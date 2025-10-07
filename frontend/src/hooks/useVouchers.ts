import { useState, useEffect, useCallback } from 'react';
import type { Voucher, VoucherFormData } from '../types/voucher';
import { mockVouchers, getNextId, simulateDelay } from '../data/mockVouchers';

interface UseVouchersOptions {
  search?: string;
  sortField?: 'expiry_date' | 'discount_percent';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Simulate localStorage for persistence
const STORAGE_KEY = 'vouchers_data';

const getStoredVouchers = (): Voucher[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockVouchers;
  } catch {
    return mockVouchers;
  }
};

const setStoredVouchers = (vouchers: Voucher[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  } catch (error) {
    console.error('Failed to save vouchers:', error);
  }
};

export const useVouchers = (options: UseVouchersOptions = {}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchVouchers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await simulateDelay(300);
      
      const storedVouchers = getStoredVouchers();
      setVouchers(storedVouchers);
      setTotal(storedVouchers.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vouchers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVoucher = async (data: VoucherFormData): Promise<Voucher> => {
    await simulateDelay(500);
    
    const storedVouchers = getStoredVouchers();
    
    // Check for duplicate voucher code
    const isDuplicate = storedVouchers.some(
      v => v.voucher_code.toLowerCase() === data.voucher_code.toLowerCase()
    );
    
    if (isDuplicate) {
      throw new Error('Voucher code already exists');
    }
    
    const newVoucher: Voucher = {
      id: getNextId(),
      voucher_code: data.voucher_code,
      discount_percent: Number(data.discount_percent),
      expiry_date: new Date(data.expiry_date).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updatedVouchers = [newVoucher, ...storedVouchers];
    setStoredVouchers(updatedVouchers);
    setVouchers(updatedVouchers);
    
    return newVoucher;
  };

  const updateVoucher = async (id: number, data: VoucherFormData): Promise<Voucher> => {
    await simulateDelay(500);
    
    const storedVouchers = getStoredVouchers();
    const index = storedVouchers.findIndex(v => v.id === id);
    
    if (index === -1) {
      throw new Error('Voucher not found');
    }
    
    // Check for duplicate voucher code (excluding current voucher)
    const isDuplicate = storedVouchers.some(
      v => v.id !== id && v.voucher_code.toLowerCase() === data.voucher_code.toLowerCase()
    );
    
    if (isDuplicate) {
      throw new Error('Voucher code already exists');
    }
    
    const updatedVoucher: Voucher = {
      ...storedVouchers[index],
      voucher_code: data.voucher_code,
      discount_percent: Number(data.discount_percent),
      expiry_date: new Date(data.expiry_date).toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const updatedVouchers = [...storedVouchers];
    updatedVouchers[index] = updatedVoucher;
    
    setStoredVouchers(updatedVouchers);
    setVouchers(updatedVouchers);
    
    return updatedVoucher;
  };

  const deleteVoucher = async (id: number): Promise<void> => {
    await simulateDelay(300);
    
    const storedVouchers = getStoredVouchers();
    const updatedVouchers = storedVouchers.filter(v => v.id !== id);
    
    setStoredVouchers(updatedVouchers);
    setVouchers(updatedVouchers);
  };

  const getVoucher = async (id: number): Promise<Voucher> => {
    await simulateDelay(200);
    
    const storedVouchers = getStoredVouchers();
    const voucher = storedVouchers.find(v => v.id === id);
    
    if (!voucher) {
      throw new Error('Voucher not found');
    }
    
    return voucher;
  };

  const bulkCreateVouchers = async (dataList: VoucherFormData[]): Promise<{ success: number; failed: number; errors: string[] }> => {
    await simulateDelay(800);
    
    const storedVouchers = getStoredVouchers();
    const result = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };
    
    const newVouchers: Voucher[] = [];
    
    for (let i = 0; i < dataList.length; i++) {
      try {
        const data = dataList[i];
        
        // Check for duplicate in existing vouchers
        const isDuplicate = storedVouchers.some(
          v => v.voucher_code.toLowerCase() === data.voucher_code.toLowerCase()
        );
        
        // Check for duplicate in new vouchers batch
        const isDuplicateInBatch = newVouchers.some(
          v => v.voucher_code.toLowerCase() === data.voucher_code.toLowerCase()
        );
        
        if (isDuplicate || isDuplicateInBatch) {
          result.failed++;
          result.errors.push(`Row ${i + 1}: Voucher code "${data.voucher_code}" already exists`);
          continue;
        }
        
        const newVoucher: Voucher = {
          id: getNextId() + newVouchers.length,
          voucher_code: data.voucher_code,
          discount_percent: Number(data.discount_percent),
          expiry_date: new Date(data.expiry_date).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        newVouchers.push(newVoucher);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Failed to create'}`);
      }
    }
    
    if (newVouchers.length > 0) {
      const updatedVouchers = [...newVouchers, ...storedVouchers];
      setStoredVouchers(updatedVouchers);
      setVouchers(updatedVouchers);
    }
    
    return result;
  };

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  return {
    vouchers,
    isLoading,
    error,
    total,
    refetch: fetchVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucher,
    bulkCreateVouchers,
  };
};