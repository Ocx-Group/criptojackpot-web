'use client';

import { useState } from 'react';
import {
  WalletIcon,
  PlusIcon,
  TrashIcon,
  CopyIcon,
  StarIcon,
  CheckCircleIcon,
  XIcon,
  CaretDownIcon,
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import MotionFade from '@/components/motionEffect/MotionFade';
import { useNotificationStore } from '@/store/notificationStore';
import { useQuery } from '@tanstack/react-query';
import { coinPaymentService } from '@/services';

/* ─── Types ─── */

interface CryptoWallet {
  id: string;
  address: string;
  currencySymbol: string;
  currencyName: string;
  logoUrl?: string;
  label: string;
  isDefault: boolean;
}

interface NewWalletForm {
  address: string;
  currencySymbol: string;
  currencyName: string;
  logoUrl?: string;
  label: string;
}

/* ─── Helpers ─── */

const CRYPTO_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  USDT: '#26A17B',
  BNB: '#F3BA2F',
  SOL: '#9945FF',
  ADA: '#0033AD',
  XRP: '#346AA9',
  DOGE: '#C2A633',
  LTC: '#BFBBBB',
  MATIC: '#8247E5',
  AVAX: '#E84142',
  DOT: '#E6007A',
  DEFAULT: '#6c5dd3',
};

const getCryptoColor = (symbol: string): string => CRYPTO_COLORS[symbol.toUpperCase()] ?? CRYPTO_COLORS.DEFAULT;

const truncateAddress = (addr: string): string => {
  if (addr.length <= 20) return addr;
  return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
};

const INITIAL_WALLETS: CryptoWallet[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b844Bc454A4088099',
    currencySymbol: 'ETH',
    currencyName: 'Ethereum',
    label: 'Billetera principal',
    isDefault: true,
  },
  {
    id: '2',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    currencySymbol: 'BTC',
    currencyName: 'Bitcoin',
    label: 'BTC savings',
    isDefault: false,
  },
];

/* ─── Wallet Card ─── */

interface WalletCardProps {
  readonly wallet: CryptoWallet;
  readonly logoUrl?: string;
  readonly onCopy: (address: string) => void;
  readonly onSetDefault: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly t: (key: string) => string;
}

function WalletCard({ wallet, logoUrl, onCopy, onSetDefault, onDelete, t }: Readonly<WalletCardProps>) {
  const color = getCryptoColor(wallet.currencySymbol);
  const displayLogo = logoUrl ?? wallet.logoUrl;

  return (
    <div
      className={`crypto-wallet-card radius16 position-relative overflow-hidden h-100${wallet.isDefault ? ' crypto-wallet-card--default' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${color}45 0%, ${color}22 45%, var(--n0) 80%)`,
        border: `1.5px solid ${color}70`,
      }}
    >
      {/* Top color stripe */}
      <div
        className="crypto-wallet-card__stripe"
        style={{ background: `linear-gradient(90deg, ${color} 0%, ${color}55 100%)` }}
      />

      {/* Decorative circles */}
      <div className="crypto-wallet-card__circles">
        <div className="cwc-circle cwc-circle--1" style={{ background: `${color}12` }} />
        <div className="cwc-circle cwc-circle--2" style={{ background: `${color}08` }} />
      </div>

      {/* Card body */}
      <div className="p-4 p-xl-5 position-relative">
        {/* Header row */}
        <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
          {/* Left: symbol + name */}
          <div className="d-flex align-items-center gap-3">
            <div
              className="crypto-wallet-card__symbol-badge"
              style={{ background: `${color}20`, border: `1.5px solid ${color}50` }}
            >
              {displayLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayLogo}
                  alt={wallet.currencySymbol}
                  width={28}
                  height={28}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <span className="fw_700" style={{ color, fontSize: '13px', letterSpacing: '0.5px' }}>
                  {wallet.currencySymbol}
                </span>
              )}
            </div>
            <div>
              <span className="n4-clr fw_700 d-block" style={{ fontSize: '15px' }}>
                {wallet.currencyName}
              </span>
              {wallet.label && <span className="n3-clr fs-eight">{wallet.label}</span>}
              {wallet.isDefault && (
                <div
                  className="crypto-wallet-card__badge mt-1"
                  style={{ background: `${color}22`, borderColor: `${color}55`, color }}
                >
                  <CheckCircleIcon size={11} weight="fill" />
                  <span>{t('PAYMENT.default')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            {!wallet.isDefault && (
              <button
                type="button"
                className="crypto-action-btn"
                onClick={() => onSetDefault(wallet.id)}
                title={t('PAYMENT.setDefault')}
              >
                <StarIcon size={15} weight="bold" className="n3-clr" />
              </button>
            )}
            <button
              type="button"
              className="crypto-action-btn"
              onClick={() => onCopy(wallet.address)}
              title={t('PAYMENT.copy')}
            >
              <CopyIcon size={15} weight="bold" className="n3-clr" />
            </button>
            <button
              type="button"
              className="crypto-action-btn crypto-action-btn--danger"
              onClick={() => onDelete(wallet.id)}
              title={t('PAYMENT.delete')}
            >
              <TrashIcon size={15} weight="bold" />
            </button>
          </div>
        </div>

        {/* Address row */}
        <div className="crypto-wallet-card__address-row">
          <span className="n3-clr fs-eight d-block mb-1" style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {t('PAYMENT.address')}
          </span>
          <span className="n4-clr fw_600 font-monospace d-block" style={{ fontSize: '13px', wordBreak: 'break-all' }}>
            {truncateAddress(wallet.address)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ─── */

export default function PaymentSection() {
  const { t } = useTranslation();
  const showNotification = useNotificationStore(state => state.show);

  const [wallets, setWallets] = useState<CryptoWallet[]>(INITIAL_WALLETS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [newWallet, setNewWallet] = useState<NewWalletForm>({
    address: '',
    currencySymbol: '',
    currencyName: '',
    logoUrl: undefined,
    label: '',
  });

  const { data: currencies = [] } = useQuery({
    queryKey: ['coinpayment-currencies'],
    queryFn: () => coinPaymentService.getCurrencies(),
    staleTime: 1000 * 60 * 5,
  });

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    showNotification('success', t('PAYMENT.copied'), '');
  };

  const handleSetDefault = (id: string) => {
    setWallets(prev => prev.map(w => ({ ...w, isDefault: w.id === id })));
    showNotification('success', t('PAYMENT.defaultSet'), '');
  };

  const handleDelete = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
    showNotification('info', t('PAYMENT.walletDeleted'), '');
  };

  const handleCurrencyChange = (symbol: string, logoUrl?: string, name?: string) => {
    const found = currencies.find(c => c.symbol === symbol);
    setNewWallet(prev => ({
      ...prev,
      currencySymbol: symbol,
      currencyName: name ?? found?.name ?? symbol,
      logoUrl: logoUrl ?? found?.logoUrl,
    }));
  };

  const handleAddWallet = () => {
    if (!newWallet.address.trim() || !newWallet.currencySymbol) {
      showNotification('error', t('PAYMENT.fillRequired'), '');
      return;
    }
    const wallet: CryptoWallet = {
      id: Date.now().toString(),
      address: newWallet.address.trim(),
      currencySymbol: newWallet.currencySymbol,
      currencyName: newWallet.currencyName,
      logoUrl: newWallet.logoUrl,
      label: newWallet.label.trim() || newWallet.currencyName,
      isDefault: wallets.length === 0,
    };
    setWallets(prev => [...prev, wallet]);
    setNewWallet({ address: '', currencySymbol: '', currencyName: '', logoUrl: undefined, label: '' });
    setShowAddForm(false);
    showNotification('success', t('PAYMENT.walletAdded'), '');
  };

  const enabledCurrencies = currencies.filter(c => c.isEnabledForPayment);
  const availableCurrencies = enabledCurrencies.length > 0 ? enabledCurrencies : currencies;

  return (
    <MotionFade className="col-xxl-9 col-xl-8 col-lg-8">
      <div className="cmn-box-addingbg win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5">
        {/* ── Header ── */}
        <div className="d-flex align-items-center justify-content-between flex-wrap px-xxl-8 px-xl-6 px-sm-5 px-4 mb-xxl-8 mb-xl-6 mb-5 gap-2">
          <div className="d-flex align-items-center gap-3">
            <WalletIcon size={30} weight="duotone" className="s1-clr" />
            <h3 className="user-title n4-clr mb-0">{t('PAYMENT.title')}</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(v => !v)}
            className="kewta-btn kewta-alt d-inline-flex align-items-center"
          >
            <span className="kew-text s1-bg nw1-clr d-inline-flex align-items-center gap-2">
              <PlusIcon size={16} weight="bold" />
              {t('PAYMENT.addWallet')}
            </span>
          </button>
        </div>

        {/* ── Add Wallet Form ── */}
        {showAddForm && (
          <div className="px-xxl-8 px-xl-6 px-sm-5 px-4 mb-xxl-8 mb-xl-6 mb-5">
            <div className="crypto-add-form border radius16 p-4 p-xl-6">
              <div className="d-flex align-items-center justify-content-between mb-xxl-6 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <WalletIcon size={20} weight="duotone" className="s1-clr" />
                  <h5 className="n4-clr fw_600 mb-0">{t('PAYMENT.newWallet')}</h5>
                </div>
                <button type="button" onClick={() => setShowAddForm(false)} className="crypto-close-btn">
                  <XIcon size={18} weight="bold" />
                </button>
              </div>

              <div className="row g-4">
                {/* Currency */}
                <div className="col-md-6">
                  <div className="ch-form-items">
                    <label className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                      {t('PAYMENT.currency')} <span className="act4-clr">*</span>
                    </label>
                    <div className="crypto-currency-picker position-relative">
                      <button
                        type="button"
                        className="crypto-currency-trigger"
                        onClick={() => setShowCurrencyDropdown(v => !v)}
                      >
                        {newWallet.currencySymbol ? (
                          <div className="d-flex align-items-center gap-2 flex-1 overflow-hidden">
                            {newWallet.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={newWallet.logoUrl}
                                alt={newWallet.currencySymbol}
                                width={22}
                                height={22}
                                style={{ objectFit: 'contain', flexShrink: 0 }}
                              />
                            ) : (
                              <div
                                className="crypto-currency-option__icon"
                                style={{
                                  background: `${getCryptoColor(newWallet.currencySymbol)}20`,
                                  color: getCryptoColor(newWallet.currencySymbol),
                                }}
                              >
                                {newWallet.currencySymbol.slice(0, 2)}
                              </div>
                            )}
                            <span className="n4-clr fw_600 text-truncate" style={{ fontSize: '14px' }}>
                              {newWallet.currencyName} ({newWallet.currencySymbol})
                            </span>
                          </div>
                        ) : (
                          <span className="n3-clr">{t('PAYMENT.selectCurrency')}</span>
                        )}
                        <CaretDownIcon
                          size={14}
                          weight="bold"
                          className="n3-clr flex-shrink-0"
                          style={{
                            transition: 'transform 0.2s',
                            transform: showCurrencyDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </button>
                      {showCurrencyDropdown && (
                        <div className="crypto-currency-list">
                          {availableCurrencies.map(c => (
                            <button
                              key={c.id}
                              type="button"
                              className={`crypto-currency-option${newWallet.currencySymbol === c.symbol ? ' crypto-currency-option--active' : ''}`}
                              onClick={() => {
                                handleCurrencyChange(c.symbol, c.logoUrl, c.name);
                                setShowCurrencyDropdown(false);
                              }}
                            >
                              {c.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={c.logoUrl}
                                  alt={c.symbol}
                                  width={26}
                                  height={26}
                                  style={{ objectFit: 'contain', flexShrink: 0 }}
                                />
                              ) : (
                                <div
                                  className="crypto-currency-option__icon"
                                  style={{
                                    background: `${getCryptoColor(c.symbol)}20`,
                                    color: getCryptoColor(c.symbol),
                                  }}
                                >
                                  {c.symbol.slice(0, 2)}
                                </div>
                              )}
                              <div className="overflow-hidden">
                                <span className="n4-clr fw_600 d-block" style={{ fontSize: '13px' }}>
                                  {c.symbol}
                                </span>
                                <span className="n3-clr text-truncate d-block" style={{ fontSize: '11px' }}>
                                  {c.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Label */}
                <div className="col-md-6">
                  <div className="ch-form-items">
                    <label className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                      {t('PAYMENT.label')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('PAYMENT.labelPlaceholder')}
                      value={newWallet.label}
                      onChange={e => setNewWallet(p => ({ ...p, label: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="col-12">
                  <div className="ch-form-items">
                    <label className="text-capitalize fs18 fw_600 n3-clr mb-xxl-4 mb-xl-3 mb-2">
                      {t('PAYMENT.walletAddress')} <span className="act4-clr">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t('PAYMENT.addressPlaceholder')}
                      value={newWallet.address}
                      onChange={e => setNewWallet(p => ({ ...p, address: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="col-12 d-flex gap-3 justify-content-end flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="kewta-btn d-inline-flex align-items-center"
                  >
                    <span className="kew-text">{t('PAYMENT.cancel')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddWallet}
                    className="kewta-btn kewta-alt d-inline-flex align-items-center"
                  >
                    <span className="kew-text s1-bg nw1-clr">{t('PAYMENT.save')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Wallet Cards ── */}
        <div className="px-xxl-8 px-xl-6 px-sm-5 px-4 pb-xxl-4 pb-2">
          {wallets.length === 0 ? (
            <div className="text-center py-xxl-15 py-xl-10 py-8">
              <WalletIcon size={64} weight="duotone" className="n3-clr mb-4" />
              <p className="n3-clr fs-six">{t('PAYMENT.noWallets')}</p>
            </div>
          ) : (
            <div className="row g-4 g-xl-5 align-items-stretch">
              {wallets.map(wallet => (
                <div key={wallet.id} className="col-xl-6 col-md-6">
                  <WalletCard
                    wallet={wallet}
                    logoUrl={currencies.find(c => c.symbol === wallet.currencySymbol)?.logoUrl}
                    onCopy={handleCopy}
                    onSetDefault={handleSetDefault}
                    onDelete={handleDelete}
                    t={t}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MotionFade>
  );
}
