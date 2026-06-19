'use client';
import logoBlue from 'public/images/logo/blue-logo.png';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { GOOGLE_CLIENT_ID } from '@/components/Providers';
import {
  ArrowRightIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeHemisphereWestIcon,
  HouseLineIcon,
  IdentificationCardIcon,
  LightningIcon,
  LockKeyIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UserIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RegisterSectionProps {
  referralCode?: string | null;
}

const RegisterSection = ({ referralCode }: RegisterSectionProps) => {
  const { t } = useTranslation();
  const {
    formData,
    countries,
    selectedCountry,
    isPasswordShow,
    isLoading,
    isLoadingCountries,
    error,
    fieldErrors,
    countryError,
    handleInputChange,
    handleCountryChange,
    togglePasswordVisibility,
    handleSubmit,
    setReferralCode,
  } = useRegisterForm();

  useEffect(() => {
    if (referralCode && setReferralCode) {
      setReferralCode(referralCode);
    }
  }, [referralCode, setReferralCode]);

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
    <section className="login-section login-section--register position-relative overflow-hidden">
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
                {t('REGISTER.heroEyebrow', 'ÚNETE A CRIPTOJACKPOT')}
              </span>
              <h2 className="login-hero__title nw1-clr fw_700">
                {t('REGISTER.heroTitle', 'Crea tu cuenta y empieza a')}{' '}
                <span className="act4-clr act4-underline">{t('REGISTER.heroHighlight', 'ganar')}</span>{' '}
                {t('REGISTER.heroTitleEnd', 'hoy mismo')}
              </h2>
              <p className="login-hero__sub nw3-clr">
                {t(
                  'REGISTER.heroSub',
                  'Regístrate gratis y participa en promociones y Pick 3 con pagos en criptomonedas.'
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
          <div className="col-xxl-5 col-lg-6 col-md-9 col-11">
            <div className="login-card">
              <Link href="/" className="login-card__logo d-lg-none text-center mb-6 d-block">
                <Image src={logoBlue} alt="CriptoJackpot" />
              </Link>

              <div className="login-card__head mb-xxl-7 mb-6">
                <h3 className="nw1-clr fw_700 mb-2">{t('REGISTER.title')}</h3>
                <span className="nw3-clr">
                  {t('REGISTER.alreadyHaveAccount')}{' '}
                  <Link href="/login" className="s1-clr fw_600 s1-texthover login-link">
                    {t('REGISTER.signIn')}
                  </Link>
                </span>
              </div>

              {error && (
                <div className="login-alert mb-4" role="alert">
                  {error}
                </div>
              )}

              <form className="form-cmn-action" onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Name + Last name */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.name ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <UserIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.namePlaceholder')}
                      />
                    </div>
                    {fieldErrors.name && <span className="field-error-text">{fieldErrors.name.message}</span>}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.lastName ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <UserIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.lastNamePlaceholder')}
                      />
                    </div>
                    {fieldErrors.lastName && <span className="field-error-text">{fieldErrors.lastName.message}</span>}
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <div className={`form-cmn login-field ${fieldErrors.email ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <EnvelopeSimpleIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.emailPlaceholder')}
                      />
                    </div>
                    {fieldErrors.email && <span className="field-error-text">{fieldErrors.email.message}</span>}
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <div className={`form-cmn login-field ${fieldErrors.password ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <LockKeyIcon size={20} weight="bold" />
                      </span>
                      <input
                        type={isPasswordShow ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="password-field"
                        placeholder={t('REGISTER.passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="login-field__toggle d-center"
                        aria-label={isPasswordShow ? t('REGISTER.hidePassword') : t('REGISTER.showPassword')}
                      >
                        {isPasswordShow ? (
                          <EyeIcon size={20} weight="bold" />
                        ) : (
                          <EyeSlashIcon size={20} weight="bold" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && <span className="field-error-text">{fieldErrors.password.message}</span>}
                  </div>

                  {/* Country */}
                  <div className="col-12">
                    <div className={`form-cmn login-field ${countryError ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <GlobeHemisphereWestIcon size={20} weight="bold" />
                      </span>
                      <select
                        title="Country select"
                        className="form-select"
                        onChange={handleCountryChange}
                        value={selectedCountry?.id || ''}
                        disabled={isLoadingCountries}
                      >
                        <option value="" disabled>
                          {isLoadingCountries ? t('REGISTER.loadingCountries') : t('REGISTER.selectCountry')}
                        </option>
                        {countries.map(country => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {countryError && <span className="field-error-text">{t('REGISTER.errors.countryRequired')}</span>}
                  </div>

                  {/* Identification + Phone */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.identification ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <IdentificationCardIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="text"
                        name="identification"
                        value={formData.identification}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.identificationPlaceholder')}
                      />
                    </div>
                    {fieldErrors.identification && (
                      <span className="field-error-text">{fieldErrors.identification.message}</span>
                    )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-cmn login-field">
                      <div className="input-group login-input-group">
                        <span className="input-group-text">+{selectedCountry?.phoneCode || ''}</span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t('REGISTER.phonePlaceholder')}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  {/* State + City */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.state ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <MapPinIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.statePlaceholder')}
                      />
                    </div>
                    {fieldErrors.state && <span className="field-error-text">{fieldErrors.state.message}</span>}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.city ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <MapPinIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.cityPlaceholder')}
                      />
                    </div>
                    {fieldErrors.city && <span className="field-error-text">{fieldErrors.city.message}</span>}
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <div className={`form-cmn login-field ${fieldErrors.address ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <HouseLineIcon size={20} weight="bold" />
                      </span>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.addressPlaceholder')}
                      />
                    </div>
                    {fieldErrors.address && <span className="field-error-text">{fieldErrors.address.message}</span>}
                  </div>

                  {/* Submit */}
                  <div className="col-12 mt-2">
                    <button type="submit" className="login-submit w-100 d-center gap-2 fw_700" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" style={{ width: 18, height: 18 }} />
                          {t('REGISTER.creatingAccount')}
                        </>
                      ) : (
                        <>
                          {t('REGISTER.createAccount')}
                          <ArrowRightIcon size={18} weight="bold" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Terms */}
                  <div className="col-12">
                    <span className="nw3-clr d-block text-center fs-eight">
                      {t('REGISTER.termsAndPrivacy')}
                      <Link href="/terms" className="s1-clr login-link">
                        {t('REGISTER.termsLink')}
                      </Link>
                    </span>
                  </div>

                  {/* Google */}
                  {GOOGLE_CLIENT_ID && (
                    <div className="col-12">
                      <div className="login-divider d-flex align-items-center gap-3">
                        <span className="login-divider__line" />
                        <span className="nw3-clr fs-eight">{t('LOGIN.orContinueWith', 'o continuar con')}</span>
                        <span className="login-divider__line" />
                      </div>
                      <GoogleLoginButton referralCode={referralCode} />
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

export default RegisterSection;
