package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/common"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/http/response"
)

type Handler struct {
	service *Service
}

type loginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type loginResponse struct {
	Token string `json:"token"`
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, commonValidationError(err))
		return
	}

	response.Success(c, http.StatusOK, loginResponse{Token: h.service.token})
}

func commonValidationError(err error) *common.AppError {
	return common.NewValidationError("invalid request payload", err)
}
