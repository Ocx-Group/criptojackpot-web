import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lottery } from '@/interfaces/lottery';

interface TicketCardProps {
  ticket: Lottery;
  onAddToCart?: (ticketId: string) => void;
  onBookmark?: (ticketId: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onAddToCart, onBookmark }) => {
  const remainingTickets = ticket.maxTickets - ticket.soldTickets;
  const percentageSold = ticket.maxTickets > 0 ? Math.round((ticket.soldTickets / ticket.maxTickets) * 100) : 0;

  // Calcular días restantes
  const calculateDaysRemaining = () => {
    const now = new Date();
    const endDate = new Date(ticket.endDate);
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(days, 0);
  };

  // Formatear la fecha del sorteo
  const formatDrawDate = () => {
    const endDate = new Date(ticket.endDate);
    const dayName = endDate.toLocaleDateString('en-US', { weekday: 'long' });
    const time = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `Draw ${dayName} ${time}`;
  };

  const daysRemaining = calculateDaysRemaining();

  // Formatear texto de días restantes
  const formatDaysRemaining = () => {
    if (daysRemaining < 1) return 'Hoy';
    return `${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'}`;
  };

  return (
    <div className="ticket-card">
      <div className="card border-0 shadow-sm h-100">
        {/* Banner superior con fecha del sorteo */}
        <div className="card-header bg-warning text-dark p-2">
          <strong>{formatDrawDate()}</strong>
        </div>

        {/* Imagen del ticket */}
        <div className="position-relative">
          <Image
            src="/images/placeholder.jpg"
            alt={ticket.title}
            width={368}
            height={383}
            className="card-img-top"
            style={{ objectFit: 'cover', aspectRatio: '368/383' }}
          />

          {/* Botones de acción flotantes */}
          <div className="position-absolute top-0 end-0 p-3 d-flex flex-column gap-2">
            {onBookmark && (
              <button
                onClick={() => onBookmark(ticket.lotteryGuid)}
                className="btn btn-warning rounded-circle p-2"
                style={{ width: '48px', height: '48px' }}
                aria-label="Marcar favorito"
              >
                <i className="far fa-bookmark"></i>
              </button>
            )}
            {onAddToCart && (
              <button
                onClick={() => onAddToCart(ticket.lotteryGuid)}
                className="btn btn-warning rounded-circle p-2"
                style={{ width: '48px', height: '48px' }}
                aria-label="Agregar al carrito"
              >
                <i className="fas fa-shopping-cart"></i>
              </button>
            )}
          </div>
        </div>

        {/* Información del ticket */}
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3">{ticket.title}</h5>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <div className="d-flex align-items-center">
                <i className="far fa-clock me-2"></i>
                <span className="small">{formatDaysRemaining()}</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="far fa-clock me-2"></i>
                <span className="small">{formatDaysRemaining()}</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-ticket-alt me-2"></i>
                <span className="small">{remainingTickets} Remaining</span>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted">{percentageSold}% Sold</small>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                style={{
                  width: `${percentageSold}%`,
                  backgroundColor: percentageSold > 70 ? '#dc3545' : '#0d6efd',
                }}
                aria-label={`${percentageSold}% vendido`}
              />
            </div>
          </div>

          {/* Botón de acción principal */}
          <Link href={`/tickets/${ticket.lotteryGuid}`} className="btn btn-primary w-100 mt-3">
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};
