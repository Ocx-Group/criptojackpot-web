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
      drawDate: z.string().min(1, t('LOTTERIES_ADMIN.errors.drawDateRequired', 'La fecha del sorteo es requerida')),
      drawTime: z.string().min(1, t('LOTTERIES_ADMIN.errors.drawTimeRequired', 'La hora del sorteo es requerida')),
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
    })
    .refine(
      data => {
        const drawDateTime = new Date(`${data.drawDate}T${data.drawTime}`);
        return drawDateTime > new Date();
      },
      {
        message: t('LOTTERIES_ADMIN.errors.drawDatePast', 'La fecha del sorteo debe ser en el futuro'),
        path: ['drawDate'],
      }
    );

export type TicketSchemaType = z.infer<ReturnType<typeof createTicketSchema>>;
