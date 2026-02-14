'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services';

interface ResetPasswordFormData {
  securityCode: string;
  newPassword: string;
  confirmPassword: string;
}

export const useResetPasswordForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);
  const resetPasswordEmail = useAuthStore(state => state.resetPasswordEmail);
  const clearResetPasswordEmail = useAuthStore(state => state.clearResetPasswordEmail);

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    securityCode: '',
    newPassword: '',
    confirmPassword: '',
  });

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
        securityCode: data.securityCode,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
    },
    onSuccess: () => {
      showNotification('success', t('RESET_PASSWORD.success'), '');
      setFormData({ securityCode: '', newPassword: '', confirmPassword: '' });
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordShow(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordShow(prev => !prev);
  };

  const validateForm = (): boolean => {
    if (!resetPasswordEmail) {
      showNotification('error', t('RESET_PASSWORD.errors.noEmailFound'), '');
      return false;
    }

    if (!formData.securityCode) {
      showNotification('error', t('RESET_PASSWORD.errors.securityCodeRequired'), '');
      return false;
    }

    if (!formData.newPassword) {
      showNotification('error', t('RESET_PASSWORD.errors.passwordRequired'), '');
      return false;
    }

    if (formData.newPassword.length < 8) {
      showNotification('error', t('RESET_PASSWORD.errors.passwordTooShort'), '');
      return false;
    }

    if (!formData.confirmPassword) {
      showNotification('error', t('RESET_PASSWORD.errors.confirmPasswordRequired'), '');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showNotification('error', t('RESET_PASSWORD.errors.passwordsMismatch'), '');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    resetPasswordMutation.mutate({
      email: resetPasswordEmail!,
      securityCode: formData.securityCode,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });
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
