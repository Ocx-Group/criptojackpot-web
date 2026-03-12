'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { lotteryNumberService } from '@/services';
import type { NumberBoardSummary, NumberSeriesDetail } from '@/services/lotteryNumberService';

export const useNumberBoard = (lotteryId: string | null) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const {
    data: boardData,
    isLoading: isBoardLoading,
    error: boardError,
    refetch: refetchBoard,
  } = useQuery<NumberBoardSummary, Error>({
    queryKey: ['number-board', lotteryId],
    queryFn: () => lotteryNumberService.getNumberBoard(lotteryId!),
    enabled: !!lotteryId,
  });

  const {
    data: seriesDetail,
    isLoading: isSeriesLoading,
    error: seriesError,
  } = useQuery<NumberSeriesDetail, Error>({
    queryKey: ['number-series-detail', lotteryId, selectedNumber],
    queryFn: () => lotteryNumberService.getNumberSeriesDetail(lotteryId!, selectedNumber!),
    enabled: !!lotteryId && selectedNumber !== null,
  });

  return {
    boardData,
    isBoardLoading,
    boardError,
    refetchBoard,
    selectedNumber,
    setSelectedNumber,
    seriesDetail,
    isSeriesLoading,
    seriesError,
  };
};
