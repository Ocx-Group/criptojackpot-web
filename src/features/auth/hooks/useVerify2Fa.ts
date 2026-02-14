'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getAuthService } from '@/di/serviceLocator';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { Verify2FaRequest } from '@/features/auth/types';
import { AxiosError } from 'axios';

export const useVerify2Fa = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  const rememberMe = useAuthStore(state => state.rememberMe);
  const setUser = useUserStore(state => state.setUser);

  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const verify2FaMutation = useMutation({
    mutationFn: (request: Verify2FaRequest) => getAuthService().verify2Fa(request),
    onSuccess: data => {
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
      const message = axiosError.response?.data?.message || t('TWO_FACTOR.errors.invalidCode', 'Código inválido');
      showNotification('error', message, '');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (useRecoveryCode) {
      if (!recoveryCode.trim()) {
        showNotification('error', t('TWO_FACTOR.errors.recoveryCodeRequired', 'Ingresa el código de recuperación'), '');
        return;
      }
      verify2FaMutation.mutate({
        recoveryCode: recoveryCode.trim(),
        rememberMe,
      });
    } else {
      if (!code || code.length !== 6) {
        showNotification('error', t('TWO_FACTOR.errors.codeRequired', 'Ingresa el código de 6 dígitos'), '');
        return;
      }
      verify2FaMutation.mutate({
        code,
        rememberMe,
      });
    }
  };

  const handleCodeComplete = (value: string) => {
    setCode(value);
    if (value.length === 6) {
      verify2FaMutation.mutate({
        code: value,
        rememberMe,
      });
    }
  };

  return {
    code,
    setCode,
    recoveryCode,
    setRecoveryCode,
    useRecoveryCode,
    setUseRecoveryCode,
    isLoading: verify2FaMutation.isPending,
    handleSubmit,
    handleCodeComplete,
  };
};
