// lib/auth/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
  }>({
    user: null,
    token: null,
    isLoading: true,
  });

  const getAuthFromCookies = (): {
    user: AuthUser | null;
    token: string | null;
  } => {
    if (typeof window === 'undefined') {
      return { user: null, token: null };
    }

    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((row) => row.startsWith('auth_token='));
    const userCookie = cookies.find((row) => row.startsWith('auth_user='));

    const token = tokenCookie?.split('=')[1] || null;

    let user: AuthUser | null = null;
    if (userCookie) {
      try {
        const userData = JSON.parse(
          decodeURIComponent(userCookie.split('=')[1])
        );
        // Validate user structure
        if (userData && userData.id && userData.email && userData.role) {
          user = userData as AuthUser;
        }
      } catch (error) {
        console.error('Failed to parse auth user cookie:', error);
      }
    }

    return { user, token };
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const session = await response.json();
        setAuthState({
          user: session.user,
          token: session.access_token,
          isLoading: false,
        });
      } else {
        const { user, token } = getAuthFromCookies();
        setAuthState({ user, token, isLoading: false });
      }
    } catch (error) {
      const { user, token } = getAuthFromCookies();
      setAuthState({ user, token, isLoading: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({ user: null, token: null, isLoading: false });
      // Clear cookies
      document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie =
        'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated: !!authState.user && !!authState.token,
        isLoading: authState.isLoading,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
