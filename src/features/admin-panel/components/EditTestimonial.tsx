'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useEditTestimonialForm } from '@/features/admin-panel/hooks';
import { Star } from 'lucide-react';

interface EditTestimonialProps {
  testimonialId: string;
}

const EditTestimonial: React.FC<EditTestimonialProps> = ({ testimonialId }) => {
  const { formData, isLoading, isSubmitting, handleInputChange, handleSubmit } =
    useEditTestimonialForm(testimonialId);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="col-lg-9">
        <div className="user-panel-wrapper">
          <div className="text-center py-5">
            <div className="spinner-border text-primary">
              <span className="visually-hidden">{t('COMMON.loading', 'Cargando...')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <h3 className="n4-clr fw_700 mb-xxl-10 mb-6">{t('TESTIMONIALS_ADMIN.edit.title', 'Editar Reseña')}</h3>

        <div className="card border-0 shadow-sm mb-6">
          <div className="card-header bg-white py-4 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{t('TESTIMONIALS_ADMIN.edit.formTitle', 'Editar Reseña')}</h5>
            <Link href="/admin/testimonials" className="btn btn-outline-secondary">
              {t('COMMON.cancel', 'Cancelar')}
            </Link>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-4">
              {/* Nombre del autor */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  {t('TESTIMONIALS_ADMIN.fields.authorName', 'Nombre del Autor')} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="authorName"
                  className="form-control"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Ubicación */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  {t('TESTIMONIALS_ADMIN.fields.authorLocation', 'Ubicación')} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="authorLocation"
                  className="form-control"
                  value={formData.authorLocation}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Texto */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">
                  {t('TESTIMONIALS_ADMIN.fields.text', 'Texto de la Reseña')} <span className="text-danger">*</span>
                </label>
                <textarea
                  name="text"
                  className="form-control"
                  rows={4}
                  value={formData.text}
                  onChange={handleInputChange}
                  maxLength={500}
                  required
                />
                <div className="form-text">{formData.text.length}/500</div>
              </div>

              {/* URL de imagen */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">
                  {t('TESTIMONIALS_ADMIN.fields.authorImageUrl', 'URL de Imagen del Autor')}
                </label>
                <input
                  type="url"
                  name="authorImageUrl"
                  className="form-control"
                  value={formData.authorImageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* Rating */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  {t('TESTIMONIALS_ADMIN.fields.rating', 'Rating')} <span className="text-danger">*</span>
                </label>
                <div className="d-flex align-items-center gap-2">
                  <select
                    name="rating"
                    className="form-select"
                    value={formData.rating}
                    onChange={e =>
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: 'rating', value: e.target.value, type: 'number' },
                      } as any)
                    }
                  >
                    {[1, 2, 3, 4, 5].map(v => (
                      <option key={v} value={v}>
                        {v}/5
                      </option>
                    ))}
                  </select>
                  <div className="d-flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        size={18}
                        className={i <= formData.rating ? 'text-warning' : 'text-muted'}
                        fill={i <= formData.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Fecha */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  {t('TESTIMONIALS_ADMIN.fields.date', 'Fecha')}
                </label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              {/* Orden */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  {t('TESTIMONIALS_ADMIN.fields.sortOrder', 'Orden de aparición')}
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  className="form-control"
                  value={formData.sortOrder}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              {/* Activa */}
              <div className="col-md-12">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    {t('TESTIMONIALS_ADMIN.fields.isActive', 'Visible en el landing page')}
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div className="col-12">
                <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                  <Link href="/admin/testimonials" className="btn btn-outline-secondary px-4">
                    {t('COMMON.cancel', 'Cancelar')}
                  </Link>
                  <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        {t('COMMON.saving', 'Guardando...')}
                      </>
                    ) : (
                      t('TESTIMONIALS_ADMIN.edit.submit', 'Guardar Cambios')
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTestimonial;
