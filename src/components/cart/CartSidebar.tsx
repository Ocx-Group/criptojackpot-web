'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { X, Trash2, Clock, ShoppingCart, CreditCard } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { CartItem } from '@/interfaces/cart';

/**
 * Componente para mostrar el timer de un item individual
 */
const CartItemTimer: React.FC<{ item: CartItem; onExpired: (itemId: string) => void }> = ({ item, onExpired }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, item.expiresAt - Date.now());
      const seconds = Math.floor(remaining / 1000);
      setTimeRemaining(seconds);

      if (seconds <= 0) {
        onExpired(item.id);
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [item.expiresAt, item.id, onExpired]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Color según tiempo restante
  const isLowTime = timeRemaining < 60;
  const isCriticalTime = timeRemaining < 30;

  const getTimerClass = (): string => {
    if (isCriticalTime) return 'text-danger';
    if (isLowTime) return 'text-warning';
    return 'text-muted';
  };

  return (
    <span
      className={`d-flex align-items-center gap-1 ${getTimerClass()}`}
      style={{ fontSize: '11px', fontWeight: 600 }}
    >
      <Clock size={12} />
      {formattedTime}
    </span>
  );
};

/**
 * Componente de item individual del carrito
 */
const CartItemCard: React.FC<{
  item: CartItem;
  onRemove: (itemId: string) => void;
  onExpired: (itemId: string) => void;
}> = ({ item, onRemove, onExpired }) => {
  const { t } = useTranslation();
  const totalQuantity = item.numbers.reduce((sum, n) => sum + n.quantity, 0);
  const itemTotal = totalQuantity * item.ticketPrice;

  return (
    <div className="cart-item p-3 mb-2 n0-bg radius8 border">
      {/* Header del item */}
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="flex-grow-1">
          <h6 className="mb-1 fw-semibold n4-clr" style={{ fontSize: '13px' }}>
            {item.lotteryName}
          </h6>
          <CartItemTimer item={item} onExpired={onExpired} />
        </div>
        <button
          className="btn btn-sm p-1 text-danger"
          onClick={() => onRemove(item.id)}
          title={t('CART.removeItem', 'Eliminar')}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Números seleccionados */}
      <div className="mb-2">
        <div className="d-flex flex-wrap gap-1">
          {item.numbers.map(({ number, quantity }) => (
            <span key={number} className="badge act4-bg n0-clr" style={{ fontSize: '10px', padding: '4px 6px' }}>
              {number.toString().padStart(2, '0')}
              {quantity > 1 && <span className="ms-1">×{quantity}</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Footer con totales */}
      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
        <span className="text-muted" style={{ fontSize: '11px' }}>
          {totalQuantity} {totalQuantity === 1 ? t('CART.ticket', 'ticket') : t('CART.tickets', 'tickets')}
        </span>
        <span className="fw-bold act4-clr" style={{ fontSize: '13px' }}>
          ${itemTotal.toFixed(2)}
        </span>
      </div>

      {/* Indicador de reserva */}
      {item.isReserved && (
        <div className="mt-2">
          <span className="badge bg-success" style={{ fontSize: '9px' }}>
            ✓ {t('CART.reserved', 'Reservado')}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Sidebar del carrito de compras
 */
const CartSidebar: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { items, isOpen, setIsOpen, removeItem, clearCart, clearExpiredItems, getTotalItems, getTotalPrice } =
    useCartStore();
  const initCheckout = useCheckoutStore(state => state.initFromCart);

  // Limpiar items expirados al montar
  useEffect(() => {
    clearExpiredItems();
  }, [clearExpiredItems]);

  // Manejar item expirado
  const handleItemExpired = (itemId: string) => {
    removeItem(itemId);
    // Aquí podríamos mostrar una notificación
    console.log('⏰ Item expirado y removido:', itemId);
  };

  // Manejar ir al checkout
  const handleGoToCheckout = () => {
    // Inicializar el store de checkout con los items del carrito
    initCheckout(items);
    // Cerrar el sidebar
    setIsOpen(false);
    // Navegar al checkout
    router.push('/checkout');
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        className="cart-overlay"
        onClick={() => setIsOpen(false)}
        onKeyDown={e => e.key === 'Escape' && setIsOpen(false)}
        aria-label="Close cart"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          border: 'none',
          cursor: 'pointer',
        }}
      />

      {/* Sidebar */}
      <div
        className="cart-sidebar n1-bg"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '380px',
          height: '100vh',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header */}
        <div className="cart-header p-4 border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <ShoppingCart size={20} className="act4-clr" />
            <h5 className="mb-0 fw-bold n4-clr">{t('CART.title', 'Carrito')}</h5>
            {totalItems > 0 && <span className="badge act4-bg n0-clr">{totalItems}</span>}
          </div>
          <button className="btn p-1" onClick={() => setIsOpen(false)}>
            <X size={20} className="n4-clr" />
          </button>
        </div>

        {/* Body - Lista de items */}
        <div className="cart-body flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
          {items.length === 0 ? (
            <div className="text-center py-5">
              <ShoppingCart size={48} className="text-muted mb-3" />
              <p className="text-muted">{t('CART.empty', 'Tu carrito está vacío')}</p>
            </div>
          ) : (
            <>
              {/* Mensaje de reserva */}
              <div className="alert alert-info py-2 mb-3" style={{ fontSize: '11px' }}>
                <Clock size={12} className="me-1" />
                {t('CART.reservationMessage', 'Los números se reservan por 5 minutos')}
              </div>

              {/* Items */}
              {items.map(item => (
                <CartItemCard key={item.id} item={item} onRemove={removeItem} onExpired={handleItemExpired} />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer p-4 border-top n0-bg">
            {/* Total */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold n4-clr">{t('CART.total', 'Total')}</span>
              <span className="fs-4 fw-bold act4-clr">${totalPrice.toFixed(2)}</span>
            </div>

            {/* Botones de acción */}
            <button
              onClick={handleGoToCheckout}
              className="btn w-100 act4-bg n0-clr fw-semibold py-2 mb-2 d-flex align-items-center justify-content-center gap-2"
            >
              <CreditCard size={18} />
              {t('CART.checkout', 'Proceder al Pago')}
            </button>

            <button className="btn w-100 btn-outline-secondary py-2" onClick={clearCart}>
              {t('CART.clearCart', 'Vaciar Carrito')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
