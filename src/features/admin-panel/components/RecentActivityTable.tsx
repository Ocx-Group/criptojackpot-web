'use client';

import React from 'react';
import { AuditLogItem } from '@/services/dashboardService';

interface RecentActivityTableProps {
  activities?: AuditLogItem[];
  isLoading: boolean;
}

const EVENT_TYPE_MAP: Record<string, { action: string; statusColor: string; status: string }> = {
  UserLogin: { action: 'Inició sesión', statusColor: 'primary', status: 'Activo' },
  UserLogout: { action: 'Cerró sesión', statusColor: 'secondary', status: 'Inactivo' },
  UserRegistration: { action: 'Se registró', statusColor: 'success', status: 'Registrado' },
  UserProfileUpdated: { action: 'Actualizó perfil', statusColor: 'info', status: 'Actualizado' },
  OrderCreated: { action: 'Creó orden', statusColor: 'warning', status: 'Procesando' },
  OrderCompleted: { action: 'Compró', statusColor: 'success', status: 'Completado' },
  OrderCancelled: { action: 'Canceló', statusColor: 'danger', status: 'Cancelado' },
  OrderExpired: { action: 'Orden expirada', statusColor: 'danger', status: 'Expirado' },
  WalletCreated: { action: 'Creó wallet', statusColor: 'info', status: 'Creado' },
  WalletDeposit: { action: 'Depositó', statusColor: 'success', status: 'Completado' },
  WalletWithdraw: { action: 'Retiró', statusColor: 'warning', status: 'Procesando' },
};

const DEFAULT_EVENT = { action: 'Acción', statusColor: 'secondary', status: 'Info' };

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Justo ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  return date.toLocaleDateString('es-CO');
}

function getResourceLabel(item: AuditLogItem): string {
  if (item.resourceType && item.resourceId) {
    const type = item.resourceType.charAt(0).toUpperCase() + item.resourceType.slice(1);
    const shortId = item.resourceId.length > 8 ? item.resourceId.substring(0, 8) : item.resourceId;
    return `${type} #${shortId}`;
  }
  if (item.description) return item.description;
  return '-';
}

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <tr key={i}>
          {[1, 2, 3, 4, 5].map(j => (
            <td key={j}>
              <span className="placeholder-glow">
                <span className="placeholder col-8"></span>
              </span>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ activities, isLoading }) => {
  return (
    <div className="card border-0 shadow-sm mb-6">
      <div className="card-header bg-white py-4">
        <h5 className="mb-0">Actividad Reciente</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Recurso</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton />}
              {!isLoading && (!activities || activities.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay actividad reciente
                  </td>
                </tr>
              )}
              {!isLoading &&
                activities?.map(item => {
                  const mapped = EVENT_TYPE_MAP[item.eventType] || DEFAULT_EVENT;
                  return (
                    <tr key={item.id}>
                      <td>{item.username || 'Sistema'}</td>
                      <td>{item.action || mapped.action}</td>
                      <td>{getResourceLabel(item)}</td>
                      <td>{formatRelativeTime(item.timestamp)}</td>
                      <td>
                        <span
                          className={`badge bg-${mapped.statusColor}-subtle text-${mapped.statusColor}`}
                        >
                          {mapped.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityTable;
