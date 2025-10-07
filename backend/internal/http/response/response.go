package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/common"
)

func Success(c *gin.Context, status int, data any) {
	c.JSON(status, data)
}

func Error(c *gin.Context, appErr *common.AppError) {
	if appErr == nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(appErr.StatusCode, gin.H{
		"error": appErr.Message,
	})
}
