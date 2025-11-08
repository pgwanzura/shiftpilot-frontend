'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, UserRole } from '@/types/auth';
import { getUserFromCookie } from '../utils/client-auth';
import { logoutAction } from '../actions/auth-actions';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: AuthUser | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(initialUser || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!initialUser) {
      const currentUser = getUserFromCookie();
      setUser(currentUser);
    }
    setIsLoading(false);
  }, [initialUser]);

  const logout = async (): Promise<void> => {
    await logoutAction();
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const refreshUser = (): void => {
    const currentUser = getUserFromCookie();
    setUser(currentUser);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
