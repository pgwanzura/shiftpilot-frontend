'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageTitleContextType {
  pageTitle: string;
  pageDescription: string;
  setPageTitle: (title: string) => void;
  setPageDescription: (description: string) => void;
  setPageMetadata: (title: string, description: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(
  undefined
);

interface PageTitleProviderProps {
  children: ReactNode;
}

export function PageTitleProvider({ children }: PageTitleProviderProps) {
  const [pageTitle, setPageTitle] = useState<string>('Dashboard');
  const [pageDescription, setPageDescription] = useState<string>(
    'Overview of your key metrics and recent activity'
  );

  const setPageMetadata = (title: string, description: string) => {
    setPageTitle(title);
    setPageDescription(description);
  };

  return (
    <PageTitleContext.Provider
      value={{
        pageTitle,
        pageDescription,
        setPageTitle,
        setPageDescription,
        setPageMetadata,
      }}
    >
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
}
