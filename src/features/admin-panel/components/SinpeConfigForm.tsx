'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gear } from '@phosphor-icons/react';
import { useSinpeConfig } from '@/features/admin-panel/hooks';

/**
 * Datos de destino de SINPE Móvil que ve el comprador, editables sin redeploy.
 * Mientras isEnabled sea false el método no aparece en el checkout.
 */
const SinpeConfigForm: React.FC = () => {
  const { t } = useTranslation();
  const { config, isLoading, updateConfig, isUpdating } = useSinpeConfig();

  const [isEnabled, setIsEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!config) return;
    setIsEnabled(config.isEnabled);
    setPhoneNumber(config.phoneNumber ?? '');
    setHolderName(config.holderName ?? '');
    setExchangeRate(config.exchangeRate ? String(config.exchangeRate) : '');
    setInstructions(config.instructions ?? '');
  }, [config]);

  const rate = Number(exchangeRate);
  // El backend rechaza habilitar sin teléfono o sin tipo de cambio; espejamos la regla.
  const canSubmit = !isEnabled || (phoneNumber.trim().length > 0 && rate > 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      await updateConfig({
        isEnabled,
        phoneNumber: phoneNumber.trim() || undefined,
        holderName: holderName.trim() || undefined,
        exchangeRate: Number.isFinite(rate) ? rate : 0,
        instructions: instructions.trim() || undefined,
      });
    } catch {
      // El error lo reporta el onError de la mutación
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h6 className="mb-0 d-flex align-items-center gap-2">
          <Gear size={18} weight="bold" />
          {t('SINPE_ADMIN.config_title', 'Configuración de SINPE Móvil')}
          <span className={`badge ${config?.isEnabled ? 'bg-success' : 'bg-secondary'}`}>
            {config?.isEnabled
              ? t('SINPE_ADMIN.enabled', 'Habilitado')
              : t('SINPE_ADMIN.disabled', 'Deshabilitado')}
          </span>
        </h6>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(prev => !prev)}>
          {open ? t('COMMON.close', 'Cerrar') : t('COMMON.edit', 'Editar')}
        </button>
      </div>

      {open && (
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary">
                <span className="visually-hidden">{t('COMMON.loading', 'Cargando...')}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sinpe-enabled"
                  checked={isEnabled}
                  onChange={e => setIsEnabled(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="sinpe-enabled">
                  {t('SINPE_ADMIN.enable_label', 'Ofrecer SINPE Móvil en el checkout')}
                </label>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small" htmlFor="sinpe-phone">
                    {t('SINPE_ADMIN.phone', 'Teléfono destino')} {isEnabled && '*'}
                  </label>
                  <input
                    id="sinpe-phone"
                    type="tel"
                    className="form-control"
                    maxLength={30}
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small" htmlFor="sinpe-holder">
                    {t('SINPE_ADMIN.holder', 'Nombre del titular')}
                  </label>
                  <input
                    id="sinpe-holder"
                    type="text"
                    className="form-control"
                    maxLength={200}
                    value={holderName}
                    onChange={e => setHolderName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small" htmlFor="sinpe-rate">
                    {t('SINPE_ADMIN.rate', 'Tipo de cambio USD → CRC')} {isEnabled && '*'}
                  </label>
                  <input
                    id="sinpe-rate"
                    type="number"
                    step="0.0001"
                    min="0"
                    className="form-control"
                    value={exchangeRate}
                    onChange={e => setExchangeRate(e.target.value)}
                  />
                  <div className="form-text">
                    {t('SINPE_ADMIN.rate_hint', 'Se usa para mostrarle al comprador el monto en colones.')}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small" htmlFor="sinpe-instructions">
                    {t('SINPE_ADMIN.instructions', 'Instrucciones para el comprador')}
                  </label>
                  <textarea
                    id="sinpe-instructions"
                    className="form-control"
                    rows={3}
                    maxLength={2000}
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={isUpdating || !canSubmit}>
                  {isUpdating && <span className="spinner-border spinner-border-sm me-2" />}
                  {t('COMMON.save', 'Guardar')}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SinpeConfigForm;
