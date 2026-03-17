'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, CalendarBlank, Ticket, CurrencyDollar } from '@phosphor-icons/react';
import { winnerService } from '@/services';
import { Winner, WinnerStatus } from '@/interfaces/winner';

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  [WinnerStatus.Announced]: { label: 'Anunciado', badge: 'badge bg-info' },
  [WinnerStatus.Claimed]: { label: 'Reclamado', badge: 'badge bg-warning' },
  [WinnerStatus.Delivered]: { label: 'Entregado', badge: 'badge bg-success' },
};

const AdminWinnersList: React.FC = () => {
  const {
    data: winners = [],
    isLoading,
  } = useQuery<Winner[]>({
    queryKey: ['admin-winners'],
    queryFn: () => winnerService.getAllWinners(),
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-0">
        {winners.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Usuario</th>
                  <th>Lotería</th>
                  <th>Boleto</th>
                  <th>Premio</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner: Winner) => {
                  const statusInfo = STATUS_MAP[winner.status] || {
                    label: winner.status,
                    badge: 'badge bg-secondary',
                  };

                  return (
                    <tr key={winner.winnerGuid}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: 36,
                              height: 36,
                              background: 'linear-gradient(135deg, #f7931a 0%, #ffb347 100%)',
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#1a1a2e',
                            }}
                          >
                            {winner.userName
                              ? winner.userName
                                  .split(' ')
                                  .map(w => w[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)
                              : '?'}
                          </div>
                          <div>
                            <div className="fw-semibold">{winner.userName || 'N/A'}</div>
                            <small className="text-muted">{winner.userEmail}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="small">{winner.lotteryTitle}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <Ticket size={14} className="text-muted" />
                          <span>#{winner.number}</span>
                        </div>
                        <small className="text-muted">Serie: {winner.series}</small>
                      </td>
                      <td>
                        <span className="fw-semibold">{winner.prizeName || '—'}</span>
                      </td>
                      <td>
                        {winner.prizeEstimatedValue ? (
                          <span className="d-flex align-items-center gap-1 fw-bold text-success">
                            <CurrencyDollar size={14} />
                            {winner.prizeEstimatedValue.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className={statusInfo.badge}>{statusInfo.label}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <CalendarBlank size={14} className="text-muted" />
                          <small>{new Date(winner.wonAt).toLocaleDateString()}</small>
                        </div>
                        <small className="text-muted">
                          {new Date(winner.wonAt).toLocaleTimeString()}
                        </small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <Trophy size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No hay ganadores registrados</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWinnersList;
