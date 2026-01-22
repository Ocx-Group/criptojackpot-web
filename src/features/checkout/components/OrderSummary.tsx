'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Ticket, Percent } from 'lucide-react';
import { CheckoutItem } from '@/store/checkoutStore';

interface OrderSummaryProps {
  items: CheckoutItem[];
  totalAmount: number;
}

/**
 * Resumen de la orden para el checkout
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalAmount }) => {
  const { t } = useTranslation();

  const totalTickets = items.reduce((total, item) => {
    return total + item.numbers.reduce((sum, n) => sum + n.quantity, 0);
  }, 0);

  const totalNumbers = items.reduce((total, item) => {
    return total + item.numbers.length;
  }, 0);

  // Posibles descuentos o cargos adicionales (para futuro)
  const discount = 0;
  const processingFee = 0;
  const finalTotal = totalAmount - discount + processingFee;

  return (
    <div className="order-summary n0-bg p-4 radius16" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
      <h5 className="mb-4 n4-clr fw-bold d-flex align-items-center gap-2">
        <ShoppingBag size={20} className="act4-clr" />
        {t('CHECKOUT.orderSummary', 'Resumen del Pedido')}
      </h5>

      {/* Lista de loterías */}
      <div className="order-items mb-4">
        {items.map(item => {
          const itemQuantity = item.numbers.reduce((sum, n) => sum + n.quantity, 0);
          const itemTotal = itemQuantity * item.ticketPrice;

          return (
            <div
              key={item.id}
              className="order-item d-flex justify-content-between align-items-start py-3"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
            >
              <div className="flex-grow-1">
                <h6 className="mb-1 n4-clr fw-semibold" style={{ fontSize: '13px' }}>
                  {item.lotteryName}
                </h6>
                <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '11px' }}>
                  <Ticket size={12} />
                  <span>
                    {itemQuantity} {itemQuantity === 1 ? 'ticket' : 'tickets'} × ${item.ticketPrice.toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 d-flex flex-wrap gap-1">
                  {item.numbers.map(({ number, quantity }) => (
                    <span key={number} className="badge n1-bg n4-clr" style={{ fontSize: '9px', padding: '3px 6px' }}>
                      #{number.toString().padStart(2, '0')}
                      {quantity > 1 && ` ×${quantity}`}
                    </span>
                  ))}
                </div>
              </div>
              <span className="fw-semibold n4-clr" style={{ fontSize: '14px' }}>
                ${itemTotal.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Estadísticas */}
      <div className="order-stats p-3 radius8 mb-4" style={{ backgroundColor: 'rgba(var(--act4-rgb), 0.05)' }}>
        <div className="row g-3">
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <div
                className="stat-icon act4-bg d-flex align-items-center justify-content-center radius8"
                style={{ width: '32px', height: '32px' }}
              >
                <Ticket size={16} className="n0-clr" />
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '10px' }}>
                  {t('CHECKOUT.totalTickets', 'Total Tickets')}
                </div>
                <div className="n4-clr fw-bold" style={{ fontSize: '16px' }}>
                  {totalTickets}
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <div
                className="stat-icon act4-bg d-flex align-items-center justify-content-center radius8"
                style={{ width: '32px', height: '32px' }}
              >
                <span className="n0-clr fw-bold" style={{ fontSize: '12px' }}>
                  #
                </span>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '10px' }}>
                  {t('CHECKOUT.numbersSelected', 'Números')}
                </div>
                <div className="n4-clr fw-bold" style={{ fontSize: '16px' }}>
                  {totalNumbers}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de precios */}
      <div className="price-breakdown">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted" style={{ fontSize: '13px' }}>
            {t('CHECKOUT.subtotal', 'Subtotal')}
          </span>
          <span className="n4-clr fw-medium">${totalAmount.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="d-flex align-items-center gap-1" style={{ fontSize: '13px', color: '#22c55e' }}>
              <Percent size={12} />
              {t('CHECKOUT.discount', 'Descuento')}
            </span>
            <span style={{ color: '#22c55e' }}>-${discount.toFixed(2)}</span>
          </div>
        )}

        {processingFee > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted" style={{ fontSize: '13px' }}>
              {t('CHECKOUT.processingFee', 'Comisión')}
            </span>
            <span className="n4-clr">${processingFee.toFixed(2)}</span>
          </div>
        )}

        {/* Total final */}
        <div
          className="d-flex justify-content-between align-items-center pt-3 mt-3"
          style={{ borderTop: '2px solid rgba(0,0,0,0.1)' }}
        >
          <span className="n4-clr fw-bold" style={{ fontSize: '16px' }}>
            {t('CHECKOUT.total', 'Total a Pagar')}
          </span>
          <span className="act4-clr fw-bold" style={{ fontSize: '24px' }}>
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Nota */}
      <p className="text-muted mt-3 mb-0 text-center" style={{ fontSize: '10px' }}>
        {t('CHECKOUT.taxIncluded', 'Los precios incluyen todos los impuestos aplicables')}
      </p>
    </div>
  );
};

export default OrderSummary;
