'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { walletService, twoFactorService, userCryptoWalletService } from '@/services';
import { useNotificationStore } from '@/store/notificationStore';
import { CreateWithdrawalRequest } from '@/features/user-panel/types/withdrawal';

export type WithdrawStep = 'amount' | 'verification' | 'success';

const MIN_WITHDRAWAL_AMOUNT = 10;

export function useWithdraw(onClose: () => void) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const [step, setStep] = useState<WithdrawStep>('amount');
  const [amount, setAmount] = useState('');
  const [selectedWalletGuid, setSelectedWalletGuid] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const { data: twoFaStatus } = useQuery({
    queryKey: ['2fa-status'],
    queryFn: () => twoFactorService.getStatus(),
    staleTime: 60_000,
  });

  const { data: wallets = [], isLoading: isLoadingWallets } = useQuery({
    queryKey: ['user-crypto-wallets'],
    queryFn: () => userCryptoWalletService.getMyWallets(),
    staleTime: 30_000,
  });

  const { data: balance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => walletService.getBalance(),
  });

  const is2FaEnabled = twoFaStatus?.isEnabled ?? false;

  const requestCodeMutation = useMutation({
    mutationFn: () => walletService.requestWithdrawalCode(),
    onSuccess: () => {
      setCodeSent(true);
      showNotification('success', t('WITHDRAWAL.codeSent'), '');
    },
    onError: () => {
      showNotification('error', t('WITHDRAWAL.codeError'), '');
    },
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: (request: CreateWithdrawalRequest) => walletService.createWithdrawal(request),
    onSuccess: () => {
      setStep('success');
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
      showNotification('success', t('WITHDRAWAL.success'), '');
    },
    onError: () => {
      showNotification('error', t('WITHDRAWAL.error'), '');
    },
  });

  const amountNum = parseFloat(amount) || 0;
  const availableBalance = balance?.balance ?? 0;

  const amountError = (() => {
    if (!amount) return '';
    if (isNaN(parseFloat(amount))) return t('WITHDRAWAL.invalidAmount');
    if (amountNum < MIN_WITHDRAWAL_AMOUNT) return t('WITHDRAWAL.minAmount', { min: MIN_WITHDRAWAL_AMOUNT });
    if (amountNum > availableBalance) return t('WITHDRAWAL.insufficientBalance');
    return '';
  })();

  const canProceedToVerification =
    amountNum >= MIN_WITHDRAWAL_AMOUNT &&
    amountNum <= availableBalance &&
    selectedWalletGuid !== '' &&
    !amountError;

  const handleContinue = useCallback(() => {
    if (!canProceedToVerification) return;
    setStep('verification');
  }, [canProceedToVerification]);

  const handleSendCode = useCallback(() => {
    requestCodeMutation.mutate();
  }, [requestCodeMutation]);

  const handleSubmit = useCallback(() => {
    if (verificationCode.length !== 6) return;

    const request: CreateWithdrawalRequest = {
      amount: amountNum,
      walletGuid: selectedWalletGuid,
    };

    if (is2FaEnabled) {
      request.twoFactorCode = verificationCode;
    } else {
      request.emailVerificationCode = verificationCode;
    }

    createWithdrawalMutation.mutate(request);
  }, [verificationCode, amountNum, selectedWalletGuid, is2FaEnabled, createWithdrawalMutation]);

  const handleClose = useCallback(() => {
    setStep('amount');
    setAmount('');
    setSelectedWalletGuid('');
    setVerificationCode('');
    setCodeSent(false);
    onClose();
  }, [onClose]);

  const handleBack = useCallback(() => {
    setVerificationCode('');
    setStep('amount');
  }, []);

  return {
    step,
    amount,
    setAmount,
    selectedWalletGuid,
    setSelectedWalletGuid,
    verificationCode,
    setVerificationCode,
    codeSent,
    is2FaEnabled,
    wallets,
    isLoadingWallets,
    availableBalance,
    amountError,
    canProceedToVerification,
    isSendingCode: requestCodeMutation.isPending,
    isSubmitting: createWithdrawalMutation.isPending,
    handleContinue,
    handleSendCode,
    handleSubmit,
    handleClose,
    handleBack,
  };
}
