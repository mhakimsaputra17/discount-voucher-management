import { FC } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const visiblePages = pages.filter(page => {
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mt-4 sm:mt-6">
      <div className="flex items-center justify-between">
        {/* Page Info */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
          </span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-in-out text-xs sm:text-sm font-medium text-slate-700"
            title="Previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            {visiblePages.map((page, index) => {
              const prevPage = visiblePages[index - 1];
              const showEllipsis = prevPage && page - prevPage > 1;

              return (
                <div key={page} className="flex items-center gap-2">
                  {showEllipsis && <span className="px-2 text-slate-400">...</span>}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`min-w-[40px] px-4 py-2 rounded-lg transition-all duration-200 ease-in-out text-sm font-medium ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-in-out text-xs sm:text-sm font-medium text-slate-700"
            title="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};