'use client';
import logoBlue from 'public/images/logo/blue-logo.png';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { GOOGLE_CLIENT_ID } from '@/components/Providers';
import {
  ArrowRightIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  LightningIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const LoginSection = () => {
  const { t } = useTranslation();
  const { formData, isPasswordShow, isLoading, handleInputChange, togglePasswordVisibility, handleSubmit } =
    useLoginForm();

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
                {t('LOGIN.heroEyebrow', 'BIENVENIDO DE NUEVO')}
              </span>
              <h2 className="login-hero__title nw1-clr fw_700">
                {t('LOGIN.heroTitle', 'Tu próxima gran')}{' '}
                <span className="act4-clr act4-underline">{t('LOGIN.heroHighlight', 'oportunidad')}</span>{' '}
                {t('LOGIN.heroTitleEnd', 'te espera')}
              </h2>
              <p className="login-hero__sub nw3-clr">
                {t('LOGIN.heroSub', 'Accede a tu cuenta y participa en promociones y Pick 3 con pagos en criptomonedas.')}
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

              <div className="login-card__head mb-xxl-8 mb-6">
                <h3 className="nw1-clr fw_700 mb-2">{t('LOGIN.loginButton', 'Iniciar sesión')}</h3>
                <span className="nw3-clr">
                  {t('LOGIN.newUser')}{' '}
                  <Link href="/register" className="s1-clr fw_600 s1-texthover login-link">
                    {t('LOGIN.createAccount')}
                  </Link>
                </span>
              </div>

              <form onSubmit={handleSubmit} className="form-cmn-action">
                <div className="row g-5">
                  <div className="col-12">
                    <label className="login-label nw2-clr fw_600 mb-2 d-block">
                      {t('LOGIN.emailLabel', 'Correo electrónico')}
                    </label>
                    <div className="form-cmn login-field">
                      <span className="login-field__icon d-center">
                        <EnvelopeSimpleIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('LOGIN.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="login-label nw2-clr fw_600 mb-2 d-block">
                      {t('LOGIN.passwordLabel', 'Contraseña')}
                    </label>
                    <div className="form-cmn login-field">
                      <span className="login-field__icon d-center">
                        <LockKeyIcon size={20} weight="bold" />
                      </span>
                      <input
                        type={isPasswordShow ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="password-field"
                        placeholder={t('LOGIN.passwordPlaceholder')}
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

                  <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <label className="login-remember d-flex align-items-center gap-2 nw3-clr fs-eight">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                      />
                      {t('LOGIN.rememberMe', 'Recordarme')}
                    </label>
                    <Link href="/forgot-password" className="login-link s1-clr fw_600 fs-eight s1-texthover">
                      {t('LOGIN.forgetPassword')}
                    </Link>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="login-submit w-100 d-center gap-2 fw_700" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" style={{ width: 18, height: 18 }} />
                          {t('LOGIN.loading')}
                        </>
                      ) : (
                        <>
                          {t('LOGIN.loginButton')}
                          <ArrowRightIcon size={18} weight="bold" />
                        </>
                      )}
                    </button>
                  </div>

                  {GOOGLE_CLIENT_ID && (
                    <div className="col-12">
                      <div className="login-divider d-flex align-items-center gap-3">
                        <span className="login-divider__line" />
                        <span className="nw3-clr fs-eight">{t('LOGIN.orContinueWith', 'o continuar con')}</span>
                        <span className="login-divider__line" />
                      </div>
                      <GoogleLoginButton />
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
