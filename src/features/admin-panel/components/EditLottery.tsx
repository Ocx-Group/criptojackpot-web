'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useEditLotteryForm } from '@/features/admin-panel/hooks/useEditLotteryForm';
import Image from 'next/image';
import { AlertTriangle, Clock, Ticket, ArrowLeft } from 'lucide-react';
import { LotteryStatus } from '@/interfaces/lottery';

interface EditLotteryProps {
  lotteryId: string;
}

const EditLottery: React.FC<EditLotteryProps> = ({ lotteryId }) => {
  const { formData, prizes, selectedPrize, isLoading, isSubmitting, error, handleInputChange, handleSubmit } =
    useEditLotteryForm(lotteryId);

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

  if (error) {
    return (
      <div className="col-lg-9">
        <div className="user-panel-wrapper">
          <div className="alert alert-danger">{t('LOTTERIES_ADMIN.edit.loadError', 'Error al cargar la lotería')}</div>
          <Link href="/admin/lotteries" className="btn btn-secondary">
            <ArrowLeft size={18} className="me-2" />
            {t('COMMON.back', 'Volver')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <h3 className="n4-clr fw_700 mb-xxl-10 mb-6">{t('LOTTERIES_ADMIN.edit.title', 'Editar Lotería')}</h3>

        <div className="card border-0 shadow-sm mb-6">
          <div className="card-header bg-white py-4 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{t('LOTTERIES_ADMIN.edit.formTitle', 'Modificar Lotería')}</h5>
            <Link href="/admin/lotteries" className="btn btn-outline-secondary">
              <ArrowLeft size={16} className="me-2" />
              {t('COMMON.back', 'Volver')}
            </Link>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-4">
              {/* Nombre de la Lotería */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.name', 'Nombre de la Lotería')} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('LOTTERIES_ADMIN.placeholders.name', 'Ej: Digital Dreamscapes')}
                  required
                />
              </div>

              {/* Descripción */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.description', 'Descripción')}
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t('LOTTERIES_ADMIN.placeholders.description', 'Descripción del sorteo')}
                />
              </div>

              {/* Precio y Total de Tickets */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.price', 'Precio por Entrada')} <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.totalTickets', 'Total de Tickets')} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="totalTickets"
                  className="form-control"
                  value={formData.totalTickets}
                  onChange={handleInputChange}
                  placeholder="1000"
                  min="1"
                  required
                />
              </div>

              {/* Premio Asociado */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.prize', 'Premio del Sorteo')}
                </label>
                <select
                  name="prizeId"
                  className="form-select"
                  value={formData.prizeId || ''}
                  onChange={handleInputChange}
                >
                  <option value="">{t('LOTTERIES_ADMIN.placeholders.selectPrize', 'Seleccione un premio')}</option>
                  {prizes?.map(prize => (
                    <option key={prize.prizeGuid} value={prize.prizeGuid}>
                      {prize.name} - ${prize.estimatedValue.toLocaleString()}
                    </option>
                  ))}
                </select>
                {!prizes || prizes.length === 0 ? (
                  <div className="form-text text-warning">
                    <AlertTriangle size={16} className="me-2" />
                    {t('LOTTERIES_ADMIN.help.noPrizes', 'No hay premios disponibles.')}{' '}
                    <Link href="/admin/prizes/create" className="text-primary">
                      {t('LOTTERIES_ADMIN.help.createPrize', 'Crear uno ahora')}
                    </Link>
                  </div>
                ) : null}
                {selectedPrize && (
                  <div className="alert alert-info mt-2 mb-0">
                    <div className="d-flex align-items-center gap-3">
                      {selectedPrize.mainImageUrl && (
                        <Image
                          src={selectedPrize.mainImageUrl}
                          alt={selectedPrize.name}
                          width={60}
                          height={60}
                          className="rounded"
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <strong>{selectedPrize.name}</strong>
                        <div className="small text-muted">{selectedPrize.description}</div>
                        <div className="small">
                          <span className="badge bg-success me-2">
                            Valor: ${selectedPrize.estimatedValue.toLocaleString()}
                          </span>
                          <span className="badge bg-info">Tier {selectedPrize.tier}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fecha y Hora del Sorteo */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.drawDate', 'Fecha del Sorteo')} <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="drawDate"
                  className="form-control"
                  value={formData.drawDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.drawTime', 'Hora del Sorteo')} <span className="text-danger">*</span>
                </label>
                <input
                  type="time"
                  name="drawTime"
                  className="form-control"
                  value={formData.drawTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Estado */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.status', 'Estado')} <span className="text-danger">*</span>
                </label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value={LotteryStatus.Draft}>{t('LOTTERIES_ADMIN.status.draft', 'Borrador')}</option>
                  <option value={LotteryStatus.Active}>{t('LOTTERIES_ADMIN.status.active', 'Activo')}</option>
                  <option value={LotteryStatus.Paused}>{t('LOTTERIES_ADMIN.status.paused', 'Pausado')}</option>
                  <option value={LotteryStatus.Completed}>{t('LOTTERIES_ADMIN.status.completed', 'Completado')}</option>
                  <option value={LotteryStatus.Cancelled}>{t('LOTTERIES_ADMIN.status.cancelled', 'Cancelado')}</option>
                </select>
                <div className="form-text">
                  {t('LOTTERIES_ADMIN.help.status', 'Las loterías activas estarán disponibles para compra inmediata')}
                </div>
              </div>

              {/* Términos */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">
                  {t('LOTTERIES_ADMIN.fields.terms', 'Términos y Condiciones')}
                </label>
                <textarea
                  name="terms"
                  className="form-control"
                  rows={3}
                  value={formData.terms}
                  onChange={handleInputChange}
                  placeholder={t('LOTTERIES_ADMIN.placeholders.terms', 'Términos y condiciones del sorteo')}
                />
              </div>

              {/* Preview de la Lotería */}
              {selectedPrize && (
                <div className="col-md-12">
                  <label className="form-label fw-semibold">
                    {t('LOTTERIES_ADMIN.fields.preview', 'Vista Previa')}
                  </label>
                  <div className="border rounded p-3 bg-light">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        {selectedPrize.mainImageUrl ? (
                          <Image
                            src={selectedPrize.mainImageUrl}
                            alt={selectedPrize.name}
                            width={368}
                            height={383}
                            className="img-fluid rounded"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="bg-secondary rounded d-flex align-items-center justify-content-center"
                            style={{ height: '200px' }}
                          >
                            <span className="text-white">{t('LOTTERIES_ADMIN.noImage', 'Sin imagen')}</span>
                          </div>
                        )}
                      </div>
                      <div className="col-md-8">
                        <div className="ticket-preview-info">
                          <div className="badge bg-warning text-dark mb-2 p-2">
                            Draw{' '}
                            {formData.drawDate &&
                              new Date(formData.drawDate).toLocaleDateString('en-US', { weekday: 'long' })}{' '}
                            {formData.drawTime}
                          </div>
                          <h4 className="mb-2">{formData.name || 'Nombre de la Lotería'}</h4>
                          <h5 className="text-danger mb-3">
                            ${formData.price || '0.00'} <small className="text-muted">PER ENTRY</small>
                          </h5>
                          <div className="d-flex gap-3 mb-2">
                            <div>
                              <Clock size={14} className="me-2" />
                              <small>Sorteo programado</small>
                            </div>
                            <div>
                              <Ticket size={14} className="me-2" />
                              <small>{formData.totalTickets || 0} Total</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="col-12">
                <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                  <Link href="/admin/lotteries" className="btn btn-outline-secondary px-4">
                    {t('COMMON.cancel', 'Cancelar')}
                  </Link>
                  <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        {t('COMMON.saving', 'Guardando...')}
                      </>
                    ) : (
                      t('LOTTERIES_ADMIN.edit.submit', 'Guardar Cambios')
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

export default EditLottery;
