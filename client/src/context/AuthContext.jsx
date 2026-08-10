import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '../services/auth.api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: getCurrentUser,
    retry: false, // Don't retry if not authenticated
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsInitializing(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.setQueryData(['auth', 'currentUser'], null);
      // remove any client-side token storage if used
      try {
        localStorage.removeItem('auth_token');
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, [queryClient]);

  // Helper to set the logged-in user (used after social login)
  const setContextLogin = (userData, token) => {
    queryClient.setQueryData(['auth', 'currentUser'], userData);
    try {
      if (token) localStorage.setItem('auth_token', token);
    } catch (e) {
      // ignore storage errors
    }
  };

  const contextLogout = () => {
    queryClient.setQueryData(['auth', 'currentUser'], null);
    try {
      localStorage.removeItem('auth_token');
    } catch (e) {}
  };

  const value = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading: isInitializing,
    refetchUser: refetch,
    setContextLogin,
    logout: contextLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
