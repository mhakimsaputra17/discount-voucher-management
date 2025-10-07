import type { Voucher } from '../types/voucher';

export const mockVouchers: Voucher[] = [
  {
    id: 1,
    voucher_code: 'SUMMER2025',
    discount_percent: 25,
    expiry_date: '2025-12-31T23:59:59Z',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: 2,
    voucher_code: 'WELCOME10',
    discount_percent: 10,
    expiry_date: '2025-11-30T23:59:59Z',
    created_at: '2025-01-20T14:20:00Z',
    updated_at: '2025-01-20T14:20:00Z',
  },
  {
    id: 3,
    voucher_code: 'FLASH50',
    discount_percent: 50,
    expiry_date: '2025-06-15T23:59:59Z',
    created_at: '2025-02-01T09:15:00Z',
    updated_at: '2025-02-01T09:15:00Z',
  },
  {
    id: 4,
    voucher_code: 'NEWYEAR2025',
    discount_percent: 30,
    expiry_date: '2025-01-31T23:59:59Z',
    created_at: '2024-12-25T08:00:00Z',
    updated_at: '2024-12-25T08:00:00Z',
  },
  {
    id: 5,
    voucher_code: 'BLACKFRIDAY',
    discount_percent: 40,
    expiry_date: '2025-11-29T23:59:59Z',
    created_at: '2025-01-10T11:45:00Z',
    updated_at: '2025-01-10T11:45:00Z',
  },
  {
    id: 6,
    voucher_code: 'STUDENT15',
    discount_percent: 15,
    expiry_date: '2025-12-31T23:59:59Z',
    created_at: '2025-01-05T16:30:00Z',
    updated_at: '2025-01-05T16:30:00Z',
  },
  {
    id: 7,
    voucher_code: 'EARLYBIRD',
    discount_percent: 20,
    expiry_date: '2025-03-31T23:59:59Z',
    created_at: '2025-01-01T07:00:00Z',
    updated_at: '2025-01-01T07:00:00Z',
  },
  {
    id: 8,
    voucher_code: 'WEEKEND20',
    discount_percent: 20,
    expiry_date: '2025-12-31T23:59:59Z',
    created_at: '2025-02-14T12:00:00Z',
    updated_at: '2025-02-14T12:00:00Z',
  },
  {
    id: 9,
    voucher_code: 'VALENTINE',
    discount_percent: 35,
    expiry_date: '2025-02-14T23:59:59Z',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 10,
    voucher_code: 'SPRING2025',
    discount_percent: 25,
    expiry_date: '2025-05-31T23:59:59Z',
    created_at: '2025-03-01T08:30:00Z',
    updated_at: '2025-03-01T08:30:00Z',
  },
  {
    id: 11,
    voucher_code: 'LOYALTY50',
    discount_percent: 50,
    expiry_date: '2025-12-31T23:59:59Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 12,
    voucher_code: 'FIRSTBUY',
    discount_percent: 12,
    expiry_date: '2025-12-31T23:59:59Z',
    created_at: '2025-01-15T13:45:00Z',
    updated_at: '2025-01-15T13:45:00Z',
  },
];

// Helper function to generate new ID
export const getNextId = (): number => {
  const ids = mockVouchers.map(v => v.id);
  return Math.max(...ids) + 1;
};

// Helper function to simulate API delay
export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};