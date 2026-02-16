import { z } from 'zod';
import { TFunction } from 'i18next';

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z.email(t('LOGIN.errors.invalidEmailFormat', 'El formato de email es inválido')),
    password: z.string().min(1, t('LOGIN.errors.requiredFields', 'Todos los campos son requeridos')),
    rememberMe: z.boolean(),
  });

export type LoginSchemaType = z.infer<ReturnType<typeof createLoginSchema>>;
