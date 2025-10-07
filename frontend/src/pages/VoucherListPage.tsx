import { FC, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/voucher/SearchBar';
import { VoucherTable } from '../components/voucher/VoucherTable';
import { Pagination } from '../components/voucher/Pagination';
import { Spinner } from '../components/common/Spinner';
import { useVouchers } from '../hooks/useVouchers';
import { useToast } from '../hooks/useToast';
import { exportToCSV, downloadCSVFile } from '../utils/csv';
import { apiClient } from '../api/axios';

const ITEMS_PER_PAGE = 10;

export const VoucherListPage: FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'expiry_date' | 'discount_percent'>('expiry_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { vouchers, isLoading, deleteVoucher, refetch } = useVouchers();

  // Client-side filtering and sorting
  const filteredAndSortedVouchers = useMemo(() => {
    let result = [...vouchers];

    // Filter
    if (searchQuery) {
      result = result.filter(v =>
        v.voucher_code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'expiry_date') {
        comparison = new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      } else {
        comparison = a.discount_percent - b.discount_percent;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [vouchers, searchQuery, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVouchers.length / ITEMS_PER_PAGE);
  const paginatedVouchers = filteredAndSortedVouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: 'expiry_date' | 'discount_percent') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVoucher(id);
      showToast('Voucher deleted successfully', 'success');
      
      // Adjust page if needed
      if (paginatedVouchers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete voucher', 'error');
    }
  };

  const handleExport = async () => {
    try {
      // Option 1: Export filtered vouchers (client-side)
      const csvContent = exportToCSV(filteredAndSortedVouchers);
      downloadCSVFile(csvContent, `vouchers-${new Date().toISOString().split('T')[0]}.csv`);
      showToast('Vouchers exported successfully', 'success');

      // Option 2: Export from server (uncomment if backend supports)
      // const blob = await apiClient.downloadCSV('/vouchers/export');
      // const url = URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `vouchers-${new Date().toISOString().split('T')[0]}.csv`;
      // link.click();
      // URL.revokeObjectURL(url);
    } catch (error) {
      showToast('Failed to export vouchers', 'error');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vouchers</h1>
            <p className="text-gray-600 mt-1">
              Manage your discount vouchers
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={vouchers.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/vouchers/new')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create Voucher</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by voucher code..."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Vouchers</p>
                <p className="text-2xl font-bold text-gray-900">{vouchers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vouchers.filter(v => new Date(v.expiry_date) > new Date()).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vouchers.filter(v => new Date(v.expiry_date) <= new Date()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <VoucherTable
              vouchers={paginatedVouchers}
              onEdit={(id) => navigate(`/vouchers/edit/${id}`)}
              onDelete={handleDelete}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </Layout>
  );
};