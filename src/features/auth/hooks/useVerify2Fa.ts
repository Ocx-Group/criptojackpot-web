'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { authService } from '@/services';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { Verify2FaRequest } from '@/features/auth/types';
import { createVerify2FaCodeSchema, createVerify2FaRecoverySchema } from '@/features/auth/schemas';
import axios from 'axios';

export const useVerify2Fa = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);
  const rememberMe = useAuthStore(state => state.rememberMe);
  const setUser = useUserStore(state => state.setUser);

  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const verify2FaMutation = useMutation({
    mutationFn: (request: Verify2FaRequest) => authService.verify2Fa(request),
    onSuccess: data => {
      const userData = data.data;
      if (!userData.emailVerified) {
        showNotification('error', t('LOGIN.errors.emailNotVerified'), '');
        return;
      }

      setUser({
        id: undefined,
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        imagePath: userData.imagePath,
        status: userData.status,
        emailVerified: userData.emailVerified,
        password: '',
        countryId: 0,
        statePlace: '',
        city: '',
        roleId: userData.role?.id ?? 0,
        role: userData.role ? { id: userData.role.id, name: userData.role.name } : undefined,
        userGuid: userData.userGuid,
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
        ? error.response?.data?.message || t('TWO_FACTOR.errors.invalidCode', 'Código inválido')
        : error.message || t('TWO_FACTOR.errors.invalidCode', 'Código inválido');
      showNotification('error', message, '');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (useRecoveryCode) {
      const schema = createVerify2FaRecoverySchema(t);
      const result = z.safeParse(schema, { recoveryCode: recoveryCode.trim() });
      if (!result.success) {
        const firstError = result.error.issues[0]?.message;
        if (firstError) showNotification('error', firstError, '');
        return;
      }
      verify2FaMutation.mutate({
        recoveryCode: recoveryCode.trim(),
        rememberMe,
      });
    } else {
      const schema = createVerify2FaCodeSchema(t);
      const result = z.safeParse(schema, { code });
      if (!result.success) {
        const firstError = result.error.issues[0]?.message;
        if (firstError) showNotification('error', firstError, '');
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
