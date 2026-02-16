'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { authService } from '@/services';
import { useNotificationStore } from '@/store/notificationStore';

export const useConfirmEmail = (token: string) => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);

  const confirmEmailMutation = useMutation({
    mutationFn: (confirmationToken: string) => authService.confirmEmail(confirmationToken),
    onSuccess: () => {
      showNotification('success', t('CONFIRM_EMAIL.success'), t('CONFIRM_EMAIL.successMessage'));
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || t('CONFIRM_EMAIL.errorMessage');
      showNotification('error', t('CONFIRM_EMAIL.error'), errorMessage);
    },
  });

  useEffect(() => {
    if (token) {
      confirmEmailMutation.mutate(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    isLoading: confirmEmailMutation.isPending,
    isSuccess: confirmEmailMutation.isSuccess,
    isError: confirmEmailMutation.isError,
    error: confirmEmailMutation.error,
  };
};
