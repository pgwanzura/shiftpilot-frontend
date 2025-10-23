// @/app/components/layouts/AppLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/components/layout/Sidebar';
import Header from '@/app/components/layout/Header';
import { Loader } from '@/app/components/ui';
import { useAuth } from '@/lib/providers/AuthProvider';
import { User } from '@/lib/api/types/auth';

interface AppLayoutProps {
  children: React.ReactNode;
  role:
    | 'admin'
    | 'super_admin'
    | 'candidate'
    | 'recruiter'
    | 'recruiter_admin'
    | 'referee';
  user: User;
}

export default function AppLayout({
  children,
  role,
  user,
}: AppLayoutProps): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { user: authUser, isLoading: authLoading } = useAuth();

  const currentUser = user || authUser;

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setInitialLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  const isLoading = initialLoading || authLoading;

  return (
    <div className="flex h-screen overflow-hidden">
      {isLoading && <Loader size="xl" fullScreen showText />}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar role={role} user={currentUser} />
      </div>
      <div className="lg:hidden">
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar role={role} user={currentUser} />
        </div>
      </div>
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <div className="fixed top-0 right-0 z-40 w-full lg:w-[calc(100%-16rem)]">
          <Header
            role={role}
            user={currentUser}
            onMenuToggle={() => setMobileOpen(!mobileOpen)}
          />
        </div>
        <main className="flex-1 pt-16 pb-6 mt-2 overflow-auto">
          <div className="min-h-screen bg-gray-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {!isLoading && children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
