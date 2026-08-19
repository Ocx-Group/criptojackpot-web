'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, Loader2, Smartphone, Upload, X } from 'lucide-react';
import { sinpeService, SinpeService } from '@/services';
import { SinpeConfig } from '@/interfaces/sinpe';

interface SinpePaymentPanelProps {
  /** Total de la orden en USD. */
  totalAmount: number;
  /** Archivo seleccionado, elevado al padre para que dispare el envío. */
  onFileChange: (file: File | null) => void;
  onSenderPhoneChange: (value: string) => void;
  onReferenceNumberChange: (value: string) => void;
  senderPhone: string;
  referenceNumber: string;
  disabled?: boolean;
}

/**
 * Instrucciones de SINPE Móvil + adjunto del comprobante.
 *
 * SINPE no confirma nada automáticamente: al enviar el comprobante la orden pasa a
 * PendingReview en el backend y sus números quedan reservados sin expirar hasta que
 * un admin apruebe o rechace.
 */
const SinpePaymentPanel: React.FC<SinpePaymentPanelProps> = ({
  totalAmount,
  onFileChange,
  onSenderPhoneChange,
  onReferenceNumberChange,
  senderPhone,
  referenceNumber,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<SinpeConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setConfig(await sinpeService.getConfig());
      } catch {
        setConfig(null);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  // Liberar el object URL de la vista previa al cambiarla o desmontar.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const amountCrc = config ? totalAmount * config.exchangeRate : 0;

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      SinpeService.validateReceiptFile(file);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : t('SINPE.invalidFile', 'Archivo inválido'));
      onFileChange(null);
      event.target.value = '';
      return;
    }

    setFileError(null);
    setPreview(previous => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    setFileName(file.name);
    onFileChange(file);
  };

  const handleRemoveFile = () => {
    setPreview(previous => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setFileName(null);
    setFileError(null);
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyPhone = async () => {
    if (!config?.phoneNumber) return;
    try {
      await navigator.clipboard.writeText(config.phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin portapapeles (contexto no seguro): el número está visible igual.
    }
  };

  if (loadingConfig) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Loader2 className="animate-spin act4-clr" size={28} />
      </div>
    );
  }

  if (!config?.isEnabled) {
    return (
      <div className="alert alert-warning mb-0 mt-4" style={{ fontSize: '13px' }}>
        {t('SINPE.unavailable', 'SINPE Móvil no está disponible en este momento.')}
      </div>
    );
  }

  return (
    <div className="sinpe-panel mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <h6 className="mb-3 n4-clr fw-bold d-flex align-items-center gap-2">
        <Smartphone size={18} className="act4-clr" />
        {t('SINPE.title', 'Pago por SINPE Móvil')}
      </h6>

      {/* Datos de destino */}
      <div className="p-3 radius12 mb-3" style={{ backgroundColor: 'var(--bg1)' }}>
        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
          <div>
            <p className="mb-1 text-muted" style={{ fontSize: '11px' }}>
              {t('SINPE.phoneLabel', 'Transfiere a este número')}
            </p>
            <p className="mb-0 n4-clr fw-bold" style={{ fontSize: '20px', letterSpacing: '1px' }}>
              {config.phoneNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyPhone}
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            style={{ borderRadius: '10px', fontSize: '12px' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? t('SINPE.copied', 'Copiado') : t('SINPE.copy', 'Copiar')}
          </button>
        </div>

        {config.holderName && (
          <p className="mb-2 text-muted" style={{ fontSize: '12px' }}>
            {t('SINPE.holderLabel', 'A nombre de')}: <span className="n4-clr">{config.holderName}</span>
          </p>
        )}

        <div className="d-flex align-items-baseline gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-muted" style={{ fontSize: '12px' }}>
            {t('SINPE.amountLabel', 'Monto a transferir')}:
          </span>
          <span className="n4-clr fw-bold" style={{ fontSize: '18px' }}>
            ₡{amountCrc.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-muted" style={{ fontSize: '11px' }}>
            (${totalAmount.toFixed(2)} · {t('SINPE.rateLabel', 'tipo de cambio')} ₡{config.exchangeRate})
          </span>
        </div>
      </div>

      {config.instructions && (
        <p className="text-muted mb-3" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>
          {config.instructions}
        </p>
      )}

      {/* Adjuntar comprobante */}
      <label className="form-label n4-clr fw-semibold" style={{ fontSize: '13px' }}>
        {t('SINPE.receiptLabel', 'Adjunta tu comprobante')} *
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
        className="d-none"
        onChange={handleFileSelected}
        disabled={disabled}
      />

      {preview ? (
        <div className="position-relative radius12 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={fileName ?? t('SINPE.receiptAlt', 'Comprobante')}
            style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', backgroundColor: 'var(--bg1)' }}
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            disabled={disabled}
            className="btn btn-danger position-absolute d-flex align-items-center justify-content-center"
            style={{ top: '8px', right: '8px', width: '32px', height: '32px', borderRadius: '50%', padding: 0 }}
            aria-label={t('SINPE.removeReceipt', 'Quitar comprobante')}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-100 d-flex flex-column align-items-center justify-content-center gap-2 p-4 radius12 border-0"
          style={{
            backgroundColor: 'var(--bg1)',
            border: '2px dashed rgba(255,255,255,0.2)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            minHeight: '140px',
          }}
        >
          <Upload size={28} className="act4-clr" />
          <span className="n4-clr" style={{ fontSize: '13px' }}>
            {t('SINPE.uploadCta', 'Haz clic para subir la imagen del comprobante')}
          </span>
          <span className="text-muted" style={{ fontSize: '11px' }}>
            {t('SINPE.uploadHint', 'JPG, PNG, WEBP o HEIC · máximo 10MB')}
          </span>
        </button>
      )}

      {fileError && (
        <p className="text-danger mt-2 mb-0" style={{ fontSize: '12px' }}>
          {fileError}
        </p>
      )}

      {/* Datos opcionales que ayudan al admin a cotejar la transferencia */}
      <div className="row g-3 mt-1">
        <div className="col-sm-6">
          <label className="form-label text-muted" style={{ fontSize: '12px' }}>
            {t('SINPE.senderPhone', 'Teléfono desde el que enviaste')}
          </label>
          <input
            type="tel"
            className="form-control"
            value={senderPhone}
            maxLength={30}
            disabled={disabled}
            onChange={event => onSenderPhoneChange(event.target.value)}
            placeholder={t('SINPE.optional', 'Opcional')}
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label text-muted" style={{ fontSize: '12px' }}>
            {t('SINPE.referenceNumber', 'Número de comprobante')}
          </label>
          <input
            type="text"
            className="form-control"
            value={referenceNumber}
            maxLength={100}
            disabled={disabled}
            onChange={event => onReferenceNumberChange(event.target.value)}
            placeholder={t('SINPE.optional', 'Opcional')}
          />
        </div>
      </div>

      <div className="mt-3 p-3 radius8" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
        <p className="mb-0" style={{ fontSize: '12px', color: 'var(--p1)' }}>
          {t(
            'SINPE.reviewNotice',
            'Tus números quedan reservados mientras revisamos el comprobante. La acreditación no es automática: un administrador la confirma manualmente.'
          )}
        </p>
      </div>
    </div>
  );
};

export default SinpePaymentPanel;
