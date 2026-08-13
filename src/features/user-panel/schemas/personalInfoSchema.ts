import { z } from 'zod';
import { TFunction } from 'i18next';

/**
 * Espejo de UpdateUserCommandValidator (backend). Mantener sincronizado para que
 * el usuario vea el error en el campo concreto y no un 400 genérico.
 */
export const createPersonalInfoSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.nameRequired', 'El nombre es requerido'))
      .max(100, t('REGISTER.errors.nameTooLong', 'El nombre no puede superar los 100 caracteres')),
    lastName: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.lastNameRequired', 'El apellido es requerido'))
      .max(100, t('REGISTER.errors.lastNameTooLong', 'El apellido no puede superar los 100 caracteres')),
    email: z.string(),
    phone: z
      .string()
      .trim()
      .max(20, t('REGISTER.errors.phoneTooLong', 'El teléfono no puede superar los 20 caracteres'))
      .refine(
        value => value.length === 0 || /^\+?[\d\s\-()]*$/.test(value),
        t('REGISTER.errors.phoneInvalid', 'El teléfono no es válido')
      ),
    countryId: z.number().int().positive(t('REGISTER.errors.countryRequired', 'Por favor, seleccione un país')),
    statePlace: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.stateRequired', 'El estado/provincia es requerido'))
      .max(100, t('REGISTER.errors.stateTooLong', 'El estado no puede superar los 100 caracteres')),
    city: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.cityRequired', 'La ciudad es requerida'))
      .max(100, t('REGISTER.errors.cityTooLong', 'La ciudad no puede superar los 100 caracteres')),
    address: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.addressRequired', 'La dirección es requerida'))
      .max(150, t('REGISTER.errors.addressTooLong', 'La dirección no puede superar los 150 caracteres')),
  });

export type PersonalInfoSchemaType = z.infer<ReturnType<typeof createPersonalInfoSchema>>;
