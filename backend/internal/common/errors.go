package common

import "net/http"

type AppError struct {
	StatusCode int
	Message    string
	Err        error
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return e.Err.Error()
	}
	return e.Message
}

func NewAppError(statusCode int, message string, err error) *AppError {
	return &AppError{
		StatusCode: statusCode,
		Message:    message,
		Err:        err,
	}
}

func NewInternalError(message string, err error) *AppError {
	return NewAppError(http.StatusInternalServerError, message, err)
}

func NewValidationError(message string, err error) *AppError {
	return NewAppError(http.StatusBadRequest, message, err)
}

func NewNotFoundError(message string, err error) *AppError {
	return NewAppError(http.StatusNotFound, message, err)
}

func NewConflictError(message string, err error) *AppError {
	return NewAppError(http.StatusConflict, message, err)
}

func NewUnauthorizedError(message string, err error) *AppError {
	return NewAppError(http.StatusUnauthorized, message, err)
}
