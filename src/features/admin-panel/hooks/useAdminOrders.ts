'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { OrderDto } from '@/interfaces/order';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { PaginationRequest } from '@/interfaces/pagination';
import { orderService } from '@/services';

export const useAdminOrders = (initialPagination?: PaginationRequest) => {
  const [pagination, setPagination] = useState<PaginationRequest>({
    pageNumber: initialPagination?.pageNumber || 1,
    pageSize: initialPagination?.pageSize || 10,
  });

  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);

  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PaginatedResponse<OrderDto>, Error>({
    queryKey: ['admin-orders', pagination, statusFilter],
    queryFn: async () => {
      return orderService.getAllOrders(
        pagination.pageNumber || 1,
        pagination.pageSize || 10,
        statusFilter
      );
    },
  });

  const orders = ordersResponse?.data?.items || [];

  return {
    orders,
    pagination: {
      pageNumber: ordersResponse?.data?.pageNumber || 1,
      pageSize: ordersResponse?.data?.pageSize || 10,
      totalCount: ordersResponse?.data?.totalItems || 0,
      totalPages: ordersResponse?.data?.totalPages || 0,
    },
    isLoading,
    error,
    refetch,
    statusFilter,
    setStatusFilter: (status: number | undefined) => {
      setStatusFilter(status);
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
