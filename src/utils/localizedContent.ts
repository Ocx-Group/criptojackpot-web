import { Lottery, LotteryTranslation } from '@/interfaces/lottery';
import { Prize, PrizeTranslation } from '@/interfaces/prize';

/**
 * Resolución de textos configurables (promociones y premios) al idioma seleccionado.
 * El español es el idioma base guardado en los campos planos; "en" y "pt" viven en
 * `translations`. Cualquier traducción faltante o vacía cae al texto base.
 */

const normalizeLang = (lang?: string): string => (lang ?? 'es').split('-')[0].toLowerCase();

const resolve = (base: string, translated: string | undefined): string =>
  translated && translated.trim() !== '' ? translated : base;

type LotteryTextSource = Pick<Lottery, 'title' | 'description' | 'terms'> & {
  translations?: Record<string, LotteryTranslation> | null;
};

export const getLotteryText = (
  lottery: LotteryTextSource,
  field: 'title' | 'description' | 'terms',
  lang?: string
): string => {
  const code = normalizeLang(lang);
  if (code === 'es') return lottery[field];
  return resolve(lottery[field], lottery.translations?.[code]?.[field]);
};

type PrizeTextSource = Pick<Prize, 'name' | 'description'> & {
  translations?: Record<string, PrizeTranslation> | null;
};

export const getPrizeText = (prize: PrizeTextSource, field: 'name' | 'description', lang?: string): string => {
  const code = normalizeLang(lang);
  if (code === 'es') return prize[field];
  return resolve(prize[field], prize.translations?.[code]?.[field]);
};

/**
 * Para snapshots (ej. items del carrito) que guardan un título base y sus traducciones.
 */
export const getTranslatedTitle = (
  baseTitle: string,
  translations: Record<string, LotteryTranslation> | null | undefined,
  lang?: string
): string => {
  const code = normalizeLang(lang);
  if (code === 'es') return baseTitle;
  return resolve(baseTitle, translations?.[code]?.title);
};
