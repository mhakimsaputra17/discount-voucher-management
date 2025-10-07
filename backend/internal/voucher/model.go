package voucher

type Voucher struct {
	ID              int64  `json:"id" db:"id"`
	VoucherCode     string `json:"voucher_code" db:"voucher_code"`
	DiscountPercent int    `json:"discount_percent" db:"discount_percent"`
	ExpiryDate      string `json:"expiry_date" db:"expiry_date"`
	CreatedAt       string `json:"created_at" db:"created_at"`
	UpdatedAt       string `json:"updated_at" db:"updated_at"`
}

type ListParams struct {
	Search string
	SortBy string
	Order  string
	Limit  int32
	Offset int32
}

type PaginationMeta struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"total_pages"`
}

type ListResponse struct {
	Data       []Voucher      `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
}
