import { z } from 'zod';
import { TFunction } from 'i18next';

export const createCreateLotterySchema = (t: TFunction) =>
  z
    .object({
      title: z.string().min(1, t('LOTTERY_ADMIN.errors.titleRequired', 'El título es requerido')),
      description: z.string().min(1, t('LOTTERY_ADMIN.errors.descriptionRequired', 'La descripción es requerida')),
      minNumber: z
        .number()
        .min(0, t('LOTTERY_ADMIN.errors.minNumberInvalid', 'El número mínimo debe ser mayor o igual a 0')),
      maxNumber: z.number(),
      ticketPrice: z
        .number()
        .positive(t('LOTTERY_ADMIN.errors.ticketPriceInvalid', 'El precio del ticket debe ser mayor a 0')),
      maxTickets: z
        .number()
        .positive(t('LOTTERY_ADMIN.errors.maxTicketsInvalid', 'El máximo de tickets debe ser mayor a 0')),
      startDate: z.string().min(1, t('LOTTERY_ADMIN.errors.startDateRequired', 'La fecha de inicio es requerida')),
      endDate: z.string().min(1, t('LOTTERY_ADMIN.errors.endDateRequired', 'La fecha de fin es requerida')),
      status: z.number(),
      type: z.number(),
      terms: z.string().min(1, t('LOTTERY_ADMIN.errors.termsRequired', 'Los términos y condiciones son requeridos')),
      hasAgeRestriction: z.boolean(),
      minimumAge: z.number().optional(),
      restrictedCountries: z.array(z.string()),
      prizeId: z.string().optional(),
    })
    .refine(data => data.maxNumber > data.minNumber, {
      message: t('LOTTERY_ADMIN.errors.maxNumberInvalid', 'El número máximo debe ser mayor al mínimo'),
      path: ['maxNumber'],
    })
    .refine(data => new Date(data.endDate) > new Date(data.startDate), {
      message: t('LOTTERY_ADMIN.errors.endDateInvalid', 'La fecha de fin debe ser posterior a la de inicio'),
      path: ['endDate'],
    })
    .refine(data => !data.hasAgeRestriction || (data.minimumAge !== undefined && data.minimumAge >= 18), {
      message: t('LOTTERY_ADMIN.errors.minimumAgeInvalid', 'La edad mínima debe ser al menos 18 años'),
      path: ['minimumAge'],
    });

export type CreateLotterySchemaType = z.infer<ReturnType<typeof createCreateLotterySchema>>;

export const createEditLotterySchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('LOTTERIES_ADMIN.errors.nameRequired', 'El nombre es requerido')),
    description: z.string(),
    price: z.number().positive(t('LOTTERIES_ADMIN.errors.priceInvalid', 'El precio debe ser mayor a 0')),
    drawDate: z.string().min(1, t('LOTTERIES_ADMIN.errors.drawDateRequired', 'La fecha del sorteo es requerida')),
    drawTime: z.string().min(1, t('LOTTERIES_ADMIN.errors.drawDateRequired', 'La hora del sorteo es requerida')),
    totalTickets: z
      .number()
      .positive(t('LOTTERIES_ADMIN.errors.totalTicketsInvalid', 'El total de tickets debe ser mayor a 0')),
    status: z.number(),
    prizeId: z.string().optional(),
    minNumber: z.number(),
    maxNumber: z.number(),
    totalSeries: z.number(),
    terms: z.string(),
  });

export type EditLotterySchemaType = z.infer<ReturnType<typeof createEditLotterySchema>>;
