import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '../api/axios';
import type {
  Voucher,
  VoucherFormData,
  VouchersResponse,
  PaginationMeta,
  CSVUploadResult,
} from '../types/voucher';

interface UseVouchersOptions {
  search?: string;
  sortField?: 'expiry_date' | 'discount_percent';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface QueryParams {
  search: string;
  sortField: 'expiry_date' | 'discount_percent';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

const DEFAULT_LIMIT = 10;

const normaliseParams = (params: Partial<UseVouchersOptions>, current: QueryParams): QueryParams => {
  const limit = params.limit ?? current.limit ?? DEFAULT_LIMIT;
  const page = params.page ?? current.page ?? 1;

  return {
    search: params.search ?? current.search ?? '',
    sortField: params.sortField ?? current.sortField ?? 'expiry_date',
    sortOrder:
      params.sortOrder === 'desc' ? 'desc' : params.sortOrder === 'asc' ? 'asc' : current.sortOrder ?? 'asc',
    page: page > 0 ? page : 1,
    limit: limit > 0 ? Math.min(limit, 100) : DEFAULT_LIMIT,
  };
};

const buildQueryString = (params: QueryParams): string => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set('q', params.search);
  }

  if (params.sortField) {
    searchParams.set('sort', params.sortField);
  }

  if (params.sortOrder) {
    searchParams.set('order', params.sortOrder);
  }

  searchParams.set('page', String(params.page));
  searchParams.set('limit', String(params.limit));

  return searchParams.toString();
};

export const useVouchers = (options: UseVouchersOptions = {}) => {
  const paramsRef = useRef<QueryParams>({
    search: options.search ?? '',
    sortField: options.sortField ?? 'expiry_date',
    sortOrder: options.sortOrder ?? 'asc',
    page: options.page ?? 1,
    limit: options.limit ?? DEFAULT_LIMIT,
  });

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = useCallback(async (override: Partial<UseVouchersOptions> = {}) => {
    const nextParams = normaliseParams(override, paramsRef.current);
    paramsRef.current = nextParams;

    const queryString = buildQueryString(paramsRef.current);
    const endpoint = queryString ? `/vouchers?${queryString}` : '/vouchers';

    setIsLoading(true);
    setError(null);

    try {
  const response = await apiClient.get<VouchersResponse | null>(endpoint);
  const safeData = response && Array.isArray(response.data) ? response.data : [];
  const safePagination = response && response.pagination ? response.pagination : null;

  setVouchers(safeData);
  setPagination(safePagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vouchers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(
    (override: Partial<UseVouchersOptions> = {}) => fetchVouchers(override),
    [fetchVouchers],
  );

  const createVoucher = useCallback(
    async (data: VoucherFormData) => {
      const payload = {
        voucher_code: data.voucher_code.trim(),
        discount_percent: Number(data.discount_percent),
        expiry_date: data.expiry_date,
      };

      const created = await apiClient.post<Voucher>('/vouchers', payload);
      await fetchVouchers();
      return created;
    },
    [fetchVouchers],
  );

  const updateVoucher = useCallback(
    async (id: number, data: VoucherFormData) => {
      const payload = {
        voucher_code: data.voucher_code.trim(),
        discount_percent: Number(data.discount_percent),
        expiry_date: data.expiry_date,
      };

      const updated = await apiClient.put<Voucher>(`/vouchers/${id}`, payload);
      await fetchVouchers();
      return updated;
    },
    [fetchVouchers],
  );

  const deleteVoucher = useCallback(
    async (id: number) => {
      await apiClient.delete(`/vouchers/${id}`);
      await fetchVouchers();
    },
    [fetchVouchers],
  );

  const getVoucher = useCallback(async (id: number) => {
    return apiClient.get<Voucher>(`/vouchers/${id}`);
  }, []);

  const uploadCSV = useCallback(
    async (file: File) => {
      const result = await apiClient.uploadCSV<CSVUploadResult>('/vouchers/upload-csv', file);
      await fetchVouchers();
      return result;
    },
    [fetchVouchers],
  );

  const downloadCSV = useCallback(async () => {
    return apiClient.downloadCSV('/vouchers/export');
  }, []);

  return {
    vouchers,
    pagination,
    isLoading,
    error,
    params: paramsRef.current,
    refetch,
    fetchVouchers: refetch,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucher,
    uploadCSV,
    downloadCSV,
  };
};