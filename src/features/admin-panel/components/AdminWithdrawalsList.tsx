'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminWithdrawals } from '@/features/admin-panel/hooks';
import { AdminWithdrawalRequest, WithdrawalRequestStatus } from '@/features/admin-panel/types/withdrawal';
import { ArrowsDownUp, CheckCircle, XCircle } from '@phosphor-icons/react';

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
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (requestGuid: string) => {
    if (!confirm(t('FINANCE.confirm_approve', '¿Estás seguro de aprobar esta solicitud de retiro?'))) return;
    try {
      setProcessingId(requestGuid);
      await approveWithdrawal(requestGuid);
    } catch {
      alert(t('FINANCE.error_approve', 'Error al aprobar la solicitud'));
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
      alert(t('FINANCE.error_reject', 'Error al rechazar la solicitud'));
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
                          <code className="small">{wr.requestGuid.substring(0, 8)}...</code>
                        </td>
                        <td>
                          <code className="small">{wr.userGuid.substring(0, 8)}...</code>
                        </td>
                        <td>
                          <span className="fw-bold text-danger">-${wr.amount.toFixed(2)}</span>
                        </td>
                        <td>
                          <span className="small">{wr.currencySymbol}</span>
                        </td>
                        <td>
                          <code className="small" title={wr.walletAddress}>
                            {wr.walletAddress.substring(0, 10)}...
                          </code>
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
                          {isPending ? (
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                onClick={() => handleApprove(wr.requestGuid)}
                                disabled={isProcessing || isApproving}
                                title={t('FINANCE.approve', 'Aprobar')}
                              >
                                <CheckCircle size={16} weight="bold" />
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
                            </div>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
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
