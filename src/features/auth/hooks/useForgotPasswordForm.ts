'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services';
import { createForgotPasswordSchema, ForgotPasswordSchemaType } from '@/features/auth/schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useForgotPasswordForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);
  const setResetPasswordEmail = useAuthStore(state => state.setResetPasswordEmail);

  const schema = useMemo(() => createForgotPasswordSchema(t), [t]);

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const formData = watch();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await userService.requestPasswordReset({ email });
    },
    onSuccess: () => {
      showNotification('success', t('FORGOT_PASSWORD.success'), '');
      // Guardar el email en el store para usarlo en reset-password
      setResetPasswordEmail(formData.email);
      // Redirigir inmediatamente a reset-password
      router.push('/reset-password');
    },
    onError: () => {
      showNotification('error', t('FORGOT_PASSWORD.errors.serverError'), '');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name as keyof ForgotPasswordSchemaType, value, { shouldValidate: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    rhfHandleSubmit(
      data => {
        forgotPasswordMutation.mutate(data.email);
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', msg, '');
      }
    )();
  };

  return {
    formData,
    isLoading: forgotPasswordMutation.isPending,
    handleInputChange,
    handleSubmit,
  };
};
