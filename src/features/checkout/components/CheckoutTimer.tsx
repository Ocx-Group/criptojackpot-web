'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CheckoutTimerProps {
  expiresAt: number;
  onExpired: () => void;
}

/**
 * Timer prominente para el checkout
 * Muestra el tiempo restante para completar el pago
 */
const CheckoutTimer: React.FC<CheckoutTimerProps> = ({ expiresAt, onExpired }) => {
  const { t } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, expiresAt - Date.now());
      const seconds = Math.floor(remaining / 1000);
      setTimeRemaining(seconds);

      if (seconds <= 0) {
        onExpired();
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt, onExpired]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Estados de urgencia
  const isLowTime = timeRemaining < 120; // Menos de 2 minutos
  const isCriticalTime = timeRemaining < 60; // Menos de 1 minuto
  const isVeryLowTime = timeRemaining < 30; // Menos de 30 segundos

  const getTimerClass = (): string => {
    if (isVeryLowTime) return 'checkout-timer--critical animate-pulse';
    if (isCriticalTime) return 'checkout-timer--warning';
    if (isLowTime) return 'checkout-timer--low';
    return 'checkout-timer--normal';
  };

  const getBackgroundClass = (): string => {
    if (isVeryLowTime) return 'bg-danger';
    if (isCriticalTime) return 'bg-warning';
    return 'act4-bg';
  };

  return (
    <div className={`checkout-timer ${getTimerClass()}`}>
      <div className={`d-flex align-items-center justify-content-center gap-2 p-3 radius12 ${getBackgroundClass()}`}>
        {isCriticalTime ? <AlertTriangle size={24} className="n0-clr" /> : <Clock size={24} className="n0-clr" />}
        <div className="text-center">
          <div className="n0-clr fw-bold" style={{ fontSize: '28px', lineHeight: 1 }}>
            {formattedTime}
          </div>
          <div className="n0-clr" style={{ fontSize: '11px', opacity: 0.9 }}>
            {isCriticalTime
              ? t('CHECKOUT.timerUrgent', '¡Completa tu compra ahora!')
              : t('CHECKOUT.timerMessage', 'Tiempo restante para completar')}
          </div>
        </div>
      </div>

      {/* Progress bar visual */}
      <div
        className="timer-progress mt-2"
        style={{
          height: '4px',
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          className={getBackgroundClass()}
          style={{
            height: '100%',
            width: `${Math.min(100, (timeRemaining / 300) * 100)}%`,
            transition: 'width 1s linear',
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
};

export default CheckoutTimer;
