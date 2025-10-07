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

const ITEMS_PER_PAGE = 10;

export const VoucherListPage: FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'expiry_date' | 'discount_percent'>('expiry_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { vouchers, isLoading, deleteVoucher } = useVouchers();

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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Vouchers</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Manage your discount vouchers
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={vouchers.length === 0}
              className="w-full xs:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/vouchers/new')}
              className="w-full xs:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Voucher</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search by voucher code..."
              />
            </div>
            {searchQuery && (
              <div className="text-xs sm:text-sm text-slate-600">
                Found <span className="font-semibold text-slate-900">{filteredAndSortedVouchers.length}</span> result{filteredAndSortedVouchers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 lg:p-6 hover:shadow-md hover:border-primary-200 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg sm:rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">Total Vouchers</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{vouchers.length}</p>
            <p className="text-xs text-slate-500 mt-1 sm:mt-2">All vouchers in system</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 lg:p-6 hover:shadow-md hover:border-green-200 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg sm:rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">Active Vouchers</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {vouchers.filter(v => new Date(v.expiry_date) > new Date()).length}
            </p>
            <p className="text-xs text-slate-500 mt-1 sm:mt-2">Currently valid</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 lg:p-6 hover:shadow-md hover:border-red-200 transition-all">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-lg sm:rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">Expired</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">
              {vouchers.filter(v => new Date(v.expiry_date) <= new Date()).length}
            </p>
            <p className="text-xs text-slate-500 mt-1 sm:mt-2">No longer valid</p>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12">
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