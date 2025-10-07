package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/common"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/http/response"
)

type AuthMiddleware struct {
	token string
}

func NewAuthMiddleware(token string) *AuthMiddleware {
	return &AuthMiddleware{token: token}
}

func (m *AuthMiddleware) Handle() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, common.NewUnauthorizedError("missing authorization header", nil))
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || parts[1] != m.token {
			response.Error(c, common.NewUnauthorizedError("invalid token", nil))
			c.Abort()
			return
		}

		c.Next()
	}
}
