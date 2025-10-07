import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Header: FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/vouchers" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Voucher System</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Link
              to="/vouchers"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/vouchers') || isActive('/vouchers/new') || location.pathname.startsWith('/vouchers/edit')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Vouchers
            </Link>
            <Link
              to="/csv-upload"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/csv-upload')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">CSV Upload</span>
              <span className="sm:hidden">CSV</span>
            </Link>
            <button
              onClick={logout}
              className="ml-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};