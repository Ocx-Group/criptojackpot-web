import { Prize } from './prize';

/**
 * Textos localizados de una promoción, por código de idioma ("en", "pt").
 * Los campos base (title/description/terms) son el idioma por defecto (español);
 * las traducciones faltantes caen al texto base.
 */
export interface LotteryTranslation {
  title?: string;
  description?: string;
  terms?: string;
}

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
  referralCommissionPercentage: number;
  restrictedCountries: string[];
  translations?: Record<string, LotteryTranslation> | null;
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
  Pick3 = 5,
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
  referralCommissionPercentage: number;
  restrictedCountries: string[];
  translations?: Record<string, LotteryTranslation> | null;
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
