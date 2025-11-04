'use client';

import { ChevronDown } from 'lucide-react';
import { MenuItem, hasMenuAccess } from '../../../config/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  // Filter menu items based on user role and permissions
  useEffect(() => {
    const filtered = menuItems
      .filter((item) => {
        // Check if user has access to this menu item
        if (!userRole || !item.permission) return true;
        return hasMenuAccess(userRole, item.permission);

        // Also filter children if they exist
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
      .filter((item) => !item.children || item.children.length > 0); // Remove parent items with no accessible children

    setFilteredMenuItems(filtered);
  }, [menuItems, userRole]);

  const isActivePath = (itemPath?: string, childPaths?: MenuItem[]) => {
    if (itemPath && pathname === itemPath) return true;
    if (childPaths) {
      return childPaths.some((child) => pathname === child.path);
    }
    return false;
  };

  const isChildActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some((child) => pathname === child.path);
  };

  // Auto-open dropdown if a child is active
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

  if (filteredMenuItems.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No menu items available for your role
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredMenuItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = isActivePath(item.path, item.children);
        const isDropdownOpen = openDropdowns.has(item.label);
        const childIsActive = isChildActive(item.children);

        const displayDropdownOpen =
          isDropdownOpen || (childIsActive && !isCollapsed);

        return (
          <div key={item.label} className="space-y-1">
            {hasChildren ? (
              <>
                <button
                  onClick={() => onToggleDropdown(item.label)}
                  className={`relative w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ease-in-out group cursor-pointer ${
                    isActive || childIsActive
                      ? 'bg-indigo-50 border-r-4 border-indigo-500 text-primary-600'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 border-r-2 border-white hover:border-indigo-500'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div
                    className={`flex items-center transition-all duration-300 ${
                      isCollapsed ? '' : 'space-x-3'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-all duration-300 ease-in-out ${
                        isActive || childIsActive
                          ? 'bg-primary-100'
                          : 'bg-gray-50 group-hover:bg-primary-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
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
                          className={`px-2 py-1 text-xs rounded-full font-medium transition-all duration-300 ${
                            isActive || childIsActive
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                          displayDropdownOpen ? 'rotate-180' : ''
                        } ${childIsActive ? 'text-primary-600' : ''}`}
                      />
                    </div>
                  )}
                </button>

                {!isCollapsed && item.children && (
                  <div
                    className={`
                    ml-4 space-y-1 border-l border-gray-200 pl-2 overflow-hidden transition-all duration-300 ease-in-out
                    ${displayDropdownOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                    role="menu"
                    aria-label={`${item.label} submenu`}
                  >
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.path;
                      return (
                        <Link
                          key={child.label}
                          href={child.path || '#'}
                          className={`relative flex items-center justify-between p-2 rounded-lg transition-all duration-300 ease-in-out group cursor-pointer ${
                            isChildActive
                              ? 'bg-primary-50 text-primary-600 border-r-4 border-indigo-500'
                              : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50 border-r-2 border-white hover:border-indigo-500'
                          }`}
                          role="menuitem"
                        >
                          <div className="flex items-center space-x-3">
                            <child.icon
                              className={`w-4 h-4 ml-1 transition-all duration-300 ease-in-out group-hover:scale-110 ${
                                isChildActive
                                  ? 'text-primary-600'
                                  : 'text-gray-500'
                              }`}
                            />
                            <span className="text-sm transition-all duration-300">
                              {child.label}
                            </span>
                          </div>
                          {child.badge && (
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium transition-all duration-300 ${
                                isChildActive
                                  ? 'bg-primary-100 text-primary-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
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
                className={`relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 ease-in-out group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-50/80 to-primary-50/20 border-r-4 border-indigo-500 text-primary-600'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 border-r-2 border-white hover:border-indigo-500'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div
                  className={`flex items-center transition-all duration-300 ${
                    isCollapsed ? '' : 'space-x-3'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'bg-primary-100'
                        : 'bg-gray-50 group-hover:bg-primary-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium transition-all duration-300 ease-in-out">
                      {item.label}
                    </span>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
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
