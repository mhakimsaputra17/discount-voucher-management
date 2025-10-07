package voucher

import (
	"context"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/common"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/config"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/logger"
)

type Service struct {
	repo   *Repository
	cfg    config.Config
	logger *logger.Logger
}

type CreateVoucherInput struct {
	VoucherCode     string `json:"voucher_code" binding:"required"`
	DiscountPercent int    `json:"discount_percent" binding:"required,min=1,max=100"`
	ExpiryDate      string `json:"expiry_date" binding:"required"`
}

type UpdateVoucherInput struct {
	VoucherCode     string `json:"voucher_code" binding:"required"`
	DiscountPercent int    `json:"discount_percent" binding:"required,min=1,max=100"`
	ExpiryDate      string `json:"expiry_date" binding:"required"`
}

type CSVImportResult struct {
	TotalRows    int               `json:"total_rows"`
	SuccessCount int               `json:"success_count"`
	FailureCount int               `json:"failure_count"`
	Failures     []CSVImportStatus `json:"failures"`
}

type CSVImportStatus struct {
	Row    int    `json:"row"`
	Reason string `json:"reason"`
}

func NewService(repo *Repository, cfg config.Config, logger *logger.Logger) *Service {
	return &Service{repo: repo, cfg: cfg, logger: logger}
}

func (s *Service) List(ctx context.Context, params ListParams) (ListResponse, *common.AppError) {
	limit := params.Limit
	if limit <= 0 {
		limit = 10
	}
	params.Limit = limit

	if params.Offset < 0 {
		params.Offset = 0
	}

	page := 1
	if limit > 0 {
		page = int(params.Offset/limit) + 1
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.QueryTimeout)
	defer cancel()

	vouchers, total, err := s.repo.List(ctx, params)
	if err != nil {
		return ListResponse{}, common.NewInternalError("failed to list vouchers", err)
	}

	totalPages := (total + int(limit) - 1) / int(limit)

	return ListResponse{
		Data: vouchers,
		Pagination: PaginationMeta{
			Page:       page,
			Limit:      int(limit),
			Total:      total,
			TotalPages: totalPages,
		},
	}, nil
}

func (s *Service) Create(ctx context.Context, input CreateVoucherInput) (Voucher, *common.AppError) {
	if err := validateDate(input.ExpiryDate); err != nil {
		return Voucher{}, common.NewValidationError("expiry_date must be in YYYY-MM-DD format", err)
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.QueryTimeout)
	defer cancel()

	exists, err := s.repo.ExistsByCode(ctx, input.VoucherCode, nil)
	if err != nil {
		return Voucher{}, common.NewInternalError("failed to validate voucher code", err)
	}
	if exists {
		return Voucher{}, common.NewConflictError("voucher_code already exists", nil)
	}

	created, err := s.repo.Create(ctx, Voucher{
		VoucherCode:     strings.TrimSpace(input.VoucherCode),
		DiscountPercent: input.DiscountPercent,
		ExpiryDate:      input.ExpiryDate,
	})
	if err != nil {
		return Voucher{}, handlePgxError(err)
	}

	return created, nil
}

func (s *Service) Get(ctx context.Context, id int64) (Voucher, *common.AppError) {
	ctx, cancel := context.WithTimeout(ctx, s.cfg.QueryTimeout)
	defer cancel()

	voucher, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Voucher{}, common.NewNotFoundError("voucher not found", err)
		}
		return Voucher{}, common.NewInternalError("failed to fetch voucher", err)
	}

	return voucher, nil
}

func (s *Service) Update(ctx context.Context, id int64, input UpdateVoucherInput) (Voucher, *common.AppError) {
	if err := validateDate(input.ExpiryDate); err != nil {
		return Voucher{}, common.NewValidationError("expiry_date must be in YYYY-MM-DD format", err)
	}

	ctx, cancel := context.WithTimeout(ctx, s.cfg.QueryTimeout)
	defer cancel()

	excludeID := new(int64)
	*excludeID = id
	exists, err := s.repo.ExistsByCode(ctx, input.VoucherCode, excludeID)
	if err != nil {
		return Voucher{}, common.NewInternalError("failed to validate voucher code", err)
	}
	if exists {
		return Voucher{}, common.NewConflictError("voucher_code already exists", nil)
	}

	updated, err := s.repo.Update(ctx, id, Voucher{
		VoucherCode:     strings.TrimSpace(input.VoucherCode),
		DiscountPercent: input.DiscountPercent,
		ExpiryDate:      input.ExpiryDate,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Voucher{}, common.NewNotFoundError("voucher not found", err)
		}
		return Voucher{}, handlePgxError(err)
	}

	return updated, nil
}

func (s *Service) Delete(ctx context.Context, id int64) *common.AppError {
	ctx, cancel := context.WithTimeout(ctx, s.cfg.QueryTimeout)
	defer cancel()

	err := s.repo.Delete(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return common.NewNotFoundError("voucher not found", err)
		}
		return common.NewInternalError("failed to delete voucher", err)
	}

	return nil
}

func (s *Service) UploadCSV(ctx context.Context, fileHeader *multipart.FileHeader) (CSVImportResult, *common.AppError) {
	if fileHeader.Size > s.cfg.CSVMaxSizeBytes {
		return CSVImportResult{}, common.NewValidationError("file size exceeds limit", nil)
	}

	file, err := fileHeader.Open()
	if err != nil {
		return CSVImportResult{}, common.NewValidationError("unable to open file", err)
	}
	defer file.Close()

	content, err := io.ReadAll(io.LimitReader(file, s.cfg.CSVMaxSizeBytes+1))
	if err != nil {
		return CSVImportResult{}, common.NewValidationError("failed to read file", err)
	}

	rows := strings.Split(strings.TrimSpace(string(content)), "\n")
	if len(rows) == 0 {
		return CSVImportResult{}, common.NewValidationError("empty file", nil)
	}

	header := strings.TrimSpace(rows[0])
	if !strings.EqualFold(header, "voucher_code,discount_percent,expiry_date") {
		return CSVImportResult{}, common.NewValidationError("invalid CSV header", nil)
	}

	result := CSVImportResult{TotalRows: len(rows) - 1}
	seenCodes := make(map[string]struct{})

	ctx, cancel := context.WithTimeout(ctx, s.cfg.QueryTimeout*2)
	defer cancel()

	for i, row := range rows[1:] {
		line := strings.TrimSpace(row)
		if line == "" {
			result.FailureCount++
			result.Failures = append(result.Failures, CSVImportStatus{Row: i + 1, Reason: "empty row"})
			continue
		}

		cols := strings.Split(line, ",")
		if len(cols) != 3 {
			result.FailureCount++
			result.Failures = append(result.Failures, CSVImportStatus{Row: i + 1, Reason: "invalid column count"})
			continue
		}

		code := strings.TrimSpace(cols[0])
		percentStr := strings.TrimSpace(cols[1])
		expiry := strings.TrimSpace(cols[2])

		if code == "" {
			result.FailureCount++
			result.Failures = append(result.Failures, CSVImportStatus{Row: i + 1, Reason: "voucher_code required"})
			continue
		}

		if _, exists := seenCodes[strings.ToLower(code)]; exists {
			result.FailureCount++
			result.Failures = append(result.Failures, CSVImportStatus{Row: i + 1, Reason: "duplicate voucher_code in file"})
			continue
		}

		percent, err := strconv.Atoi(percentStr)
		if err != nil || percent < 1 || percent > 100 {
			result.FailureCount++
			result.Failures = append(result.Failures, CSVImportStatus{Row: i + 1, Reason: "discount_percent must be integer between 1 and 100"})
			continue
		}

		if err := validateDate(expiry); err != nil {
			result.FailureCount++
			result.Failures = append(result.Failures, CSVImportStatus{Row: i + 1, Reason: "expiry_date must be YYYY-MM-DD"})
			continue
		}

		exists, err := s.repo.ExistsByCode(ctx, code, nil)
		if err != nil {
			return CSVImportResult{}, common.NewInternalError("failed to check voucher code", err)
		}
		if exists {
			result.FailureCount++
			result.Failures = append(result.Failures, CSVImportStatus{Row: i + 1, Reason: "voucher_code already exists"})
			continue
		}

		_, err = s.repo.Create(ctx, Voucher{
			VoucherCode:     code,
			DiscountPercent: percent,
			ExpiryDate:      expiry,
		})
		if err != nil {
			result.FailureCount++
			result.Failures = append(result.Failures, CSVImportStatus{Row: i + 1, Reason: "failed to insert voucher"})
			s.logger.Errorf("csv import failed for row %d: %v", i+1, err)
			continue
		}

		seenCodes[strings.ToLower(code)] = struct{}{}
		result.SuccessCount++
	}

	if result.Failures == nil {
		result.Failures = make([]CSVImportStatus, 0)
	}

	return result, nil
}

func (s *Service) Export(ctx context.Context) ([]byte, *common.AppError) {
	ctx, cancel := context.WithTimeout(ctx, s.cfg.QueryTimeout*2)
	defer cancel()

	vouchers, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, common.NewInternalError("failed to export vouchers", err)
	}

	var builder strings.Builder
	builder.WriteString("voucher_code,discount_percent,expiry_date\n")
	for _, v := range vouchers {
		builder.WriteString(fmt.Sprintf("%s,%d,%s\n", v.VoucherCode, v.DiscountPercent, v.ExpiryDate))
	}

	return []byte(builder.String()), nil
}

func validateDate(dateStr string) error {
	_, err := time.Parse("2006-01-02", dateStr)
	return err
}

func handlePgxError(err error) *common.AppError {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch pgErr.Code {
		case "23505":
			return common.NewConflictError("voucher_code already exists", err)
		}
	}
	return common.NewInternalError("database error", err)
}
