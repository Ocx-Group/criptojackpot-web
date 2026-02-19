'use client';
import registerImage from 'public/images/background/back-register.png';
import logo from 'public/images/logo/cripto-jackpot-logo.png';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { CaretRightIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react/dist/ssr';
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

  return (
    <section
      className="register-section position-relative overflow-hidden"
      style={{
        backgroundColor: '#000000',
        minHeight: '100vh',
      }}
    >
      <div className="container-fluid p-0 h-100">
        <div className="row g-0 min-vh-100">
          {/* Form Column */}
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center order-2 order-lg-1">
            <div className="w-100 py-4 py-md-5 px-3 px-sm-4 px-md-5" style={{ maxWidth: '560px' }}>
              {/* Logo */}
              <Link href="/public" className="d-block text-center mb-4">
                <Image src={logo} alt="logo" className="img-fluid" style={{ maxWidth: '120px', height: 'auto' }} />
              </Link>

              {/* Title */}
              <div className="text-center mb-4">
                <h3
                  className="mb-2"
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {t('REGISTER.title')}
                </h3>
                <span className="n3-clr" style={{ fontSize: '0.95rem' }}>
                  {t('REGISTER.alreadyHaveAccount')}
                  <Link href="/login" className="s1-clr fw_500 s1-texthover">
                    {t('REGISTER.signIn')}
                  </Link>
                </span>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger mb-3 py-2" role="alert" style={{ fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              {/* Form */}
              <form className="form-cmn-action" onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Name Fields */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn ${fieldErrors.name ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.namePlaceholder')}
                        className="py-2 w-100"
                      />
                    </div>
                    {fieldErrors.name && <span className="field-error-text">{fieldErrors.name.message}</span>}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn ${fieldErrors.lastName ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.lastNamePlaceholder')}
                        className="py-2 w-100"
                      />
                    </div>
                    {fieldErrors.lastName && <span className="field-error-text">{fieldErrors.lastName.message}</span>}
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <div className={`form-cmn ${fieldErrors.email ? 'has-error' : ''}`}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.emailPlaceholder')}
                        className="py-2 w-100"
                      />
                    </div>
                    {fieldErrors.email && <span className="field-error-text">{fieldErrors.email.message}</span>}
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <div className="position-relative">
                      <div className={`form-cmn ${fieldErrors.password ? 'has-error' : ''}`}>
                        <input
                          type={isPasswordShow ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="py-2 w-100"
                          placeholder={t('REGISTER.passwordPlaceholder')}
                          style={{ paddingRight: '45px' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label={isPasswordShow ? t('REGISTER.hidePassword') : t('REGISTER.showPassword')}
                        style={{
                          cursor: 'pointer',
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          lineHeight: 0,
                        }}
                      >
                        {isPasswordShow ? (
                          <EyeIcon size={20} weight="bold" style={{ color: '#ffffff' }} />
                        ) : (
                          <EyeSlashIcon size={20} weight="bold" style={{ color: '#ffffff' }} />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && <span className="field-error-text">{fieldErrors.password.message}</span>}
                  </div>

                  {/* Country */}
                  <div className="col-12">
                    <div className={`form-cmn ${countryError ? 'has-error' : ''}`}>
                      <select
                        title="Country select"
                        className="form-select py-2 w-100"
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

                  {/* Identification and Phone */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn ${fieldErrors.identification ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="identification"
                        value={formData.identification}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.identificationPlaceholder')}
                        className="py-2 w-100"
                      />
                    </div>
                    {fieldErrors.identification && (
                      <span className="field-error-text">{fieldErrors.identification.message}</span>
                    )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-cmn">
                      <div className="input-group">
                        <span className="input-group-text px-2 px-sm-3">+{selectedCountry?.phoneCode || ''}</span>
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

                  {/* State and City */}
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn ${fieldErrors.state ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.statePlaceholder')}
                        className="py-2 w-100"
                      />
                    </div>
                    {fieldErrors.state && <span className="field-error-text">{fieldErrors.state.message}</span>}
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className={`form-cmn ${fieldErrors.city ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.cityPlaceholder')}
                        className="py-2 w-100"
                      />
                    </div>
                    {fieldErrors.city && <span className="field-error-text">{fieldErrors.city.message}</span>}
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <div className={`form-cmn ${fieldErrors.address ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={t('REGISTER.addressPlaceholder')}
                        className="py-2 w-100"
                      />
                    </div>
                    {fieldErrors.address && <span className="field-error-text">{fieldErrors.address.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-3">
                    <button
                      type="submit"
                      className="w-100 radius12 s1-bg fw_600 nw1-clr d-flex align-items-center justify-content-between py-2 py-sm-3 px-3 px-sm-4"
                      disabled={isLoading}
                      style={{ transition: 'opacity 0.2s' }}
                    >
                      <span style={{ fontSize: '1rem' }}>
                        {isLoading ? t('REGISTER.creatingAccount') : t('REGISTER.createAccount')}
                      </span>
                      <CaretRightIcon size={20} />
                    </button>
                  </div>

                  {/* Terms */}
                  <div className="col-12 mt-2">
                    <span className="n3-clr d-block text-center" style={{ fontSize: '0.8rem' }}>
                      {t('REGISTER.termsAndPrivacy')}
                      <Link href="#" className="n4-clr text-decoration-none">
                        {t('REGISTER.termsLink')}
                      </Link>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Image Column */}
          <div className="col-12 col-lg-6 d-none d-lg-flex order-1 order-lg-2 position-relative">
            <div className="w-100 h-100 position-relative" style={{ minHeight: '100vh' }}>
              <Image
                src={registerImage}
                alt="register"
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                priority
                sizes="50vw"
              />
              {/* Subtle gradient overlay for polished blending */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Background Image */}
      <div className="d-lg-none position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: -1 }}>
        <Image
          src={registerImage}
          alt="register background"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.08,
          }}
        />
      </div>
    </section>
  );
};

export default RegisterSection;
