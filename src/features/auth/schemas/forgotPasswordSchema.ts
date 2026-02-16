import { z } from 'zod';
import { TFunction } from 'i18next';

export const createForgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: z.email(t('FORGOT_PASSWORD.errors.invalidEmailFormat', 'El formato de email es inválido')),
  });

export type ForgotPasswordSchemaType = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
