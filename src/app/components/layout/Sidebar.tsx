'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, LogOut } from 'lucide-react';
import { MenuItems } from '@/app/components/ui';
import { MenuItem } from '@/config';
import { User } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  user: User | null;
  menuItems: MenuItem[];
}

export default function Sidebar({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onClose,
  user,
  menuItems,
}: SidebarProps) {
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1024 && isOpen) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleOverlayClick = (): void => {
    onClose();
  };

  const handleCollapseToggle = (): void => {
    onToggleCollapse();
  };

  const handleSettingsClick = (): void => {
    console.log('Settings clicked');
  };

  const handleLogoutClick = (): void => {
    console.log('Logout clicked');
  };

  const toggleDropdown = (label: string): void => {
    const newDropdowns = new Set(openDropdowns);
    if (newDropdowns.has(label)) {
      newDropdowns.delete(label);
    } else {
      newDropdowns.add(label);
    }
    setOpenDropdowns(newDropdowns);
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50
    flex flex-col
    bg-white
    transition-all duration-300 ease-in-out
    shadow-[0_0_50px_rgba(0,0,0,0.08)]
    h-full relative
    lg:static
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-50 z-40
    transition-opacity duration-300
    lg:hidden
    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `;

  return (
    <>
      <div className={overlayClasses} onClick={handleOverlayClick} />

      <aside className={sidebarClasses}>
        <button
          onClick={handleCollapseToggle}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm flex items-center justify-center transition-all duration-200 hover:bg-indigo-100 hover:shadow-lg group"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
          )}
        </button>

        <div className="relative flex items-center p-4 border-b border-gray-100 h-20">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
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
          <div
            className={`absolute left-16 transition-all duration-300 ease-in-out ${
              isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <span className="text-xl font-bold text-gray-800 block">
              ShiftPilot
            </span>
            <p className="text-xs text-gray-500">Staffing Platform</p>
          </div>
        </div>

        {user && (
          <div className="relative flex items-center p-4 border-b border-gray-100 h-20">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {getUserInitials(user.name)}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div
              className={`absolute left-20 transition-all duration-300 ease-in-out ${
                isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <nav className="p-4 space-y-1 h-full">
            <MenuItems
              isCollapsed={isCollapsed}
              menuItems={menuItems}
              userRole={user?.role}
              openDropdowns={openDropdowns}
              onToggleDropdown={toggleDropdown}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={handleSettingsClick}
            className="relative w-full flex items-center p-3 rounded-xl text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 group hover:border-r-4 hover:border-indigo-500"
          >
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary-100 transition-colors flex-shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <span
              className={`absolute left-16 transition-all duration-300 ease-in-out font-medium ${
                isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              Settings
            </span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="relative w-full flex items-center p-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group hover:border-r-4 hover:border-indigo-500"
          >
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-red-100 transition-colors flex-shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <span
              className={`absolute left-16 transition-all duration-300 ease-in-out font-medium ${
                isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
