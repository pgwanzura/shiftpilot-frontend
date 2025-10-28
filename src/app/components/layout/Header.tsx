'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '@/app/components/ui';
import { User as UserType } from '@/types';

interface HeaderProps {
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
  user: UserType | null;
}

interface PanelState {
  messages: boolean;
  notifications: boolean;
  userMenu: boolean;
}

export default function Header({
  onMenuToggle,
  sidebarCollapsed,
  user,
}: HeaderProps) {
  const [panelState, setPanelState] = useState<PanelState>({
    messages: false,
    notifications: false,
    userMenu: false,
  });

  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const messageCount = 5;
  const notificationCount = 125;

  const getUserInitials = useCallback((name: string): string => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const formatBadgeCount = useCallback((count: number): string => {
    return count > 99 ? '99+' : count.toString();
  }, []);

  const closeAllPanels = useCallback(() => {
    setPanelState({ messages: false, notifications: false, userMenu: false });
  }, []);

  const togglePanel = useCallback((panel: keyof PanelState) => {
    setPanelState((prev) => ({
      messages: panel === 'messages' ? !prev.messages : false,
      notifications: panel === 'notifications' ? !prev.notifications : false,
      userMenu: panel === 'userMenu' ? !prev.userMenu : false,
    }));
  }, []);

  const handleCreateShift = () => console.log('Create shift clicked');
  const handleCalendarView = () => console.log('Calendar view clicked');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targets = [notificationsRef, messagesRef, userMenuRef];
      const shouldClose = targets.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node)
      );

      if (shouldClose) closeAllPanels();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeAllPanels]);

  const messageItems = useMemo(
    () => [
      {
        initials: 'SJ',
        name: 'Sarah Johnson',
        time: '2 min ago',
        message: 'Can you approve my timesheet for this week?',
        color: 'blue',
      },
      {
        initials: 'MW',
        name: 'Mike Wilson',
        time: '1 hour ago',
        message: 'I need to request time off next week',
        color: 'purple',
      },
    ],
    []
  );

  const notificationItems = useMemo(
    () => [
      {
        icon: 'checkCircle' as const,
        title: 'Timesheet approved',
        description: 'Sarah Johnson • 2 hours ago',
        color: 'green',
      },
      {
        icon: 'calendar' as const,
        title: 'New shift assigned',
        description: 'Manchester Hospital • 5 hours ago',
        color: 'blue',
      },
    ],
    []
  );

  const userMenuItems = useMemo(
    () => [
      { icon: 'user' as const, label: 'Profile', href: '#' },
      { icon: 'settings' as const, label: 'Settings', href: '#' },
      {
        icon: 'logout' as const,
        label: 'Logout',
        href: '#',
        destructive: true,
      },
    ],
    []
  );

  const panelTransitionClasses = (isOpen: boolean) =>
    isOpen
      ? 'opacity-100 visible translate-y-0'
      : 'opacity-0 invisible -translate-y-2';

  return (
    <header className="glass-effect border-b border-gray-200 sticky top-0 z-9">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 lg:hidden hover:scale-105 cursor-pointer"
            aria-label="Toggle menu"
          >
            <Icon name="menu" className="w-5 h-5 text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.name?.split(' ')[0]}! Here's your agency
              overview.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleCalendarView}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Calendar View"
          >
            <Icon name="calendar" className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative" ref={messagesRef}>
            <button
              onClick={() => togglePanel('messages')}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group cursor-pointer"
              aria-label={`Messages ${messageCount > 0 ? `(${messageCount} unread)` : ''}`}
            >
              <Icon
                name="messageCircle"
                className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
              />
              {messageCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-blue-500 text-white text-xs font-medium rounded-full border-2 border-white flex items-center justify-center">
                  {formatBadgeCount(messageCount)}
                </span>
              )}
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${panelTransitionClasses(panelState.messages)}`}
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Messages</h3>
                {messageCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {messageCount} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {messageItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center`}
                      >
                        <span
                          className={`text-${item.color}-800 text-sm font-medium`}
                        >
                          {item.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-800 truncate">
                            {item.name}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium cursor-pointer"
                >
                  View All Messages
                </a>
              </div>
            </div>
          </div>

          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => togglePanel('notifications')}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group cursor-pointer"
              aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
            >
              <Icon
                name="bell"
                className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors"
              />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-medium rounded-full border-2 border-white flex items-center justify-center">
                  {formatBadgeCount(notificationCount)}
                </span>
              )}
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${panelTransitionClasses(panelState.notifications)}`}
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {notificationCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    {notificationCount} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notificationItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center`}
                      >
                        <Icon
                          name={item.icon}
                          className={`w-5 h-5 text-${item.color}-600`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 text-center">
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium cursor-pointer"
                >
                  View All Notifications
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCreateShift}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              title="Create Shift"
            >
              <Icon name="plusCircle" className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => togglePanel('userMenu')}
              className="flex items-center space-x-3 pl-3 border-l border-gray-200 cursor-pointer"
              aria-label="User menu"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role.replace('_', ' ')}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-md cursor-pointer">
                <span className="text-white font-semibold text-sm">
                  {getUserInitials(user?.name || '')}
                </span>
              </div>
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${panelTransitionClasses(panelState.userMenu)}`}
            >
              {userMenuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 transition-colors cursor-pointer ${
                    item.destructive
                      ? 'hover:bg-red-50 text-red-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon name={item.icon} className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
