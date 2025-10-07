package router

import (
	"github.com/gin-gonic/gin"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/auth"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/http/middleware"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/voucher"
)

func RegisterRoutes(r *gin.Engine, authHandler *auth.Handler, authMiddleware *middleware.AuthMiddleware, voucherHandler *voucher.Handler) {
	r.POST("/login", authHandler.Login)

	api := r.Group("/vouchers")
	api.Use(authMiddleware.Handle())
	{
		api.GET("", voucherHandler.List)
		api.POST("", voucherHandler.Create)
		api.GET("/export", voucherHandler.Export)
		api.POST("/upload-csv", voucherHandler.UploadCSV)
		api.GET("/:id", voucherHandler.Get)
		api.PUT("/:id", voucherHandler.Update)
		api.DELETE("/:id", voucherHandler.Delete)
	}
}
