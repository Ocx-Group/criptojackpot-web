import { LotteryType } from '@/interfaces/lottery';
import { Prize } from '@/interfaces/prize';
import { CoinPaymentCurrency } from '@/interfaces/coinPaymentCurrency';

/**
 * Tipo para el formulario del frontend
 */
export interface CreateTicketFormData {
  name: string;
  description: string;
  price: number;
  drawDate: string;
  drawTime: string;
  totalTickets: number;
  status: 'active' | 'upcoming';
  prizeId?: string;
  // Campos adicionales para lottery
  minNumber: number;
  maxNumber: number;
  terms: string;
  type: LotteryType;
  hasAgeRestriction: boolean;
  minimumAge?: number;
  restrictedCountries: string[];
  // Crypto currency
  cryptoCurrencyId: string;
  cryptoCurrencySymbol: string;
}

/**
 * Tipo para el retorno del hook useCreateTicketForm
 */
export interface UseCreateTicketFormReturn {
  formData: CreateTicketFormData;
  prizes: Prize[];
  currencies: CoinPaymentCurrency[];
  isLoadingCurrencies: boolean;
  selectedPrize: Prize | undefined;
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCurrencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
