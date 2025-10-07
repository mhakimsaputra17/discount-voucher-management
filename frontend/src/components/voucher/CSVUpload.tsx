import { FC, useState, ChangeEvent } from 'react';
import { Button } from '../common/Button';
import { parseCSV } from '../../utils/csv';
import type { VoucherFormData } from '../../types/voucher';

interface CSVUploadProps {
  onUpload: (file: File) => Promise<void>;
  onUploadingChange?: (isUploading: boolean) => void;
}

export const CSVUpload: FC<CSVUploadProps> = ({ onUpload, onUploadingChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<VoucherFormData[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (value: boolean) => {
    setIsLoading(value);
    onUploadingChange?.(value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setError('');
    setPreview([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = parseCSV(content);
        setPreview(parsedData.slice(0, 5)); // Show first 5 rows
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV');
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      await onUpload(file);
      setFile(null);
      setPreview([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 sm:p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center gap-2 text-primary-600">
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V2m0 20v-2a8 8 0 008-8" />
            </svg>
            <span className="text-sm font-medium">Uploading vouchers…</span>
          </div>
        )}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
          disabled={isLoading}
        />
        <label htmlFor="csv-upload" className={`cursor-pointer ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
          <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            {file ? file.name : 'Click to upload CSV file'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Format: voucher_code, discount_percent, expiry_date
          </p>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">Preview (First 5 rows)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {preview.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.voucher_code}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.discount_percent}%</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.expiry_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      {file && (
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setFile(null);
              setPreview([]);
              setError('');
            }}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            isLoading={isLoading}
            disabled={isLoading || preview.length === 0}
            className="w-full sm:w-auto"
          >
            Upload File
          </Button>
        </div>
      )}
    </div>
  );
};