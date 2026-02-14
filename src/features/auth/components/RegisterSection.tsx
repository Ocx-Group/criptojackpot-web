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
    <section className="login-section position-relative min-vh-100 d-flex align-items-center overflow-hidden">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center min-vh-100 g-0">
          {/* Form Column */}
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 order-2 order-lg-1">
            <div className="left-logwrap h-100 d-flex align-items-center py-4 py-md-5">
              <div className="authentication-cmn w-100 px-3 px-sm-4 px-md-5 px-lg-4 px-xl-5">
                {/* Logo */}
                <Link href="/public" className="d-block text-center mb-4">
                  <div className="d-flex justify-content-center">
                    <Image
                      src={logo}
                      alt="logo"
                      className="img-fluid"
                      style={{
                        maxWidth: '120px',
                        height: 'auto',
                      }}
                    />
                  </div>
                </Link>

                {/* Title */}
                <div className="log-title mb-4 text-center">
                  <h3 className="fs-5 fs-sm-4 mb-2">{t('REGISTER.title')}</h3>
                  <span className="n3-clr d-block fs-6">
                    {t('REGISTER.alreadyHaveAccount')}
                    <Link href="/login" className="s1-clr fw_500 s1-texthover">
                      {t('REGISTER.signIn')}
                    </Link>
                  </span>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form className="form-cmn-action" onSubmit={handleSubmit}>
                  <div className="row g-2 g-sm-3">
                    {/* Name Fields */}
                    <div className="col-12 col-sm-6">
                      <div className="form-cmn">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t('REGISTER.namePlaceholder')}
                          className="py-2 w-100"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-cmn">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={t('REGISTER.lastNamePlaceholder')}
                          className="py-2 w-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <div className="form-cmn">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('REGISTER.emailPlaceholder')}
                          className="py-2 w-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12">
                      <div className="position-relative">
                        <div className="form-cmn">
                          <input
                            type={isPasswordShow ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="py-2 w-100"
                            placeholder={t('REGISTER.passwordPlaceholder')}
                            style={{ paddingRight: '45px' }}
                            required
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
                    </div>

                    {/* Country */}
                    <div className="col-12">
                      <div className="form-cmn">
                        <select
                          title="Country select"
                          className="form-select py-2 w-100"
                          onChange={handleCountryChange}
                          value={selectedCountry?.id || ''}
                          disabled={isLoadingCountries}
                          required
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
                    </div>

                    {/* Identification and Phone */}
                    <div className="col-12 col-sm-6">
                      <div className="form-cmn">
                        <input
                          type="text"
                          name="identification"
                          value={formData.identification}
                          onChange={handleInputChange}
                          placeholder={t('REGISTER.identificationPlaceholder')}
                          className="py-2 w-100"
                          required
                        />
                      </div>
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
                      <div className="form-cmn">
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder={t('REGISTER.statePlaceholder')}
                          className="py-2 w-100"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-cmn">
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder={t('REGISTER.cityPlaceholder')}
                          className="py-2 w-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <div className="form-cmn">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder={t('REGISTER.addressPlaceholder')}
                          className="py-2 w-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 mt-3">
                      <button
                        type="submit"
                        className="w-100 radius12 s1-bg fw_600 nw1-clr d-flex align-items-center justify-content-between py-2 px-3"
                        disabled={isLoading}
                      >
                        <span className="fs-6 fs-sm-5">
                          {isLoading ? t('REGISTER.creatingAccount') : t('REGISTER.createAccount')}
                        </span>
                        <CaretRightIcon size={18} />
                      </button>
                    </div>

                    {/* Terms */}
                    <div className="col-12 mt-2">
                      <span className="n3-clr fs-eight d-block text-center">
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
          </div>

          {/* Image Column - Hidden on mobile */}
          <div className="col-lg-7 col-xl-8 d-none d-lg-block order-1 order-lg-2">
            <div className="log-thumbwrap h-100">
              <div className="thumb h-100 position-relative">
                <Image
                  src={registerImage}
                  alt="register"
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  priority
                />
              </div>
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
            opacity: 0.1,
          }}
        />
      </div>
    </section>
  );
};

export default RegisterSection;
