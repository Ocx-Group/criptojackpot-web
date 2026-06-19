'use client';
import logoBlue from 'public/images/logo/blue-logo.png';
import { useResetPasswordForm } from '@/features/auth/hooks/useResetPasswordForm';
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  LightningIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  ShieldIcon,
  TrophyIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const ResetPasswordSection = () => {
  const { t } = useTranslation();
  const {
    formData,
    email,
    isPasswordShow,
    isConfirmPasswordShow,
    isLoading,
    handleInputChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
  } = useResetPasswordForm();

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
                {t('RESET_PASSWORD.heroEyebrow', 'CUENTA PROTEGIDA')}
              </span>
              <h2 className="login-hero__title nw1-clr fw_700">
                {t('RESET_PASSWORD.heroTitle', 'Crea una contraseña')}{' '}
                <span className="act4-clr act4-underline">{t('RESET_PASSWORD.heroHighlight', 'más fuerte')}</span>
              </h2>
              <p className="login-hero__sub nw3-clr">
                {t(
                  'RESET_PASSWORD.heroSub',
                  'Define una nueva contraseña segura y recupera el acceso a tu cuenta al instante.'
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
                <ShieldIcon size={26} weight="bold" />
              </span>

              <div className="login-card__head mb-xxl-7 mb-6">
                <h3 className="nw1-clr fw_700 mb-2">{t('RESET_PASSWORD.title')}</h3>
                <span className="nw3-clr d-block">{t('RESET_PASSWORD.description')}</span>
                {email && (
                  <span className="nw3-clr fs-eight fw_600 d-block mt-2">
                    {t('RESET_PASSWORD.emailLabel')}: <span className="s1-clr">{email}</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit} className="form-cmn-action">
                <div className="row g-5">
                  {/* Security code */}
                  <div className="col-12">
                    <label className="login-label nw2-clr fw_600 mb-2 d-block">
                      {t('RESET_PASSWORD.securityCodePlaceholder')}
                    </label>
                    <div className="form-cmn login-field">
                      <span className="login-field__icon d-center">
                        <KeyIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="text"
                        name="securityCode"
                        value={formData.securityCode}
                        onChange={handleInputChange}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        pattern="\d{6}"
                        placeholder={t('RESET_PASSWORD.securityCodePlaceholder')}
                      />
                    </div>
                  </div>

                  {/* New password */}
                  <div className="col-12">
                    <label className="login-label nw2-clr fw_600 mb-2 d-block">
                      {t('RESET_PASSWORD.newPasswordPlaceholder')}
                    </label>
                    <div className="form-cmn login-field">
                      <span className="login-field__icon d-center">
                        <LockKeyIcon size={20} weight="bold" />
                      </span>
                      <input
                        type={isPasswordShow ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="password-field"
                        placeholder={t('RESET_PASSWORD.newPasswordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="login-field__toggle d-center"
                        aria-label={isPasswordShow ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {isPasswordShow ? (
                          <EyeIcon size={20} weight="bold" />
                        ) : (
                          <EyeSlashIcon size={20} weight="bold" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="col-12">
                    <label className="login-label nw2-clr fw_600 mb-2 d-block">
                      {t('RESET_PASSWORD.confirmPasswordPlaceholder')}
                    </label>
                    <div className="form-cmn login-field">
                      <span className="login-field__icon d-center">
                        <LockKeyIcon size={20} weight="bold" />
                      </span>
                      <input
                        type={isConfirmPasswordShow ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="password-field"
                        placeholder={t('RESET_PASSWORD.confirmPasswordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="login-field__toggle d-center"
                        aria-label={isConfirmPasswordShow ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {isConfirmPasswordShow ? (
                          <EyeIcon size={20} weight="bold" />
                        ) : (
                          <EyeSlashIcon size={20} weight="bold" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="login-submit w-100 d-center gap-2 fw_700" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" style={{ width: 18, height: 18 }} />
                          {t('RESET_PASSWORD.loading')}
                        </>
                      ) : (
                        <>
                          {t('RESET_PASSWORD.resetButton')}
                          <ShieldCheckIcon size={18} weight="bold" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="col-12">
                    <Link href="/login" className="login-back d-center gap-2 nw3-clr fw_600 fs-eight s1-texthover">
                      <ArrowLeftIcon size={16} weight="bold" />
                      {t('RESET_PASSWORD.backToLogin')}
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

export default ResetPasswordSection;
export interface ResetPasswordRequest {
  email: string;
  securityCode: string;
  newPassword: string;
}
