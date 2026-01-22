'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Ticket, Gift, Trophy } from 'lucide-react';
import { CheckoutItem } from '@/store/checkoutStore';

interface LotteryTicketCardProps {
  item: CheckoutItem;
}

/**
 * Representación visual de un ticket de lotería en el checkout
 * Diseño inspirado en un ticket real con efecto de papel
 */
const LotteryTicketCard: React.FC<LotteryTicketCardProps> = ({ item }) => {
  const { t } = useTranslation();
  const totalQuantity = item.numbers.reduce((sum, n) => sum + n.quantity, 0);
  const itemTotal = totalQuantity * item.ticketPrice;

  return (
    <div className="lottery-ticket-card mb-4">
      {/* Ticket Container con efecto de bordes dentados */}
      <div
        className="ticket-container n0-bg position-relative overflow-hidden"
        style={{
          borderRadius: '16px',
          border: '2px dashed rgba(var(--act4-rgb), 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header del ticket */}
        <div
          className="ticket-header act4-bg p-4 position-relative"
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 100% calc(100% - 12px), 95% 100%, 90% calc(100% - 12px), 85% 100%, 80% calc(100% - 12px), 75% 100%, 70% calc(100% - 12px), 65% 100%, 60% calc(100% - 12px), 55% 100%, 50% calc(100% - 12px), 45% 100%, 40% calc(100% - 12px), 35% 100%, 30% calc(100% - 12px), 25% 100%, 20% calc(100% - 12px), 15% 100%, 10% calc(100% - 12px), 5% 100%, 0 calc(100% - 12px))',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            {item.lotteryImage ? (
              <Image
                src={item.lotteryImage}
                alt={item.lotteryName}
                width={60}
                height={60}
                className="rounded-circle"
                style={{ objectFit: 'cover', border: '3px solid white' }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center n0-bg rounded-circle"
                style={{ width: '60px', height: '60px' }}
              >
                <Trophy size={28} className="act4-clr" />
              </div>
            )}
            <div>
              <h4 className="mb-1 n0-clr fw-bold">{item.lotteryName}</h4>
              <div className="d-flex align-items-center gap-2 n0-clr" style={{ opacity: 0.9, fontSize: '12px' }}>
                <Ticket size={14} />
                <span>{t('CHECKOUT.lotteryTicket', 'Ticket de Lotería')}</span>
              </div>
            </div>
          </div>

          {/* Decoración */}
          <div
            className="position-absolute"
            style={{
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              opacity: 0.15,
            }}
          >
            <Gift size={80} className="n0-clr" />
          </div>
        </div>

        {/* Cuerpo del ticket */}
        <div className="ticket-body p-4">
          {/* Números seleccionados */}
          <div className="mb-4">
            <h6 className="text-muted mb-3 d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
              <span className="text-uppercase fw-semibold">
                {t('CHECKOUT.selectedNumbers', 'Números Seleccionados')}
              </span>
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {item.numbers.map(({ number, quantity }) => (
                <div
                  key={number}
                  className="number-badge position-relative"
                  style={{
                    background: 'linear-gradient(135deg, var(--act4) 0%, #8b5cf6 100%)',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    minWidth: '70px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(var(--act4-rgb), 0.3)',
                  }}
                >
                  <span className="n0-clr fw-bold" style={{ fontSize: '24px' }}>
                    {number.toString().padStart(2, '0')}
                  </span>
                  {quantity > 1 && (
                    <span
                      className="position-absolute badge bg-warning text-dark"
                      style={{
                        top: '-8px',
                        right: '-8px',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      ×{quantity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Línea divisoria con efecto */}
          <div
            className="ticket-divider my-4 position-relative"
            style={{
              height: '2px',
              background:
                'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)',
            }}
          >
            {/* Círculos decorativos a los lados */}
            <div
              className="position-absolute n1-bg"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                left: '-12px',
                top: '-11px',
                boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.1)',
              }}
            />
            <div
              className="position-absolute n1-bg"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                right: '-12px',
                top: '-11px',
                boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.1)',
              }}
            />
          </div>

          {/* Resumen */}
          <div className="ticket-summary">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted" style={{ fontSize: '13px' }}>
                {t('CHECKOUT.ticketQuantity', 'Cantidad de Tickets')}
              </span>
              <span className="fw-semibold n4-clr">
                {totalQuantity} {totalQuantity === 1 ? 'ticket' : 'tickets'}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted" style={{ fontSize: '13px' }}>
                {t('CHECKOUT.pricePerTicket', 'Precio por Ticket')}
              </span>
              <span className="fw-semibold n4-clr">${item.ticketPrice.toFixed(2)}</span>
            </div>
            <div
              className="d-flex justify-content-between align-items-center pt-3 mt-2"
              style={{ borderTop: '2px solid rgba(0,0,0,0.05)' }}
            >
              <span className="fw-bold n4-clr" style={{ fontSize: '15px' }}>
                {t('CHECKOUT.subtotal', 'Subtotal')}
              </span>
              <span className="fw-bold act4-clr" style={{ fontSize: '20px' }}>
                ${itemTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer con código de barras decorativo */}
        <div className="ticket-footer px-4 pb-4">
          <div
            className="barcode-placeholder py-2 px-3 radius8 text-center"
            style={{
              background: 'rgba(0,0,0,0.03)',
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '2px',
              color: '#999',
            }}
          >
            {item.id.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryTicketCard;
