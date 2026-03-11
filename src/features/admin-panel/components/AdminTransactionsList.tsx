'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminTransactions } from '@/features/admin-panel/hooks';
import {
  WalletTransaction,
  WalletTransactionDirection,
  WalletTransactionType,
  WalletTransactionStatus,
} from '@/interfaces/walletTransaction';
import { ArrowsLeftRight } from '@phosphor-icons/react';

const DIRECTION_MAP: Record<WalletTransactionDirection, { label: string; color: string }> = {
  [WalletTransactionDirection.Credit]: { label: 'Crédito', color: 'text-success' },
  [WalletTransactionDirection.Debit]: { label: 'Débito', color: 'text-danger' },
};

const TYPE_MAP: Record<WalletTransactionType, string> = {
  [WalletTransactionType.ReferralBonus]: 'Bono de Referido',
  [WalletTransactionType.ReferralPurchaseCommission]: 'Comisión de Compra',
  [WalletTransactionType.LotteryPrize]: 'Premio de Lotería',
  [WalletTransactionType.TicketPurchase]: 'Compra de Ticket',
  [WalletTransactionType.Withdrawal]: 'Retiro',
  [WalletTransactionType.WithdrawalRefund]: 'Reembolso de Retiro',
  [WalletTransactionType.AdminCredit]: 'Crédito Admin',
  [WalletTransactionType.AdminDebit]: 'Débito Admin',
};

const STATUS_MAP: Record<WalletTransactionStatus, { label: string; badge: string }> = {
  [WalletTransactionStatus.Pending]: { label: 'Pendiente', badge: 'badge bg-warning' },
  [WalletTransactionStatus.Completed]: { label: 'Completada', badge: 'badge bg-success' },
  [WalletTransactionStatus.Failed]: { label: 'Fallida', badge: 'badge bg-danger' },
  [WalletTransactionStatus.Reversed]: { label: 'Revertida', badge: 'badge bg-secondary' },
};

const AdminTransactionsList: React.FC = () => {
  const { t } = useTranslation();
  const { transactions, isLoading, pagination, goToPage, typeFilter, setTypeFilter } = useAdminTransactions();

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
        <label className="fw-semibold">{t('FINANCE.filter_type', 'Filtrar por tipo')}:</label>
        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={typeFilter ?? ''}
          onChange={e => setTypeFilter(e.target.value === '' ? undefined : (Number(e.target.value) as WalletTransactionType))}
        >
          <option value="">{t('FINANCE.all_types', 'Todos')}</option>
          {Object.entries(TYPE_MAP).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {transactions && transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{t('FINANCE.transaction_id', 'Transacción')}</th>
                    <th>{t('FINANCE.user', 'Usuario')}</th>
                    <th>{t('FINANCE.type', 'Tipo')}</th>
                    <th>{t('FINANCE.direction', 'Dirección')}</th>
                    <th>{t('FINANCE.amount', 'Monto')}</th>
                    <th>{t('FINANCE.balance_after', 'Saldo Después')}</th>
                    <th>{t('FINANCE.status', 'Estado')}</th>
                    <th>{t('FINANCE.description', 'Descripción')}</th>
                    <th>{t('FINANCE.date', 'Fecha')}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: WalletTransaction) => {
                    const dirInfo = DIRECTION_MAP[tx.direction] || { label: '?', color: '' };
                    const typeName = TYPE_MAP[tx.type] || String(tx.type);
                    const statusInfo = STATUS_MAP[tx.status] || {
                      label: String(tx.status),
                      badge: 'badge bg-secondary',
                    };

                    return (
                      <tr key={tx.transactionGuid}>
                        <td>
                          <code className="small">{tx.transactionGuid.substring(0, 8)}...</code>
                        </td>
                        <td>
                          <code className="small">{tx.userGuid?.substring(0, 8) || '-'}...</code>
                        </td>
                        <td>
                          <span className="small">{typeName}</span>
                        </td>
                        <td>
                          <span className={`fw-semibold ${dirInfo.color}`}>{dirInfo.label}</span>
                        </td>
                        <td>
                          <span className={`fw-bold ${dirInfo.color}`}>
                            {tx.direction === WalletTransactionDirection.Credit ? '+' : '-'}${tx.amount.toFixed(2)}
                          </span>
                        </td>
                        <td>${tx.balanceAfter.toFixed(2)}</td>
                        <td>
                          <span className={statusInfo.badge}>{statusInfo.label}</span>
                        </td>
                        <td>
                          <span className="small text-muted">{tx.description || '-'}</span>
                        </td>
                        <td>
                          <small>{new Date(tx.createdAt).toLocaleDateString()}</small>
                          <br />
                          <small className="text-muted">{new Date(tx.createdAt).toLocaleTimeString()}</small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <ArrowsLeftRight size={48} className="text-muted mb-3" />
              <h5 className="text-muted">{t('FINANCE.no_transactions', 'No hay transacciones')}</h5>
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
    </div>
  );
};

export default AdminTransactionsList;
