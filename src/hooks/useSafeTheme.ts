'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function useSafeTheme() {
  try {
    return useTheme();
  } catch (error) {
    return {
      theme: 'light' as const,
      resolvedTheme: 'light' as const,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
}
