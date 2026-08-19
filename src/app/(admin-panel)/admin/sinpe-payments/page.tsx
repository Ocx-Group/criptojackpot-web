'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminSinpePaymentsList from '@/features/admin-panel/components/AdminSinpePaymentsList';
import SinpeConfigForm from '@/features/admin-panel/components/SinpeConfigForm';

/**
 * Bandeja de comprobantes SINPE Movil.
 * Cada comprobante pendiente mantiene una orden congelada (PendingReview) con sus
 * numeros reservados sin expiracion, hasta que se apruebe o rechace aqui.
 */
const SinpePaymentsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <h3 className="nw1-clr fw_700 mb-2">{t('SINPE_ADMIN.title', 'Pagos SINPE Movil')}</h3>
        <p className="text-muted mb-xxl-8 mb-6" style={{ fontSize: '13px' }}>
          {t(
            'SINPE_ADMIN.subtitle',
            'Revisa los comprobantes de transferencia. Los numeros quedan reservados hasta que apruebes o rechaces.'
          )}
        </p>

        <SinpeConfigForm />
        <AdminSinpePaymentsList />
      </div>
    </div>
  );
};

export default SinpePaymentsPage;
