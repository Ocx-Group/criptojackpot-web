'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AdminWithdrawalRequest, WithdrawalRequestStatus } from '@/features/admin-panel/types/withdrawal';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { PaginationRequest } from '@/interfaces/pagination';
import { walletService } from '@/services';

export const useAdminWithdrawals = (initialPagination?: PaginationRequest) => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationRequest>({
    pageNumber: initialPagination?.pageNumber || 1,
    pageSize: initialPagination?.pageSize || 10,
  });

  const [statusFilter, setStatusFilter] = useState<WithdrawalRequestStatus | undefined>(undefined);

  const {
    data: withdrawalsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PaginatedResponse<AdminWithdrawalRequest>, Error>({
    queryKey: ['admin-withdrawals', pagination, statusFilter],
    queryFn: async () => {
      return walletService.getAdminWithdrawals(
        pagination.pageNumber || 1,
        pagination.pageSize || 10,
        statusFilter
      );
    },
  });

  const approveMutation = useMutation({
    mutationFn: (requestGuid: string) => walletService.approveWithdrawal(requestGuid),
    onSuccess: () => {
      toast.success('Solicitud de retiro aprobada. El envío se procesará automáticamente.');
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al aprobar la solicitud de retiro');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ requestGuid, adminNotes }: { requestGuid: string; adminNotes?: string }) =>
      walletService.rejectWithdrawal(requestGuid, { adminNotes }),
    onSuccess: () => {
      toast.success('Solicitud de retiro rechazada. Los fondos han sido devueltos al usuario.');
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al rechazar la solicitud de retiro');
    },
  });

  const withdrawals = withdrawalsResponse?.data?.items || [];

  return {
    withdrawals,
    pagination: {
      pageNumber: withdrawalsResponse?.data?.pageNumber || 1,
      pageSize: withdrawalsResponse?.data?.pageSize || 10,
      totalCount: withdrawalsResponse?.data?.totalItems || 0,
      totalPages: withdrawalsResponse?.data?.totalPages || 0,
    },
    isLoading,
    error,
    refetch,
    statusFilter,
    setStatusFilter: (status: WithdrawalRequestStatus | undefined) => {
      setStatusFilter(status);
      setPagination(prev => ({ ...prev, pageNumber: 1 }));
    },
    goToPage: (pageNumber: number) => {
      setPagination(prev => ({ ...prev, pageNumber }));
    },
    approveWithdrawal: approveMutation.mutateAsync,
    rejectWithdrawal: rejectMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};
