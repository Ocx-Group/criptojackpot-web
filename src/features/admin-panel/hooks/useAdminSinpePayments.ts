'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { PaginationRequest } from '@/interfaces/pagination';
import { SinpeConfigAdmin, SinpePaymentAdmin, SinpePaymentStatus, UpdateSinpeConfigPayload } from '@/interfaces/sinpe';
import { sinpeService } from '@/services';

const PAYMENTS_QUERY_KEY = 'admin-sinpe-payments';
const CONFIG_QUERY_KEY = 'admin-sinpe-config';

/**
 * Bandeja de comprobantes SINPE. Cada comprobante pendiente mantiene números
 * reservados sin expiración, así que aprobar o rechazar es lo que los desbloquea.
 */
export const useAdminSinpePayments = (initialPagination?: PaginationRequest) => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationRequest>({
    pageNumber: initialPagination?.pageNumber || 1,
    pageSize: initialPagination?.pageSize || 10,
  });

  const [statusFilter, setStatusFilter] = useState<SinpePaymentStatus | undefined>(
    SinpePaymentStatus.PendingReview
  );

  const {
    data: paymentsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PaginatedResponse<SinpePaymentAdmin>, Error>({
    queryKey: [PAYMENTS_QUERY_KEY, pagination, statusFilter],
    queryFn: () =>
      sinpeService.getPayments(pagination.pageNumber || 1, pagination.pageSize || 10, statusFilter),
  });

  const approveMutation = useMutation({
    mutationFn: ({ sinpePaymentGuid, adminNotes }: { sinpePaymentGuid: string; adminNotes?: string }) =>
      sinpeService.approve(sinpePaymentGuid, adminNotes),
    onSuccess: () => {
      toast.success('Comprobante aprobado. Los números fueron acreditados al usuario.');
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al aprobar el comprobante');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ sinpePaymentGuid, adminNotes }: { sinpePaymentGuid: string; adminNotes: string }) =>
      sinpeService.reject(sinpePaymentGuid, adminNotes),
    onSuccess: () => {
      toast.success('Comprobante rechazado. Los números fueron liberados.');
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al rechazar el comprobante');
    },
  });

  const payments = paymentsResponse?.data?.items || [];

  return {
    payments,
    pagination: {
      pageNumber: paymentsResponse?.data?.pageNumber || 1,
      pageSize: paymentsResponse?.data?.pageSize || 10,
      totalCount: paymentsResponse?.data?.totalItems || 0,
      totalPages: paymentsResponse?.data?.totalPages || 0,
    },
    isLoading,
    error,
    refetch,
    statusFilter,
    setStatusFilter: (status: SinpePaymentStatus | undefined) => {
      setStatusFilter(status);
      setPagination(prev => ({ ...prev, pageNumber: 1 }));
    },
    goToPage: (pageNumber: number) => {
      setPagination(prev => ({ ...prev, pageNumber }));
    },
    approvePayment: approveMutation.mutateAsync,
    rejectPayment: rejectMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};

/** Teléfono destino, titular, tipo de cambio e interruptor del método. */
export const useSinpeConfig = () => {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery<SinpeConfigAdmin, Error>({
    queryKey: [CONFIG_QUERY_KEY],
    queryFn: () => sinpeService.getAdminConfig(),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSinpeConfigPayload) => sinpeService.updateAdminConfig(payload),
    onSuccess: () => {
      toast.success('Configuración de SINPE actualizada.');
      queryClient.invalidateQueries({ queryKey: [CONFIG_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar la configuración de SINPE');
    },
  });

  return {
    config,
    isLoading,
    updateConfig: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
