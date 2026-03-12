'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminWithdrawals } from '@/features/admin-panel/hooks';
import { AdminWithdrawalRequest, WithdrawalRequestStatus } from '@/features/admin-panel/types/withdrawal';
import { ArrowsDownUp, CheckCircle, XCircle, Eye, Copy } from '@phosphor-icons/react';
import { toast } from 'react-toastify';

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  Pending: { label: 'Pendiente', badge: 'badge bg-warning' },
  Approved: { label: 'Aprobado', badge: 'badge bg-success' },
  Rejected: { label: 'Rechazado', badge: 'badge bg-danger' },
  Completed: { label: 'Completado', badge: 'badge bg-info' },
  Cancelled: { label: 'Cancelado', badge: 'badge bg-secondary' },
};

const STATUS_FILTER_OPTIONS: { value: WithdrawalRequestStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: WithdrawalRequestStatus.Pending, label: 'Pendiente' },
  { value: WithdrawalRequestStatus.Approved, label: 'Aprobado' },
  { value: WithdrawalRequestStatus.Rejected, label: 'Rechazado' },
  { value: WithdrawalRequestStatus.Completed, label: 'Completado' },
  { value: WithdrawalRequestStatus.Cancelled, label: 'Cancelado' },
];

const AdminWithdrawalsList: React.FC = () => {
  const { t } = useTranslation();
  const {
    withdrawals,
    isLoading,
    pagination,
    goToPage,
    statusFilter,
    setStatusFilter,
    approveWithdrawal,
    rejectWithdrawal,
    isApproving,
    isRejecting,
  } = useAdminWithdrawals();

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [detailRequest, setDetailRequest] = useState<AdminWithdrawalRequest | null>(null);

  const handleApproveClick = (requestGuid: string) => {
    setApprovingId(requestGuid);
  };

  const handleApproveConfirm = async () => {
    if (!approvingId) return;
    try {
      setProcessingId(approvingId);
      await approveWithdrawal(approvingId);
      setApprovingId(null);
    } catch {
      // Error handled by mutation onError
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId) return;
    try {
      setProcessingId(rejectingId);
      await rejectWithdrawal({ requestGuid: rejectingId, adminNotes: rejectNotes || undefined });
      setRejectingId(null);
      setRejectNotes('');
    } catch {
      // Error handled by mutation onError
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.info('Copiado al portapapeles');
    });
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
      {/* Filters */}
      <div className="d-flex gap-3 mb-4 flex-wrap align-items-center">
        <label className="fw-semibold">{t('FINANCE.filter_status', 'Filtrar por estado')}:</label>
        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={statusFilter ?? ''}
          onChange={e =>
            setStatusFilter(
              e.target.value === '' ? undefined : (Number(e.target.value) as WithdrawalRequestStatus)
            )
          }
        >
          {STATUS_FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {withdrawals && withdrawals.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{t('FINANCE.request_id', 'Solicitud')}</th>
                    <th>{t('FINANCE.user', 'Usuario')}</th>
                    <th>{t('FINANCE.amount', 'Monto')}</th>
                    <th>{t('FINANCE.currency', 'Moneda')}</th>
                    <th>{t('FINANCE.wallet_address', 'Dirección Wallet')}</th>
                    <th>{t('FINANCE.status', 'Estado')}</th>
                    <th>{t('FINANCE.date', 'Fecha')}</th>
                    <th>{t('FINANCE.actions', 'Acciones')}</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((wr: AdminWithdrawalRequest) => {
                    const statusInfo = STATUS_MAP[wr.status] || {
                      label: wr.status,
                      badge: 'badge bg-secondary',
                    };
                    const isPending = wr.status === 'Pending';
                    const isProcessing = processingId === wr.requestGuid;

                    return (
                      <tr key={wr.requestGuid}>
                        <td>
                          <code
                            className="small"
                            role="button"
                            title={wr.requestGuid}
                            onClick={() => copyToClipboard(wr.requestGuid)}
                          >
                            {wr.requestGuid.substring(0, 8)}...
                          </code>
                        </td>
                        <td>
                          <code
                            className="small"
                            role="button"
                            title={wr.userGuid}
                            onClick={() => copyToClipboard(wr.userGuid)}
                          >
                            {wr.userGuid.substring(0, 8)}...
                          </code>
                        </td>
                        <td>
                          <span className="fw-bold text-danger">-${wr.amount.toFixed(2)}</span>
                        </td>
                        <td>
                          <span className="small">{wr.currencySymbol}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <code className="small" title={wr.walletAddress}>
                              {wr.walletAddress.substring(0, 10)}...
                            </code>
                            <Copy
                              size={14}
                              className="text-muted"
                              role="button"
                              onClick={() => copyToClipboard(wr.walletAddress)}
                            />
                          </div>
                        </td>
                        <td>
                          <span className={statusInfo.badge}>{statusInfo.label}</span>
                          {wr.adminNotes && (
                            <div className="small text-muted mt-1" title={wr.adminNotes}>
                              {wr.adminNotes.length > 30 ? `${wr.adminNotes.substring(0, 30)}...` : wr.adminNotes}
                            </div>
                          )}
                        </td>
                        <td>
                          <small>{new Date(wr.createdAt).toLocaleDateString()}</small>
                          <br />
                          <small className="text-muted">{new Date(wr.createdAt).toLocaleTimeString()}</small>
                          {wr.processedAt && (
                            <>
                              <br />
                              <small className="text-muted">
                                Procesado: {new Date(wr.processedAt).toLocaleDateString()}
                              </small>
                            </>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                              onClick={() => setDetailRequest(wr)}
                              title={t('FINANCE.view_details', 'Ver detalles')}
                            >
                              <Eye size={16} weight="bold" />
                            </button>
                            {isPending && (
                              <>
                                <button
                                  className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                  onClick={() => handleApproveClick(wr.requestGuid)}
                                  disabled={isProcessing || isApproving}
                                  title={t('FINANCE.approve', 'Aprobar')}
                                >
                                  {isProcessing && approvingId === wr.requestGuid ? (
                                    <span className="spinner-border spinner-border-sm" />
                                  ) : (
                                    <CheckCircle size={16} weight="bold" />
                                  )}
                                  {t('FINANCE.approve', 'Aprobar')}
                                </button>
                                <button
                                  className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                                  onClick={() => {
                                    setRejectingId(wr.requestGuid);
                                    setRejectNotes('');
                                  }}
                                  disabled={isProcessing || isRejecting}
                                  title={t('FINANCE.reject', 'Rechazar')}
                                >
                                  <XCircle size={16} weight="bold" />
                                  {t('FINANCE.reject', 'Rechazar')}
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
              <ArrowsDownUp size={48} className="text-muted mb-3" />
              <h5 className="text-muted">{t('FINANCE.no_withdrawals', 'No hay solicitudes de retiro')}</h5>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="card-footer bg-white py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div className="text-muted">
                {t('COMMON.showing', 'Mostrando')}{' '}
                <strong>{(pagination.pageNumber - 1) * pagination.pageSize + 1}</strong> -{' '}
                <strong>{Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}</strong>{' '}
                {t('COMMON.of', 'de')} <strong>{pagination.totalCount}</strong> {t('COMMON.results', 'resultados')}
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

      {/* Detail Modal */}
      {detailRequest && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('FINANCE.withdrawal_details', 'Detalle de Solicitud de Retiro')}</h5>
                <button type="button" className="btn-close" onClick={() => setDetailRequest(null)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small mb-0">ID Solicitud</label>
                    <div className="d-flex align-items-center gap-1">
                      <code className="small">{detailRequest.requestGuid}</code>
                      <Copy
                        size={14}
                        className="text-muted"
                        role="button"
                        onClick={() => copyToClipboard(detailRequest.requestGuid)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small mb-0">ID Usuario</label>
                    <div className="d-flex align-items-center gap-1">
                      <code className="small">{detailRequest.userGuid}</code>
                      <Copy
                        size={14}
                        className="text-muted"
                        role="button"
                        onClick={() => copyToClipboard(detailRequest.userGuid)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small mb-0">Monto</label>
                    <div className="fw-bold text-danger fs-5">-${detailRequest.amount.toFixed(2)}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small mb-0">Moneda</label>
                    <div>{detailRequest.currencyName} ({detailRequest.currencySymbol})</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted small mb-0">Dirección Wallet</label>
                    <div className="d-flex align-items-center gap-1">
                      <code className="small text-break">{detailRequest.walletAddress}</code>
                      <Copy
                        size={14}
                        className="text-muted flex-shrink-0"
                        role="button"
                        onClick={() => copyToClipboard(detailRequest.walletAddress)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small mb-0">Estado</label>
                    <div>
                      <span className={STATUS_MAP[detailRequest.status]?.badge || 'badge bg-secondary'}>
                        {STATUS_MAP[detailRequest.status]?.label || detailRequest.status}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small mb-0">Fecha de Creación</label>
                    <div>{new Date(detailRequest.createdAt).toLocaleString()}</div>
                  </div>
                  {detailRequest.processedAt && (
                    <div className="col-md-6">
                      <label className="form-label text-muted small mb-0">Fecha de Procesamiento</label>
                      <div>{new Date(detailRequest.processedAt).toLocaleString()}</div>
                    </div>
                  )}
                  {detailRequest.adminNotes && (
                    <div className="col-12">
                      <label className="form-label text-muted small mb-0">Notas del Admin</label>
                      <div className="bg-light p-2 rounded small">{detailRequest.adminNotes}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDetailRequest(null)}>
                  {t('COMMON.close', 'Cerrar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approvingId && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('FINANCE.approve_withdrawal', 'Aprobar Solicitud de Retiro')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setApprovingId(null)}
                  disabled={!!processingId}
                />
              </div>
              <div className="modal-body">
                <div className="alert alert-warning mb-3">
                  <strong>{t('FINANCE.attention', '¡Atención!')}</strong>{' '}
                  {t(
                    'FINANCE.approve_warning',
                    'Al aprobar esta solicitud, se enviará el pago automáticamente vía CoinPayments. Esta acción no se puede deshacer.'
                  )}
                </div>
                <p>
                  {t(
                    'FINANCE.confirm_approve_message',
                    '¿Estás seguro de que deseas aprobar esta solicitud de retiro?'
                  )}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setApprovingId(null)}
                  disabled={!!processingId}
                >
                  {t('COMMON.cancel', 'Cancelar')}
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleApproveConfirm}
                  disabled={!!processingId}
                >
                  {processingId ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : (
                    <CheckCircle size={16} weight="bold" className="me-1" />
                  )}
                  {t('FINANCE.confirm_approve', 'Confirmar Aprobación')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('FINANCE.reject_withdrawal', 'Rechazar Solicitud de Retiro')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRejectingId(null)}
                  disabled={!!processingId}
                />
              </div>
              <div className="modal-body">
                <label className="form-label fw-semibold">
                  {t('FINANCE.rejection_reason', 'Motivo de rechazo (opcional)')}:
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={rejectNotes}
                  onChange={e => setRejectNotes(e.target.value)}
                  placeholder={t('FINANCE.rejection_placeholder', 'Ingresa el motivo del rechazo...')}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setRejectingId(null)}
                  disabled={!!processingId}
                >
                  {t('COMMON.cancel', 'Cancelar')}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleRejectConfirm}
                  disabled={!!processingId}
                >
                  {processingId ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : (
                    <XCircle size={16} weight="bold" className="me-1" />
                  )}
                  {t('FINANCE.confirm_reject', 'Confirmar Rechazo')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawalsList;
