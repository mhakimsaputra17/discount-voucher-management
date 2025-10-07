package auth

import "github.com/mhakimsaputra17/discount-voucher-management/backend/internal/common"

type Service struct {
	token string
}

func NewService(token string) *Service {
	return &Service{token: token}
}

func (s *Service) ValidateToken(token string) *common.AppError {
	if token != s.token {
		return common.NewUnauthorizedError("invalid token", nil)
	}
	return nil
}
