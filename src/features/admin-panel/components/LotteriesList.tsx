'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useLotteries } from '@/features/admin-panel/hooks';
import { Lottery, LotteryStatus } from '@/interfaces/lottery';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Ticket as TicketIcon, Calendar, Clock, Grid3X3, Trophy } from 'lucide-react';
import NumberBoardModal from './NumberBoardModal';
import DetermineWinnerModal from './DetermineWinnerModal';

const LotteriesList: React.FC = () => {
  const { t } = useTranslation();
  const { lotteries, isLoading, deleteLottery, isDeleting, pagination, goToPage } = useLotteries();
  const [lotteryToDelete, setLotteryToDelete] = useState<Lottery | null>(null);
  const [boardLottery, setBoardLottery] = useState<Lottery | null>(null);
  const [winnerLottery, setWinnerLottery] = useState<Lottery | null>(null);

  const handleDelete = async () => {
    if (!lotteryToDelete) return;
    deleteLottery(lotteryToDelete.lotteryGuid);
    setLotteryToDelete(null);
  };

  const getStatusBadge = (status: LotteryStatus) => {
    const badges: Record<LotteryStatus, string> = {
      [LotteryStatus.Draft]: 'badge bg-secondary',
      [LotteryStatus.Active]: 'badge bg-success',
      [LotteryStatus.Paused]: 'badge bg-warning',
      [LotteryStatus.Completed]: 'badge bg-primary',
      [LotteryStatus.Cancelled]: 'badge bg-danger',
    };
    return badges[status] || 'badge bg-secondary';
  };

  const getStatusText = (status: LotteryStatus) => {
    const texts: Record<LotteryStatus, string> = {
      [LotteryStatus.Draft]: t('LOTTERIES_ADMIN.status.draft', 'Borrador'),
      [LotteryStatus.Active]: t('LOTTERIES_ADMIN.status.active', 'Activo'),
      [LotteryStatus.Paused]: t('LOTTERIES_ADMIN.status.paused', 'Pausado'),
      [LotteryStatus.Completed]: t('LOTTERIES_ADMIN.status.completed', 'Completado'),
      [LotteryStatus.Cancelled]: t('LOTTERIES_ADMIN.status.cancelled', 'Cancelado'),
    };
    return texts[status] || String(status);
  };

  // Obtener la imagen del primer premio o placeholder
  const getPrizeImage = (lottery: Lottery): string => {
    if (lottery.prizes && lottery.prizes.length > 0 && lottery.prizes[0].mainImageUrl) {
      return lottery.prizes[0].mainImageUrl;
    }
    return '/images/placeholder.jpg';
  };

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
        <div className="d-flex justify-content-between align-items-center mb-xxl-10 mb-6">
          <h3 className="n4-clr fw_700 mb-0">{t('LOTTERIES_ADMIN.title', 'Gestión de Loterías')}</h3>
          <Link href="/admin/lotteries/create" className="btn btn-primary">
            <Plus size={18} className="me-2" />
            {t('LOTTERIES_ADMIN.create.button', 'Crear Lotería')}
          </Link>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">{t('LOTTERIES_ADMIN.list.title', 'Lista de Loterías')}</h5>
          </div>
          <div className="card-body p-0">
            {lotteries && lotteries.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '100px' }}>{t('LOTTERIES_ADMIN.columns.image', 'Imagen')}</th>
                      <th>{t('LOTTERIES_ADMIN.columns.name', 'Nombre')}</th>
                      <th>{t('LOTTERIES_ADMIN.columns.prize', 'Premio')}</th>
                      <th>{t('LOTTERIES_ADMIN.columns.price', 'Precio')}</th>
                      <th>{t('LOTTERIES_ADMIN.columns.drawDate', 'Sorteo')}</th>
                      <th>{t('LOTTERIES_ADMIN.columns.tickets', 'Tickets')}</th>
                      <th>{t('LOTTERIES_ADMIN.columns.sold', 'Vendidos')}</th>
                      <th>{t('LOTTERIES_ADMIN.columns.status', 'Estado')}</th>
                      <th style={{ width: '150px' }}>{t('LOTTERIES_ADMIN.columns.actions', 'Acciones')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotteries.map((lottery: Lottery) => {
                      const percentageSold =
                        lottery.maxTickets > 0 ? Math.round((lottery.soldTickets / lottery.maxTickets) * 100) : 0;
                      const mainPrize = lottery.prizes?.[0];

                      return (
                        <tr key={lottery.lotteryGuid}>
                          <td>
                            <Image
                              src={getPrizeImage(lottery)}
                              alt={lottery.title}
                              width={80}
                              height={80}
                              className="rounded"
                              style={{ objectFit: 'cover' }}
                            />
                          </td>
                          <td>
                            <div className="fw-semibold">{lottery.title}</div>
                            <small className="text-muted">{lottery.description?.substring(0, 50)}...</small>
                          </td>
                          <td>
                            {mainPrize ? (
                              <div>
                                <div className="fw-semibold text-primary">{mainPrize.name}</div>
                                <small className="text-muted">${mainPrize.cashAlternative?.toLocaleString()}</small>
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <span className="fw-bold text-success">${lottery.ticketPrice.toFixed(2)}</span>
                            <br />
                            <small className="text-muted">por entrada</small>
                          </td>
                          <td>
                            <div>
                              <Calendar size={14} className="me-1" />
                              {new Date(lottery.endDate).toLocaleDateString()}
                            </div>
                            <small className="text-muted">
                              <Clock size={12} className="me-1" />
                              {new Date(lottery.endDate).toLocaleTimeString()}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">{lottery.maxTickets}</span>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              <div>
                                <span className="fw-semibold">{lottery.soldTickets}</span>
                                <small className="text-muted"> / {lottery.maxTickets}</small>
                              </div>
                              <div className="progress" style={{ height: '8px' }}>
                                <div
                                  className="progress-bar"
                                  style={{ width: `${percentageSold}%` }}
                                  aria-label={`${percentageSold}% vendido`}
                                />
                              </div>
                              <small className="text-muted">{percentageSold}%</small>
                            </div>
                          </td>
                          <td>
                            <span className={getStatusBadge(lottery.status)}>{getStatusText(lottery.status)}</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-warning"
                                onClick={() => setWinnerLottery(lottery)}
                                title={t('LOTTERIES_ADMIN.actions.determineWinner', 'Determinar Ganador')}
                              >
                                <Trophy size={14} />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-warning"
                                onClick={() => setBoardLottery(lottery)}
                                title={t('LOTTERIES_ADMIN.actions.numberBoard', 'Panel de Números')}
                              >
                                <Grid3X3 size={14} />
                              </button>
                              <Link
                                href={`/admin/lotteries/${lottery.lotteryGuid}/edit`}
                                className="btn btn-outline-primary"
                                title={t('COMMON.edit', 'Editar')}
                              >
                                <Pencil size={14} />
                              </Link>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => setLotteryToDelete(lottery)}
                                disabled={isDeleting}
                                title={t('COMMON.delete', 'Eliminar')}
                              >
                                <Trash2 size={14} />
                              </button>
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
                <TicketIcon size={48} className="text-muted mb-3" />
                <h5 className="text-muted">{t('LOTTERIES_ADMIN.empty', 'No hay loterías creadas')}</h5>
                <p className="text-muted mb-4">
                  {t('LOTTERIES_ADMIN.emptyMessage', 'Comienza creando tu primera lotería')}
                </p>
                <Link href="/admin/lotteries/create" className="btn btn-primary">
                  <Plus size={18} className="me-2" />
                  {t('LOTTERIES_ADMIN.create.button', 'Crear Lotería')}
                </Link>
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
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`btn ${pagination.pageNumber === page ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      {page}
                    </button>
                  ))}
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

      {/* Modal de confirmación de eliminación */}
      {lotteryToDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('LOTTERIES_ADMIN.delete.title', 'Eliminar Lotería')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setLotteryToDelete(null)}
                  disabled={isDeleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  {t('LOTTERIES_ADMIN.delete.confirm', '¿Estás seguro de que deseas eliminar la lotería')}{' '}
                  <strong>{lotteryToDelete.title}</strong>?
                </p>
                <p className="text-muted small">
                  {t(
                    'LOTTERIES_ADMIN.delete.warning',
                    'Esta acción no se puede deshacer. Se eliminarán todos los tickets asociados.'
                  )}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setLotteryToDelete(null)}
                  disabled={isDeleting}
                >
                  {t('COMMON.cancel', 'Cancelar')}
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {t('COMMON.deleting', 'Eliminando...')}
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="me-2" />
                      {t('COMMON.delete', 'Eliminar')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal del panel de números */}
      {boardLottery && (
        <NumberBoardModal
          lotteryId={boardLottery.lotteryGuid}
          lotteryTitle={boardLottery.title}
          onClose={() => setBoardLottery(null)}
        />
      )}
      {/* Modal de determinar ganador */}
      {winnerLottery && (
        <DetermineWinnerModal
          lottery={winnerLottery}
          onClose={() => setWinnerLottery(null)}
        />
      )}
    </div>
  );
};

export default LotteriesList;
