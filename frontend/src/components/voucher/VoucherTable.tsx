import { FC } from 'react';
import type { Voucher } from '../../types/voucher';
import { VoucherRow } from './VoucherRow';

interface VoucherTableProps {
  vouchers: Voucher[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onSort: (field: 'expiry_date' | 'discount_percent') => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export const VoucherTable: FC<VoucherTableProps> = ({
  vouchers,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortOrder,
}) => {
  const SortIcon: FC<{ field: string }> = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200 -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Voucher Code
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('discount_percent')}
            >
              <div className="flex items-center gap-2">
                Discount
                <SortIcon field="discount_percent" />
              </div>
            </th>
            <th
              className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
              onClick={() => onSort('expiry_date')}
            >
              <div className="flex items-center gap-2">
                Expiry Date
                <SortIcon field="expiry_date" />
              </div>
            </th>
            <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {vouchers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-lg font-medium">No vouchers found</p>
                  <p className="text-sm">Create your first voucher to get started</p>
                </div>
              </td>
            </tr>
          ) : (
            vouchers.map((voucher, index) => (
              <VoucherRow
                key={voucher.id}
                voucher={voucher}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};