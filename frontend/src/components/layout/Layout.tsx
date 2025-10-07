import { FC, ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto w-full">
        <div className="container-custom py-4 sm:py-6 md:py-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
};