'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twoFactorService } from '@/services';
import { useNotificationStore } from '@/store/notificationStore';
import { TwoFactorSetupResponse } from '@/features/user-panel/types/twoFactor';
import axios from 'axios';

export type TwoFactorStep = 'status' | 'setup' | 'verify' | 'recovery-codes' | 'disable' | 'regenerate';

export const useSetup2Fa = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const [step, setStep] = useState<TwoFactorStep>('status');
  const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [verifyCode, setVerifyCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [regenerateCode, setRegenerateCode] = useState('');

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

  const confirmMutation = useMutation({
    mutationFn: (code: string) => twoFactorService.confirm({ code }),
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
    mutationFn: (code: string) => twoFactorService.regenerateRecoveryCodes({ code }),
    onSuccess: data => {
      setRecoveryCodes(data.recoveryCodes || []);
      setStep('recovery-codes');
      setRegenerateCode('');
      queryClient.invalidateQueries({ queryKey: ['2fa-status'] });
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
    confirmMutation.mutate(verifyCode);
  };

  const handleDisable = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (disableCode.length !== 6) {
      showNotification('error', t('SECURITY.errors.codeMustBe6Digits'), '');
      return;
    }
    disableMutation.mutate(disableCode);
  };

  const handleRegenerateCodes = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (regenerateCode.length !== 6) {
      showNotification('error', t('SECURITY.errors.codeMustBe6Digits'), '');
      return;
    }
    regenerateCodesMutation.mutate(regenerateCode);
  };

  const handleCodeComplete = (value: string) => {
    setVerifyCode(value);
    if (value.length === 6) {
      confirmMutation.mutate(value);
    }
  };

  const handleDisableCodeComplete = (value: string) => {
    setDisableCode(value);
    if (value.length === 6) {
      disableMutation.mutate(value);
    }
  };

  const handleRegenerateCodeComplete = (value: string) => {
    setRegenerateCode(value);
    if (value.length === 6) {
      regenerateCodesMutation.mutate(value);
    }
  };

  const handleBackToStatus = () => {
    setStep('status');
    setSetupData(null);
    setVerifyCode('');
    setDisableCode('');
    setRegenerateCode('');
  };

  const handleShowDisable = () => {
    setStep('disable');
    setDisableCode('');
  };

  const handleShowRegenerate = () => {
    setStep('regenerate');
    setRegenerateCode('');
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
    regenerateCode,
    setRegenerateCode,
    isEnabled: statusQuery.data?.isEnabled ?? false,
    recoveryCodesRemaining: statusQuery.data?.recoveryCodesRemaining ?? null,
    isStatusLoading: statusQuery.isLoading,
    isSetupLoading: setupMutation.isPending,
    isEnabling: confirmMutation.isPending,
    isDisabling: disableMutation.isPending,
    isRegenerating: regenerateCodesMutation.isPending,
    handleStartSetup,
    handleVerifyAndEnable,
    handleDisable,
    handleRegenerateCodes,
    handleCodeComplete,
    handleDisableCodeComplete,
    handleRegenerateCodeComplete,
    handleBackToStatus,
    handleShowDisable,
    handleShowRegenerate,
  };
};
