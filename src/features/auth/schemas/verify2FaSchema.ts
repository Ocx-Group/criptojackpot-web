import { z } from 'zod';
import { TFunction } from 'i18next';

export const createVerify2FaCodeSchema = (t: TFunction) =>
  z.object({
    code: z.string().length(6, t('TWO_FACTOR.errors.codeRequired', 'Ingresa el código de 6 dígitos')),
  });

export const createVerify2FaRecoverySchema = (t: TFunction) =>
  z.object({
    recoveryCode: z.string().min(1, t('TWO_FACTOR.errors.recoveryCodeRequired', 'Ingresa el código de recuperación')),
  });
