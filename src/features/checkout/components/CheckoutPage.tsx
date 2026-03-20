'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useCheckoutStore, PaymentMethod } from '@/store/checkoutStore';
import { useNotificationStore } from '@/store/notificationStore';
import { orderService } from '@/services';
import { CheckoutTimer, LotteryTicketCard, PaymentMethodSelector, OrderSummary } from '@/features/checkout/components';

/**
 * Pagina principal de checkout
 * Muestra los tickets reservados, permite seleccionar metodo de pago y completar la compra.
 * El timer de 5 min es puramente visual (urgencia). La expiracion real
 * de la orden (30 min) la maneja el backend con Quartz scheduler.
 */
const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);

  // Estado del checkout
  const {
    items,
    displayExpiresAt,
    selectedPaymentMethod,
    totalAmount,
    isProcessing,
    status,
    orderId,
    setPaymentMethod,
    setProcessing,
    setError,
    setStatus,
    clearCheckout,
  } = useCheckoutStore();

  // Timer de urgencia: cuando llega a 0 solo se oculta, no expira nada
  const [showTimer, setShowTimer] = useState(true);

  // Verificar si hay items al montar
  useEffect(() => {
    if (items.length === 0 && status !== 'success' && status !== 'processing') {
      router.push('/');
    }
  }, [items.length, status, router]);

  // Si el timer de urgencia ya paso (ej. reload de pagina despues de 5 min), no mostrarlo
  useEffect(() => {
    if (displayExpiresAt && Date.now() >= displayExpiresAt) {
      setShowTimer(false);
    }
  }, [displayExpiresAt]);

  // Cuando el timer de urgencia llega a 0, redirigir a personal-info
  const handleTimerEnd = useCallback(() => {
    setShowTimer(false);
    globalThis.location.href = 'https://criptojackpot.com/personal-info';
  }, []);

  // Manejar seleccion de metodo de pago
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // Pago con saldo interno: debit balance → complete order → redirect
  const handleBalancePayment = async (existingOrderId: string) => {
    await orderService.payOrderWithBalance(existingOrderId);

    setStatus('success');
    clearCheckout();

    showNotification(
      'success',
      t('CHECKOUT.balancePaymentSuccess', '¡Pago exitoso!'),
      t('CHECKOUT.balancePaymentSuccessDesc', 'Tu compra ha sido completada con saldo interno.')
    );

    router.push('/personal-info');
  };

  // Pago con crypto: abrir CoinPayments en nueva pestaña
  const handleCryptoPayment = async (existingOrderId: string) => {
    const payResponse = await orderService.payOrder(existingOrderId);

    if (!payResponse?.checkoutUrl) {
      throw new Error(t('CHECKOUT.noCheckoutUrl', 'No se recibió la URL de pago. Intenta nuevamente.'));
    }

    const link = document.createElement('a');
    link.href = payResponse.checkoutUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();

    showNotification(
      'info',
      t('CHECKOUT.paymentWindowOpened', 'Página de pago abierta'),
      t('CHECKOUT.paymentWindowOpenedDesc', 'Completa el pago en la nueva pestaña y vuelve aquí cuando termine.')
    );
  };

  // Procesar el pago segun el metodo seleccionado
  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      showNotification('warning', t('CHECKOUT.selectPaymentFirst', 'Selecciona un método de pago'), '');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const existingOrderId = orderId || items.find(item => item.orderId)?.orderId;

      if (!existingOrderId) {
        throw new Error(
          t('CHECKOUT.noOrderFound', 'No se encontró la orden. Intenta agregar los números al carrito nuevamente.')
        );
      }

      if (selectedPaymentMethod === 'balance') {
        await handleBalancePayment(existingOrderId);
      } else {
        await handleCryptoPayment(existingOrderId);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('CHECKOUT.paymentError', 'Error al procesar el pago');
      setError(message);
      showNotification('error', t('CHECKOUT.paymentError', 'Error al procesar el pago'), message);
    } finally {
      setProcessing(false);
    }
  };

  // Volver atras
  const handleGoBack = () => {
    router.back();
  };

  // Si no hay items y no esta en exito/procesando, no renderizar nada
  if (items.length === 0 && status !== 'success' && status !== 'processing') {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <Loader2 className="animate-spin act4-clr" size={40} />
      </div>
    );
  }

  return (
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

            {/* Timer de urgencia (5 min, puramente visual) */}
            {displayExpiresAt && status === 'pending' && showTimer && (
              <div style={{ minWidth: '200px' }}>
                <CheckoutTimer expiresAt={displayExpiresAt} onExpired={handleTimerEnd} />
              </div>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="row g-4">
          {/* Columna izquierda: Tickets y Metodo de pago */}
          <div className="col-lg-8">
            {/* Tickets de loteria */}
            <div className="checkout-tickets mb-4">
              <h5 className="mb-3 n4-clr fw-bold">{t('CHECKOUT.yourTickets', 'Tus Tickets')}</h5>
              {items.map(item => (
                <LotteryTicketCard key={item.id} item={item} />
              ))}
            </div>

            {/* Metodo de pago */}
            <div className="checkout-payment n0-bg p-4 radius16" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onSelect={handlePaymentMethodSelect}
                disabled={isProcessing || status !== 'pending'}
                totalAmount={totalAmount}
              />
            </div>
          </div>

          {/* Columna derecha: Resumen y boton de pago */}
          <div className="col-lg-4">
            <div className="checkout-sidebar sticky-top" style={{ top: '100px' }}>
              {/* Resumen del pedido */}
              <OrderSummary items={items} totalAmount={totalAmount} />

              {/* Boton de pago */}
              <button
                onClick={handleConfirmPayment}
                disabled={!selectedPaymentMethod || isProcessing || status !== 'pending'}
                className="checkout-confirm-btn btn w-100 act4-bg n0-clr fw-bold py-3 mt-4 d-flex align-items-center justify-content-center gap-2"
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

              {/* Terminos */}
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
  );
};

export default CheckoutPage;
