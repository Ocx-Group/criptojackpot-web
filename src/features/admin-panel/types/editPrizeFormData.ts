import { PrizeImage, PrizeType } from '@/interfaces/prize';

export interface EditPrizeFormData {
  id: string;
  name: string;
  description: string;
  estimatedValue: number;
  type: PrizeType;
  mainImageUrl: string;
  additionalImages: PrizeImage[];
  specifications: Record<string, string>;
  cashAlternative: number;
  isDeliverable: boolean;
  isDigital: boolean;
  tier: number;
  // Traducciones obligatorias (el español es el idioma base en name/description)
  nameEn: string;
  descriptionEn: string;
  namePt: string;
  descriptionPt: string;
}

export interface UseEditPrizeFormReturn {
  formData: EditPrizeFormData;
  isLoading: boolean;
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleTypeChange: (type: PrizeType) => void;
  handleMainImageUrlChange: (url: string) => void;
  handleAddAdditionalImage: (image: Omit<PrizeImage, 'id'>) => void;
  handleRemoveAdditionalImage: (index: number) => void;
  handleSpecificationChange: (key: string, value: string) => void;
  handleRemoveSpecification: (key: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
