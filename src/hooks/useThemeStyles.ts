import { useTheme } from '@/contexts/ThemeContext';

export function useThemeStyles() {
  const { resolvedTheme } = useTheme();

  return {
    isDark: resolvedTheme === 'dark',
    theme: resolvedTheme,
  };
}
