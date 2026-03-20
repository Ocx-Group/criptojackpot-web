'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useNotificationStore } from '@/store/notificationStore';
import { walletService } from '@/services';
import { User } from '@/interfaces/user';
import { DollarSign } from 'lucide-react';

interface AdminCreditModalProps {
  user: User;
  onClose: () => void;
}

const AdminCreditModal: React.FC<AdminCreditModalProps> = ({ user, onClose }) => {
  const { t } = useTranslation();
  const showNotification = useNotificationStore(state => state.show);

  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const creditMutation = useMutation({
    mutationFn: async () => {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error(t('ADMIN_CREDIT.errors.invalidAmount', 'El monto debe ser mayor a cero'));
      }
      if (!user.userGuid) {
        throw new Error(t('ADMIN_CREDIT.errors.noUserGuid', 'El usuario no tiene un GUID válido'));
      }

      return walletService.adminCredit({
        userGuid: user.userGuid,
        amount: parsedAmount,
        description: description.trim() || undefined,
      });
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('ADMIN_CREDIT.success.title', '¡Saldo agregado!'),
        t('ADMIN_CREDIT.success.message', 'El saldo interno ha sido agregado exitosamente')
      );
      onClose();
    },
    onError: (error: Error) => {
      const errorMessage = error.message || t('ADMIN_CREDIT.errors.generic', 'Error al agregar saldo');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    creditMutation.mutate();
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <DollarSign size={20} className="text-success" />
              {t('ADMIN_CREDIT.title', 'Agregar Saldo Interno')}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={creditMutation.isPending}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="alert alert-info mb-4">
                <strong>{t('ADMIN_CREDIT.user', 'Usuario')}:</strong> {user.name} {user.lastName}
                <br />
                <small className="text-muted">{user.email}</small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {t('ADMIN_CREDIT.amount', 'Monto (USD)')}
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                  disabled={creditMutation.isPending}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {t('ADMIN_CREDIT.description', 'Descripción')}
                </label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder={t('ADMIN_CREDIT.descriptionPlaceholder', 'Ej: Bonificación promocional, corrección de saldo...')}
                  disabled={creditMutation.isPending}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={creditMutation.isPending}
              >
                {t('COMMON.cancel', 'Cancelar')}
              </button>
              <button type="submit" className="btn btn-success" disabled={creditMutation.isPending}>
                {creditMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {t('ADMIN_CREDIT.processing', 'Procesando...')}
                  </>
                ) : (
                  <>
                    <DollarSign size={16} className="me-2" />
                    {t('ADMIN_CREDIT.confirm', 'Agregar Saldo')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreditModal;
