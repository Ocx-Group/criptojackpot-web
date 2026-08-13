"use client";
import { CheckIcon, WarningCircleIcon } from "@phosphor-icons/react";
import MotionFade from "../../../components/motionEffect/MotionFade";
import { usePersonalInfoForm } from "@/features/user-panel/hooks/usePersonalInfoForm";
import { useTranslation } from "react-i18next";

export default function PersonalInfoSection() {
  const { t } = useTranslation();
  const {
    register,
    email,
    countries,
    selectedCountry,
    isLoadingCountries,
    fieldErrors,
    isSubmitted,
    handleCountryChange,
    handleSubmit,
    isLoading,
    error,
  } = usePersonalInfoForm();

  const invalidFieldCount = Object.keys(fieldErrors).length;
  // Si el backend rechazó la petición ya se notificó por toast; el resumen solo
  // cuenta campos obligatorios que faltan por rellenar.
  const showErrorSummary = isSubmitted && invalidFieldCount > 0 && !error;
  const requiredMark = <span className="field-required-mark" aria-hidden="true"> *</span>;

  return (
      <MotionFade className="col-xxl-9 col-xl-8 col-lg-8">
        <div className="cmn-box-addingbg win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-8 px-xl-6 px-sm-5 px-4">
          <h3 className="user-title n4-clr mb-xxl-10 mb-xl-8 mb-lg-6 mb-5">{t('PERSONAL_INFO.title')}</h3>

          {showErrorSummary && (
            <div className="login-alert login-alert--summary mb-5" role="alert" aria-live="polite">
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

          <p className="nw3-clr fs-eight mb-5">
            {t('REGISTER.requiredHint', 'Los campos marcados con * son obligatorios.')}
          </p>

          <form onSubmit={handleSubmit} className="ch-form-one" noValidate>
            <div className="row g-6">
              {/* First Name */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className={`ch-form-items ${fieldErrors.firstName ? 'has-error' : ''}`}>
                  <label htmlFor="firstName" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.firstName')}{requiredMark}
                  </label>
                  <input
                      id="firstName"
                      type="text"
                      placeholder={t('PERSONAL_INFO.placeholders.firstName')}
                      {...register("firstName")}
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.firstName)}
                      aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                  />
                  {fieldErrors.firstName && (
                    <span id="firstName-error" className="field-error-text">{fieldErrors.firstName.message}</span>
                  )}
                </div>
              </div>
              {/* Last Name */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className={`ch-form-items ${fieldErrors.lastName ? 'has-error' : ''}`}>
                  <label htmlFor="lastName" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.lastName')}{requiredMark}
                  </label>
                  <input
                      id="lastName"
                      type="text"
                      placeholder={t('PERSONAL_INFO.placeholders.lastName')}
                      {...register("lastName")}
                      aria-required="true"
                      aria-invalid={Boolean(fieldErrors.lastName)}
                      aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                  />
                  {fieldErrors.lastName && (
                    <span id="lastName-error" className="field-error-text">{fieldErrors.lastName.message}</span>
                  )}
                </div>
              </div>
              {/* Email (no editable) */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="email" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.emailAddress')}
                  </label>
                  <input
                      id="email"
                      type="email"
                      placeholder={t('PERSONAL_INFO.placeholders.email')}
                      value={email}
                      readOnly
                      disabled
                  />
                </div>
              </div>
              {/* Phone */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className={`ch-form-items ${fieldErrors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="phone" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.phoneNumber')}
                  </label>
                  <input
                      id="phone"
                      type="tel"
                      placeholder={t('PERSONAL_INFO.placeholders.phoneNumber')}
                      {...register("phone")}
                      aria-invalid={Boolean(fieldErrors.phone)}
                      aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  />
                  {fieldErrors.phone && (
                    <span id="phone-error" className="field-error-text">{fieldErrors.phone.message}</span>
                  )}
                </div>
              </div>
              {/* Country */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className={`ch-form-items ${fieldErrors.countryId ? 'has-error' : ''}`}>
                  <label htmlFor="countryId" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.country')}{requiredMark}
                  </label>
                  <select
                    id="countryId"
                    title={t('PERSONAL_INFO.country')}
                    value={selectedCountry?.id || ''}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    disabled={isLoadingCountries}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.countryId)}
                    aria-describedby={fieldErrors.countryId ? 'countryId-error' : undefined}
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
                  {fieldErrors.countryId && (
                    <span id="countryId-error" className="field-error-text">{fieldErrors.countryId.message}</span>
                  )}
                </div>
              </div>
              {/* State Place */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className={`ch-form-items ${fieldErrors.statePlace ? 'has-error' : ''}`}>
                  <label htmlFor="statePlace" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.statePlace')}{requiredMark}
                  </label>
                  <input
                    id="statePlace"
                    type="text"
                    placeholder={t('PERSONAL_INFO.placeholders.statePlace')}
                    {...register("statePlace")}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.statePlace)}
                    aria-describedby={fieldErrors.statePlace ? 'statePlace-error' : undefined}
                  />
                  {fieldErrors.statePlace && (
                    <span id="statePlace-error" className="field-error-text">{fieldErrors.statePlace.message}</span>
                  )}
                </div>
              </div>
              {/* City */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className={`ch-form-items ${fieldErrors.city ? 'has-error' : ''}`}>
                  <label htmlFor="city" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.city')}{requiredMark}
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder={t('PERSONAL_INFO.placeholders.city')}
                    {...register("city")}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.city)}
                    aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                  />
                  {fieldErrors.city && (
                    <span id="city-error" className="field-error-text">{fieldErrors.city.message}</span>
                  )}
                </div>
              </div>
              {/* Address */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className={`ch-form-items ${fieldErrors.address ? 'has-error' : ''}`}>
                  <label htmlFor="address" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.address')}{requiredMark}
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder={t('PERSONAL_INFO.placeholders.address')}
                    {...register("address")}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.address)}
                    aria-describedby={fieldErrors.address ? 'address-error' : undefined}
                  />
                  {fieldErrors.address && (
                    <span id="address-error" className="field-error-text">{fieldErrors.address.message}</span>
                  )}
                </div>
              </div>
            </div>
            {/* Checkbox y boton */}
            <div className="border-top d-flex align-items-center justify-content-between pt-xxl-8 pt-6 mt-xxl-8 mt-6">
              <label className="checkbox-single">
                <input type="checkbox" name="checkbox" className="d-none" />
                <span className="checkmark d-center"><CheckIcon /></span>
                <span className="fs-seven fw_600 title-item">{t('PERSONAL_INFO.subscribeNewsletter')}</span>
              </label>
              <button type="submit" className="kewta-btn kewta-alt d-inline-flex align-items-center" disabled={isLoading}>
                <span className="kew-text act4-bg nw1-clr act3-bg">{t('PERSONAL_INFO.updateProfile')}</span>
              </button>
            </div>
          </form>
        </div>
      </MotionFade>
  );
}
