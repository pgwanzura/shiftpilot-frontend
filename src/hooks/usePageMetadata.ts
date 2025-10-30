'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePageTitle } from '@/contexts/PageTitleContext';
import {
  findMenuItemByPath,
  getDefaultTitleForRole,
  getDefaultDescriptionForRole,
} from '@/config/menu';

interface UsePageMetadataReturn {
  // State
  pageTitle: string;
  pageDescription: string;

  // Setters
  setPageTitle: (title: string) => void;
  setPageDescription: (description: string) => void;
  setPageMetadata: (title: string, description: string) => void;

  // Convenience methods
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setBoth: (title: string, description: string) => void;

  // Route-based automation
  useRouteMetadata: (userRole?: string) => void;
}

export function usePageMetadata(): UsePageMetadataReturn {
  const {
    pageTitle,
    pageDescription,
    setPageTitle,
    setPageDescription,
    setPageMetadata,
  } = usePageTitle();

  const setTitle = setPageTitle;
  const setDescription = setPageDescription;
  const setBoth = setPageMetadata;

  const useRouteMetadata = (userRole?: string) => {
    const pathname = usePathname();

    useEffect(() => {
      if (!pathname) return;

      // Find menu item matching current path
      const menuItem = findMenuItemByPath(pathname);

      if (menuItem) {
        setPageMetadata(menuItem.label, menuItem.description);
      } else if (userRole) {
        // Fallback to default title and description for the role
        const defaultTitle = getDefaultTitleForRole(userRole);
        const defaultDescription = getDefaultDescriptionForRole(userRole);
        setPageMetadata(defaultTitle, defaultDescription);
      } else {
        setPageMetadata(
          'Dashboard',
          'Overview of your key metrics and recent activity'
        );
      }
    }, [pathname, userRole, setPageMetadata]);
  };

  return {
    // State
    pageTitle,
    pageDescription,

    // Setters
    setPageTitle,
    setPageDescription,
    setPageMetadata,

    // Convenience methods
    setTitle,
    setDescription,
    setBoth,

    // Route-based automation
    useRouteMetadata,
  };
}
