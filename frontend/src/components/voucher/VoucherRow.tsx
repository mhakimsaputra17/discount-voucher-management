import { FC, useState } from 'react';
import type { Voucher } from '../../types/voucher';
import { formatDate, isExpired } from '../../utils/formatters';

interface VoucherRowProps {
  voucher: Voucher;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const VoucherRow: FC<VoucherRowProps> = ({ voucher, index, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const expired = isExpired(voucher.expiry_date);

  return (
    <>
      <tr className="hover:bg-slate-50 transition-all duration-200 ease-in-out border-l-4 border-transparent hover:border-l-primary-500">
        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
          <span className="text-sm font-semibold text-slate-500">#{index + 1}</span>
        </td>
        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">{voucher.voucher_code}</span>
          </div>
        </td>
        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {voucher.discount_percent}% OFF
          </span>
        </td>
        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <span className={`text-xs sm:text-sm font-semibold ${expired ? 'text-red-600' : 'text-slate-900'}`}>
              {formatDate(voucher.expiry_date)}
            </span>
            {expired ? (
              <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Expired
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Active
              </span>
            )}
          </div>
        </td>
        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-right">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
            <button
              onClick={() => onEdit(voucher.id)}
              className="inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-in-out"
              title="Edit voucher"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-in-out"
              title="Delete voucher"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <tr>
          <td colSpan={5} className="px-6 py-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Delete Voucher?
                  </p>
                  <p className="text-sm text-red-800 mt-1">
                    Are you sure you want to delete voucher <strong className="font-bold">{voucher.voucher_code}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(voucher.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-in-out shadow-sm"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};