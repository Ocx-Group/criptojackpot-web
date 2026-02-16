import { z } from 'zod';
import { TFunction } from 'i18next';

export const createAdminUserSchema = (t: TFunction) =>
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
    roleId: z.number().min(1, t('USERS_ADMIN.create.errors.roleRequired', 'Debe seleccionar un rol')),
    status: z.boolean(),
  });

export type AdminUserSchemaType = z.infer<ReturnType<typeof createAdminUserSchema>>;
