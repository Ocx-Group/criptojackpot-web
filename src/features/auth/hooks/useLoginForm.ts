'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authService } from '@/services';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { AuthRequest, LoginFormData } from '@/features/auth/types';
import { createLoginSchema } from '@/features/auth/schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';
import axios from 'axios';

export const useLoginForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);
  const setRememberMe = useAuthStore(state => state.setRememberMe);
  const setUser = useUserStore(state => state.setUser);

  const schema = useMemo(() => createLoginSchema(t), [t]);

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const formData = watch();
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
      showNotification('success', t('LOGIN.success'), '');

      if (userData.role?.name === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user-panel');
      }
    },
    onError: (error: Error) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || t('LOGIN.errors.invalidCredentials')
        : error.message || t('LOGIN.errors.invalidCredentials');
      showNotification('error', message, '');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValue(name as keyof LoginFormData, type === 'checkbox' ? checked : value, { shouldValidate: false });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordShow(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rhfHandleSubmit(
      data => {
        loginMutation.mutate({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        });
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', msg, '');
      }
    )();
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
