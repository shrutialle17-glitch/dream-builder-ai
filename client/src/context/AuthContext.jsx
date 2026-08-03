import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
//import { getCurrentUser } from '../services/auth.api';

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
    };
    
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, [queryClient]);

  const value = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading: isInitializing,
    refetchUser: refetch,
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
