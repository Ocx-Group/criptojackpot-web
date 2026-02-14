'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { authService } from '@/services';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { AuthRequest, LoginFormData } from '@/features/auth/types';
import { validateLoginForm } from '@/features/auth/validators/loginValidations';
import { AxiosError } from 'axios';

export const useLoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  const setRememberMe = useAuthStore(state => state.setRememberMe);
  const setUser = useUserStore(state => state.setUser);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (credentials: AuthRequest) => authService.login(credentials),
    onSuccess: data => {
      // If 2FA is required, redirect to 2FA verification page
      if (data.requiresTwoFactor) {
        setRememberMe(formData.rememberMe);
        router.push('/verify-2fa');
        return;
      }

      // Login successful - store user data
      const userData = data.data;
      setUser({
        id: undefined,
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        imagePath: userData.imagePath,
        status: userData.status,
        password: '',
        countryId: 0,
        statePlace: '',
        city: '',
        roleId: userData.role?.id ?? 0,
        role: userData.role ? { id: userData.role.id, name: userData.role.name } : undefined,
      });
      setAuthenticated(true);
      showNotification('success', t('LOGIN.success'), '');

      if (userData.role?.name === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user-panel');
      }
    },
    onError: (error: Error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || t('LOGIN.errors.invalidCredentials');
      showNotification('error', message, '');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordShow(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm(formData, t, showNotification)) {
      return;
    }
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });
  };

  return {
    formData,
    isPasswordShow,
    isLoading: loginMutation.isPending,
    error: loginMutation.error ? loginMutation.error.message || 'Error' : null,
    handleInputChange,
    togglePasswordVisibility,
    handleSubmit,
  };
};
