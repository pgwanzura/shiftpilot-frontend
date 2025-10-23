// lib/providers/AuthProvider.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getUserFromCookie } from '@/lib/utils/client-auth';
import { logoutAction } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/api/types/auth';

type UserRole = 'admin' | 'recruiter' | 'candidate' | 'referee';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

// Type guard to validate user role
function isValidUserRole(role: string): role is UserRole {
  return ['admin', 'recruiter', 'candidate', 'referee'].includes(role);
}

// Transform AuthUser to User with proper role typing
function transformAuthUser(
  authUser: ReturnType<typeof getUserFromCookie>
): User | null {
  if (!authUser) return null;

  if (isValidUserRole(authUser.role)) {
    return {
      id: authUser.id, // This is number (from ApiUser)
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      // Include any other properties from ApiUser
    };
  }

  return null;
}

export function AuthProvider({
  children,
  initialUser,
}: AuthProviderProps): React.JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // If no initial user provided, get from cookie
    if (!initialUser) {
      const currentUser = transformAuthUser(getUserFromCookie());
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
    const currentUser = transformAuthUser(getUserFromCookie());
    setUser(currentUser);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
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
