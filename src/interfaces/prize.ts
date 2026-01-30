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
}
