import { z } from 'zod';
import { TFunction } from 'i18next';

export const createPersonalInfoSchema = (t: TFunction) =>
  z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    })
    .refine(data => !data.password || data.password === data.confirmPassword, {
      message: t('PERSONAL_INFO.notifications.passwordMismatch', 'Las contraseñas no coinciden'),
      path: ['confirmPassword'],
    });

export type PersonalInfoSchemaType = z.infer<ReturnType<typeof createPersonalInfoSchema>>;
