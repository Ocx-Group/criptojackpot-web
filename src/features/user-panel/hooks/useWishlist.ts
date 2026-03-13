'use client';

import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { wishListService, lotteryService } from '@/services';
import { Lottery } from '@/interfaces/lottery';
import { toast } from 'react-toastify';
import { useUserStore } from '@/store/userStore';

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const user = useUserStore(state => state.user);
  const isAuthenticated = user !== null;

  const {
    data: wishlistItems = [],
    isLoading: isLoadingWishlist,
    error: wishlistError,
    refetch,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishListService.getWishList(),
    enabled: isAuthenticated,
  });

  const uniqueLotteryIds = useMemo(() => {
    return [...new Set(wishlistItems.map(item => item.lotteryGuid).filter(Boolean))];
  }, [wishlistItems]);

  const lotteryQueries = useQueries({
    queries: uniqueLotteryIds.map(lotteryGuid => ({
      queryKey: ['lottery', lotteryGuid],
      queryFn: () => lotteryService.getLotteryById(lotteryGuid),
      staleTime: 5 * 60 * 1000,
      enabled: uniqueLotteryIds.length > 0,
    })),
  });

  const lotteries = useMemo(() => {
    return lotteryQueries
      .filter(q => q.data)
      .map(q => q.data as Lottery);
  }, [lotteryQueries]);

  const isLoadingLotteries = lotteryQueries.some(q => q.isLoading);

  const addMutation = useMutation({
    mutationFn: (lotteryGuid: string) => wishListService.addToWishList(lotteryGuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add to wishlist');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (lotteryGuid: string) => wishListService.removeFromWishList(lotteryGuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove from wishlist');
    },
  });

  const isInWishlist = useCallback(
    (lotteryGuid: string) => wishlistItems.some(item => item.lotteryGuid === lotteryGuid),
    [wishlistItems]
  );

  const toggleWishlist = useCallback(
    (lotteryGuid: string) => {
      if (isInWishlist(lotteryGuid)) {
        removeMutation.mutate(lotteryGuid);
      } else {
        addMutation.mutate(lotteryGuid);
      }
    },
    [isInWishlist, addMutation, removeMutation]
  );

  return {
    wishlistItems,
    lotteries,
    isLoading: isLoadingWishlist || isLoadingLotteries,
    isAuthenticated,
    error: wishlistError,
    refetch,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isInWishlist,
    toggleWishlist,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
