'use client';

import logoBlue from 'public/images/logo/blue-logo.png';
import { useVerify2Fa } from '@/features/auth/hooks/useVerify2Fa';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  LightningIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import OtpInput from 'react-otp-input';
import { useTranslation } from 'react-i18next';

const TwoFactorSection = () => {
  const { t } = useTranslation();
  const {
    code,
    recoveryCode,
    setRecoveryCode,
    useRecoveryCode,
    setUseRecoveryCode,
    isLoading,
    handleSubmit,
    handleCodeComplete,
  } = useVerify2Fa();

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
                {t('TWO_FACTOR.heroEyebrow', 'VERIFICACIÓN SEGURA')}
              </span>
              <h2 className="login-hero__title nw1-clr fw_700">
                {t('TWO_FACTOR.heroTitle', 'Un paso más para')}{' '}
                <span className="act4-clr act4-underline">{t('TWO_FACTOR.heroHighlight', 'protegerte')}</span>
              </h2>
              <p className="login-hero__sub nw3-clr">
                {t(
                  'TWO_FACTOR.heroSub',
                  'Confirma tu identidad con el código de tu app de autenticación y mantén tu cuenta a salvo.'
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

          {/* Auth card */}
          <div className="col-xxl-5 col-lg-6 col-md-8 col-11">
            <div className="login-card">
              <Link href="/" className="login-card__logo d-lg-none text-center mb-6 d-block">
                <Image src={logoBlue} alt="CriptoJackpot" />
              </Link>

              <span className="login-card__badge d-center mb-5">
                <ShieldCheckIcon size={26} weight="bold" />
              </span>

              <div className="login-card__head mb-xxl-8 mb-6">
                <h3 className="nw1-clr fw_700 mb-2">{t('TWO_FACTOR.title', 'Verificación en dos pasos')}</h3>
                <span className="nw3-clr d-block">
                  {useRecoveryCode
                    ? t('TWO_FACTOR.recoveryDescription', 'Ingresa uno de tus códigos de recuperación')
                    : t('TWO_FACTOR.description', 'Ingresa el código de 6 dígitos de tu aplicación de autenticación')}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="form-cmn-action">
                <div className="row g-5">
                  {useRecoveryCode ? (
                    <div className="col-12">
                      <label className="login-label nw2-clr fw_600 mb-2 d-block">
                        {t('TWO_FACTOR.recoveryCodeLabel', 'Código de recuperación')}
                      </label>
                      <div className="form-cmn">
                        <input
                          type="text"
                          value={recoveryCode}
                          onChange={e => setRecoveryCode(e.target.value)}
                          placeholder={t('TWO_FACTOR.recoveryCodePlaceholder', 'XXXX-XXXX')}
                          maxLength={9}
                          className="login-recovery-input w-100"
                          autoFocus
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="col-12">
                      <div className="d-flex justify-content-center otp-container login-otp">
                        <OtpInput
                          value={code}
                          onChange={handleCodeComplete}
                          numInputs={6}
                          shouldAutoFocus
                          inputType="number"
                          containerStyle={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 'clamp(6px, 1.5vw, 10px)',
                            width: '100%',
                          }}
                          renderInput={props => <input {...props} className="otp-input" />}
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <button type="submit" className="login-submit w-100 d-center gap-2 fw_700" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" style={{ width: 18, height: 18 }} />
                          {t('LOGIN.loading')}
                        </>
                      ) : (
                        <>
                          {t('TWO_FACTOR.verify', 'Verificar')}
                          <CheckCircleIcon size={18} weight="bold" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="col-12 text-center">
                    <button
                      type="button"
                      onClick={() => setUseRecoveryCode(!useRecoveryCode)}
                      className="login-textbtn s1-clr fw_600 fs-eight"
                    >
                      {useRecoveryCode
                        ? t('TWO_FACTOR.useAuthenticator', 'Usar código de autenticador')
                        : t('TWO_FACTOR.useRecoveryCode', 'Usar código de recuperación')}
                    </button>
                  </div>

                  <div className="col-12">
                    <Link href="/login" className="login-back d-center gap-2 nw3-clr fw_600 fs-eight s1-texthover">
                      <ArrowLeftIcon size={16} weight="bold" />
                      {t('TWO_FACTOR.backToLogin', 'Volver al inicio de sesión')}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoFactorSection;
