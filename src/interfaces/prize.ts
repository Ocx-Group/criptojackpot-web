export enum PrizeType {
  Cash = 0,
  Physical = 1,
  Digital = 2,
  Experience = 3,
}

export interface PrizeImage {
  id: string;
  imageUrl: string;
  caption: string;
  displayOrder: number;
}

export interface PrizeImageRequest {
  imageUrl: string;
  caption: string;
  displayOrder: number;
}

/**
 * Textos localizados de un premio, por código de idioma ("en", "pt").
 * Los campos base (name/description) son el idioma por defecto (español).
 */
export interface PrizeTranslation {
  name?: string;
  description?: string;
}

export interface Prize {
  id: string;
  prizeGuid: string;
  lotteryId: string;
  tier: number;
  name: string;
  description: string;
  estimatedValue: number;
  type: PrizeType;
  mainImageUrl: string;
  additionalImages: PrizeImage[];
  specifications: Record<string, string>;
  cashAlternative?: number;
  isDeliverable: boolean;
  isDigital: boolean;
  translations?: Record<string, PrizeTranslation> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrizeRequest {
  lotteryId?: string;
  tier: number;
  name: string;
  description: string;
  estimatedValue: number;
  type: PrizeType;
  mainImageUrl: string;
  additionalImages: PrizeImageRequest[];
  specifications: Record<string, string>;
  cashAlternative?: number;
  isDeliverable: boolean;
  isDigital: boolean;
  translations?: Record<string, PrizeTranslation> | null;
}

export interface UpdatePrizeRequest {
  name: string;
  description: string;
  estimatedValue: number;
  mainImageUrl: string;
  additionalImages: PrizeImage[];
  specifications: Record<string, string>;
  cashAlternative?: number;
  isDeliverable: boolean;
  isDigital: boolean;
  translations?: Record<string, PrizeTranslation> | null;
}
