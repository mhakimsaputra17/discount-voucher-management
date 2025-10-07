import { FC, FormEvent, useState } from 'react';
import type { VoucherFormData } from '../../types/voucher';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validateVoucherForm, ValidationErrors } from '../../utils/validators';

interface VoucherFormProps {
  initialData?: VoucherFormData;
  onSubmit: (data: VoucherFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const VoucherForm: FC<VoucherFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<VoucherFormData>(
    initialData || {
      voucher_code: '',
      discount_percent: '',
      expiry_date: '',
    }
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (field: keyof VoucherFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateVoucherForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Voucher Code"
        type="text"
        value={formData.voucher_code}
        onChange={(e) => handleChange('voucher_code', e.target.value)}
        error={errors.voucher_code}
        placeholder="e.g., SUMMER2025"
        required
        disabled={isLoading}
      />

      <Input
        label="Discount Percent"
        type="number"
        min="1"
        max="100"
        value={formData.discount_percent}
        onChange={(e) => handleChange('discount_percent', e.target.value)}
        error={errors.discount_percent}
        placeholder="e.g., 20"
        required
        disabled={isLoading}
      />

      <Input
        label="Expiry Date"
        type="date"
        value={formData.expiry_date}
        onChange={(e) => handleChange('expiry_date', e.target.value)}
        error={errors.expiry_date}
        required
        disabled={isLoading}
      />

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {initialData ? 'Update' : 'Create'} Voucher
        </Button>
      </div>
    </form>
  );
};