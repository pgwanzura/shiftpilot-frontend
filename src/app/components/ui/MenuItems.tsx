'use client';

import { ChevronDown } from 'lucide-react';
import { MenuItem, hasMenuAccess } from '../../../config/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface MenuItemsProps {
  isCollapsed: boolean;
  menuItems: MenuItem[];
  userRole?: string;
  openDropdowns: Set<string>;
  onToggleDropdown: (label: string) => void;
}

export function MenuItems({
  isCollapsed,
  menuItems,
  userRole,
  openDropdowns,
  onToggleDropdown,
}: MenuItemsProps) {
  const pathname = usePathname();
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const filtered = menuItems
      .filter((item) => {
        if (!userRole || !item.permission) return true;
        return hasMenuAccess(userRole, item.permission);
      })
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter(
              (child) =>
                !child.permission ||
                hasMenuAccess(userRole || '', child.permission)
            ),
          };
        }
        return item;
      })
      .filter((item) => !item.children || item.children.length > 0);

    setFilteredMenuItems(filtered);
  }, [menuItems, userRole]);

  const isItemActive = (item: MenuItem): boolean => {
    if (pathname === item.path) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.path);
    }
    return false;
  };

  const isChildActive = (children?: MenuItem[]): boolean => {
    if (!children) return false;
    return children.some((child) => pathname === child.path);
  };

  useEffect(() => {
    filteredMenuItems.forEach((item) => {
      if (
        item.children &&
        isChildActive(item.children) &&
        !openDropdowns.has(item.label)
      ) {
        onToggleDropdown(item.label);
      }
    });
  }, [pathname, filteredMenuItems, openDropdowns, onToggleDropdown]);

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
    <div className="space-y-0.5">
      {filteredMenuItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = isItemActive(item);
        const isDropdownOpen = openDropdowns.has(item.label);
        const childIsActive = hasChildren && isChildActive(item.children);
        const displayDropdownOpen =
          isDropdownOpen || (childIsActive && !isCollapsed);

        const baseClasses = clsx(
          'relative w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 border-r-2',
          isCollapsed ? 'justify-center' : ''
        );

        const activeClasses =
          'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400';
        const inactiveClasses =
          'bg-white dark:bg-gray-900 border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20';

        const iconBaseClasses = 'p-1.5 rounded transition-all duration-200';
        const iconActiveClasses = 'bg-primary-100 dark:bg-primary-800';
        const iconInactiveClasses =
          'bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-800';

        const iconSvgBaseClasses = 'w-4 h-4 transition-transform duration-200';
        const iconSvgActiveClasses = 'text-primary-600 dark:text-primary-400';
        const iconSvgInactiveClasses =
          'text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400';

        return (
          <div key={item.label} className="space-y-0.5">
            {hasChildren ? (
              <>
                <button
                  onClick={() => onToggleDropdown(item.label)}
                  className={clsx(
                    baseClasses,
                    isActive ? activeClasses : inactiveClasses
                  )}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
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
                          isActive
                            ? iconSvgActiveClasses
                            : iconSvgInactiveClasses
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
                        className={clsx('w-3 h-3 transition-all duration-200', {
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
                    className={clsx(
                      'ml-3 space-y-0.5 border-l overflow-hidden transition-all duration-200 pl-2',
                      {
                        'border-primary-300 dark:border-primary-600 max-h-96 opacity-100':
                          displayDropdownOpen,
                        'border-gray-200 dark:border-gray-700 max-h-0 opacity-0':
                          !displayDropdownOpen,
                      }
                    )}
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
                            'relative flex items-center justify-between p-1.5 rounded transition-all duration-200 border-l ml-[-1px]',
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
                                'p-1 rounded transition-all duration-200',
                                {
                                  'bg-primary-100 dark:bg-primary-800':
                                    isChildActive,
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
                            <span className="text-sm font-medium">
                              {child.label}
                            </span>
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
              </>
            ) : (
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
            )}
          </div>
        );
      })}
    </div>
  );
}
