export interface Voucher {
  id: number;
  voucher_code: string;
  discount_percent: number;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface VoucherFormData {
  voucher_code: string;
  discount_percent: number | string;
  expiry_date: string;
}

export interface VouchersResponse {
  data: Voucher[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface CSVUploadFailure {
  row: number;
  reason: string;
}

export interface CSVUploadResult {
  total_rows: number;
  success_count: number;
  failure_count: number;
  failures: CSVUploadFailure[];
}