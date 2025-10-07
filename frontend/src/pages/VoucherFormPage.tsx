import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { VoucherForm } from '../components/voucher/VoucherForm';
import { Spinner } from '../components/common/Spinner';
import { useVouchers } from '../hooks/useVouchers';
import { useToast } from '../hooks/useToast';
import type { VoucherFormData } from '../types/voucher';
import { formatDateForInput } from '../utils/formatters';

export const VoucherFormPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { createVoucher, updateVoucher, getVoucher } = useVouchers();
  const [initialData, setInitialData] = useState<VoucherFormData | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);

  const isEditMode = !!id;

  useEffect(() => {
    if (id) {
      const fetchVoucher = async () => {
        try {
          const voucher = await getVoucher(Number(id));
          setInitialData({
            voucher_code: voucher.voucher_code,
            discount_percent: voucher.discount_percent,
            expiry_date: formatDateForInput(voucher.expiry_date),
          });
        } catch (error) {
          showToast('Failed to load voucher', 'error');
          navigate('/vouchers');
        } finally {
          setIsFetching(false);
        }
      };
      fetchVoucher();
    }
  }, [id]);

  const handleSubmit = async (data: VoucherFormData) => {
    setIsLoading(true);
    try {
      if (isEditMode && id) {
        await updateVoucher(Number(id), data);
        showToast('Voucher updated successfully', 'success');
      } else {
        await createVoucher(data);
        showToast('Voucher created successfully', 'success');
      }
      navigate('/vouchers');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} voucher`,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/vouchers');
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-12">
            <Spinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/vouchers')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Vouchers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Voucher' : 'Create New Voucher'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update voucher details' : 'Fill in the form to create a new voucher'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <VoucherForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};