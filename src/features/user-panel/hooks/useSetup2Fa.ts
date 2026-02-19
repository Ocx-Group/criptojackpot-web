'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twoFactorService } from '@/services';
import { useNotificationStore } from '@/store/notificationStore';
import { TwoFactorSetupResponse } from '@/features/user-panel/types/twoFactor';
import axios from 'axios';

export type TwoFactorStep = 'status' | 'setup' | 'verify' | 'recovery-codes' | 'disable';

export const useSetup2Fa = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const [step, setStep] = useState<TwoFactorStep>('status');
  const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [verifyCode, setVerifyCode] = useState('');
  const [disableCode, setDisableCode] = useState('');

  const statusQuery = useQuery({
    queryKey: ['2fa-status'],
    queryFn: () => twoFactorService.getStatus(),
    retry: 1,
  });

  const setupMutation = useMutation({
    mutationFn: () => twoFactorService.setup(),
    onSuccess: data => {
      setSetupData(data);
      setStep('setup');
    },
    onError: (error: Error) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || t('SECURITY.errors.setupFailed')
        : error.message || t('SECURITY.errors.setupFailed');
      showNotification('error', message, '');
    },
  });

  const enableMutation = useMutation({
    mutationFn: (code: string) => twoFactorService.enable({ code }),
    onSuccess: data => {
      setRecoveryCodes(data.recoveryCodes || []);
      setStep('recovery-codes');
      setVerifyCode('');
      queryClient.invalidateQueries({ queryKey: ['2fa-status'] });
      showNotification('success', t('SECURITY.notifications.enableSuccess'), '');
    },
    onError: (error: Error) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || t('SECURITY.errors.invalidCode')
        : error.message || t('SECURITY.errors.invalidCode');
      showNotification('error', message, '');
    },
  });

  const disableMutation = useMutation({
    mutationFn: (code: string) => twoFactorService.disable({ code }),
    onSuccess: () => {
      setStep('status');
      setDisableCode('');
      queryClient.invalidateQueries({ queryKey: ['2fa-status'] });
      showNotification('success', t('SECURITY.notifications.disableSuccess'), '');
    },
    onError: (error: Error) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || t('SECURITY.errors.invalidCode')
        : error.message || t('SECURITY.errors.invalidCode');
      showNotification('error', message, '');
    },
  });

  const regenerateCodesMutation = useMutation({
    mutationFn: () => twoFactorService.getRecoveryCodes(),
    onSuccess: data => {
      setRecoveryCodes(data);
      showNotification('success', t('SECURITY.notifications.codesRegenerated'), '');
    },
    onError: (error: Error) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || t('SECURITY.errors.regenerateFailed')
        : error.message || t('SECURITY.errors.regenerateFailed');
      showNotification('error', message, '');
    },
  });

  const handleStartSetup = () => {
    setupMutation.mutate();
  };

  const handleVerifyAndEnable = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (verifyCode.length !== 6) {
      showNotification('error', t('SECURITY.errors.codeMustBe6Digits'), '');
      return;
    }
    enableMutation.mutate(verifyCode);
  };

  const handleDisable = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (disableCode.length !== 6) {
      showNotification('error', t('SECURITY.errors.codeMustBe6Digits'), '');
      return;
    }
    disableMutation.mutate(disableCode);
  };

  const handleCodeComplete = (value: string) => {
    setVerifyCode(value);
    if (value.length === 6) {
      enableMutation.mutate(value);
    }
  };

  const handleDisableCodeComplete = (value: string) => {
    setDisableCode(value);
    if (value.length === 6) {
      disableMutation.mutate(value);
    }
  };

  const handleBackToStatus = () => {
    setStep('status');
    setSetupData(null);
    setVerifyCode('');
    setDisableCode('');
  };

  const handleShowDisable = () => {
    setStep('disable');
    setDisableCode('');
  };

  return {
    step,
    setStep,
    setupData,
    recoveryCodes,
    verifyCode,
    setVerifyCode,
    disableCode,
    setDisableCode,
    isEnabled: statusQuery.data?.twoFactorEnabled ?? false,
    isStatusLoading: statusQuery.isLoading,
    isSetupLoading: setupMutation.isPending,
    isEnabling: enableMutation.isPending,
    isDisabling: disableMutation.isPending,
    isRegenerating: regenerateCodesMutation.isPending,
    handleStartSetup,
    handleVerifyAndEnable,
    handleDisable,
    handleCodeComplete,
    handleDisableCodeComplete,
    handleBackToStatus,
    handleShowDisable,
    regenerateCodes: () => regenerateCodesMutation.mutate(),
  };
};
