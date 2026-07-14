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
  referralCommissionPercentage: number;
  // Traducciones obligatorias (el español es el idioma base en name/description/terms)
  titleEn: string;
  descriptionEn: string;
  termsEn: string;
  titlePt: string;
  descriptionPt: string;
  termsPt: string;
}
