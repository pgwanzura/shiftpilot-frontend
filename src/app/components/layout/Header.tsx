'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/app/components/ui';
import { User } from '@/types';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface HeaderProps {
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
  user: User | null;
}

export default function Header({
  onMenuToggle,
  sidebarCollapsed,
  user,
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Using the consolidated usePageMetadata hook
  const { pageTitle, pageDescription } = usePageMetadata();

  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        messagesRef.current &&
        !messagesRef.current.contains(event.target as Node)
      ) {
        setIsMessagesOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const messageCount = 5;
  const notificationCount = 125;

  const formatBadgeCount = (count: number): string => {
    return count > 99 ? '99+' : count.toString();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <Icon name="menu" className="w-5 h-5 text-gray-600" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-800 truncate">
                {pageTitle}
              </h1>
              <p className="text-xs text-gray-500 line-clamp-2">
                {pageDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                aria-label="Notifications"
              >
                <Icon name="bell" className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-red-500 text-white text-[10px] font-medium rounded-full border-2 border-white flex items-center justify-center">
                    {formatBadgeCount(notificationCount)}
                  </span>
                )}
              </button>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {getUserInitials(user?.name || 'User')}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800 truncate">
                {pageTitle}
              </h1>
              <p className="text-sm text-gray-500 max-w-2xl truncate">
                {pageDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Calendar"
            >
              <Icon name="calendar" className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative" ref={messagesRef}>
              <button
                onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                aria-label="Messages"
              >
                <Icon name="messageCircle" className="w-5 h-5 text-gray-600" />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-blue-500 text-white text-xs font-medium rounded-full border-2 border-white flex items-center justify-center">
                    {formatBadgeCount(messageCount)}
                  </span>
                )}
              </button>
            </div>

            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                aria-label="Notifications"
              >
                <Icon name="bell" className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-medium rounded-full border-2 border-white flex items-center justify-center">
                    {formatBadgeCount(notificationCount)}
                  </span>
                )}
              </button>
            </div>

            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Create new"
            >
              <Icon name="plusCircle" className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 pl-3 border-l border-gray-200"
                aria-label="User menu"
              >
                <div className="text-right min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize truncate">
                    {user?.role?.replace('_', ' ') || 'Unknown Role'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials(user?.name || 'User')}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
