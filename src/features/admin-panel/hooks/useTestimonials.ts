'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Testimonial } from '@/interfaces/testimonial';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { PaginationRequest } from '@/interfaces/pagination';
import { testimonialService } from '@/services';

export const useTestimonials = (initialPagination?: PaginationRequest) => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationRequest>({
    pageNumber: initialPagination?.pageNumber || 1,
    pageSize: initialPagination?.pageSize || 10,
  });

  const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<Testimonial>, Error>({
    queryKey: ['testimonials', pagination],
    queryFn: async () => {
      return await testimonialService.getAllTestimonials(pagination);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await testimonialService.deleteTestimonial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const goToPage = (pageNumber: number) => {
    setPagination(prev => ({ ...prev, pageNumber }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, pageNumber: 1 }));
  };

  const deleteTestimonial = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    testimonials: data?.data?.items || [],
    isLoading,
    isDeleting: deleteMutation.isPending,
    error,
    refetch,
    deleteTestimonial,
    pagination: {
      pageNumber: data?.data?.pageNumber || 1,
      pageSize: data?.data?.pageSize || 10,
      totalCount: data?.data?.totalItems || 0,
      totalPages: data?.data?.totalPages || 0,
    },
    goToPage,
    setPageSize,
  };
};
