import type { Voucher, VoucherFormData } from '../types/voucher';

export const parseCSV = (csvContent: string): VoucherFormData[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  if (!headers.includes('voucher_code') || !headers.includes('discount_percent') || !headers.includes('expiry_date')) {
    throw new Error('Invalid CSV format. Required columns: voucher_code, discount_percent, expiry_date');
  }

  const data: VoucherFormData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    data.push({
      voucher_code: row.voucher_code,
      discount_percent: parseInt(row.discount_percent, 10),
      expiry_date: row.expiry_date,
    });
  }

  return data;
};

export const exportToCSV = (vouchers: Voucher[]): string => {
  const headers = ['voucher_code', 'discount_percent', 'expiry_date'];
  const rows = vouchers.map(v => [
    v.voucher_code,
    v.discount_percent.toString(),
    v.expiry_date.split('T')[0],
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};

export const downloadCSVFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};