// lib/auth/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { AuthUser, AuthContextType } from '@/types/auth';
import { apiClient } from '@/lib/api/apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const getAuthFromCookies = useCallback((): {
    user: AuthUser | null;
    token: string | null;
  } => {
    if (typeof window === 'undefined') {
      return { user: null, token: null };
    }

    const cookies = document.cookie.split('; ');
    console.log('All available cookies:', cookies); // Debug line
    const tokenCookie = cookies.find((row) => row.startsWith('auth_token='));
    const userCookie = cookies.find((row) => row.startsWith('auth_user='));

    const token = tokenCookie?.split('=')[1] || null;

    let user: AuthUser | null = null;
    if (userCookie) {
      try {
        const userData = JSON.parse(
          decodeURIComponent(userCookie.split('=')[1])
        );
        if (userData && userData.id && userData.email && userData.role) {
          user = userData as AuthUser;
        }
      } catch (error) {
        console.error('Failed to parse auth user cookie:', error);
      }
    }

    return { user, token };
  }, []);

  const [authState, setAuthState] = useState<{
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
  }>(() => {
    const { user, token } = getAuthFromCookies();
    if (token) {
      apiClient.setAuthToken(token);
    }
    return {
      user,
      token,
      isLoading: !token, // Only loading if no token found initially
    };
  });

  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      console.log('Starting auth refresh...');

      // FIRST: Get auth from cookies immediately
      const { user: cookieUser, token: cookieToken } = getAuthFromCookies();
      console.log(
        'Cookie auth - user:',
        cookieUser?.email,
        'token exists:',
        !!cookieToken
      );

      // Set token in API client immediately if not already set by initial state
      if (cookieToken && !apiClient.getAuthToken()) {
        apiClient.setAuthToken(cookieToken);
        console.log('Token set in API client from cookies');
      }

      // THEN: Try to refresh from API
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Session API response status:', response.status);

        if (response.ok) {
          const session = await response.json();
          console.log('Session API success:', session.user?.email);
          setAuthState({
            user: session.user,
            token: session.access_token,
            isLoading: false,
          });
          apiClient.setAuthToken(session.access_token);
        } else {
          // API failed but we have cookies - use them
          console.log('Session API failed, using cookies');
          setAuthState({
            user: cookieUser,
            token: cookieToken,
            isLoading: false,
          });
          // Token already set from cookies above
        }
      } catch (apiError) {
        console.error('Session API call failed:', apiError);
        // API call failed but we have cookies - use them
        setAuthState({
          user: cookieUser,
          token: cookieToken,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      // Final fallback to cookies
      const { user, token } = getAuthFromCookies();
      setAuthState({
        user,
        token,
        isLoading: false,
      });
      apiClient.setAuthToken(token);
    }
  }, [getAuthFromCookies]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({ user: null, token: null, isLoading: false });
      apiClient.clearAuthToken();
      document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie =
        'auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, []);

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
