'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import clsx from 'clsx';
import { MenuItems } from '@/app/components/ui';
import { MenuItem, getMenuForRole } from '@/config';
import { User } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  user: User | null;
  menuItems?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onClose,
  user,
  menuItems: propMenuItems,
}) => {
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const { theme, resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    if (propMenuItems) {
      setMenuItems(propMenuItems);
    } else if (user?.role) {
      setMenuItems(getMenuForRole(user.role));
    }
  }, [propMenuItems, user?.role]);

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    document.body.style.overflow = mobile && isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = 'unset';
    };
  }, [checkMobile]);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024 && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const getUserInitials = useCallback((name: string): string => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const handleOverlayClick = useCallback(() => onClose(), [onClose]);

  const handleCollapseToggle = useCallback(() => {
    if (!isMobile) onToggleCollapse();
  }, [isMobile, onToggleCollapse]);

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdowns((prev) => {
      const updated = new Set(prev);
      updated.has(label) ? updated.delete(label) : updated.add(label);
      return updated;
    });
  }, []);

  const sidebarClasses = useMemo(
    () =>
      clsx(
        'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out h-full border-r shadow-sm',
        'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        {
          'w-80': isMobile,
          'w-20': !isMobile && isCollapsed,
          'w-64': !isMobile && !isCollapsed,
          'translate-x-0': isOpen,
          '-translate-x-full lg:translate-x-0': !isOpen,
          'lg:static': !isMobile,
        }
      ),
    [isMobile, isCollapsed, isOpen]
  );

  const overlayClasses = useMemo(
    () =>
      clsx(
        'fixed inset-0 z-40 transition-opacity duration-300 lg:hidden bg-black dark:bg-gray-950',
        {
          'opacity-50': isOpen,
          'opacity-0 pointer-events-none': !isOpen,
        }
      ),
    [isOpen]
  );

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Dark Mode';
      case 'light':
        return 'Light Mode';
      case 'system':
        return 'System Theme';
      default:
        return 'Theme';
    }
  };

  return (
    <>
      {isMobile && (
        <div
          className={overlayClasses}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClasses} aria-label="Main navigation">
        {!isMobile && (
          <button
            onClick={handleCollapseToggle}
            className={clsx(
              'absolute -right-3 top-6 z-10 w-6 h-6 border rounded-lg flex items-center justify-center transition-all duration-200 group',
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
            )}
          </button>
        )}

        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <span className="text-lg font-bold text-gray-900 dark:text-white block truncate">
                  ShiftPilot
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Staffing Platform
                </p>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials(user.name)}
                  </span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-gray-900" />
              </div>

              {(!isCollapsed || isMobile) && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-1 inline-block" />
                    <span>Online</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4" aria-label="Primary navigation">
            <MenuItems
              isCollapsed={isMobile ? false : isCollapsed}
              menuItems={menuItems}
              userRole={user?.role}
              openDropdowns={openDropdowns}
              onToggleDropdown={toggleDropdown}
            />
          </nav>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            onClick={toggleTheme}
          >
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              {getThemeIcon()}
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-medium">{getThemeLabel()}</span>
            )}
          </button>

          <button
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => console.log('Settings clicked')}
          >
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-medium">Settings</span>
            )}
          </button>

          <button
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
            onClick={() => console.log('Logout clicked')}
          >
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
