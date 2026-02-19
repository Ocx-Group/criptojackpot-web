import { z } from 'zod';
import { TFunction } from 'i18next';

export const createRegisterSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('REGISTER.errors.nameRequired', 'El nombre es requerido')),
    lastName: z.string().min(1, t('REGISTER.errors.lastNameRequired', 'El apellido es requerido')),
    email: z.email(t('REGISTER.errors.invalidEmailFormat', 'El formato de email es inválido')),
    password: z.string().min(8, t('REGISTER.errors.weakPassword', 'La contraseña debe tener al menos 8 caracteres')),
    identification: z.string().min(1, t('REGISTER.errors.identificationRequired', 'La identificación es requerida')),
    phone: z.string(),
    state: z.string().min(1, t('REGISTER.errors.stateRequired', 'El estado es requerido')),
    city: z.string().min(1, t('REGISTER.errors.cityRequired', 'La ciudad es requerida')),
    address: z.string().min(1, t('REGISTER.errors.addressRequired', 'La dirección es requerida')),
    referralCode: z.string().optional(),
  });

export type RegisterSchemaType = z.infer<ReturnType<typeof createRegisterSchema>>;
