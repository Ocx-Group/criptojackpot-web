'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Receipt, Copy, Warning } from '@phosphor-icons/react';
import { useAdminSinpePayments } from '@/features/admin-panel/hooks';
import { SinpePaymentAdmin, SinpePaymentStatus } from '@/interfaces/sinpe';
import { copyTextToClipboard } from '@/utils/clipboard';

const STATUS_MAP: Record<SinpePaymentStatus, { label: string; badge: string }> = {
  [SinpePaymentStatus.PendingReview]: { label: 'Pendiente', badge: 'badge bg-warning' },
  [SinpePaymentStatus.Approved]: { label: 'Aprobado', badge: 'badge bg-success' },
  [SinpePaymentStatus.Rejected]: { label: 'Rechazado', badge: 'badge bg-danger' },
};

const STATUS_FILTER_OPTIONS: { value: SinpePaymentStatus | ''; label: string }[] = [
  { value: SinpePaymentStatus.PendingReview, label: 'Pendiente' },
  { value: '', label: 'Todos' },
  { value: SinpePaymentStatus.Approved, label: 'Aprobado' },
  { value: SinpePaymentStatus.Rejected, label: 'Rechazado' },
];

/** Umbral para avisar que un comprobante lleva demasiado tiempo bloqueando números. */
const STALE_HOURS = 24;

const formatCrc = (value: number) =>
  `₡${value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const hoursSince = (isoDate: string) => (Date.now() - new Date(isoDate).getTime()) / 3_600_000;

/**
 * Bandeja de comprobantes SINPE Móvil.
 *
 * Mientras un comprobante está pendiente la orden queda en PendingReview y sus números
 * siguen reservados SIN expiración. Aprobar los acredita; rechazar los libera.
 */
const AdminSinpePaymentsList: React.FC = () => {
  const { t } = useTranslation();
  const {
    payments,
    isLoading,
    pagination,
    goToPage,
    statusFilter,
    setStatusFilter,
    approvePayment,
    rejectPayment,
    isApproving,
    isRejecting,
  } = useAdminSinpePayments();

  const [receiptPreview, setReceiptPreview] = useState<SinpePaymentAdmin | null>(null);
  const [approving, setApproving] = useState<SinpePaymentAdmin | null>(null);
  const [rejecting, setRejecting] = useState<SinpePaymentAdmin | null>(null);
  const [notes, setNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await copyTextToClipboard(text);
      toast.info('Copiado al portapapeles');
    } catch {
      toast.error('No se pudo copiar al portapapeles');
    }
  };

  const handleApproveConfirm = async () => {
    if (!approving) return;
    try {
      setProcessingId(approving.sinpePaymentGuid);
      await approvePayment({
        sinpePaymentGuid: approving.sinpePaymentGuid,
        adminNotes: notes.trim() || undefined,
      });
      setApproving(null);
      setNotes('');
    } catch {
      // El error lo reporta el onError de la mutación
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejecting || !notes.trim()) return;
    try {
      setProcessingId(rejecting.sinpePaymentGuid);
      await rejectPayment({ sinpePaymentGuid: rejecting.sinpePaymentGuid, adminNotes: notes.trim() });
      setRejecting(null);
      setNotes('');
    } catch {
      // El error lo reporta el onError de la mutación
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">{t('COMMON.loading', 'Cargando...')}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros */}
      <div className="d-flex gap-3 mb-4 flex-wrap align-items-center">
        <label className="form-label fw-semibold mb-0" htmlFor="sinpe-status-filter">
          {t('SINPE_ADMIN.filter_status', 'Filtrar por estado')}:
        </label>
        <select
          id="sinpe-status-filter"
          className="form-select"
          style={{ width: 'auto' }}
          value={statusFilter ?? ''}
          onChange={e =>
            setStatusFilter(e.target.value === '' ? undefined : (Number(e.target.value) as SinpePaymentStatus))
          }
        >
          {STATUS_FILTER_OPTIONS.map(opt => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {payments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>{t('SINPE_ADMIN.receipt', 'Comprobante')}</th>
                    <th>{t('SINPE_ADMIN.user', 'Usuario')}</th>
                    <th>{t('SINPE_ADMIN.amount', 'Monto')}</th>
                    <th>{t('SINPE_ADMIN.numbers', 'Números')}</th>
                    <th>{t('SINPE_ADMIN.reference', 'Referencia')}</th>
                    <th>{t('SINPE_ADMIN.status', 'Estado')}</th>
                    <th>{t('SINPE_ADMIN.submitted', 'Enviado')}</th>
                    <th>{t('SINPE_ADMIN.actions', 'Acciones')}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment: SinpePaymentAdmin) => {
                    const statusInfo = STATUS_MAP[payment.status] ?? {
                      label: String(payment.status),
                      badge: 'badge bg-secondary',
                    };
                    const isPending = payment.status === SinpePaymentStatus.PendingReview;
                    const isStale = isPending && hoursSince(payment.submittedAt) > STALE_HOURS;
                    const isProcessing = processingId === payment.sinpePaymentGuid;

                    return (
                      <tr key={payment.sinpePaymentGuid} className={isStale ? 'table-danger' : undefined}>
                        <td>
                          {payment.receiptUrl ? (
                            <button
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => setReceiptPreview(payment)}
                              title={t('SINPE_ADMIN.view_receipt', 'Ver comprobante')}
                            >
                              {/* Imagen prefirmada de corta duración: next/image no la cachea bien */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={payment.receiptUrl}
                                alt={t('SINPE_ADMIN.receipt', 'Comprobante')}
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(0,0,0,0.1)',
                                }}
                              />
                            </button>
                          ) : (
                            <span className="text-muted small">
                              {t('SINPE_ADMIN.no_receipt', 'No disponible')}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="small fw-semibold">{payment.userName}</div>
                          <div className="small text-muted">{payment.userEmail}</div>
                          {payment.senderPhone && (
                            <div className="small text-muted">
                              {t('SINPE_ADMIN.from', 'Desde')}: {payment.senderPhone}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="fw-bold">{formatCrc(payment.amountCrc)}</div>
                          <div className="small text-muted">
                            ${payment.amountUsd.toFixed(2)} · TC ₡{payment.exchangeRate}
                          </div>
                        </td>
                        <td>
                          <div className="small">{payment.lotteryTitle}</div>
                          <div className="small text-muted">
                            {payment.numbers
                              .map(n => `${n.displayNumber ?? n.number}-S${n.series}`)
                              .join(', ')}
                          </div>
                        </td>
                        <td>
                          {payment.referenceNumber ? (
                            <code
                              className="small"
                              role="button"
                              title={payment.referenceNumber}
                              onClick={() => copyToClipboard(payment.referenceNumber!)}
                            >
                              {payment.referenceNumber}
                            </code>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                        <td>
                          <span className={statusInfo.badge}>{statusInfo.label}</span>
                          {isStale && (
                            <div
                              className="small text-danger mt-1 d-flex align-items-center gap-1"
                              title={t(
                                'SINPE_ADMIN.stale_hint',
                                'Los números siguen bloqueados mientras no se revise'
                              )}
                            >
                              <Warning size={14} weight="bold" />
                              {t('SINPE_ADMIN.stale', 'Sin revisar +24h')}
                            </div>
                          )}
                          {payment.adminNotes && (
                            <div className="small text-muted mt-1" title={payment.adminNotes}>
                              {payment.adminNotes.length > 30
                                ? `${payment.adminNotes.substring(0, 30)}...`
                                : payment.adminNotes}
                            </div>
                          )}
                        </td>
                        <td>
                          <small>{new Date(payment.submittedAt).toLocaleDateString()}</small>
                          <br />
                          <small className="text-muted">
                            {new Date(payment.submittedAt).toLocaleTimeString()}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                              onClick={() => copyToClipboard(payment.orderGuid)}
                              title={t('SINPE_ADMIN.copy_order', 'Copiar ID de orden')}
                            >
                              <Copy size={16} weight="bold" />
                            </button>
                            {isPending && (
                              <>
                                <button
                                  className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                  onClick={() => {
                                    setApproving(payment);
                                    setNotes('');
                                  }}
                                  disabled={isProcessing || isApproving}
                                  title={t('SINPE_ADMIN.approve', 'Aprobar')}
                                >
                                  {isProcessing ? (
                                    <span className="spinner-border spinner-border-sm" />
                                  ) : (
                                    <CheckCircle size={16} weight="bold" />
                                  )}
                                  {t('SINPE_ADMIN.approve', 'Aprobar')}
                                </button>
                                <button
                                  className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                                  onClick={() => {
                                    setRejecting(payment);
                                    setNotes('');
                                  }}
                                  disabled={isProcessing || isRejecting}
                                  title={t('SINPE_ADMIN.reject', 'Rechazar')}
                                >
                                  <XCircle size={16} weight="bold" />
                                  {t('SINPE_ADMIN.reject', 'Rechazar')}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <Receipt size={48} className="text-muted mb-3" />
              <h5 className="text-muted">{t('SINPE_ADMIN.empty', 'No hay comprobantes SINPE')}</h5>
            </div>
          )}
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="card-footer bg-white py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div className="text-muted">
                {t('COMMON.showing', 'Mostrando')}{' '}
                <strong>{(pagination.pageNumber - 1) * pagination.pageSize + 1}</strong> -{' '}
                <strong>
                  {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}
                </strong>{' '}
                {t('COMMON.of', 'de')} <strong>{pagination.totalCount}</strong>{' '}
                {t('COMMON.results', 'resultados')}
              </div>
              <div className="btn-group" aria-label="Paginación">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => goToPage(pagination.pageNumber - 1)}
                  disabled={pagination.pageNumber === 1}
                >
                  ←
                </button>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let page: number;
                  if (pagination.totalPages <= 5) {
                    page = i + 1;
                  } else if (pagination.pageNumber <= 3) {
                    page = i + 1;
                  } else if (pagination.pageNumber >= pagination.totalPages - 2) {
                    page = pagination.totalPages - 4 + i;
                  } else {
                    page = pagination.pageNumber - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`btn ${pagination.pageNumber === page ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => goToPage(pagination.pageNumber + 1)}
                  disabled={pagination.pageNumber === pagination.totalPages}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comprobante a tamaño completo */}
      {receiptPreview?.receiptUrl && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {t('SINPE_ADMIN.receipt_of', 'Comprobante de')} {receiptPreview.userName} ·{' '}
                  {formatCrc(receiptPreview.amountCrc)}
                </h5>
                <button type="button" className="btn-close" onClick={() => setReceiptPreview(null)} />
              </div>
              <div className="modal-body text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={receiptPreview.receiptUrl}
                  alt={t('SINPE_ADMIN.receipt', 'Comprobante')}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>
              <div className="modal-footer">
                <a
                  className="btn btn-outline-secondary"
                  href={receiptPreview.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('SINPE_ADMIN.open_new_tab', 'Abrir en pestaña nueva')}
                </a>
                <button className="btn btn-secondary" onClick={() => setReceiptPreview(null)}>
                  {t('COMMON.close', 'Cerrar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar aprobación */}
      {approving && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('SINPE_ADMIN.approve_title', 'Aprobar comprobante')}</h5>
                <button type="button" className="btn-close" onClick={() => setApproving(null)} />
              </div>
              <div className="modal-body">
                <p>
                  {t(
                    'SINPE_ADMIN.approve_confirm',
                    'Confirma que recibiste la transferencia. Se completará la orden y se acreditarán los números al usuario.'
                  )}
                </p>
                <div className="bg-light p-3 rounded small mb-3">
                  <div>
                    <strong>{approving.userName}</strong> · {approving.userEmail}
                  </div>
                  <div>
                    {formatCrc(approving.amountCrc)} (${approving.amountUsd.toFixed(2)})
                  </div>
                  <div className="text-muted">
                    {approving.numbers.map(n => `${n.displayNumber ?? n.number}-S${n.series}`).join(', ')}
                  </div>
                </div>
                <label className="form-label small" htmlFor="sinpe-approve-notes">
                  {t('SINPE_ADMIN.notes_optional', 'Notas (opcional)')}
                </label>
                <textarea
                  id="sinpe-approve-notes"
                  className="form-control"
                  rows={2}
                  maxLength={1000}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setApproving(null)}>
                  {t('COMMON.cancel', 'Cancelar')}
                </button>
                <button className="btn btn-success" onClick={handleApproveConfirm} disabled={isApproving}>
                  {isApproving && <span className="spinner-border spinner-border-sm me-2" />}
                  {t('SINPE_ADMIN.approve', 'Aprobar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar rechazo */}
      {rejecting && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('SINPE_ADMIN.reject_title', 'Rechazar comprobante')}</h5>
                <button type="button" className="btn-close" onClick={() => setRejecting(null)} />
              </div>
              <div className="modal-body">
                <div className="alert alert-warning small">
                  {t(
                    'SINPE_ADMIN.reject_warning',
                    'Al rechazar, la orden se expira y sus números vuelven a quedar disponibles para otros usuarios. Se le enviará un correo al comprador con el motivo que escribas aquí. Esta acción no se puede deshacer.'
                  )}
                </div>
                <label className="form-label small" htmlFor="sinpe-reject-notes">
                  {t('SINPE_ADMIN.reject_reason', 'Motivo del rechazo')} *
                </label>
                <textarea
                  id="sinpe-reject-notes"
                  className="form-control"
                  rows={3}
                  maxLength={1000}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={t('SINPE_ADMIN.reject_placeholder', 'Ej: el monto no coincide con la orden')}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setRejecting(null)}>
                  {t('COMMON.cancel', 'Cancelar')}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleRejectConfirm}
                  disabled={isRejecting || !notes.trim()}
                >
                  {isRejecting && <span className="spinner-border spinner-border-sm me-2" />}
                  {t('SINPE_ADMIN.reject', 'Rechazar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSinpePaymentsList;
