'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useCreateUserForm } from '@/features/admin-panel/hooks/useCreateUserForm';

const CreateUser: React.FC = () => {
  const {
    countries,
    isLoadingCountries,
    formData,
    selectedCountry,
    roles,
    isSubmitting,
    handleInputChange,
    handleCountryChange,
    handleSubmit,
  } = useCreateUserForm();
  const { t } = useTranslation();

  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <h3 className="nw1-clr fw_700 mb-xxl-10 mb-6">{t('USERS_ADMIN.create.title', 'Crear usuario')}</h3>

        <div className="card border-0 shadow-sm mb-6">
          <div className="card-header bg-white py-4 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{t('USERS_ADMIN.create.formTitle', 'Nuevo usuario')}</h5>
            <Link href="/admin/users" className="btn btn-outline-secondary">
              {t('COMMON.cancel', 'Cancelar')}
            </Link>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              {/* Nombre y Apellido */}
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.columns.name', 'Nombre')}</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('USERS_ADMIN.placeholders.name', 'Nombre')}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.columns.lastName', 'Apellido')}</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={t('USERS_ADMIN.placeholders.lastName', 'Apellido')}
                />
              </div>

              {/* Email y Password */}
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.columns.email', 'Correo')}</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@dominio.com"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.create.password', 'Contraseña')}</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('USERS_ADMIN.placeholders.password', 'Mínimo 6 caracteres')}
                />
              </div>

              {/* Identificación y Teléfono */}
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.create.identification', 'Identificación')}</label>
                <input
                  type="text"
                  name="identification"
                  className="form-control"
                  value={formData.identification}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.columns.phone', 'Teléfono')}</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              {/* País y Estado */}
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.columns.country', 'País')}</label>
                <select
                  className="form-select"
                  value={selectedCountry?.id ?? ''}
                  onChange={handleCountryChange}
                  disabled={isLoadingCountries}
                >
                  <option value="">
                    {isLoadingCountries
                      ? t('COMMON.loading', 'Cargando...')
                      : t('USERS_ADMIN.create.selectCountry', 'Seleccione un país')}
                  </option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.create.state', 'Estado/Provincia')}</label>
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              {/* Ciudad y Dirección */}
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.columns.city', 'Ciudad')}</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.create.address', 'Dirección')}</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              {/* Rol y Estado */}
              <div className="col-md-6">
                <label className="form-label">{t('USERS_ADMIN.columns.role', 'Rol')}</label>
                <select
                  name="roleId"
                  className="form-select"
                  value={formData.roleId}
                  onChange={handleInputChange}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 d-flex align-items-end">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="statusCheck"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="statusCheck">
                    {formData.status
                      ? t('USERS_ADMIN.status.active', 'Activo')
                      : t('USERS_ADMIN.status.inactive', 'Inactivo')}
                  </label>
                </div>
              </div>

              {/* Acciones */}
              <div className="col-12 d-flex gap-2 justify-content-end mt-3">
                <Link href="/admin/users" className="btn btn-outline-secondary">
                  {t('COMMON.cancel', 'Cancelar')}
                </Link>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? t('COMMON.saving', 'Guardando...') : t('COMMON.save', 'Guardar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
