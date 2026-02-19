"use client";
import { CheckIcon } from "@phosphor-icons/react";
import MotionFade from "../../../components/motionEffect/MotionFade";
import { usePersonalInfoForm } from "@/features/user-panel/hooks/usePersonalInfoForm";
import { useTranslation } from "react-i18next";

export default function PersonalInfoSection() {
  const { t } = useTranslation();
  const {
    formData,
    countries,
    isLoadingCountries,
    countryError,
    handleChange,
    handleCountryChange,
    handleSubmit,
  } = usePersonalInfoForm();

  return (
      <MotionFade className="col-xxl-9 col-xl-8 col-lg-8">
        <div className="cmn-box-addingbg win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-8 px-xl-6 px-sm-5 px-4">
          <h3 className="user-title n4-clr mb-xxl-10 mb-xl-8 mb-lg-6 mb-5">{t('PERSONAL_INFO.title')}</h3>
          <form onSubmit={handleSubmit} className="ch-form-one">
            <div className="row g-6">
              {/* First Name */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="firstName" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.firstName')}
                  </label>
                  <input
                      id="firstName"
                      type="text"
                      placeholder={t('PERSONAL_INFO.placeholders.firstName')}
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </div>
              </div>
              {/* Last Name */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="lastName" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.lastName')}
                  </label>
                  <input
                      id="lastName"
                      type="text"
                      placeholder={t('PERSONAL_INFO.placeholders.lastName')}
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </div>
              </div>
              {/* Email */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="email" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.emailAddress')}
                  </label>
                  <input
                      id="email"
                      type="email"
                      placeholder={t('PERSONAL_INFO.placeholders.email')}
                      value={formData.email}
                      disabled
                  />
                </div>
              </div>
              {/* Phone */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="phone" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.phoneNumber')}
                  </label>
                  <input
                      id="phone"
                      type="tel"
                      placeholder={t('PERSONAL_INFO.placeholders.phoneNumber')}
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>
              {/* Country */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="countryId" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.country')}
                  </label>
                  <select
                    id="countryId"
                    title={t('PERSONAL_INFO.country')}
                    value={formData.countryId || ''}
                    onChange={(e) => handleCountryChange(e.target.value)}
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
                  {countryError && <span className="field-error-text">{t('REGISTER.errors.countryRequired')}</span>}
                </div>
              </div>
              {/* State Place */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="statePlace" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.statePlace')}
                  </label>
                  <input
                    id="statePlace"
                    type="text"
                    placeholder={t('PERSONAL_INFO.placeholders.statePlace')}
                    value={formData.statePlace}
                    onChange={(e) => handleChange("statePlace", e.target.value)}
                  />
                </div>
              </div>
              {/* City */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="city" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.city')}
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder={t('PERSONAL_INFO.placeholders.city')}
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
              </div>
              {/* Address */}
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="ch-form-items">
                  <label htmlFor="address" className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                    {t('PERSONAL_INFO.address')}
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder={t('PERSONAL_INFO.placeholders.address')}
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
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
              <button type="submit" className="kewta-btn kewta-alt d-inline-flex align-items-center">
                <span className="kew-text act4-bg nw1-clr act3-bg">{t('PERSONAL_INFO.updateProfile')}</span>
              </button>
            </div>
          </form>
        </div>
      </MotionFade>
  );
}
