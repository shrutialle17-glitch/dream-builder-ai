import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, register, logout } from '../services/auth.api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const authKeys = {
  currentUser: ['auth', 'currentUser'],
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser, user);
      toast.success('Successfully logged in!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to login');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to register');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.currentUser, null);
      queryClient.clear();
      toast.success('Successfully logged out!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to logout');
    },
  });
};
