'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuItem, getMenuForRole, hasMenuAccess } from '@/config/menu';
import { User } from '@/types';
import { useSafeTheme } from '@/hooks/useSafeTheme';

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
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const submenuRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const { theme, toggleTheme } = useSafeTheme();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (propMenuItems) {
      setMenuItems(propMenuItems);
    } else if (user?.role) {
      setMenuItems(getMenuForRole(user.role));
    }
  }, [propMenuItems, user?.role]);

  const checkMobile = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    if (mobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return mobile;
  }, [isOpen]);

  useEffect(() => {
    if (!isClient) return;
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = 'unset';
    };
  }, [checkMobile, isClient]);

  const handleResize = useCallback(() => {
    if (!isClient) return;
    if (window.innerWidth >= 1024 && isOpen) {
      onClose();
    }
  }, [isOpen, onClose, isClient]);

  useEffect(() => {
    if (!isClient) return;
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, isClient]);

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
      if (prev.has(label)) {
        const updated = new Set(prev);
        updated.delete(label);
        return updated;
      }
      return new Set([label]);
    });
  }, []);

  const filteredMenuItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        if (!user?.role || !item.permission) return true;
        return hasMenuAccess(user.role, item.permission);
      })
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter(
              (child) =>
                !child.permission ||
                hasMenuAccess(user?.role || '', child.permission)
            ),
          };
        }
        return item;
      })
      .filter((item) => !item.children || item.children.length > 0);
  }, [menuItems, user?.role]);

  const isItemActive = useCallback(
    (item: MenuItem): boolean => {
      if (pathname === item.path) return true;
      if (item.children) {
        return item.children.some((child) => pathname === child.path);
      }
      return false;
    },
    [pathname]
  );

  const isChildActive = useCallback(
    (children?: MenuItem[]): boolean => {
      if (!children) return false;
      return children.some((child) => pathname === child.path);
    },
    [pathname]
  );

  useEffect(() => {
    for (const item of filteredMenuItems) {
      if (item.children && isChildActive(item.children)) {
        setOpenDropdowns(() => new Set([item.label]));
        break;
      }
    }
  }, [pathname, filteredMenuItems, isChildActive]);

  const sidebarClasses = useMemo(
    () =>
      clsx(
        'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out h-full border-r',
        'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        {
          'w-80': isClient && isMobile,
          'w-20': isClient && !isMobile && isCollapsed,
          'w-64': isClient && !isMobile && !isCollapsed,
          'translate-x-0': isOpen,
          '-translate-x-full lg:translate-x-0': !isOpen,
          'lg:static': isClient && !isMobile,
        }
      ),
    [isMobile, isCollapsed, isOpen, isClient]
  );

  const overlayClasses = useMemo(
    () =>
      clsx(
        'fixed inset-0 z-40 transition-opacity duration-300 lg:hidden bg-black dark:bg-gray-950',
        {
          'opacity-50': isOpen && isClient && isMobile,
          'opacity-0 pointer-events-none': !isOpen || !isClient || !isMobile,
        }
      ),
    [isOpen, isClient, isMobile]
  );

  const getThemeIcon = (): JSX.Element => {
    const iconProps = { className: 'w-4 h-4' };
    switch (theme) {
      case 'dark':
        return <Moon {...iconProps} />;
      case 'light':
        return <Sun {...iconProps} />;
      case 'system':
        return <Monitor {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  const getThemeLabel = (): string => {
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

  const showFullSidebar = isClient;
  const showCollapsedContent = !isCollapsed || (isClient && isMobile);
  const showMobileOverlay = isClient && isMobile && isOpen;

  const handleSettingsClick = (): void => console.log('Settings clicked');
  const handleLogoutClick = (): void => console.log('Logout clicked');

  const LogoIcon = (): JSX.Element => (
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
  );

  const renderMenuItem = (item: MenuItem): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isItemActive(item);
    const isDropdownOpen = openDropdowns.has(item.label);
    const childIsActive = hasChildren && isChildActive(item.children);
    const displayDropdownOpen =
      isDropdownOpen || (childIsActive && !isCollapsed);

    const baseClasses = clsx(
      'relative w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200 border-r-2',
      isCollapsed ? 'justify-center' : ''
    );

    const activeClasses =
      'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400';
    const inactiveClasses =
      'bg-white dark:bg-gray-900 border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20';

    const iconBaseClasses = 'p-1.5 rounded transition-colors duration-200';
    const iconActiveClasses = 'bg-primary-100 dark:bg-primary-800';
    const iconInactiveClasses =
      'bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-800';

    const iconSvgBaseClasses = 'w-4 h-4';
    const iconSvgActiveClasses = 'text-primary-600 dark:text-primary-400';
    const iconSvgInactiveClasses =
      'text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400';

    if (hasChildren) {
      return (
        <div key={item.label} className="space-y-0.5">
          <button
            onClick={() => toggleDropdown(item.label)}
            className={clsx(
              baseClasses,
              isActive ? activeClasses : inactiveClasses
            )}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            type="button"
          >
            <div
              className={clsx(
                'flex items-center',
                isCollapsed ? '' : 'space-x-2'
              )}
            >
              <div
                className={clsx(
                  iconBaseClasses,
                  isActive ? iconActiveClasses : iconInactiveClasses
                )}
              >
                <item.icon
                  className={clsx(
                    iconSvgBaseClasses,
                    isActive ? iconSvgActiveClasses : iconSvgInactiveClasses
                  )}
                />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex items-center space-x-1">
                {item.badge && (
                  <span
                    className={clsx(
                      'px-1.5 py-0.5 text-xs rounded-full font-medium',
                      {
                        'bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200':
                          isActive,
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200':
                          !isActive,
                      }
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronDown
                  className={clsx('w-3 h-3 transition-transform duration-200', {
                    'rotate-180': displayDropdownOpen,
                    'text-primary-600 dark:text-primary-400': isActive,
                    'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400':
                      !isActive,
                  })}
                />
              </div>
            )}
          </button>

          {!isCollapsed && item.children && (
            <div
              ref={(el) => submenuRefs.current.set(item.label, el)}
              style={{
                maxHeight: displayDropdownOpen
                  ? `${submenuRefs.current.get(item.label)?.scrollHeight ?? 0}px`
                  : '0px',
                transition: 'max-height 280ms ease',
                overflow: 'hidden',
              }}
              className={clsx('ml-3 space-y-0.5 border-l pl-2', {
                'border-primary-300 dark:border-primary-600':
                  displayDropdownOpen,
                'border-gray-200 dark:border-gray-700': !displayDropdownOpen,
              })}
              role="menu"
              aria-label={`${item.label} submenu`}
            >
              {item.children.map((child) => {
                const isChildActive = pathname === child.path;
                return (
                  <Link
                    key={child.label}
                    href={child.path || '#'}
                    className={clsx(
                      'relative flex items-center justify-between p-1.5 rounded transition-colors duration-200 border-l ml-[-1px]',
                      {
                        'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-500':
                          isChildActive,
                        'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-transparent':
                          !isChildActive,
                      }
                    )}
                    role="menuitem"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={clsx(
                          'p-1 rounded transition-colors duration-200',
                          {
                            'bg-primary-100 dark:bg-primary-800': isChildActive,
                            'bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-800':
                              !isChildActive,
                          }
                        )}
                      >
                        <child.icon
                          className={clsx('w-3 h-3', {
                            'text-primary-600 dark:text-primary-400':
                              isChildActive,
                            'text-gray-500 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400':
                              !isChildActive,
                          })}
                        />
                      </div>
                      <span className="text-sm font-medium">{child.label}</span>
                    </div>
                    {child.badge && (
                      <span
                        className={clsx(
                          'px-1.5 py-0.5 text-xs rounded-full font-medium',
                          {
                            'bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200':
                              isChildActive,
                            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200':
                              !isChildActive,
                          }
                        )}
                      >
                        {child.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.label} className="space-y-0.5">
        <Link
          href={item.path || '#'}
          className={clsx(
            baseClasses,
            isActive ? activeClasses : inactiveClasses
          )}
        >
          <div
            className={clsx(
              'flex items-center',
              isCollapsed ? '' : 'space-x-2'
            )}
          >
            <div
              className={clsx(
                iconBaseClasses,
                isActive ? iconActiveClasses : iconInactiveClasses
              )}
            >
              <item.icon
                className={clsx(
                  iconSvgBaseClasses,
                  isActive ? iconSvgActiveClasses : iconSvgInactiveClasses
                )}
              />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </div>
          {!isCollapsed && item.badge && (
            <span
              className={clsx(
                'px-1.5 py-0.5 text-xs rounded-full font-medium',
                {
                  'bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200':
                    isActive,
                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200':
                    !isActive,
                }
              )}
            >
              {item.badge}
            </span>
          )}
        </Link>
      </div>
    );
  };

  const renderMenuItems = (): JSX.Element => {
    if (!isClient) {
      return (
        <div className="space-y-0.5">
          {filteredMenuItems.map((item) => (
            <div key={item.label} className="space-y-0.5">
              <div className="flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300">
                <div className="p-1.5 rounded bg-gray-50 dark:bg-gray-800">
                  <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-medium ml-2">{item.label}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredMenuItems.length === 0) {
      return (
        <div className="p-2 text-center text-sm text-gray-500 dark:text-gray-400">
          No menu items available
        </div>
      );
    }

    return (
      <div className="space-y-0.5">{filteredMenuItems.map(renderMenuItem)}</div>
    );
  };

  return (
    <>
      {showMobileOverlay && (
        <div
          className={overlayClasses}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClasses} aria-label="Main navigation">
        {showFullSidebar && !isMobile && (
          <button
            onClick={handleCollapseToggle}
            className={clsx(
              'absolute -right-3 top-6 z-10 w-6 h-6 border rounded-lg flex items-center justify-center transition-colors duration-200 group',
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
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <LogoIcon />
            </div>
            {showCollapsedContent && (
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
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials(user.name)}
                  </span>
                </div>
                {showFullSidebar && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-gray-900" />
                )}
              </div>

              {showCollapsedContent && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                  {showFullSidebar && (
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="w-2 h-2 bg-success-500 rounded-full mr-1 inline-block" />
                      <span>Online</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <nav className="p-2" aria-label="Primary navigation">
            {renderMenuItems()}
          </nav>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 space-y-0.5">
          <button
            className="w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200 border-r-2 border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            onClick={toggleTheme}
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-800 transition-colors duration-200">
                {getThemeIcon()}
              </div>
              {showCollapsedContent && (
                <span className="text-sm font-medium">{getThemeLabel()}</span>
              )}
            </div>
          </button>

          <button
            className="w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200 border-r-2 border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            onClick={handleSettingsClick}
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-800 transition-colors duration-200">
                <Settings className="w-4 h-4" />
              </div>
              {showCollapsedContent && (
                <span className="text-sm font-medium">Settings</span>
              )}
            </div>
          </button>

          <button
            className="w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200 border-r-2 border-transparent text-gray-700 dark:text-gray-300 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20"
            onClick={handleLogoutClick}
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded bg-gray-50 dark:bg-gray-800 group-hover:bg-error-100 dark:group-hover:bg-error-800 transition-colors duration-200">
                <LogOut className="w-4 h-4" />
              </div>
              {showCollapsedContent && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
