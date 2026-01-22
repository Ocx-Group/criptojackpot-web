'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Clock, ArrowLeft, RefreshCcw } from 'lucide-react';

interface CheckoutExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal que se muestra cuando el tiempo de reserva ha expirado
 */
const CheckoutExpiredModal: React.FC<CheckoutExpiredModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoBack = () => {
    router.push('/contest');
    onClose();
  };

  const handleTryAgain = () => {
    router.back();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
        }}
      >
        {/* Modal Content */}
        <div
          className="expired-modal n0-bg radius24 p-5 text-center position-relative overflow-hidden"
          style={{
            maxWidth: '420px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            animation: 'modalSlideIn 0.3s ease-out',
          }}
        >
          {/* Decoración de fondo */}
          <div
            className="position-absolute"
            style={{
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />

          {/* Icono */}
          <div
            className="expired-icon mx-auto mb-4 d-flex align-items-center justify-content-center"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              animation: 'pulse 2s infinite',
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
              }}
            >
              <AlertTriangle size={32} color="#ef4444" />
            </div>
          </div>

          {/* Título */}
          <h3 className="mb-2 n4-clr fw-bold">{t('CHECKOUT.expiredTitle', '¡Tiempo Expirado!')}</h3>

          {/* Mensaje */}
          <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
            {t(
              'CHECKOUT.expiredMessage',
              'El tiempo de reserva de tus números ha terminado. Los números han sido liberados y podrían ser seleccionados por otros usuarios.'
            )}
          </p>

          {/* Timer visual expirado */}
          <div
            className="expired-timer mx-auto mb-4 d-flex align-items-center justify-content-center gap-2 py-2 px-4 radius8"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'inline-flex',
            }}
          >
            <Clock size={16} color="#ef4444" />
            <span className="fw-bold" style={{ color: '#ef4444', fontSize: '18px' }}>
              0:00
            </span>
          </div>

          {/* Botones */}
          <div className="d-flex flex-column gap-3">
            <button
              onClick={handleTryAgain}
              className="btn act4-bg n0-clr fw-semibold py-3 d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: '12px' }}
            >
              <RefreshCcw size={18} />
              {t('CHECKOUT.tryAgain', 'Intentar de Nuevo')}
            </button>

            <button
              onClick={handleGoBack}
              className="btn btn-outline-secondary py-3 d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: '12px' }}
            >
              <ArrowLeft size={18} />
              {t('CHECKOUT.backToLotteries', 'Ver Otras Loterías')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutExpiredModal;
