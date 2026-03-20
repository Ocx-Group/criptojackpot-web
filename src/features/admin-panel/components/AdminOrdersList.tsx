'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminOrders } from '@/features/admin-panel/hooks';
import { OrderDto } from '@/interfaces/order';
import { ShoppingCart, CaretDown, CaretUp } from '@phosphor-icons/react';
import { formatSeries } from '@/utils/formatSeries';

const ORDER_STATUS_MAP: Record<number, { label: string; badge: string }> = {
  0: { label: 'Pendiente', badge: 'badge bg-warning' },
  1: { label: 'Completada', badge: 'badge bg-success' },
  2: { label: 'Expirada', badge: 'badge bg-secondary' },
  3: { label: 'Cancelada', badge: 'badge bg-danger' },
};

const AdminOrdersList: React.FC = () => {
  const { t } = useTranslation();
  const { orders, isLoading, pagination, goToPage, statusFilter, setStatusFilter } = useAdminOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleExpand = (orderGuid: string) => {
    setExpandedOrder(prev => (prev === orderGuid ? null : orderGuid));
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
          onChange={e => setStatusFilter(e.target.value === '' ? undefined : Number(e.target.value))}
        >
          <option value="">{t('FINANCE.all_statuses', 'Todos')}</option>
          {Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {orders && orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>{t('FINANCE.order_id', 'Orden')}</th>
                    <th>{t('FINANCE.user', 'Usuario')}</th>
                    <th>{t('FINANCE.lottery', 'Lotería')}</th>
                    <th>{t('FINANCE.total', 'Total')}</th>
                    <th>{t('FINANCE.items', 'Items')}</th>
                    <th>{t('FINANCE.status', 'Estado')}</th>
                    <th>{t('FINANCE.date', 'Fecha')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: OrderDto) => {
                    const statusInfo = ORDER_STATUS_MAP[order.status] || {
                      label: String(order.status),
                      badge: 'badge bg-secondary',
                    };
                    const isExpanded = expandedOrder === order.orderGuid;

                    return (
                      <React.Fragment key={order.orderGuid}>
                        <tr
                          onClick={() => toggleExpand(order.orderGuid)}
                          style={{ cursor: 'pointer' }}
                          className={isExpanded ? 'table-active' : ''}
                        >
                          <td>
                            {isExpanded ? (
                              <CaretUp size={16} weight="bold" />
                            ) : (
                              <CaretDown size={16} weight="bold" />
                            )}
                          </td>
                          <td>
                            <code className="small">{order.orderGuid.substring(0, 8)}...</code>
                          </td>
                          <td>
                            <div className="fw-semibold">{order.userName}</div>
                            <small className="text-muted">{order.userEmail}</small>
                          </td>
                          <td>
                            <span className="small">{order.lotteryTitle || order.lotteryId.substring(0, 8)}</span>
                          </td>
                          <td>
                            <span className="fw-bold text-success">${order.totalAmount.toFixed(2)}</span>
                          </td>
                          <td>{order.totalItems}</td>
                          <td>
                            <span className={statusInfo.badge}>{statusInfo.label}</span>
                          </td>
                          <td>
                            <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                            <br />
                            <small className="text-muted">{new Date(order.createdAt).toLocaleTimeString()}</small>
                          </td>
                        </tr>
                        {isExpanded && order.items && order.items.length > 0 && (
                          <tr>
                            <td colSpan={8} className="p-0">
                              <div className="bg-light p-3">
                                <h6 className="mb-2">{t('FINANCE.order_details', 'Detalles de la Orden')}</h6>
                                <table className="table table-sm table-bordered mb-0 bg-white">
                                  <thead>
                                    <tr>
                                      <th>{t('FINANCE.number', 'Número')}</th>
                                      <th>{t('FINANCE.series', 'Serie')}</th>
                                      <th>{t('FINANCE.unit_price', 'Precio Unitario')}</th>
                                      <th>{t('FINANCE.quantity', 'Cantidad')}</th>
                                      <th>{t('FINANCE.subtotal', 'Subtotal')}</th>
                                      <th>{t('FINANCE.gift', 'Regalo')}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((detail, idx) => (
                                      <tr key={idx}>
                                        <td>{detail.number}</td>
                                        <td>{formatSeries(detail.series)}</td>
                                        <td>${detail.unitPrice.toFixed(2)}</td>
                                        <td>{detail.quantity}</td>
                                        <td>${detail.subtotal.toFixed(2)}</td>
                                        <td>
                                          {detail.isGift ? (
                                            <span className="badge bg-info">Sí</span>
                                          ) : (
                                            <span className="text-muted">No</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <ShoppingCart size={48} className="text-muted mb-3" />
              <h5 className="text-muted">{t('FINANCE.no_orders', 'No hay órdenes')}</h5>
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

export default AdminOrdersList;
