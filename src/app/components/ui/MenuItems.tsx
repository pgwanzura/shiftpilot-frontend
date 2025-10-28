'use client';

import { ChevronDown } from 'lucide-react';
import { MenuItem, hasMenuAccess } from '../../../config/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItemsProps {
  isCollapsed: boolean;
  menuItems: MenuItem[];
  userRole?: string;
  openDropdowns: Set<string>;
  onToggleDropdown: (label: string) => void;
}

export default function MenuItems({
  isCollapsed,
  menuItems,
  userRole,
  openDropdowns,
  onToggleDropdown,
}: MenuItemsProps) {
  const pathname = usePathname();

  const isActivePath = (itemPath?: string, childPaths?: MenuItem[]) => {
    if (itemPath && pathname === itemPath) return true;
    if (childPaths) {
      return childPaths.some((child) => pathname === child.path);
    }
    return false;
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (!userRole || !item.permission) return true;
    return hasMenuAccess(userRole, item.permission);
  });

  return (
    <div className="space-y-1">
      {filteredMenuItems.map((item) => {
        const isActive = isActivePath(item.path, item.children);
        const hasChildren = item.children && item.children.length > 0;
        const isDropdownOpen = openDropdowns.has(item.label);

        return (
          <div key={item.label} className="space-y-1">
            {hasChildren ? (
              <>
                <button
                  onClick={() => onToggleDropdown(item.label)}
                  className={`relative w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ease-in-out group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-50/80 to-primary-50/20 border-r-4 border-indigo-500 text-primary-600'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:border-r-4 hover:border-indigo-500'
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

                  {!isCollapsed && (
                    <div className="flex items-center space-x-2 transition-all duration-300">
                      {item.badge && (
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
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  )}
                </button>

                {!isCollapsed && item.children && (
                  <div
                    className={`
                    ml-4 space-y-1 border-l border-gray-200 pl-2 overflow-hidden transition-all duration-500 ease-in-out
                    ${isDropdownOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                  >
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.path;
                      return (
                        <Link
                          key={child.label}
                          href={child.path || '#'}
                          className={`relative flex items-center justify-between p-2 rounded-lg transition-all duration-300 ease-in-out group ${
                            isChildActive
                              ? 'bg-primary-50 text-primary-600 border-r-4 border-indigo-500'
                              : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50 hover:border-r-4 hover:border-indigo-500'
                          }`}
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
                className={`relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 ease-in-out group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-50/80 to-primary-50/20 border-r-4 border-indigo-500 text-primary-600'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:border-r-4 hover:border-indigo-500'
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
