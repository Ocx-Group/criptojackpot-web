import { LotteryType } from '@/interfaces/lottery';
import { Prize } from '@/interfaces/prize';

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
}

/**
 * Tipo para el retorno del hook useCreateTicketForm
 */
export interface UseCreateTicketFormReturn {
  formData: CreateTicketFormData;
  prizes: Prize[];
  selectedPrize: Prize | undefined;
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
