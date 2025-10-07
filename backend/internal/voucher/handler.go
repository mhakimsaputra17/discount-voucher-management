package voucher

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/common"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/http/response"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) List(c *gin.Context) {
	limit := parseQueryInt(c, "limit", 10)
	page := parseQueryInt(c, "page", 1)
	if page < 1 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	offset := (page - 1) * limit

	params := ListParams{
		Search: c.Query("q"),
		SortBy: strings.TrimSpace(c.DefaultQuery("sort", "expiry_date")),
		Order:  strings.TrimSpace(c.DefaultQuery("order", "asc")),
		Limit:  int32(limit),
		Offset: int32(offset),
	}

	result, appErr := h.service.List(c.Request.Context(), params)
	if appErr != nil {
		response.Error(c, appErr)
		return
	}

	response.Success(c, http.StatusOK, result)
}

func (h *Handler) Create(c *gin.Context) {
	var input CreateVoucherInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, validationError(err))
		return
	}

	created, appErr := h.service.Create(c.Request.Context(), input)
	if appErr != nil {
		response.Error(c, appErr)
		return
	}

	response.Success(c, http.StatusCreated, created)
}

func (h *Handler) Get(c *gin.Context) {
	id, appErr := parseIDParam(c)
	if appErr != nil {
		response.Error(c, appErr)
		return
	}

	voucher, err := h.service.Get(c.Request.Context(), id)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, voucher)
}

func (h *Handler) Update(c *gin.Context) {
	id, appErr := parseIDParam(c)
	if appErr != nil {
		response.Error(c, appErr)
		return
	}

	var input UpdateVoucherInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.Error(c, validationError(err))
		return
	}

	updated, err := h.service.Update(c.Request.Context(), id, input)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, updated)
}

func (h *Handler) Delete(c *gin.Context) {
	id, appErr := parseIDParam(c)
	if appErr != nil {
		response.Error(c, appErr)
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		response.Error(c, err)
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *Handler) UploadCSV(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		response.Error(c, common.NewValidationError("file is required", err))
		return
	}

	result, appErr := h.service.UploadCSV(c.Request.Context(), file)
	if appErr != nil {
		response.Error(c, appErr)
		return
	}

	response.Success(c, http.StatusOK, result)
}

func (h *Handler) Export(c *gin.Context) {
	data, appErr := h.service.Export(c.Request.Context())
	if appErr != nil {
		response.Error(c, appErr)
		return
	}

	c.Header("Content-Disposition", "attachment; filename=vouchers.csv")
	c.Data(http.StatusOK, "text/csv", data)
}

func parseQueryInt(c *gin.Context, key string, fallback int) int {
	valueStr := c.Query(key)
	if valueStr == "" {
		return fallback
	}

	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return fallback
	}

	return value
}

func parseIDParam(c *gin.Context) (int64, *common.AppError) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		return 0, common.NewValidationError("invalid voucher id", err)
	}
	return id, nil
}

func validationError(err error) *common.AppError {
	return common.NewValidationError("invalid request payload", err)
}
