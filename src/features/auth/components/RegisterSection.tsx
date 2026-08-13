'use client';
import logoBlue from 'public/images/logo/blue-logo.png';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';
import { GOOGLE_CLIENT_ID } from '@/components/Providers';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CircleIcon,
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
  WarningCircleIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PASSWORD_RULES } from '@/features/auth/schemas';

interface RegisterSectionProps {
  referralCode?: string | null;
}

const RegisterSection = ({ referralCode }: RegisterSectionProps) => {
  const { t } = useTranslation();
  const {
    register,
    countries,
    selectedCountry,
    passwordValue,
    isPasswordShow,
    isLoading,
    isLoadingCountries,
    isSubmitted,
    error,
    fieldErrors,
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

  // El teléfono se normaliza a dígitos mientras se escribe (el backend lo limita a 20).
  const phoneField = register('phone');

  const passwordRuleLabels: Record<string, string> = {
    length: t('REGISTER.passwordRules.length', 'Al menos 8 caracteres'),
    uppercase: t('REGISTER.passwordRules.uppercase', 'Una letra mayúscula'),
    lowercase: t('REGISTER.passwordRules.lowercase', 'Una letra minúscula'),
    digit: t('REGISTER.passwordRules.digit', 'Un número'),
    special: t('REGISTER.passwordRules.special', 'Un carácter especial'),
  };

  const invalidFieldCount = useMemo(() => Object.keys(fieldErrors).length, [fieldErrors]);
  // Si el backend ya devolvió un error, ese mensaje se muestra arriba; el resumen
  // solo cuenta campos obligatorios que faltan por rellenar.
  const showErrorSummary = isSubmitted && invalidFieldCount > 0 && !error;
  const showPasswordRules = passwordValue.length > 0 || Boolean(fieldErrors.password);
  const requiredMark = ' *';

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

              {showErrorSummary && (
                <div className="login-alert login-alert--summary mb-4" role="alert" aria-live="polite">
                  <WarningCircleIcon size={18} weight="fill" />
                  <span>
                    {invalidFieldCount === 1
                      ? t('REGISTER.errors.summaryOne', 'Falta 1 campo obligatorio, marcado abajo en rojo')
                      : t(
                          'REGISTER.errors.summaryMany',
                          'Faltan {{count}} campos obligatorios, marcados abajo en rojo',
                          { count: invalidFieldCount }
                        )}
                  </span>
                </div>
              )}

              <p className="login-required-hint nw3-clr fs-eight mb-4">
                {t('REGISTER.requiredHint', 'Los campos marcados con * son obligatorios.')}
              </p>

              <form className="form-cmn-action" onSubmit={handleSubmit} noValidate>
                <div className="row g-4">
                  {/* Name + Last name */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.name ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <UserIcon size={20} weight="bold" />
                      </span>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        placeholder={t('REGISTER.namePlaceholder') + requiredMark}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                      />
                    </div>
                    {fieldErrors.name && (
                      <span id="name-error" className="field-error-text">
                        {fieldErrors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.lastName ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <UserIcon size={20} weight="bold" />
                      </span>
                      <input
                        id="lastName"
                        type="text"
                        {...register('lastName')}
                        placeholder={t('REGISTER.lastNamePlaceholder') + requiredMark}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.lastName)}
                        aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                      />
                    </div>
                    {fieldErrors.lastName && (
                      <span id="lastName-error" className="field-error-text">
                        {fieldErrors.lastName.message}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <div className={`form-cmn login-field ${fieldErrors.email ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <EnvelopeSimpleIcon size={20} weight="bold" />
                      </span>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder={t('REGISTER.emailPlaceholder') + requiredMark}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                      />
                    </div>
                    {fieldErrors.email && (
                      <span id="email-error" className="field-error-text">
                        {fieldErrors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <div className={`form-cmn login-field ${fieldErrors.password ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <LockKeyIcon size={20} weight="bold" />
                      </span>
                      <input
                        id="password"
                        type={isPasswordShow ? 'text' : 'password'}
                        {...register('password')}
                        className="password-field"
                        placeholder={t('REGISTER.passwordPlaceholder') + requiredMark}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={fieldErrors.password ? 'password-error' : 'password-rules'}
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
                    {fieldErrors.password && (
                      <span id="password-error" className="field-error-text">
                        {fieldErrors.password.message}
                      </span>
                    )}
                    {showPasswordRules && (
                      <ul id="password-rules" className="password-rules" aria-live="polite">
                        {PASSWORD_RULES.map(rule => {
                          const isMet = rule.test(passwordValue);
                          return (
                            <li key={rule.id} className={isMet ? 'is-met' : 'is-pending'}>
                              {isMet ? (
                                <CheckCircleIcon size={14} weight="fill" />
                              ) : (
                                <CircleIcon size={14} weight="bold" />
                              )}
                              <span>{passwordRuleLabels[rule.id]}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Country */}
                  <div className="col-12">
                    <div className={`form-cmn login-field ${fieldErrors.countryId ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <GlobeHemisphereWestIcon size={20} weight="bold" />
                      </span>
                      <select
                        id="countryId"
                        title={t('REGISTER.selectCountry')}
                        className="form-select"
                        onChange={handleCountryChange}
                        value={selectedCountry?.id || ''}
                        disabled={isLoadingCountries}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.countryId)}
                        aria-describedby={fieldErrors.countryId ? 'countryId-error' : undefined}
                      >
                        <option value="" disabled>
                          {isLoadingCountries
                            ? t('REGISTER.loadingCountries')
                            : t('REGISTER.selectCountry') + requiredMark}
                        </option>
                        {countries.map(country => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {fieldErrors.countryId && (
                      <span id="countryId-error" className="field-error-text">
                        {fieldErrors.countryId.message}
                      </span>
                    )}
                  </div>

                  {/* Identification + Phone */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.identification ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <IdentificationCardIcon size={20} weight="bold" />
                      </span>
                      <input
                        id="identification"
                        type="text"
                        {...register('identification')}
                        placeholder={t('REGISTER.identificationPlaceholder') + requiredMark}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.identification)}
                        aria-describedby={fieldErrors.identification ? 'identification-error' : undefined}
                      />
                    </div>
                    {fieldErrors.identification && (
                      <span id="identification-error" className="field-error-text">
                        {fieldErrors.identification.message}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.phone ? 'has-error' : ''}`}>
                      <div className="input-group login-input-group">
                        <span className="input-group-text">+{selectedCountry?.phoneCode || ''}</span>
                        <input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          {...phoneField}
                          onChange={event => {
                            event.target.value = event.target.value.replaceAll(/\D/g, '');
                            return phoneField.onChange(event);
                          }}
                          placeholder={t('REGISTER.phonePlaceholder')}
                          className="form-control"
                          aria-invalid={Boolean(fieldErrors.phone)}
                          aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                        />
                      </div>
                    </div>
                    {fieldErrors.phone && (
                      <span id="phone-error" className="field-error-text">
                        {fieldErrors.phone.message}
                      </span>
                    )}
                  </div>

                  {/* State + City */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.state ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <MapPinIcon size={20} weight="bold" />
                      </span>
                      <input
                        id="state"
                        type="text"
                        {...register('state')}
                        placeholder={t('REGISTER.statePlaceholder') + requiredMark}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.state)}
                        aria-describedby={fieldErrors.state ? 'state-error' : undefined}
                      />
                    </div>
                    {fieldErrors.state && (
                      <span id="state-error" className="field-error-text">
                        {fieldErrors.state.message}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn login-field ${fieldErrors.city ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <MapPinIcon size={20} weight="bold" />
                      </span>
                      <input
                        id="city"
                        type="text"
                        {...register('city')}
                        placeholder={t('REGISTER.cityPlaceholder') + requiredMark}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.city)}
                        aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                      />
                    </div>
                    {fieldErrors.city && (
                      <span id="city-error" className="field-error-text">
                        {fieldErrors.city.message}
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <div className={`form-cmn login-field ${fieldErrors.address ? 'has-error' : ''}`}>
                      <span className="login-field__icon d-center">
                        <HouseLineIcon size={20} weight="bold" />
                      </span>
                      <input
                        id="address"
                        type="text"
                        {...register('address')}
                        placeholder={t('REGISTER.addressPlaceholder') + requiredMark}
                        aria-required="true"
                        aria-invalid={Boolean(fieldErrors.address)}
                        aria-describedby={fieldErrors.address ? 'address-error' : undefined}
                      />
                    </div>
                    {fieldErrors.address && (
                      <span id="address-error" className="field-error-text">
                        {fieldErrors.address.message}
                      </span>
                    )}
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
