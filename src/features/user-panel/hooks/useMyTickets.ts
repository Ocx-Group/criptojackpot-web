'use client';

import { useQuery } from '@tanstack/react-query';
import { Ticket } from '@/interfaces/ticket';
import { ticketService } from '@/services';

export const useMyTickets = () => {
  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Ticket[], Error>({
    queryKey: ['my-tickets'],
    queryFn: () => ticketService.getMyTickets(),
  });

  return {
    tickets,
    isLoading,
    error,
    refetch,
  };
};
