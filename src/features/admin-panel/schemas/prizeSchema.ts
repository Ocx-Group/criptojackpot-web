import { z } from 'zod';
import { TFunction } from 'i18next';

export const createCreatePrizeSchema = (t: TFunction) =>
  z.object({
    lotteryId: z.string(),
    tier: z.number(),
    name: z.string().min(1, t('PRIZES_ADMIN.errors.nameRequired', 'El nombre es requerido')),
    description: z.string().min(1, t('PRIZES_ADMIN.errors.descriptionRequired', 'La descripción es requerida')),
    estimatedValue: z.number().positive(t('PRIZES_ADMIN.errors.valueInvalid', 'El valor debe ser mayor a 0')),
    type: z.number(),
    mainImageUrl: z.string().min(1, t('PRIZES_ADMIN.errors.imageRequired', 'La URL de imagen principal es requerida')),
    additionalImages: z.array(z.any()),
    specifications: z.any(),
    cashAlternative: z.number(),
    isDeliverable: z.boolean(),
    isDigital: z.boolean(),
  });

export const createEditPrizeSchema = (t: TFunction) =>
  z.object({
    id: z.string(),
    name: z.string().min(1, t('PRIZES_ADMIN.errors.nameRequired', 'El nombre es requerido')),
    description: z.string().min(1, t('PRIZES_ADMIN.errors.descriptionRequired', 'La descripción es requerida')),
    estimatedValue: z.number().positive(t('PRIZES_ADMIN.errors.valueInvalid', 'El valor debe ser mayor a 0')),
    type: z.number(),
    mainImageUrl: z.string().min(1, t('PRIZES_ADMIN.errors.imageRequired', 'La URL de imagen principal es requerida')),
    additionalImages: z.array(z.any()),
    specifications: z.any(),
    cashAlternative: z.number(),
    isDeliverable: z.boolean(),
    isDigital: z.boolean(),
    tier: z.number(),
  });

export type CreatePrizeSchemaType = z.infer<ReturnType<typeof createCreatePrizeSchema>>;
export type EditPrizeSchemaType = z.infer<ReturnType<typeof createEditPrizeSchema>>;
