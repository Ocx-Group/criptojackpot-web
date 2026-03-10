'use client';

import { useQuery, useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Ticket } from '@/interfaces/ticket';
import { Lottery } from '@/interfaces/lottery';
import { ticketService, lotteryService } from '@/services';

export const useMyTickets = () => {
  const {
    data: tickets = [],
    isLoading: isLoadingTickets,
    error: ticketsError,
    refetch,
  } = useQuery<Ticket[], Error>({
    queryKey: ['my-tickets'],
    queryFn: () => ticketService.getMyTickets(),
  });

  const uniqueLotteryIds = useMemo(() => {
    return [...new Set(tickets.map(t => t.lotteryId).filter(Boolean))];
  }, [tickets]);

  const lotteryQueries = useQueries({
    queries: uniqueLotteryIds.map(lotteryId => ({
      queryKey: ['lottery', lotteryId],
      queryFn: () => lotteryService.getLotteryById(lotteryId),
      staleTime: 5 * 60 * 1000,
      enabled: uniqueLotteryIds.length > 0,
    })),
  });

  const lotteryMap = useMemo(() => {
    const map = new Map<string, Lottery>();
    lotteryQueries.forEach(query => {
      if (query.data) {
        map.set(query.data.lotteryGuid, query.data);
      }
    });
    return map;
  }, [lotteryQueries]);

  const isLoadingLotteries = lotteryQueries.some(q => q.isLoading);

  return {
    tickets,
    lotteryMap,
    isLoading: isLoadingTickets || isLoadingLotteries,
    error: ticketsError,
    refetch,
  };
};
