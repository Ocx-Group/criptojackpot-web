'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { WalletTransaction, WalletTransactionType } from '@/interfaces/walletTransaction';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { PaginationRequest } from '@/interfaces/pagination';
import { walletService } from '@/services';

export const useAdminTransactions = (initialPagination?: PaginationRequest) => {
  const [pagination, setPagination] = useState<PaginationRequest>({
    pageNumber: initialPagination?.pageNumber || 1,
    pageSize: initialPagination?.pageSize || 10,
  });

  const [typeFilter, setTypeFilter] = useState<WalletTransactionType | undefined>(undefined);

  const {
    data: transactionsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PaginatedResponse<WalletTransaction>, Error>({
    queryKey: ['admin-transactions', pagination, typeFilter],
    queryFn: async () => {
      return walletService.getAllTransactions(
        pagination.pageNumber || 1,
        pagination.pageSize || 10,
        typeFilter
      );
    },
  });

  const transactions = transactionsResponse?.data?.items || [];

  return {
    transactions,
    pagination: {
      pageNumber: transactionsResponse?.data?.pageNumber || 1,
      pageSize: transactionsResponse?.data?.pageSize || 10,
      totalCount: transactionsResponse?.data?.totalItems || 0,
      totalPages: transactionsResponse?.data?.totalPages || 0,
    },
    isLoading,
    error,
    refetch,
    typeFilter,
    setTypeFilter: (type: WalletTransactionType | undefined) => {
      setTypeFilter(type);
      setPagination(prev => ({ ...prev, pageNumber: 1 }));
    },
    goToPage: (pageNumber: number) => {
      setPagination(prev => ({ ...prev, pageNumber }));
    },
    setPageSize: (pageSize: number) => {
      setPagination(prev => ({ ...prev, pageSize, pageNumber: 1 }));
    },
  };
};
