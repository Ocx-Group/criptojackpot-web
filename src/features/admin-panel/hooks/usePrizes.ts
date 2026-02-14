'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Prize } from '@/interfaces/prize';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { PaginationRequest } from '@/interfaces/pagination';
import { prizeService } from '@/services';

export const usePrizes = (initialPagination?: PaginationRequest) => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationRequest>({
    pageNumber: initialPagination?.pageNumber || 1,
    pageSize: initialPagination?.pageSize || 10,
  });

  const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<Prize>, Error>({
    queryKey: ['prizes', pagination],
    queryFn: async () => {
      return await prizeService.getAllPrizes(pagination);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await prizeService.deletePrize(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] });
    },
  });

  const goToPage = (pageNumber: number) => {
    setPagination(prev => ({ ...prev, pageNumber }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, pageNumber: 1 }));
  };

  const deletePrize = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    prizes: data?.data?.items || [],
    isLoading,
    isDeleting: deleteMutation.isPending,
    error,
    refetch,
    deletePrize,
    pagination: {
      pageNumber: data?.pageNumber || 1,
      pageSize: data?.pageSize || 10,
      totalCount: data?.totalCount || 0,
      totalPages: data?.totalPages || 0,
    },
    goToPage,
    setPageSize,
  };
};
