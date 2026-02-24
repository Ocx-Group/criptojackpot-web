import { LotteryStatus } from '@/interfaces/lottery';

export interface EditLotteryFormData {
  name: string;
  description: string;
  price: number;
  drawDate: string;
  drawTime: string;
  totalTickets: number;
  status: LotteryStatus;
  prizeId?: string;
  minNumber: number;
  maxNumber: number;
  totalSeries: number;
  terms: string;
  cryptoCurrencyId: string;
  cryptoCurrencySymbol: string;
}
