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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const getUserFromCookie = (): void => {
      try {
        if (typeof document === 'undefined') return;

        const value = `; ${document.cookie}`;
        const parts = value.split(`; auth_user=`);
        if (parts.length === 2) {
          const cookieValue = parts.pop()?.split(';').shift();
          if (cookieValue) {
            const decodedUser = decodeURIComponent(cookieValue);
            const parsedUser = JSON.parse(decodedUser) as User;
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.log('Error parsing user cookie:', error);
      }
    };

    getUserFromCookie();
  }, []);

  const handleMenuToggle = (): void => {
    setSidebarOpen((prevState) => !prevState);
  };

  const handleToggleCollapse = (): void => {
    // Only allow collapsing on desktop, not mobile
    if (!isMobile) {
      setSidebarCollapsed((prevState) => !prevState);
    }
  };

  const handleCloseSidebar = (): void => {
    setSidebarOpen(false);
  };

  const sidebarState: SidebarState = {
    isOpen: sidebarOpen,
    // On mobile, sidebar is never collapsed - always full width when open
    isCollapsed: isMobile ? false : sidebarCollapsed,
  };

  const sidebarHandlers: SidebarHandlers = {
    onToggleCollapse: handleToggleCollapse,
    onClose: handleCloseSidebar,
    onMenuToggle: handleMenuToggle,
  };

  const userMenu = user ? getMenuForRole(user.role) : [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarState.isOpen}
        isCollapsed={sidebarState.isCollapsed}
        onToggleCollapse={sidebarHandlers.onToggleCollapse}
        onClose={sidebarHandlers.onClose}
        user={user}
        menuItems={userMenu}
      />

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
