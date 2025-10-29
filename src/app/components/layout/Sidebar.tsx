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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection + body scroll lock
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile && isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-close when hitting desktop breakpoint
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1024 && isOpen) {
        onClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  const getUserInitials = (name: string): string =>
    name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleOverlayClick = (): void => {
    onClose();
  };

  const handleCollapseToggle = (): void => {
    if (!isMobile) onToggleCollapse();
  };

  const toggleDropdown = (label: string): void => {
    const newDropdowns = new Set(openDropdowns);
    if (newDropdowns.has(label)) newDropdowns.delete(label);
    else newDropdowns.add(label);
    setOpenDropdowns(newDropdowns);
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50
    flex flex-col
    bg-white
    transition-all duration-300 ease-in-out
    shadow-[0_0_50px_rgba(0,0,0,0.08)]
    h-full
    border-r border-gray-100
    ${isMobile ? 'w-80' : isCollapsed ? 'w-20' : 'w-64'}
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    ${isMobile ? '' : 'lg:static'}
  `;

  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-50 z-40
    transition-opacity duration-300
    lg:hidden
    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `;

  return (
    <>
      {isMobile && (
        <div className={overlayClasses} onClick={handleOverlayClick} />
      )}

      <aside className={sidebarClasses}>
        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={handleCollapseToggle}
            className="absolute -right-3 top-6 z-10 w-6 h-6 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm flex items-center justify-center transition-all duration-200 hover:bg-indigo-100 hover:shadow-lg group cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
            )}
          </button>
        )}

        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3 w-full">
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

            {/* Logo / title: visible on desktop when not collapsed, always on mobile */}
            {(!isCollapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <span className="text-lg font-bold text-gray-800 block truncate">
                  ShiftPilot
                </span>
                <p className="text-xs text-gray-500 truncate">
                  Staffing Platform
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User block (flex layout, not absolute) */}
        {user && (
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials(user.name)}
                  </span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>

              {!isCollapsed || isMobile ? (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role.replace('_', ' ')}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block" />
                    <span>Online</span>
                  </div>
                </div>
              ) : (
                // when collapsed on desktop, show nothing (avatar only)
                <div />
              )}
            </div>
          </div>
        )}

        {/* Navigation: ensure scrollable area and no absolute positioning */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4">
            <MenuItems
              isCollapsed={isMobile ? false : isCollapsed}
              menuItems={menuItems}
              userRole={user?.role}
              openDropdowns={openDropdowns}
              onToggleDropdown={toggleDropdown}
            />
          </nav>
        </div>

        {/* Footer buttons: inline layout so mobile shows text */}
        <div className="px-4 py-3 border-t border-gray-100 space-y-2">
          <button
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            onClick={() => console.log('Settings clicked')}
          >
            <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-medium">Settings</span>
            )}
          </button>

          <button
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => console.log('Logout clicked')}
          >
            <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-center">
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
}
