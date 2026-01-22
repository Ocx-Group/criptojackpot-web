'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Wallet, Building2, Bitcoin, Check } from 'lucide-react';
import { PaymentMethod } from '@/store/checkoutStore';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
}

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  comingSoon?: boolean;
}

/**
 * Selector de métodos de pago para el checkout
 */
const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const paymentOptions: PaymentOption[] = [
    {
      id: 'card',
      name: t('CHECKOUT.paymentMethods.card', 'Tarjeta de Crédito/Débito'),
      description: t('CHECKOUT.paymentMethods.cardDesc', 'Visa, Mastercard, American Express'),
      icon: <CreditCard size={28} />,
      popular: true,
    },
    {
      id: 'crypto',
      name: t('CHECKOUT.paymentMethods.crypto', 'Criptomonedas'),
      description: t('CHECKOUT.paymentMethods.cryptoDesc', 'Bitcoin, Ethereum, USDT'),
      icon: <Bitcoin size={28} />,
    },
    {
      id: 'paypal',
      name: t('CHECKOUT.paymentMethods.paypal', 'PayPal'),
      description: t('CHECKOUT.paymentMethods.paypalDesc', 'Pago seguro con PayPal'),
      icon: <Wallet size={28} />,
    },
    {
      id: 'bank_transfer',
      name: t('CHECKOUT.paymentMethods.bank', 'Transferencia Bancaria'),
      description: t('CHECKOUT.paymentMethods.bankDesc', 'Depósito directo a cuenta'),
      icon: <Building2 size={28} />,
      comingSoon: true,
    },
  ];

  return (
    <div className="payment-method-selector">
      <h5 className="mb-4 n4-clr fw-bold d-flex align-items-center gap-2">
        <Wallet size={20} className="act4-clr" />
        {t('CHECKOUT.selectPaymentMethod', 'Selecciona tu Método de Pago')}
      </h5>

      <div className="payment-options d-flex flex-column gap-3">
        {paymentOptions.map(option => {
          const isSelected = selectedMethod === option.id;
          const isDisabled = disabled || option.comingSoon;

          return (
            <button
              key={option.id}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(option.id)}
              className={`payment-option d-flex align-items-center gap-3 p-4 radius12 border-0 text-start w-100 position-relative ${
                isSelected ? 'payment-option--selected' : ''
              } ${isDisabled ? 'payment-option--disabled' : ''}`}
              style={{
                backgroundColor: isSelected ? 'rgba(var(--act4-rgb), 0.1)' : 'var(--n0)',
                border: isSelected ? '2px solid var(--act4)' : '2px solid rgba(0,0,0,0.08)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {/* Icono */}
              <div
                className={`payment-icon d-flex align-items-center justify-content-center radius12 ${
                  isSelected ? 'act4-bg n0-clr' : 'n1-bg act4-clr'
                }`}
                style={{ width: '56px', height: '56px' }}
              >
                {option.icon}
              </div>

              {/* Info */}
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-1 n4-clr fw-semibold" style={{ fontSize: '14px' }}>
                    {option.name}
                  </h6>
                  {option.popular && (
                    <span className="badge act4-bg n0-clr" style={{ fontSize: '9px', padding: '3px 8px' }}>
                      {t('CHECKOUT.popular', 'Popular')}
                    </span>
                  )}
                  {option.comingSoon && (
                    <span className="badge bg-secondary n0-clr" style={{ fontSize: '9px', padding: '3px 8px' }}>
                      {t('CHECKOUT.comingSoon', 'Próximamente')}
                    </span>
                  )}
                </div>
                <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                  {option.description}
                </p>
              </div>

              {/* Indicador de selección */}
              <div
                className={`selection-indicator d-flex align-items-center justify-content-center radius-circle ${
                  isSelected ? 'act4-bg' : 'border'
                }`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderWidth: isSelected ? 0 : '2px',
                  transition: 'all 0.2s ease',
                }}
              >
                {isSelected && <Check size={14} className="n0-clr" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Información de seguridad */}
      <div
        className="security-info mt-4 p-3 radius8 d-flex align-items-center gap-2"
        style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <span style={{ fontSize: '12px', color: '#22c55e' }}>
          {t('CHECKOUT.securePayment', 'Todos los pagos son procesados de forma segura con encriptación SSL')}
        </span>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
