import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/voucher/SearchBar';
import { VoucherTable } from '../components/voucher/VoucherTable';
import { Pagination } from '../components/voucher/Pagination';
import { Spinner } from '../components/common/Spinner';
import { useVouchers } from '../hooks/useVouchers';
import { useToast } from '../hooks/useToast';
import { useSmoothProgress } from '../hooks/useSmoothProgress';
import { ProgressBar } from '../components/common/ProgressBar';

const ITEMS_PER_PAGE = 10;

export const VoucherListPage: FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'expiry_date' | 'discount_percent'>('expiry_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isExporting, setIsExporting] = useState(false);

  const {
    vouchers,
    isLoading,
    error,
    pagination,
    refetch,
    deleteVoucher,
    downloadCSV,
  } = useVouchers({ limit: ITEMS_PER_PAGE, sortField, sortOrder, page: 1 });

  const totalCount = pagination?.total ?? vouchers.length;
  const hasData = totalCount > 0;
  const isSearching = Boolean(searchQuery.trim());

  useEffect(() => {
    refetch({
      search: searchQuery,
      sortField,
      sortOrder,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    });
  }, [currentPage, searchQuery, sortField, sortOrder, refetch]);

  const totalPages = pagination?.total_pages ?? 1;
  const currentPageNumber = pagination?.page ?? currentPage;

  const activeCount = useMemo(
    () => vouchers.filter((v) => new Date(v.expiry_date) > new Date()).length,
    [vouchers],
  );

  const expiredCount = useMemo(
    () => vouchers.filter((v) => new Date(v.expiry_date) <= new Date()).length,
    [vouchers],
  );

  const handleSort = (field: 'expiry_date' | 'discount_percent') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVoucher(id);
      showToast('Voucher deleted successfully', 'success');
      
      const shouldGoBack = vouchers.length === 1 && (pagination?.page ?? currentPage) > 1;
      if (shouldGoBack) {
        const previousPage = Math.max(1, (pagination?.page ?? currentPage) - 1);
        setCurrentPage(previousPage);
        await refetch({
          search: searchQuery,
          sortField,
          sortOrder,
          page: previousPage,
          limit: ITEMS_PER_PAGE,
        });
      } else {
        await refetch({
          search: searchQuery,
          sortField,
          sortOrder,
          page: pagination?.page ?? currentPage,
          limit: ITEMS_PER_PAGE,
        });
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete voucher', 'error');
    }
  };

  const handleExport = async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);
    try {
      const blob = await downloadCSV();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vouchers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Vouchers exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export vouchers', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const progress = useSmoothProgress(isExporting);

  return (
    <Layout>
      <ProgressBar progress={progress} />
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
              isLoading={isExporting}
              disabled={isLoading || !hasData || isExporting}
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
                onSearch={handleSearch}
                placeholder="Search by voucher code..."
              />
            </div>
            {searchQuery && (
              <div className="text-xs sm:text-sm text-slate-600">
                Found <span className="font-semibold text-slate-900">{totalCount}</span> result{totalCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* In-flight status */}
        {isExporting && (
          <div className="bg-primary-50 border border-primary-200 text-primary-700 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V2m0 20v-2a8 8 0 008-8" />
            </svg>
            Preparing CSV export…
          </div>
        )}

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
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{totalCount}</p>
            <p className="text-xs text-slate-500 mt-1 sm:mt-2">Matches current filters</p>
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
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{activeCount}</p>
            <p className="text-xs text-slate-500 mt-1 sm:mt-2">Active in current page</p>
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
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{expiredCount}</p>
            <p className="text-xs text-slate-500 mt-1 sm:mt-2">Expired in current page</p>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : !hasData ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-10 text-center flex flex-col items-center gap-3">
            <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-primary-50 to-primary-100">
              <svg className="w-9 h-9 sm:w-11 sm:h-11 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="max-w-md space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                {isSearching ? 'No vouchers match your search' : 'No vouchers found'}
              </h2>
              <p className="text-sm text-slate-600">
                {isSearching
                  ? 'Try adjusting your keywords or filters and search again.'
                  : 'Your voucher list is currently empty.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <VoucherTable
              vouchers={vouchers}
              onEdit={(id) => navigate(`/vouchers/edit/${id}`)}
              onDelete={handleDelete}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />
            <Pagination
              currentPage={currentPageNumber}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </Layout>
  );
};