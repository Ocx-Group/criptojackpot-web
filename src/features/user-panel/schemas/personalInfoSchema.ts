import { z } from 'zod';
import { TFunction } from 'i18next';

export const createPersonalInfoSchema = (t: TFunction) =>
  z.object({
    firstName: z.string().min(1, t('REGISTER.errors.nameRequired', 'El nombre es requerido')),
    lastName: z.string().min(1, t('REGISTER.errors.lastNameRequired', 'El apellido es requerido')),
    email: z.string(),
    phone: z.string(),
    countryId: z.number().int().positive(t('REGISTER.errors.countryRequired', 'Por favor, seleccione un país')),
    statePlace: z.string().min(1, t('REGISTER.errors.stateRequired', 'El estado/provincia es requerido')),
    city: z.string().min(1, t('REGISTER.errors.cityRequired', 'La ciudad es requerida')),
    address: z.string().min(1, t('REGISTER.errors.addressRequired', 'La dirección es requerida')),
  });

export type PersonalInfoSchemaType = z.infer<ReturnType<typeof createPersonalInfoSchema>>;
