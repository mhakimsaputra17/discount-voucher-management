import type { VoucherFormData } from '../types/voucher';

export interface ValidationErrors {
  voucher_code?: string;
  discount_percent?: string;
  expiry_date?: string;
}

export const validateVoucherForm = (data: VoucherFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.voucher_code.trim()) {
    errors.voucher_code = 'Voucher code is required';
  }

  const discount = Number(data.discount_percent);
  if (!data.discount_percent || isNaN(discount)) {
    errors.discount_percent = 'Discount percent is required';
  } else if (discount < 1 || discount > 100) {
    errors.discount_percent = 'Discount must be between 1 and 100';
  }

  if (!data.expiry_date) {
    errors.expiry_date = 'Expiry date is required';
  }

  return errors;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};