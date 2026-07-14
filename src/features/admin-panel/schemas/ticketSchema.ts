import { z } from 'zod';
import { TFunction } from 'i18next';

export const createTicketSchema = (t: TFunction) =>
  z
    .object({
      name: z.string().min(1, t('LOTTERIES_ADMIN.errors.nameRequired', 'El nombre es requerido')),
      description: z.string().min(1, t('LOTTERIES_ADMIN.errors.descriptionRequired', 'La descripción es requerida')),
      price: z.number().positive(t('LOTTERIES_ADMIN.errors.priceInvalid', 'El precio debe ser mayor a 0')),
      totalTickets: z
        .number()
        .positive(t('LOTTERIES_ADMIN.errors.totalTicketsInvalid', 'El total de tickets debe ser mayor a 0')),
      drawDate: z.string().min(1, t('LOTTERIES_ADMIN.errors.drawDateRequired', 'La fecha de la promoción es requerida')),
      drawTime: z.string().min(1, t('LOTTERIES_ADMIN.errors.drawTimeRequired', 'La hora de la promoción es requerida')),
      status: z.enum(['active', 'upcoming']),
      prizeId: z.string().optional(),
      minNumber: z.number(),
      maxNumber: z.number(),
      terms: z.string().min(1, t('LOTTERIES_ADMIN.errors.termsRequired', 'Los términos y condiciones son requeridos')),
      type: z.number(),
      hasAgeRestriction: z.boolean(),
      minimumAge: z.number().optional(),
      restrictedCountries: z.array(z.string()),
      cryptoCurrencyId: z
        .string()
        .min(1, t('LOTTERIES_ADMIN.errors.cryptoCurrencyRequired', 'La criptomoneda es requerida')),
      cryptoCurrencySymbol: z.string().min(1),
      referralCommissionPercentage: z
        .number()
        .min(0, t('LOTTERIES_ADMIN.errors.referralCommissionInvalid', 'La comisión debe estar entre 0 y 100'))
        .max(100, t('LOTTERIES_ADMIN.errors.referralCommissionInvalid', 'La comisión debe estar entre 0 y 100')),
      // Traducciones obligatorias (es/en/pt) para que el usuario siempre vea su idioma
      titleEn: z.string().min(1, t('LOTTERIES_ADMIN.errors.translationRequired', 'Completa las traducciones en inglés y portugués')),
      descriptionEn: z
        .string()
        .min(1, t('LOTTERIES_ADMIN.errors.translationRequired', 'Completa las traducciones en inglés y portugués')),
      termsEn: z.string().min(1, t('LOTTERIES_ADMIN.errors.translationRequired', 'Completa las traducciones en inglés y portugués')),
      titlePt: z.string().min(1, t('LOTTERIES_ADMIN.errors.translationRequired', 'Completa las traducciones en inglés y portugués')),
      descriptionPt: z
        .string()
        .min(1, t('LOTTERIES_ADMIN.errors.translationRequired', 'Completa las traducciones en inglés y portugués')),
      termsPt: z.string().min(1, t('LOTTERIES_ADMIN.errors.translationRequired', 'Completa las traducciones en inglés y portugués')),
    })
    .refine(
      data => {
        const drawDateTime = new Date(`${data.drawDate}T${data.drawTime}`);
        return drawDateTime > new Date();
      },
      {
        message: t('LOTTERIES_ADMIN.errors.drawDatePast', 'La fecha de la promoción debe ser en el futuro'),
        path: ['drawDate'],
      }
    )
    .refine(
      data => {
        // Pick3 (type=5) must have fixed config
        if (data.type === 5) {
          return data.minNumber === 0 && data.maxNumber === 999 && data.totalTickets === 1000;
        }
        return true;
      },
      {
        message: t(
          'LOTTERIES_ADMIN.errors.pick3Config',
          'Pick3 must have minNumber=0, maxNumber=999, totalTickets=1000'
        ),
        path: ['type'],
      }
    )
    .refine(
      data => {
        // Standard raffle (type=0) must have fixed config: 0000-9999, 10000 tickets, 1 series
        if (data.type === 0) {
          return data.minNumber === 0 && data.maxNumber === 9999 && data.totalTickets === 10000;
        }
        return true;
      },
      {
        message: t(
          'LOTTERIES_ADMIN.errors.standardConfig',
          'La promoción estándar debe tener minNumber=0, maxNumber=9999, totalTickets=10000'
        ),
        path: ['type'],
      }
    );

export type TicketSchemaType = z.infer<ReturnType<typeof createTicketSchema>>;
