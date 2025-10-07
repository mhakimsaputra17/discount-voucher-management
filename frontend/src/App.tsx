import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { VoucherListPage } from './pages/VoucherListPage';
import { VoucherFormPage } from './pages/VoucherFormPage';
import { CSVUploadPage } from './pages/CSVUploadPage';

const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/vouchers" replace /> : <Login />}
      />
      <Route
        path="/vouchers"
        element={
          <ProtectedRoute>
            <VoucherListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vouchers/new"
        element={
          <ProtectedRoute>
            <VoucherFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vouchers/edit/:id"
        element={
          <ProtectedRoute>
            <VoucherFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/csv-upload"
        element={
          <ProtectedRoute>
            <CSVUploadPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/vouchers" replace />} />
      <Route path="*" element={<Navigate to="/vouchers" replace />} />
    </Routes>
  );
};

const App: FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;