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
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="font-medium text-gray-900">{voucher.voucher_code}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {voucher.discount_percent}%
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span className={expired ? 'text-red-600 font-medium' : 'text-gray-900'}>
            {formatDate(voucher.expiry_date)}
          </span>
          {expired && (
            <span className="ml-2 text-xs text-red-600">(Expired)</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onEdit(voucher.id)}
              className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <tr>
          <td colSpan={5} className="px-6 py-4 bg-red-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-800">
                Are you sure you want to delete voucher <strong>{voucher.voucher_code}</strong>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(voucher.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};