'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/layout';
import { Header } from '@/app/components/layout';
import { getMenuForRole } from '../../config/menu';
import { LayoutProps, User, SidebarState, SidebarHandlers } from '@/types';

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const parseUserFromCookie = (cookieValue: string): User | null => {
      try {
        return JSON.parse(cookieValue) as User;
      } catch {
        return null;
      }
    };

    const getCookieValue = (name: string): string | null => {
      if (typeof document === 'undefined') return null;

      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
      return null;
    };

    const getUserFromCookie = (): void => {
      const userCookie = getCookieValue('auth_user');
      if (userCookie) {
        const decodedUser = decodeURIComponent(userCookie);
        const parsedUser = parseUserFromCookie(decodedUser);
        setUser(parsedUser);
      }
    };

    getUserFromCookie();
  }, []);

  const handleMenuToggle = (): void => {
    setSidebarOpen((prevState) => !prevState);
  };

  const handleToggleCollapse = (): void => {
    setSidebarCollapsed((prevState) => !prevState);
  };

  const handleCloseSidebar = (): void => {
    setSidebarOpen(false);
  };

  const sidebarState: SidebarState = {
    isOpen: sidebarOpen,
    isCollapsed: sidebarCollapsed,
  };

  const sidebarHandlers: SidebarHandlers = {
    onToggleCollapse: handleToggleCollapse,
    onClose: handleCloseSidebar,
    onMenuToggle: handleMenuToggle,
  };

  const userMenu = user ? getMenuForRole(user.role) : [];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isOpen={sidebarState.isOpen}
        isCollapsed={sidebarState.isCollapsed}
        onToggleCollapse={sidebarHandlers.onToggleCollapse}
        onClose={sidebarHandlers.onClose}
        user={user}
        menuItems={userMenu}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuToggle={sidebarHandlers.onMenuToggle}
          sidebarCollapsed={sidebarState.isCollapsed}
          user={user}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
