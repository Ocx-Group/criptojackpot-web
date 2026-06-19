'use client';

import logoBlue from 'public/images/logo/blue-logo.png';
import { useConfirmEmail } from '@/features/auth/hooks/useConfirmEmail';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  LightningIcon,
  ShieldCheckIcon,
  TrophyIcon,
  XCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface ConfirmEmailSectionProps {
  token: string;
}

const ConfirmEmailSection = ({ token }: ConfirmEmailSectionProps) => {
  const { t } = useTranslation();
  const { isLoading, isSuccess, isError } = useConfirmEmail(token);

  const features = [
    {
      icon: <ShieldCheckIcon weight="bold" />,
      title: t('LOGIN.feature1Title', 'Pagos 100% seguros'),
      desc: t('LOGIN.feature1Desc', 'Transacciones cripto verificadas y protegidas.'),
    },
    {
      icon: <LightningIcon weight="bold" />,
      title: t('LOGIN.feature2Title', 'Promociones transparentes'),
      desc: t('LOGIN.feature2Desc', 'Resultados auditables y al instante.'),
    },
    {
      icon: <TrophyIcon weight="bold" />,
      title: t('LOGIN.feature3Title', 'Premios reales'),
      desc: t('LOGIN.feature3Desc', 'Miles de ganadores en toda la comunidad.'),
    },
  ];

  const stats = [
    { value: '100%', label: t('LOGIN.statTransparent', 'Transparente') },
    { value: '24/7', label: t('LOGIN.statAvailable', 'Disponible') },
    { value: 'Cripto', label: t('LOGIN.statCrypto', 'Pagos') },
  ];

  return (
    <section className="login-section position-relative overflow-hidden">
      {/* Ambient glow orbs */}
      <span className="login-orb login-orb--cyan" aria-hidden="true" />
      <span className="login-orb login-orb--green" aria-hidden="true" />

      <div className="container">
        <div className="row align-items-center justify-content-center g-0 login-row">
          {/* Brand showcase */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="login-hero">
              <Link href="/" className="login-hero__logo">
                <Image src={logoBlue} alt="CriptoJackpot" priority />
              </Link>

              <span className="login-hero__eyebrow s1-clr fw_700">
                {t('CONFIRM_EMAIL.heroEyebrow', 'CASI LISTO')}
              </span>
              <h2 className="login-hero__title nw1-clr fw_700">
                {t('CONFIRM_EMAIL.heroTitle', 'Activa tu cuenta y empieza a')}{' '}
                <span className="act4-clr act4-underline">{t('CONFIRM_EMAIL.heroHighlight', 'jugar')}</span>
              </h2>
              <p className="login-hero__sub nw3-clr">
                {t(
                  'CONFIRM_EMAIL.heroSub',
                  'Confirmamos tu correo para mantener tu cuenta segura. En un momento estarás dentro.'
                )}
              </p>

              <ul className="login-hero__features">
                {features.map(feature => (
                  <li key={feature.title} className="login-feature">
                    <span className="login-feature__icon d-center">{feature.icon}</span>
                    <div>
                      <span className="login-feature__title nw1-clr fw_700 d-block">{feature.title}</span>
                      <span className="login-feature__desc nw3-clr">{feature.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="login-hero__stats">
                {stats.map(stat => (
                  <div key={stat.label} className="login-stat">
                    <span className="login-stat__value fw_700">{stat.value}</span>
                    <span className="login-stat__label nw3-clr fw_600">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status card */}
          <div className="col-xxl-5 col-lg-6 col-md-8 col-11">
            <div className="login-card text-center">
              <Link href="/" className="login-card__logo d-lg-none text-center mb-6 d-block">
                <Image src={logoBlue} alt="CriptoJackpot" />
              </Link>

              {isLoading && (
                <div className="d-flex flex-column align-items-center gap-4 py-3">
                  <span className="login-card__badge login-card__badge--lg d-center">
                    <EnvelopeSimpleIcon size={32} weight="bold" />
                  </span>
                  <div>
                    <h3 className="nw1-clr fw_700 mb-2">{t('CONFIRM_EMAIL.title')}</h3>
                    <p className="nw3-clr mb-0 d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm s1-clr" style={{ width: 18, height: 18 }} />
                      {t('CONFIRM_EMAIL.verifying')}
                    </p>
                  </div>
                </div>
              )}

              {isSuccess && (
                <div className="d-flex flex-column align-items-center gap-4 py-3">
                  <span className="login-card__badge login-card__badge--lg login-card__badge--success d-center">
                    <CheckCircleIcon size={34} weight="fill" />
                  </span>
                  <div>
                    <h3 className="nw1-clr fw_700 mb-2">{t('CONFIRM_EMAIL.success')}</h3>
                    <p className="nw3-clr mb-2">{t('CONFIRM_EMAIL.successMessage')}</p>
                    <p className="nw3-clr fs-eight mb-0">{t('CONFIRM_EMAIL.redirecting', 'Redirigiendo al login...')}</p>
                  </div>
                  <Link href="/login" className="login-submit w-100 d-center gap-2 fw_700">
                    {t('CONFIRM_EMAIL.goToLogin')}
                    <ArrowRightIcon size={18} weight="bold" />
                  </Link>
                </div>
              )}

              {isError && (
                <div className="d-flex flex-column align-items-center gap-4 py-3">
                  <span className="login-card__badge login-card__badge--lg login-card__badge--error d-center">
                    <XCircleIcon size={34} weight="fill" />
                  </span>
                  <div>
                    <h3 className="nw1-clr fw_700 mb-2">{t('CONFIRM_EMAIL.error')}</h3>
                    <p className="nw3-clr mb-0">{t('CONFIRM_EMAIL.errorMessage')}</p>
                  </div>
                  <Link href="/login" className="login-submit w-100 d-center gap-2 fw_700">
                    {t('CONFIRM_EMAIL.goToLogin')}
                    <ArrowRightIcon size={18} weight="bold" />
                  </Link>
                </div>
              )}

              <div className="mt-5">
                <Link href="/" className="login-back d-center gap-2 nw3-clr fw_600 fs-eight s1-texthover">
                  {t('NAVBAR.Home', 'Inicio')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmEmailSection;
