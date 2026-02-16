import { z } from 'zod';
import { TFunction } from 'i18next';

export const createRegisterSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('REGISTER.errors.requiredFields', 'Todos los campos son requeridos')),
    lastName: z.string().min(1, t('REGISTER.errors.requiredFields', 'Todos los campos son requeridos')),
    email: z.email(t('REGISTER.errors.invalidEmailFormat', 'El formato de email es inválido')),
    password: z.string().min(8, t('REGISTER.errors.weakPassword', 'La contraseña debe tener al menos 8 caracteres')),
    identification: z.string(),
    phone: z.string(),
    state: z.string(),
    city: z.string(),
    address: z.string(),
    referralCode: z.string().optional(),
  });

export type RegisterSchemaType = z.infer<ReturnType<typeof createRegisterSchema>>;
