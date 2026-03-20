'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNumberBoard } from '@/features/admin-panel/hooks';
import type { NumberSummaryItem } from '@/services/lotteryNumberService';
import { formatSeries } from '@/utils/formatSeries';

interface NumberBoardModalProps {
  lotteryId: string;
  lotteryTitle: string;
  onClose: () => void;
}

const COLORS = {
  bg: '#020617',
  cardBg: '#0f172a',
  border: '#1e293b',
  borderLight: '#334155',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textDark: '#475569',
  accent: '#f59e0b',
  green: '#22c55e',
  greenDark: '#14532d',
  greenBorder: '#16a34a',
  red: '#ef4444',
  blue: '#3b82f6',
  blueDark: '#1e3a5f',
};

const NumberBoardModal: React.FC<NumberBoardModalProps> = ({ lotteryId, lotteryTitle, onClose }) => {
  const { t } = useTranslation();
  const {
    boardData,
    isBoardLoading,
    refetchBoard,
    selectedNumber,
    setSelectedNumber,
    seriesDetail,
    isSeriesLoading,
  } = useNumberBoard(lotteryId);

  const totalSlots = boardData?.totalSlots ?? 0;
  const soldCount = boardData?.soldCount ?? 0;
  const reservedCount = boardData?.reservedCount ?? 0;
  const availableCount = boardData?.availableCount ?? 0;
  const pct = totalSlots > 0 ? Math.round((soldCount / totalSlots) * 100) : 0;

  const getNumberIntensity = (item: NumberSummaryItem): number => {
    const totalSeries = boardData?.totalSeries ?? 1;
    return totalSeries > 0 ? item.soldCount / totalSeries : 0;
  };

  const formatNumber = (n: number): string => {
    const maxNum = boardData?.maxNumber ?? 99;
    const digits = String(maxNum).length;
    return String(n).padStart(digits, '0');
  };

  const getGridCols = (): number => {
    const totalNumbers = (boardData?.maxNumber ?? 99) - (boardData?.minNumber ?? 0) + 1;
    if (totalNumbers <= 10) return 5;
    if (totalNumbers <= 25) return 5;
    if (totalNumbers <= 50) return 10;
    return 10;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: COLORS.bg,
          borderRadius: 16,
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          overflow: 'auto',
          fontFamily: 'monospace',
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: COLORS.bg,
            zIndex: 10,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}>
              🎟️ {t('NUMBER_BOARD.title', 'PANEL DE NÚMEROS')}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: COLORS.textDark, letterSpacing: 2 }}>
              {lotteryTitle.toUpperCase()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => refetchBoard()}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.borderLight}`,
                color: COLORS.textSecondary,
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title={t('COMMON.refresh', 'Actualizar')}
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.borderLight}`,
                color: COLORS.textSecondary,
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {isBoardLoading ? (
            <div style={{ textAlign: 'center', padding: 48, color: COLORS.textSecondary }}>
              <div className="spinner-border text-primary" style={{ width: 32, height: 32 }}>
                <span className="visually-hidden">{t('COMMON.loading', 'Cargando...')}</span>
              </div>
              <p style={{ marginTop: 16, fontFamily: 'monospace', fontSize: 13 }}>
                {t('NUMBER_BOARD.loading', 'Cargando tablero...')}
              </p>
            </div>
          ) : !boardData ? (
            <div style={{ textAlign: 'center', padding: 48, color: COLORS.textSecondary }}>
              {t('NUMBER_BOARD.error', 'Error al cargar los datos')}
            </div>
          ) : (
            <>
              {/* Stats cards */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'TOTAL', val: totalSlots, color: COLORS.textPrimary },
                  { label: t('NUMBER_BOARD.sold', 'VENDIDOS'), val: soldCount, color: COLORS.green },
                  { label: t('NUMBER_BOARD.reserved', 'RESERVADOS'), val: reservedCount, color: COLORS.blue },
                  { label: t('NUMBER_BOARD.available', 'DISPONIBLES'), val: availableCount, color: COLORS.red },
                  { label: t('NUMBER_BOARD.progress', 'PROGRESO'), val: `${pct}%`, color: COLORS.accent },
                ].map((k) => (
                  <div
                    key={k.label}
                    style={{
                      background: COLORS.cardBg,
                      borderRadius: 10,
                      padding: '10px 18px',
                      border: `1px solid ${COLORS.border}`,
                      minWidth: 100,
                      flex: 1,
                    }}
                  >
                    <div style={{ fontSize: 9, color: COLORS.textDark, letterSpacing: 2, marginBottom: 2 }}>
                      {k.label}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: k.color }}>{k.val}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div
                style={{
                  background: COLORS.cardBg,
                  borderRadius: 10,
                  padding: '12px 18px',
                  border: `1px solid ${COLORS.border}`,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, letterSpacing: 2 }}>
                    {t('NUMBER_BOARD.totalProgress', 'AVANCE TOTAL')}
                  </span>
                  <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: COLORS.border, borderRadius: 99, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #22c55e, #f59e0b)',
                      borderRadius: 99,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>

              {/* Number Board + Series Detail */}
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                {/* Numbers grid */}
                <div style={{ flex: selectedNumber !== null ? '0 0 auto' : 1 }}>
                  {selectedNumber !== null && (
                    <button
                      onClick={() => setSelectedNumber(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: COLORS.accent,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginBottom: 12,
                        padding: 0,
                      }}
                    >
                      <ArrowLeft size={14} />
                      {t('NUMBER_BOARD.backToAll', 'Volver a todos')}
                    </button>
                  )}
                  <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 14 }}>
                    {t('NUMBER_BOARD.selectNumber', 'Selecciona un número para ver sus series')}
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${getGridCols()}, 1fr)`,
                      gap: 8,
                    }}
                  >
                    {boardData.numbers.map((item) => {
                      const intensity = getNumberIntensity(item);
                      const isActive = selectedNumber === item.number;
                      const totalSeriesForNum = boardData.totalSeries;
                      return (
                        <div
                          key={item.number}
                          onClick={() => setSelectedNumber(isActive ? null : item.number)}
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: 10,
                            cursor: 'pointer',
                            background: isActive
                              ? COLORS.accent
                              : `rgba(34,197,94,${intensity * 0.7 + 0.1})`,
                            border: `2px solid ${
                              isActive
                                ? COLORS.accent
                                : intensity > 0.6
                                ? COLORS.greenBorder
                                : COLORS.borderLight
                            }`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            transform: isActive ? 'scale(1.08)' : 'scale(1)',
                            boxShadow: isActive ? '0 0 20px #f59e0b66' : 'none',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 20,
                              fontWeight: 700,
                              color: isActive ? COLORS.bg : COLORS.textPrimary,
                            }}
                          >
                            {formatNumber(item.number)}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              color: isActive ? COLORS.bg : COLORS.textSecondary,
                            }}
                          >
                            {item.soldCount}/{totalSeriesForNum}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Series detail panel */}
                {selectedNumber !== null && (
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <p
                      style={{
                        color: COLORS.accent,
                        fontSize: 14,
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      {t('NUMBER_BOARD.numberLabel', 'Número')} {formatNumber(selectedNumber)} ·{' '}
                      {t('NUMBER_BOARD.seriesLabel', 'Series')}
                    </p>

                    {isSeriesLoading ? (
                      <div style={{ textAlign: 'center', padding: 32, color: COLORS.textSecondary }}>
                        <div className="spinner-border spinner-border-sm" />
                      </div>
                    ) : seriesDetail ? (
                      <>
                        {/* Series summary */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                          <div
                            style={{
                              background: COLORS.greenDark,
                              border: `1px solid ${COLORS.green}`,
                              borderRadius: 6,
                              padding: '4px 10px',
                              fontSize: 11,
                              color: COLORS.green,
                            }}
                          >
                            ✓ {seriesDetail.soldCount} {t('NUMBER_BOARD.soldLabel', 'vendidas')}
                          </div>
                          {seriesDetail.reservedCount > 0 && (
                            <div
                              style={{
                                background: COLORS.blueDark,
                                border: `1px solid ${COLORS.blue}`,
                                borderRadius: 6,
                                padding: '4px 10px',
                                fontSize: 11,
                                color: COLORS.blue,
                              }}
                            >
                              ⏳ {seriesDetail.reservedCount} {t('NUMBER_BOARD.reservedLabel', 'reservadas')}
                            </div>
                          )}
                          <div
                            style={{
                              background: COLORS.border,
                              border: `1px solid ${COLORS.borderLight}`,
                              borderRadius: 6,
                              padding: '4px 10px',
                              fontSize: 11,
                              color: COLORS.textMuted,
                            }}
                          >
                            ○ {seriesDetail.availableCount} {t('NUMBER_BOARD.freeLabel', 'libres')}
                          </div>
                        </div>

                        {/* Series grid */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: 8,
                          }}
                        >
                          {seriesDetail.series.map((s) => {
                            const isSold = s.status === 'Sold';
                            const isReserved = s.status === 'Reserved';
                            return (
                              <div
                                key={s.series}
                                style={{
                                  padding: '8px 4px',
                                  borderRadius: 8,
                                  textAlign: 'center',
                                  background: isSold
                                    ? COLORS.greenDark
                                    : isReserved
                                    ? COLORS.blueDark
                                    : COLORS.border,
                                  border: `1px solid ${
                                    isSold ? COLORS.green : isReserved ? COLORS.blue : COLORS.borderLight
                                  }`,
                                  fontSize: 12,
                                  color: isSold ? COLORS.green : isReserved ? COLORS.blue : COLORS.textMuted,
                                }}
                              >
                                <div style={{ fontWeight: 700 }}>S{formatSeries(s.series)}</div>
                                <div style={{ fontSize: 9, marginTop: 2 }}>
                                  {isSold
                                    ? `✓ ${t('NUMBER_BOARD.statusSold', 'vendida')}`
                                    : isReserved
                                    ? `⏳ ${t('NUMBER_BOARD.statusReserved', 'reservada')}`
                                    : t('NUMBER_BOARD.statusFree', 'libre')}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                        {t('NUMBER_BOARD.noData', 'Sin datos')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Legend */}
              <div
                style={{
                  marginTop: 20,
                  display: 'flex',
                  gap: 16,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { color: COLORS.green, label: t('NUMBER_BOARD.legendSold', 'Vendido') },
                  { color: COLORS.blue, label: t('NUMBER_BOARD.legendReserved', 'Reservado') },
                  { color: COLORS.borderLight, label: t('NUMBER_BOARD.legendAvailable', 'Disponible') },
                  { color: COLORS.accent, label: t('NUMBER_BOARD.legendSelected', 'Seleccionado') },
                ].map((l) => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: l.color,
                      }}
                    />
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberBoardModal;
