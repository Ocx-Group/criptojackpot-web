import { CreateLotteryRequest, LotteryStatus, LotteryType } from '@/interfaces/lottery';

export const initialFormData: CreateLotteryRequest = {
  title: '',
  description: '',
  minNumber: 1,
  maxNumber: 49,
  ticketPrice: 0,
  maxTickets: 1000,
  startDate: '',
  endDate: '',
  status: LotteryStatus.Draft,
  type: LotteryType.Standard,
  terms: '',
  hasAgeRestriction: false,
  minimumAge: undefined,
  restrictedCountries: [],
  prizeId: undefined,
};
