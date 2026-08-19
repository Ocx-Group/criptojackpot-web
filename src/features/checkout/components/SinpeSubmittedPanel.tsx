'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Clock, ShieldCheck } from 'lucide-react';
import { SinpePayment } from '@/interfaces/sinpe';

interface SinpeSubmittedPanelProps {
  payment: SinpePayment;
}

/**
 * Confirmación tras enviar el comprobante SINPE.
 * A partir de aquí la orden está congelada en PendingReview: sus números siguen
 * reservados sin expirar hasta que un admin apruebe o rechace.
 */
const SinpeSubmittedPanel: React.FC<SinpeSubmittedPanelProps> = ({ payment }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="bg2-color p-4 p-md-5 radius16 text-center" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div
              className="d-inline-flex align-items-center justify-content-center radius-circle mb-4"
              style={{ width: '72px', height: '72px', backgroundColor: 'rgba(255, 193, 7, 0.15)' }}
            >
              <Clock size={34} style={{ color: '#FFC107' }} />
            </div>

            <h3 className="nw1-clr fw-bold mb-2">
              {t('SINPE.submittedTitle', 'Comprobante enviado')}
            </h3>

            <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
              {t(
                'SINPE.submittedDesc',
                'Recibimos tu comprobante y lo estamos revisando. Tus números quedan reservados hasta que un administrador confirme el pago.'
              )}
            </p>

            <div className="p-3 radius12 text-start mb-4" style={{ backgroundColor: 'var(--bg1)' }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  {t('SINPE.amountLabel', 'Monto a transferir')}
                </span>
                <span className="n4-clr fw-semibold" style={{ fontSize: '13px' }}>
                  ₡{payment.amountCrc.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className="text-muted fw-normal">(${payment.amountUsd.toFixed(2)})</span>
                </span>
              </div>
              {payment.referenceNumber && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted" style={{ fontSize: '12px' }}>
                    {t('SINPE.referenceNumber', 'Número de comprobante')}
                  </span>
                  <span className="n4-clr" style={{ fontSize: '13px' }}>
                    {payment.referenceNumber}
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-between">
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  {t('SINPE.submittedAt', 'Enviado')}
                </span>
                <span className="n4-clr" style={{ fontSize: '13px' }}>
                  {new Date(payment.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/my-tickets')}
              className="btn w-100 p1-bg n4-clr fw-bold py-3 d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: '14px', fontSize: '15px' }}
            >
              <ShieldCheck size={18} />
              {t('SINPE.goToTickets', 'Ir a mis tickets')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinpeSubmittedPanel;
