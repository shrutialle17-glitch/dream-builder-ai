import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, register, logout, updateProfile, updatePassword } from '../services/auth.api';
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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser, user);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update password');
    },
  });
};

import { forgotPassword, resetPassword } from '../services/auth.api';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Reset link sent successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to request password reset');
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
};
