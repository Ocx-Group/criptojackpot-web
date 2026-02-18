'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services';
import { createResetPasswordSchema, ResetPasswordSchemaType } from '@/features/auth/schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useResetPasswordForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);
  const resetPasswordEmail = useAuthStore(state => state.resetPasswordEmail);
  const clearResetPasswordEmail = useAuthStore(state => state.clearResetPasswordEmail);

  const schema = useMemo(() => createResetPasswordSchema(t), [t]);

  const {
    watch,
    setValue,
    reset,
    handleSubmit: rhfHandleSubmit,
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      securityCode: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const formData = watch();
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

  // Verificar que haya un email en el store
  useEffect(() => {
    if (!resetPasswordEmail) {
      showNotification('error', t('RESET_PASSWORD.errors.noEmailFound'), '');
      router.push('/forgot-password');
    }
  }, [resetPasswordEmail, router, showNotification, t]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string; securityCode: string; newPassword: string; confirmPassword: string }) => {
      await userService.resetPassword({
        email: data.email,
        securityCode: data.securityCode.trim(),
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
    },
    onSuccess: () => {
      showNotification('success', t('RESET_PASSWORD.success'), '');
      reset({ securityCode: '', newPassword: '', confirmPassword: '' });
      clearResetPasswordEmail();
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: () => {
      showNotification('error', t('RESET_PASSWORD.errors.resetFailed'), '');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name as keyof ResetPasswordSchemaType, value, { shouldValidate: false });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordShow(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordShow(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetPasswordEmail) {
      showNotification('error', t('RESET_PASSWORD.errors.noEmailFound'), '');
      return;
    }

    rhfHandleSubmit(
      data => {
        resetPasswordMutation.mutate({
          email: resetPasswordEmail!,
          securityCode: data.securityCode,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
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
    email: resetPasswordEmail,
    isPasswordShow,
    isConfirmPasswordShow,
    isLoading: resetPasswordMutation.isPending,
    handleInputChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
  };
};
