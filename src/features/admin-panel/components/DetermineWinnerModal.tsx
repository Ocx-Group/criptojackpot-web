'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/store/notificationStore';
import { winnerService } from '@/services';
import { Lottery } from '@/interfaces/lottery';
import { Trophy } from 'lucide-react';

interface DetermineWinnerModalProps {
  lottery: Lottery;
  onClose: () => void;
}

const DetermineWinnerModal: React.FC<DetermineWinnerModalProps> = ({ lottery, onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const [number, setNumber] = useState<string>('');
  const [series, setSeries] = useState<string>('');

  const determineMutation = useMutation({
    mutationFn: async () => {
      const num = parseInt(number, 10);
      const ser = parseInt(series, 10);
      if (isNaN(num) || isNaN(ser)) throw new Error('Número y serie deben ser valores numéricos');

      const mainPrize = lottery.prizes?.[0];
      return winnerService.determineWinner({
        lotteryId: lottery.lotteryGuid,
        lotteryTitle: lottery.title,
        number: num,
        series: ser,
        prizeName: mainPrize?.name,
        prizeEstimatedValue: mainPrize?.cashAlternative,
        prizeImageUrl: mainPrize?.mainImageUrl,
      });
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('WINNERS.determine.success', '¡Ganador registrado!'),
        t('WINNERS.determine.successMessage', 'El ganador ha sido registrado exitosamente')
      );
      queryClient.invalidateQueries({ queryKey: ['winners'] }).then();
      onClose();
    },
    onError: (error: Error) => {
      const errorMessage = error.message || t('WINNERS.determine.error', 'Error al registrar el ganador');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    determineMutation.mutate();
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Trophy size={20} className="text-warning" />
              {t('WINNERS.determine.title', 'Determinar Ganador')}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={determineMutation.isPending}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Lottery info */}
              <div className="alert alert-info mb-4">
                <strong>{t('WINNERS.determine.lottery', 'Lotería')}:</strong> {lottery.title}
                <br />
                <small className="text-muted">
                  {t('WINNERS.determine.range', 'Rango')}: {lottery.minNumber} - {lottery.maxNumber} |{' '}
                  {t('WINNERS.determine.series', 'Series')}: {lottery.totalSeries}
                </small>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    {t('WINNERS.determine.number', 'Número')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    min={lottery.minNumber}
                    max={lottery.maxNumber}
                    placeholder={`${lottery.minNumber} - ${lottery.maxNumber}`}
                    required
                    disabled={determineMutation.isPending}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    {t('WINNERS.determine.series', 'Serie')}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={series}
                    onChange={e => setSeries(e.target.value)}
                    min={0}
                    max={lottery.totalSeries - 1}
                    placeholder={`0 - ${lottery.totalSeries - 1}`}
                    required
                    disabled={determineMutation.isPending}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={determineMutation.isPending}
              >
                {t('COMMON.cancel', 'Cancelar')}
              </button>
              <button
                type="submit"
                className="btn btn-warning"
                disabled={determineMutation.isPending}
              >
                {determineMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {t('WINNERS.determine.registering', 'Registrando...')}
                  </>
                ) : (
                  <>
                    <Trophy size={16} className="me-2" />
                    {t('WINNERS.determine.confirm', 'Confirmar Ganador')}
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

export default DetermineWinnerModal;
