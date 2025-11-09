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

  // Simple active state detection
  const isItemActive = (item: MenuItem): boolean => {
    // Check if this exact item is active
    if (pathname === item.path) return true;

    // For parent items, check if any child is active
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
  }, [pathname, filteredMenuItems]);

  // Don't render dropdowns on server to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="space-y-1">
        {filteredMenuItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center p-3 rounded-xl text-gray-700 dark:text-gray-300">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              {!isCollapsed && (
                <span className="font-medium ml-3">{item.label}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredMenuItems.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No menu items available for your role
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredMenuItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = isItemActive(item);
        const isDropdownOpen = openDropdowns.has(item.label);
        const childIsActive = hasChildren && isChildActive(item.children);

        const displayDropdownOpen =
          isDropdownOpen || (childIsActive && !isCollapsed);

        // Base classes that apply to all states
        const baseClasses = clsx(
          'relative w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ease-in-out group cursor-pointer border-r-4',
          isCollapsed ? 'justify-center' : ''
        );

        const activeClasses =
          'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400 shadow-sm';
        const inactiveClasses =
          'bg-white dark:bg-gray-900 border-transparent text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20';

        const iconBaseClasses =
          'p-2 rounded-lg transition-all duration-300 ease-in-out';
        const iconActiveClasses = 'bg-primary-100 dark:bg-primary-800';
        const iconInactiveClasses =
          'bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-800';

        const iconSvgBaseClasses =
          'w-5 h-5 transition-transform duration-300 group-hover:scale-110';
        const iconSvgActiveClasses = 'text-primary-600 dark:text-primary-400';
        const iconSvgInactiveClasses =
          'text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400';

        return (
          <div key={item.label} className="space-y-1">
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
                      'flex items-center transition-all duration-300',
                      isCollapsed ? '' : 'space-x-3'
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
                      <span className="font-medium transition-all duration-300 ease-in-out">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center space-x-2 transition-all duration-300">
                      {item.badge && (
                        <span
                          className={clsx(
                            'px-2 py-1 text-xs rounded-full font-medium transition-all duration-300',
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
                        className={clsx(
                          'w-4 h-4 transition-all duration-300 ease-in-out',
                          {
                            'rotate-180': displayDropdownOpen,
                            'text-primary-600 dark:text-primary-400': isActive,
                            'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400':
                              !isActive,
                          }
                        )}
                      />
                    </div>
                  )}
                </button>

                {!isCollapsed && item.children && (
                  <div
                    className={clsx(
                      'ml-4 space-y-1 border-l-2 overflow-hidden transition-all duration-300 ease-in-out',
                      'pl-3',
                      {
                        'border-primary-300 dark:border-primary-600 max-h-[500px] opacity-100':
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
                            'relative flex items-center justify-between p-2 rounded-lg transition-all duration-300 ease-in-out group cursor-pointer border-l-2 ml-[-2px]',
                            {
                              'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-500':
                                isChildActive,
                              'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-transparent':
                                !isChildActive,
                            }
                          )}
                          role="menuitem"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={clsx(
                                'p-1 rounded-md transition-all duration-300',
                                {
                                  'bg-primary-100 dark:bg-primary-800':
                                    isChildActive,
                                  'bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-800':
                                    !isChildActive,
                                }
                              )}
                            >
                              <child.icon
                                className={clsx(
                                  'w-4 h-4 transition-transform duration-300 group-hover:scale-110',
                                  {
                                    'text-primary-600 dark:text-primary-400':
                                      isChildActive,
                                    'text-gray-500 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400':
                                      !isChildActive,
                                  }
                                )}
                              />
                            </div>
                            <span className="text-sm transition-all duration-300 font-medium">
                              {child.label}
                            </span>
                          </div>
                          {child.badge && (
                            <span
                              className={clsx(
                                'px-2 py-1 text-xs rounded-full font-medium transition-all duration-300',
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
                    'flex items-center transition-all duration-300',
                    isCollapsed ? '' : 'space-x-3'
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
                    <span className="font-medium transition-all duration-300 ease-in-out">
                      {item.label}
                    </span>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <span
                    className={clsx(
                      'px-2 py-1 text-xs rounded-full font-medium transition-all duration-300',
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
