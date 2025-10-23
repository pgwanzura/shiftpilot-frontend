'use client';

import { useEffect, useRef, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

export interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'underline' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underline',
  size = 'md',
  animated = true,
}: TabNavigationProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (
      activeTabElement &&
      (variant === 'underline' || variant === 'default')
    ) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        opacity: 1,
      });
    }
  }, [activeTab, variant, tabs]);

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (
      activeTabElement &&
      (variant === 'underline' || variant === 'default')
    ) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        opacity: 0,
      });

      setTimeout(() => {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 1 }));
      }, 50);
    }
  }, [activeTab, variant]);

  const sizeClasses = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-3 px-4 text-sm',
    lg: 'py-4 px-5 text-base',
  };

  const variantClasses = {
    default: {
      active: 'border-indigo-500 text-indigo-600',
      inactive:
        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
    underline: {
      active: 'text-indigo-600',
      inactive: 'text-gray-500 hover:text-gray-700',
    },
    pills: {
      active: 'bg-indigo-100 text-indigo-700 rounded-lg',
      inactive:
        'text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg',
    },
  };

  const getTabClassName = (tabId: string) => {
    const baseClasses = `whitespace-nowrap font-medium flex items-center relative z-10 transition-all duration-300 ease-out ${
      sizeClasses[size]
    } ${
      activeTab === tabId
        ? variantClasses[variant].active
        : variantClasses[variant].inactive
    } ${variant === 'pills' ? 'mx-1 first:ml-0 rounded-lg' : ''}`;

    return baseClasses;
  };

  const setTabRef = (tabId: string) => (el: HTMLButtonElement | null) => {
    tabRefs.current[tabId] = el;
  };

  return (
    <div className="mb-6">
      <div className="sm:hidden">
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-all duration-200"
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label} {tab.badge ? `(${tab.badge})` : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div
          className={`relative ${
            variant === 'underline'
              ? 'border-b-2 border-gray-200'
              : variant === 'pills'
                ? ''
                : 'border-b border-gray-200'
          }`}
        >
          <nav
            className={`flex ${
              variant === 'pills' ? 'space-x-1' : 'space-x-8'
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={setTabRef(tab.id)}
                onClick={() => onTabChange(tab.id)}
                className={getTabClassName(tab.id)}
              >
                <div className="flex items-center justify-center space-x-2">
                  {tab.icon && (
                    <span
                      className={`flex items-center justify-center ${
                        size === 'sm'
                          ? 'w-3 h-3'
                          : size === 'lg'
                            ? 'w-5 h-5'
                            : 'w-4 h-4'
                      }`}
                    >
                      {tab.icon}
                    </span>
                  )}
                  <span className="flex items-center">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center justify-center min-w-[20px] h-5 ${
                        activeTab === tab.id
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>

          {variant === 'underline' && animated && (
            <div
              className="absolute bottom-0 bg-indigo-500 transition-all duration-400 ease-out"
              style={{
                ...indicatorStyle,
                height: '6px',
                bottom: '-3px',
                transitionProperty: 'left, width, opacity',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}

          {variant === 'pills' && animated && (
            <div
              className="absolute bottom-0 h-full bg-indigo-100 rounded-lg transition-all duration-400 ease-out z-0"
              style={{
                ...indicatorStyle,
                transitionProperty: 'left, width, opacity',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
        </div>
      </div>

      {variant === 'default' && animated && (
        <div className="hidden sm:block relative">
          <div
            className="absolute bottom-0 bg-indigo-500 transition-all duration-400 ease-out rounded-t-full"
            style={{
              ...indicatorStyle,
              height: '6px',
              bottom: '-3px',
              transitionProperty: 'left, width, opacity',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      )}
    </div>
  );
}
