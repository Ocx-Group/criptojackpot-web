'use client';

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useCreateTestimonialForm } from '@/features/admin-panel/hooks';
import { Star, Upload, X } from 'lucide-react';
import Image from 'next/image';

const CreateTestimonial: React.FC = () => {
  const { formData, isSubmitting, handleInputChange, handleAuthorImageUpload, handleAuthorImageUrlChange, handleSubmit } =
    useCreateTestimonialForm();
  const { t } = useTranslation();

  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setImageUploading(true);

    try {
      await handleAuthorImageUpload(file);
    } catch {
      setImagePreview(null);
    } finally {
      setImageUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    handleAuthorImageUrlChange('');
  };

  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <h3 className="n4-clr fw_700 mb-xxl-10 mb-6">{t('TESTIMONIALS_ADMIN.create.title', 'Crear Reseña')}</h3>

        <div className="card border-0 shadow-sm mb-6">
          <div className="card-header bg-white py-4 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{t('TESTIMONIALS_ADMIN.create.formTitle', 'Nueva Reseña')}</h5>
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
                  placeholder={t('TESTIMONIALS_ADMIN.placeholders.authorName', 'Ej: Juan Pérez')}
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
                  placeholder={t('TESTIMONIALS_ADMIN.placeholders.authorLocation', 'Ej: United States')}
                  required
                />
              </div>

              {/* Texto de la reseña */}
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
                  placeholder={t('TESTIMONIALS_ADMIN.placeholders.text', 'Escribe el testimonio del usuario...')}
                  maxLength={500}
                  required
                />
                <div className="form-text">{formData.text.length}/500</div>
              </div>

              {/* Imagen del autor - Upload */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">
                  {t('TESTIMONIALS_ADMIN.fields.authorImageUrl', 'Imagen del Autor')}
                </label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="d-none"
                  onChange={handleImageFileChange}
                />
                {!formData.authorImageUrl && !imageUploading ? (
                  <div
                    className="border border-2 border-secondary rounded p-4 text-center bg-light"
                    style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload size={32} className="text-secondary mb-2" />
                    <p className="text-muted mb-1">
                      {t('TESTIMONIALS_ADMIN.upload.clickToUpload', 'Haz clic para subir una foto del autor')}
                    </p>
                    <small className="text-muted">JPG, PNG, GIF, WebP — máximo 10MB (opcional)</small>
                  </div>
                ) : imageUploading ? (
                  <div className="border rounded p-4 text-center bg-light">
                    <div className="spinner-border text-primary mb-2" aria-hidden="true"></div>
                    <p className="text-muted mb-0">
                      {t('TESTIMONIALS_ADMIN.upload.uploading', 'Subiendo imagen...')}
                    </p>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-3 p-3 border rounded bg-light">
                    <Image
                      src={formData.authorImageUrl || imagePreview || ''}
                      alt="Author"
                      width={64}
                      height={64}
                      className="rounded-circle"
                      style={{ objectFit: 'cover', width: 64, height: 64 }}
                      onError={e => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="flex-grow-1">
                      <p className="mb-0 text-muted small">{t('TESTIMONIALS_ADMIN.upload.imageUploaded', 'Imagen subida exitosamente')}</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        {t('TESTIMONIALS_ADMIN.upload.changeImage', 'Cambiar')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleRemoveImage}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
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
                <div className="form-text">
                  {t('TESTIMONIALS_ADMIN.help.sortOrder', 'Menor número = aparece primero')}
                </div>
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

              {/* Botones de acción */}
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
                      t('TESTIMONIALS_ADMIN.create.submit', 'Crear Reseña')
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

export default CreateTestimonial;
