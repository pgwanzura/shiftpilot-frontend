'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/app/components/ui';
import { User } from '@/types';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
  user: User | null;
}

export default function Header({ onMenuToggle, user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { pageTitle, pageDescription } = usePageMetadata();

  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
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

  const getCalendarDescription = (): string => {
    if (pathname !== '/calendar') return pageDescription;

    const roleDescriptions: Record<string, string> = {
      super_admin: 'Manage platform-wide schedules and resource allocation',
      agency_admin: 'Manage agency schedules and shift assignments',
      agent: 'View and manage shift schedules and assignments',
      employer_admin: 'Manage company schedules and shift planning',
      contact: 'View and manage daily schedules and approvals',
      employee: 'View personal schedule and shift assignments',
    };

    return (
      roleDescriptions[user?.role || ''] ||
      'Manage your schedules and calendar events'
    );
  };

  const messageCount = 5;
  const notificationCount = 125;

  const formatBadgeCount = (count: number): string => {
    return count > 99 ? '99+' : count.toString();
  };

  const handleCalendarClick = (): void => {
    router.push('/calendar');
  };

  const currentDescription = getCalendarDescription();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <Icon
                name="menu"
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
              />
            </button>
            <div className="min-w-0 flex-1 ml-2.5">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {pageTitle}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {currentDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <Icon
                  name="bell"
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-error-500 text-white text-[10px] font-medium rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
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
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">
                    {getUserInitials(user?.name || 'User')}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4 ml-2.5">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {pageTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl truncate">
                {currentDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCalendarClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Calendar"
            >
              <Icon
                name="calendar"
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
              />
            </button>

            <div className="relative" ref={messagesRef}>
              <button
                onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Messages"
              >
                <Icon
                  name="mail"
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-primary-500 text-white text-xs font-medium rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    {formatBadgeCount(messageCount)}
                  </span>
                )}
              </button>
            </div>

            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <Icon
                  name="bell"
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-error-500 text-white text-xs font-medium rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    {formatBadgeCount(notificationCount)}
                  </span>
                )}
              </button>
            </div>

            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Create new"
            >
              <Icon
                name="plusCircle"
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
              />
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700"
                aria-label="User menu"
              >
                <div className="text-right min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                    {user?.role?.replace('_', ' ') || 'Unknown Role'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">
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
