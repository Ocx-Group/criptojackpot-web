import { z } from 'zod';
import { TFunction } from 'i18next';

export const createResetPasswordSchema = (t: TFunction) =>
  z
    .object({
      securityCode: z
        .string()
        .min(1, t('RESET_PASSWORD.errors.securityCodeRequired', 'El código de seguridad es requerido'))
        .regex(/^\d{6}$/, t('RESET_PASSWORD.errors.invalidSecurityCode', 'El código debe tener 6 dígitos')),
      newPassword: z
        .string()
        .min(8, t('RESET_PASSWORD.errors.passwordTooShort', 'La contraseña debe tener al menos 8 caracteres')),
      confirmPassword: z
        .string()
        .min(1, t('RESET_PASSWORD.errors.confirmPasswordRequired', 'La confirmación de contraseña es requerida')),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: t('RESET_PASSWORD.errors.passwordsMismatch', 'Las contraseñas no coinciden'),
      path: ['confirmPassword'],
    });

export type ResetPasswordSchemaType = {
  securityCode: string;
  newPassword: string;
  confirmPassword: string;
};
