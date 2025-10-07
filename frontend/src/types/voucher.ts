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
  total: number;
  page: number;
  limit: number;
}

export interface CSVUploadResult {
  success: number;
  failed: number;
  errors: string[];
}