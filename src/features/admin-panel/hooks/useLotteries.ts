'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '@/store/notificationStore';
import { Lottery, LotteryStatus } from '@/interfaces/lottery';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { PaginationRequest } from '@/interfaces/pagination';
import { lotteryService } from '@/services';

export const useLotteries = (initialPagination?: PaginationRequest) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const [pagination, setPagination] = useState<PaginationRequest>({
    pageNumber: initialPagination?.pageNumber || 1,
    pageSize: initialPagination?.pageSize || 10,
  });

  // Obtener lista de loterías
  const {
    data: lotteriesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PaginatedResponse<Lottery>, Error>({
    queryKey: ['lotteries', pagination],
    queryFn: async () => {
      return lotteryService.getAllLotteries(pagination);
    },
  });

  const lotteries = lotteriesResponse?.data?.items || [];

  // Eliminar lotería
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return lotteryService.deleteLottery(id);
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('LOTTERY_ADMIN.delete.success', 'Lotería eliminada'),
        t('LOTTERY_ADMIN.delete.successMessage', 'La lotería se ha eliminado correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['lotteries'] }).then();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || t('LOTTERY_ADMIN.delete.error', 'Error al eliminar la lotería');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  // Actualizar estado de la lotería
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LotteryStatus }) => {
      return lotteryService.updateLotteryStatus(id, status);
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('LOTTERY_ADMIN.updateStatus.success', 'Estado actualizado'),
        t('LOTTERY_ADMIN.updateStatus.successMessage', 'El estado de la lotería se ha actualizado')
      );
      queryClient.invalidateQueries({ queryKey: ['lotteries'] }).then();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || t('LOTTERY_ADMIN.updateStatus.error', 'Error al actualizar el estado');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  return {
    lotteries,
    pagination: {
      pageNumber: lotteriesResponse?.pageNumber || 1,
      pageSize: lotteriesResponse?.pageSize || 10,
      totalCount: lotteriesResponse?.totalCount || 0,
      totalPages: lotteriesResponse?.totalPages || 0,
    },
    isLoading,
    error,
    refetch,
    goToPage: (pageNumber: number) => {
      setPagination(prev => ({ ...prev, pageNumber }));
    },
    setPageSize: (pageSize: number) => {
      setPagination(prev => ({ ...prev, pageSize, pageNumber: 1 }));
    },
    deleteLottery: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
