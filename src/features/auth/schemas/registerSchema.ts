import { z } from 'zod';
import { TFunction } from 'i18next';

/**
 * Espejo de CreateUserCommandValidator (backend).
 * Mantener sincronizado: si el front es más laxo, el backend responde 400 con
 * "One or more validation errors occurred" en lugar de un error por campo.
 */
export const PASSWORD_RULES = [
  { id: 'length', test: (v: string) => v.length >= 8 },
  { id: 'uppercase', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lowercase', test: (v: string) => /[a-z]/.test(v) },
  { id: 'digit', test: (v: string) => /\d/.test(v) },
  { id: 'special', test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
] as const;

export const createRegisterSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.nameRequired', 'El nombre es requerido'))
      .max(100, t('REGISTER.errors.nameTooLong', 'El nombre no puede superar los 100 caracteres')),
    lastName: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.lastNameRequired', 'El apellido es requerido'))
      .max(100, t('REGISTER.errors.lastNameTooLong', 'El apellido no puede superar los 100 caracteres')),
    email: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.emailRequired', 'El correo electrónico es requerido'))
      .max(150, t('REGISTER.errors.emailTooLong', 'El correo no puede superar los 150 caracteres'))
      .refine(
        value => z.email().safeParse(value).success,
        t('REGISTER.errors.invalidEmailFormat', 'El formato de email es inválido')
      ),
    password: z
      .string()
      .min(8, t('REGISTER.errors.weakPassword', 'La contraseña debe tener al menos 8 caracteres'))
      .max(100, t('REGISTER.errors.passwordTooLong', 'La contraseña no puede superar los 100 caracteres'))
      .regex(/[A-Z]/, t('REGISTER.errors.passwordUppercase', 'La contraseña debe incluir una mayúscula'))
      .regex(/[a-z]/, t('REGISTER.errors.passwordLowercase', 'La contraseña debe incluir una minúscula'))
      .regex(/\d/, t('REGISTER.errors.passwordDigit', 'La contraseña debe incluir un número'))
      .regex(
        /[^a-zA-Z0-9]/,
        t('REGISTER.errors.passwordSpecial', 'La contraseña debe incluir un carácter especial')
      ),
    countryId: z
      .number()
      .int()
      .positive(t('REGISTER.errors.countryRequired', 'Por favor, seleccione un país')),
    identification: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.identificationRequired', 'La identificación es requerida'))
      .max(50, t('REGISTER.errors.identificationTooLong', 'La identificación no puede superar los 50 caracteres')),
    phone: z
      .string()
      .trim()
      .max(20, t('REGISTER.errors.phoneTooLong', 'El teléfono no puede superar los 20 caracteres')),
    state: z
      .string()
      .trim()
      .min(1, t('REGISTER.errors.stateRequired', 'El estado es requerido'))
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
    referralCode: z
      .string()
      .trim()
      .max(50, t('REGISTER.errors.referralCodeTooLong', 'El código de referido no puede superar los 50 caracteres'))
      .optional(),
  });

export type RegisterSchemaType = z.infer<ReturnType<typeof createRegisterSchema>>;
