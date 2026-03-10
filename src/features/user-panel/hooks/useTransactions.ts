'use client';

import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services';
import { WalletBalance, WalletTransaction, WalletTransactionType } from '@/interfaces/walletTransaction';
import { PaginatedData } from '@/interfaces/paginatedResponse';

interface UseTransactionsOptions {
  page?: number;
  pageSize?: number;
  type?: WalletTransactionType;
}

export const useTransactions = (options: UseTransactionsOptions = {}) => {
  const { page = 1, pageSize = 10, type } = options;

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery<PaginatedData<WalletTransaction>>({
    queryKey: ['wallet-transactions', page, pageSize, type],
    queryFn: async () => {
      const response = await walletService.getTransactions(page, pageSize, type);
      return response.data;
    },
  });

  const {
    data: balance,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useQuery<WalletBalance>({
    queryKey: ['wallet-balance'],
    queryFn: () => walletService.getBalance(),
  });

  return {
    transactions: transactionsData?.items ?? [],
    totalPages: transactionsData?.totalPages ?? 1,
    totalItems: transactionsData?.totalItems ?? 0,
    pageNumber: transactionsData?.pageNumber ?? 1,
    balance,
    isLoading: isLoadingTransactions || isLoadingBalance,
    error: transactionsError || balanceError,
  };
};
