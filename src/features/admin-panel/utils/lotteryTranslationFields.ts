import { LotteryTranslation } from '@/interfaces/lottery';
import { PrizeTranslation } from '@/interfaces/prize';

/**
 * Campos planos de traducción usados por los formularios de promoción del admin.
 * El español es el idioma base (campos principales); estos campos son opcionales
 * y se convierten al diccionario `translations` ({ en, pt }) que espera el backend.
 */
export interface LotteryTranslationFormFields {
  titleEn?: string;
  descriptionEn?: string;
  termsEn?: string;
  titlePt?: string;
  descriptionPt?: string;
  termsPt?: string;
}

const compact = (translation: LotteryTranslation): LotteryTranslation | undefined => {
  const entries = Object.entries(translation).filter(([, value]) => value && value.trim() !== '');
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

/** Construye el diccionario `translations` para el backend; undefined si no hay nada traducido. */
export const buildLotteryTranslations = (
  fields: LotteryTranslationFormFields
): Record<string, LotteryTranslation> | undefined => {
  const translations: Record<string, LotteryTranslation> = {};

  const en = compact({ title: fields.titleEn, description: fields.descriptionEn, terms: fields.termsEn });
  if (en) translations.en = en;

  const pt = compact({ title: fields.titlePt, description: fields.descriptionPt, terms: fields.termsPt });
  if (pt) translations.pt = pt;

  return Object.keys(translations).length > 0 ? translations : undefined;
};

/** Convierte el diccionario `translations` del backend a campos planos del formulario. */
export const extractLotteryTranslationFields = (
  translations?: Record<string, LotteryTranslation> | null
): Required<LotteryTranslationFormFields> => ({
  titleEn: translations?.en?.title ?? '',
  descriptionEn: translations?.en?.description ?? '',
  termsEn: translations?.en?.terms ?? '',
  titlePt: translations?.pt?.title ?? '',
  descriptionPt: translations?.pt?.description ?? '',
  termsPt: translations?.pt?.terms ?? '',
});

/** Campos planos de traducción para los formularios de premio del admin. */
export interface PrizeTranslationFormFields {
  nameEn?: string;
  descriptionEn?: string;
  namePt?: string;
  descriptionPt?: string;
}

const compactPrize = (translation: PrizeTranslation): PrizeTranslation | undefined => {
  const entries = Object.entries(translation).filter(([, value]) => value && value.trim() !== '');
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

export const buildPrizeTranslations = (
  fields: PrizeTranslationFormFields
): Record<string, PrizeTranslation> | undefined => {
  const translations: Record<string, PrizeTranslation> = {};

  const en = compactPrize({ name: fields.nameEn, description: fields.descriptionEn });
  if (en) translations.en = en;

  const pt = compactPrize({ name: fields.namePt, description: fields.descriptionPt });
  if (pt) translations.pt = pt;

  return Object.keys(translations).length > 0 ? translations : undefined;
};

export const extractPrizeTranslationFields = (
  translations?: Record<string, PrizeTranslation> | null
): Required<PrizeTranslationFormFields> => ({
  nameEn: translations?.en?.name ?? '',
  descriptionEn: translations?.en?.description ?? '',
  namePt: translations?.pt?.name ?? '',
  descriptionPt: translations?.pt?.description ?? '',
});
