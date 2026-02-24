import { Prize } from './prize';

export interface Lottery {
  lotteryGuid: string;
  lotteryNo: string;
  title: string;
  description: string;
  minNumber: number;
  maxNumber: number;
  totalSeries: number;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  startDate: string;
  endDate: string;
  status: LotteryStatus;
  type: LotteryType;
  terms: string;
  hasAgeRestriction: boolean;
  minimumAge?: number;
  cryptoCurrencyId: string;
  cryptoCurrencySymbol: string;
  restrictedCountries: string[];
  prizes: Prize[];
  createdAt: string;
  updatedAt: string;
}

export enum LotteryType {
  Standard = 0,
  Instant = 1,
  Daily = 2,
  Weekly = 3,
  Monthly = 4,
}

export interface CreateLotteryRequest {
  title: string;
  description: string;
  minNumber: number;
  maxNumber: number;
  ticketPrice: number;
  maxTickets: number;
  startDate: string;
  endDate: string;
  status: LotteryStatus;
  type: LotteryType;
  terms: string;
  hasAgeRestriction: boolean;
  minimumAge?: number;
  cryptoCurrencyId: string;
  cryptoCurrencySymbol: string;
  restrictedCountries: string[];
  prizeId?: string;
}

export interface UpdateLotteryRequest extends Partial<CreateLotteryRequest> {
  id: string;
}

export interface CreateLotteryData {
  name: string;
  description: string;
  price: number;
  drawDate: string;
  drawTime: string;
  totalTickets: number;
  status: 'active' | 'upcoming';
  prizeId?: string;
}

export enum LotteryStatus {
  Draft = 0,
  Active = 1,
  Paused = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface LotteryFilters {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}
