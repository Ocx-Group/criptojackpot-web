import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';

export interface LegalBlock {
  heading: string;
  /** Paragraphs of body text. */
  paragraphs?: string[];
  /** Optional bullet list. */
  bullets?: string[];
}

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  blocks: LegalBlock[];
  /** Closing contact / questions note. */
  contactNote?: string;
  /** Label for the back-to-home link. */
  backLabel: string;
}

const LegalDocument = ({ eyebrow, title, lastUpdated, intro, blocks, contactNote, backLabel }: LegalDocumentProps) => {
  return (
    <section className="legal-section position-relative overflow-hidden">
      <span className="login-orb login-orb--cyan" aria-hidden="true" />
      <span className="login-orb login-orb--green" aria-hidden="true" />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-9 col-lg-10">
            {/* Header */}
            <div className="legal-section__head">
              <span className="legal-section__eyebrow s1-clr fw_700">{eyebrow}</span>
              <h1 className="legal-section__title nw1-clr fw_700">{title}</h1>
              <span className="legal-section__updated nw3-clr fw_600">{lastUpdated}</span>
            </div>

            {/* Body card */}
            <div className="legal-card">
              <p className="legal-card__intro nw2-clr">{intro}</p>

              {blocks.map((block, i) => (
                <div key={block.heading} className="legal-block">
                  <h2 className="legal-block__heading nw1-clr fw_700">
                    <span className="legal-block__num s1-clr">{String(i + 1).padStart(2, '0')}</span>
                    {block.heading}
                  </h2>
                  {block.paragraphs?.map((p, idx) => (
                    <p key={idx} className="legal-block__text nw3-clr">
                      {p}
                    </p>
                  ))}
                  {block.bullets && (
                    <ul className="legal-block__list">
                      {block.bullets.map((b, idx) => (
                        <li key={idx} className="nw3-clr">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {contactNote && <p className="legal-card__contact nw3-clr">{contactNote}</p>}
            </div>

            <div className="text-center mt-5">
              <Link href="/" className="login-back d-center gap-2 nw3-clr fw_600 fs-eight s1-texthover">
                <ArrowLeftIcon size={16} weight="bold" />
                {backLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalDocument;
