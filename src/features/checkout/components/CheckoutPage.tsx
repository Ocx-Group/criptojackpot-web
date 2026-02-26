'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useCheckoutStore, PaymentMethod } from '@/store/checkoutStore';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import {
  CheckoutTimer,
  LotteryTicketCard,
  PaymentMethodSelector,
  OrderSummary,
  CheckoutExpiredModal,
} from '@/features/checkout/components';

/**
 * Página principal de checkout
 * Muestra los tickets reservados, permite seleccionar método de pago y completar la compra
 */
const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);

  // Estado del checkout
  const {
    items,
    expiresAt,
    selectedPaymentMethod,
    totalAmount,
    isProcessing,
    status,
    setPaymentMethod,
    setProcessing,
    setStatus,
    setError,
    clearCheckout,
  } = useCheckoutStore();

  // Limpiar carrito cuando se complete el pago
  const clearCart = useCartStore(state => state.clearCart);

  // Estado local para el modal de expiración
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Verificar si hay items al montar
  useEffect(() => {
    if (items.length === 0 && status !== 'success') {
      // No hay items, redirigir
      router.push('/contest');
    }
  }, [items.length, status, router]);

  // Verificar si ya expiró al cargar
  useEffect(() => {
    if (expiresAt && Date.now() >= expiresAt && status === 'pending') {
      setShowExpiredModal(true);
      setStatus('expired');
    }
  }, [expiresAt, status, setStatus]);

  // Manejar expiración del timer
  const handleExpired = useCallback(() => {
    setShowExpiredModal(true);
    setStatus('expired');
  }, [setStatus]);

  // Cerrar modal de expiración
  const handleCloseExpiredModal = useCallback(() => {
    setShowExpiredModal(false);
    clearCheckout();
  }, [clearCheckout]);

  // Manejar selección de método de pago
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // Procesar el pago
  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      showNotification('warning', t('CHECKOUT.selectPaymentFirst', 'Selecciona un método de pago'), '');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Simular procesamiento de pago (aquí iría la llamada al backend)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Éxito
      setStatus('success');
      clearCart();

      showNotification(
        'success',
        t('CHECKOUT.paymentSuccess', '¡Pago Exitoso!'),
        t('CHECKOUT.paymentSuccessMessage', 'Tu compra ha sido procesada correctamente')
      );

      // Redirigir a mis tickets tras completar la compra
      router.push('/my-tickets');
    } catch {
      setError(t('CHECKOUT.paymentError', 'Error al procesar el pago'));
      showNotification('error', t('CHECKOUT.paymentError', 'Error al procesar el pago'), '');
    } finally {
      setProcessing(false);
    }
  };

  // Volver atrás
  const handleGoBack = () => {
    router.back();
  };

  // Si no hay items y no está en éxito, no renderizar nada
  if (items.length === 0 && status !== 'success') {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <Loader2 className="animate-spin act4-clr" size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="container py-4">
          {/* Header */}
          <div className="checkout-header mb-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', borderRadius: '12px' }}
                  disabled={isProcessing}
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="mb-0 n4-clr fw-bold">{t('CHECKOUT.title', 'Checkout')}</h2>
                  <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
                    {t('CHECKOUT.subtitle', 'Completa tu compra de manera segura')}
                  </p>
                </div>
              </div>

              {/* Timer prominente */}
              {expiresAt && status === 'pending' && (
                <div style={{ minWidth: '200px' }}>
                  <CheckoutTimer expiresAt={expiresAt} onExpired={handleExpired} />
                </div>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="row g-4">
            {/* Columna izquierda: Tickets y Método de pago */}
            <div className="col-lg-8">
              {/* Tickets de lotería */}
              <div className="checkout-tickets mb-4">
                <h5 className="mb-3 n4-clr fw-bold">{t('CHECKOUT.yourTickets', 'Tus Tickets')}</h5>
                {items.map(item => (
                  <LotteryTicketCard key={item.id} item={item} />
                ))}
              </div>

              {/* Método de pago */}
              <div className="checkout-payment n0-bg p-4 radius16" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onSelect={handlePaymentMethodSelect}
                  disabled={isProcessing || status !== 'pending'}
                />
              </div>
            </div>

            {/* Columna derecha: Resumen y botón de pago */}
            <div className="col-lg-4">
              <div className="checkout-sidebar sticky-top" style={{ top: '100px' }}>
                {/* Resumen del pedido */}
                <OrderSummary items={items} totalAmount={totalAmount} />

                {/* Botón de pago */}
                <button
                  onClick={handleConfirmPayment}
                  disabled={!selectedPaymentMethod || isProcessing || status !== 'pending'}
                  className="btn w-100 act4-bg n0-clr fw-bold py-3 mt-4 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    borderRadius: '14px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    opacity: !selectedPaymentMethod || isProcessing ? 0.7 : 1,
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {t('CHECKOUT.processing', 'Procesando...')}
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      {t('CHECKOUT.confirmPayment', 'Confirmar y Pagar')} ${totalAmount.toFixed(2)}
                    </>
                  )}
                </button>

                {/* Términos */}
                <p className="text-muted text-center mt-3" style={{ fontSize: '10px' }}>
                  {t(
                    'CHECKOUT.termsNote',
                    'Al confirmar el pago, aceptas nuestros Términos de Servicio y Política de Privacidad'
                  )}
                </p>

                {/* Logos de seguridad */}
                <div
                  className="security-badges d-flex align-items-center justify-content-center gap-3 mt-3 pt-3"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '10px' }}>
                    <ShieldCheck size={14} color="#22c55e" />
                    <span>SSL Secured</span>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '10px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>256-bit Encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de expiración */}
      <CheckoutExpiredModal isOpen={showExpiredModal} onClose={handleCloseExpiredModal} />
    </>
  );
};

export default CheckoutPage;
