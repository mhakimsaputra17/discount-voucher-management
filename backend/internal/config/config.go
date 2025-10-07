package config

import (
	"errors"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

const (
	defaultEnv                 = "development"
	defaultServerPort          = "8080"
	defaultAuthToken           = "123456"
	defaultCSVMaxSizeMB        = int64(5)
	defaultDatabaseMaxConns    = int32(10)
	defaultDatabaseMinConns    = int32(2)
	defaultQueryTimeoutSeconds = 5
	defaultCORSAllowedOrigins  = "*"
)

type Config struct {
	Env                string
	ServerPort         string
	DatabaseURL        string
	DatabaseMaxConns   int32
	DatabaseMinConns   int32
	AuthToken          string
	CSVMaxSizeBytes    int64
	QueryTimeout       time.Duration
	CORSAllowedOrigins []string
}

func Load() (Config, error) {
	_ = godotenv.Load()

	cfg := Config{
		Env:                getEnv("APP_ENV", defaultEnv),
		ServerPort:         getEnv("SERVER_PORT", defaultServerPort),
		DatabaseURL:        os.Getenv("DATABASE_URL"),
		DatabaseMaxConns:   getEnvAsInt32("DATABASE_MAX_CONNS", defaultDatabaseMaxConns),
		DatabaseMinConns:   getEnvAsInt32("DATABASE_MIN_CONNS", defaultDatabaseMinConns),
		AuthToken:          getEnv("AUTH_TOKEN", defaultAuthToken),
		CSVMaxSizeBytes:    getEnvAsInt64("CSV_MAX_SIZE_MB", defaultCSVMaxSizeMB) * 1024 * 1024,
		QueryTimeout:       time.Duration(getEnvAsInt("QUERY_TIMEOUT_SECONDS", defaultQueryTimeoutSeconds)) * time.Second,
		CORSAllowedOrigins: getEnvAsSlice("CORS_ALLOWED_ORIGINS", defaultCORSAllowedOrigins),
	}

	if cfg.DatabaseURL == "" {
		return Config{}, errors.New("DATABASE_URL is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	if valueStr, ok := os.LookupEnv(key); ok && valueStr != "" {
		if value, err := strconv.Atoi(valueStr); err == nil {
			return value
		}
	}
	return fallback
}

func getEnvAsInt64(key string, fallback int64) int64 {
	if valueStr, ok := os.LookupEnv(key); ok && valueStr != "" {
		if value, err := strconv.ParseInt(valueStr, 10, 64); err == nil {
			return value
		}
	}
	return fallback
}

func getEnvAsInt32(key string, fallback int32) int32 {
	if valueStr, ok := os.LookupEnv(key); ok && valueStr != "" {
		if value, err := strconv.ParseInt(valueStr, 10, 32); err == nil {
			return int32(value)
		}
	}
	return fallback
}

func getEnvAsSlice(key, fallback string) []string {
	value := getEnv(key, fallback)
	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	if len(result) == 0 {
		result = []string{"*"}
	}
	return result
}
