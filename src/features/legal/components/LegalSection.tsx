'use client';

import { useTranslation } from 'react-i18next';
import LegalDocument, { LegalBlock } from './LegalDocument';

interface LegalSectionProps {
  /** i18n namespace holding the legal content. */
  ns: 'TERMS' | 'PRIVACY';
}

const LegalSection = ({ ns }: LegalSectionProps) => {
  const { t } = useTranslation();

  const rawBlocks = t(`${ns}.blocks`, { returnObjects: true });
  const blocks: LegalBlock[] = Array.isArray(rawBlocks) ? (rawBlocks as LegalBlock[]) : [];

  return (
    <LegalDocument
      eyebrow={t(`${ns}.eyebrow`)}
      title={t(`${ns}.title`)}
      lastUpdated={t(`${ns}.lastUpdated`)}
      intro={t(`${ns}.intro`)}
      blocks={blocks}
      contactNote={t(`${ns}.contactNote`)}
      backLabel={t(`${ns}.backToHome`)}
    />
  );
};

export default LegalSection;
