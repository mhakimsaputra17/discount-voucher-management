package voucher

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	defaultSortBy = "expiry_date"
	defaultOrder  = "asc"
)

var sortColumns = map[string]string{
	"expiry_date":      "expiry_date",
	"discount_percent": "discount_percent",
}

// Repository handles voucher database operations.
type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) List(ctx context.Context, params ListParams) ([]Voucher, int, error) {
	sortBy := defaultSortBy
	order := defaultOrder

	if col, ok := sortColumns[params.SortBy]; ok {
		sortBy = col
	}

	if strings.EqualFold(params.Order, "desc") {
		order = "desc"
	}

	args := []any{}
	whereClauses := []string{"1=1"}

	if params.Search != "" {
		placeholder := len(args) + 1
		whereClauses = append(whereClauses, fmt.Sprintf("voucher_code ILIKE $%d", placeholder))
		args = append(args, fmt.Sprintf("%%%s%%", params.Search))
	}

	limitPlaceholder := len(args) + 1
	offsetPlaceholder := limitPlaceholder + 1

	query := fmt.Sprintf(`
		SELECT id,
		       voucher_code,
		       discount_percent,
		       TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date,
		       TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
		       TO_CHAR(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at
		FROM vouchers
		WHERE %s
		ORDER BY %s %s, id ASC
		LIMIT $%d OFFSET $%d
	`, strings.Join(whereClauses, " AND "), sortBy, order, limitPlaceholder, offsetPlaceholder)

	argsWithLimit := append(args, params.Limit, params.Offset)

	rows, err := r.db.Query(ctx, query, argsWithLimit...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var vouchers []Voucher
	for rows.Next() {
		var v Voucher
		if err := rows.Scan(&v.ID, &v.VoucherCode, &v.DiscountPercent, &v.ExpiryDate, &v.CreatedAt, &v.UpdatedAt); err != nil {
			return nil, 0, err
		}
		vouchers = append(vouchers, v)
	}

	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	countQuery := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM vouchers
		WHERE %s
	`, strings.Join(whereClauses, " AND "))

	var total int
	if err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	return vouchers, total, nil
}

func (r *Repository) GetByID(ctx context.Context, id int64) (Voucher, error) {
	var v Voucher
	err := r.db.QueryRow(ctx, `
		SELECT id,
		       voucher_code,
		       discount_percent,
		       TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date,
		       TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
		       TO_CHAR(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at
		FROM vouchers
		WHERE id = $1
	`, id).Scan(&v.ID, &v.VoucherCode, &v.DiscountPercent, &v.ExpiryDate, &v.CreatedAt, &v.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return Voucher{}, err
		}
		return Voucher{}, err
	}
	return v, nil
}

func (r *Repository) Create(ctx context.Context, v Voucher) (Voucher, error) {
	var created Voucher
	err := r.db.QueryRow(ctx, `
		INSERT INTO vouchers (voucher_code, discount_percent, expiry_date)
		VALUES ($1, $2, $3)
		RETURNING id,
		          voucher_code,
		          discount_percent,
		          TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date,
		          TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
		          TO_CHAR(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at
	`, v.VoucherCode, v.DiscountPercent, v.ExpiryDate).Scan(&created.ID, &created.VoucherCode, &created.DiscountPercent, &created.ExpiryDate, &created.CreatedAt, &created.UpdatedAt)
	return created, err
}

func (r *Repository) Update(ctx context.Context, id int64, v Voucher) (Voucher, error) {
	var updated Voucher
	err := r.db.QueryRow(ctx, `
		UPDATE vouchers
		SET voucher_code = $1,
			discount_percent = $2,
			expiry_date = $3,
			updated_at = NOW()
		WHERE id = $4
		RETURNING id,
		          voucher_code,
		          discount_percent,
		          TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date,
		          TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
		          TO_CHAR(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at
	`, v.VoucherCode, v.DiscountPercent, v.ExpiryDate, id).Scan(&updated.ID, &updated.VoucherCode, &updated.DiscountPercent, &updated.ExpiryDate, &updated.CreatedAt, &updated.UpdatedAt)
	return updated, err
}

func (r *Repository) Delete(ctx context.Context, id int64) error {
	cmdTag, err := r.db.Exec(ctx, `DELETE FROM vouchers WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if cmdTag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *Repository) ExistsByCode(ctx context.Context, code string, excludeID *int64) (bool, error) {
	query := `SELECT 1 FROM vouchers WHERE voucher_code = $1`
	args := []any{code}

	if excludeID != nil {
		query += " AND id <> $2"
		args = append(args, *excludeID)
	}

	var exists int
	err := r.db.QueryRow(ctx, query, args...).Scan(&exists)
	if err != nil {
		if err == pgx.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (r *Repository) GetAll(ctx context.Context) ([]Voucher, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id,
		       voucher_code,
		       discount_percent,
		       TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date,
		       TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
		       TO_CHAR(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_at
		FROM vouchers
		ORDER BY id ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var vouchers []Voucher
	for rows.Next() {
		var v Voucher
		if err := rows.Scan(&v.ID, &v.VoucherCode, &v.DiscountPercent, &v.ExpiryDate, &v.CreatedAt, &v.UpdatedAt); err != nil {
			return nil, err
		}
		vouchers = append(vouchers, v)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return vouchers, nil
}
