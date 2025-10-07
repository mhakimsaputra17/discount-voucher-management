package app

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/auth"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/config"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/database"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/http/middleware"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/http/router"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/logger"
	"github.com/mhakimsaputra17/discount-voucher-management/backend/internal/voucher"
)

type Server struct {
	cfg        config.Config
	httpServer *http.Server
	db         *pgxpool.Pool
	logger     *logger.Logger
}

func NewServer(ctx context.Context) (*Server, error) {
	cfg, err := config.Load()
	if err != nil {
		return nil, err
	}

	log := logger.New(cfg.Env)

	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	dbPool, err := database.Connect(ctx, cfg)
	if err != nil {
		return nil, err
	}

	voucherRepo := voucher.NewRepository(dbPool)
	voucherService := voucher.NewService(voucherRepo, cfg, log)
	voucherHandler := voucher.NewHandler(voucherService)

	authService := auth.NewService(cfg.AuthToken)
	authHandler := auth.NewHandler(authService)
	authMiddleware := middleware.NewAuthMiddleware(cfg.AuthToken)
	corsMiddleware := middleware.NewCORSMiddleware(cfg.CORSAllowedOrigins)

	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), corsMiddleware)

	router.RegisterRoutes(r, authHandler, authMiddleware, voucherHandler)

	srv := &http.Server{
		Addr:              fmt.Sprintf(":%s", cfg.ServerPort),
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	return &Server{
		cfg:        cfg,
		httpServer: srv,
		db:         dbPool,
		logger:     log,
	}, nil
}

func (s *Server) Start() error {
	s.logger.Infof("server starting on port %s", s.cfg.ServerPort)
	if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return err
	}
	return nil
}

func (s *Server) Shutdown(ctx context.Context) error {
	s.logger.Info("server shutting down")
	defer s.db.Close()
	return s.httpServer.Shutdown(ctx)
}
