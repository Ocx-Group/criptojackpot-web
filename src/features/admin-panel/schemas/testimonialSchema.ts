import { z } from 'zod';
import { TFunction } from 'i18next';

export const createCreateTestimonialSchema = (t: TFunction) =>
  z.object({
    authorName: z.string().min(1, t('TESTIMONIALS_ADMIN.errors.nameRequired', 'El nombre es requerido')),
    authorLocation: z.string().min(1, t('TESTIMONIALS_ADMIN.errors.locationRequired', 'La ubicación es requerida')),
    authorImageUrl: z.string().optional(),
    text: z
      .string()
      .min(1, t('TESTIMONIALS_ADMIN.errors.textRequired', 'El texto es requerido'))
      .max(500, t('TESTIMONIALS_ADMIN.errors.textTooLong', 'El texto no debe exceder 500 caracteres')),
    rating: z
      .number()
      .min(1, t('TESTIMONIALS_ADMIN.errors.ratingMin', 'El rating mínimo es 1'))
      .max(5, t('TESTIMONIALS_ADMIN.errors.ratingMax', 'El rating máximo es 5')),
    date: z.string().optional(),
    isActive: z.boolean(),
    sortOrder: z.number().min(0),
  });

export const createEditTestimonialSchema = (t: TFunction) =>
  z.object({
    id: z.string(),
    authorName: z.string().min(1, t('TESTIMONIALS_ADMIN.errors.nameRequired', 'El nombre es requerido')),
    authorLocation: z.string().min(1, t('TESTIMONIALS_ADMIN.errors.locationRequired', 'La ubicación es requerida')),
    authorImageUrl: z.string().optional(),
    text: z
      .string()
      .min(1, t('TESTIMONIALS_ADMIN.errors.textRequired', 'El texto es requerido'))
      .max(500, t('TESTIMONIALS_ADMIN.errors.textTooLong', 'El texto no debe exceder 500 caracteres')),
    rating: z
      .number()
      .min(1, t('TESTIMONIALS_ADMIN.errors.ratingMin', 'El rating mínimo es 1'))
      .max(5, t('TESTIMONIALS_ADMIN.errors.ratingMax', 'El rating máximo es 5')),
    date: z.string().optional(),
    isActive: z.boolean(),
    sortOrder: z.number().min(0),
  });

export type CreateTestimonialSchemaType = z.infer<ReturnType<typeof createCreateTestimonialSchema>>;
export type EditTestimonialSchemaType = z.infer<ReturnType<typeof createEditTestimonialSchema>>;
