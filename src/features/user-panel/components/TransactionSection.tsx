'use client';

import {
  ArrowsDownUpIcon,
  CaretLeftIcon,
  CaretRightIcon,
  WalletIcon,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '@/features/user-panel/hooks/useTransactions';
import {
  WalletTransactionDirection,
  WalletTransactionStatus,
  WalletTransactionType,
} from '@/interfaces/walletTransaction';

const PAGE_SIZE = 10;

const TransactionSection = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const { transactions, totalPages, balance, isLoading, error } = useTransactions({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const getTypeLabel = (type: WalletTransactionType): string => {
    const key = WalletTransactionType[type];
    return t(`TRANSACTIONS.type${key}`);
  };

  const getStatusLabel = (status: WalletTransactionStatus): string => {
    const key = WalletTransactionStatus[status];
    return t(`TRANSACTIONS.status${key}`);
  };

  const getStatusClass = (status: WalletTransactionStatus): string => {
    switch (status) {
      case WalletTransactionStatus.Completed:
        return 'text-success';
      case WalletTransactionStatus.Pending:
        return 'text-warning';
      case WalletTransactionStatus.Failed:
        return 'text-danger';
      case WalletTransactionStatus.Reversed:
        return 'n3-clr';
      default:
        return 'n3-clr';
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatAmount = (amount: number, direction: WalletTransactionDirection): string => {
    const sign = direction === WalletTransactionDirection.Credit ? '+' : '-';
    return `${sign}$${amount.toFixed(2)}`;
  };

  const getAmountClass = (direction: WalletTransactionDirection): string => {
    return direction === WalletTransactionDirection.Credit ? 'text-success' : 'text-danger';
  };

  return (
    <div className="col-xxl-9 col-xl-8 col-lg-8">
      <div className="cmn-box-addingbg mb-6 win40-ragba border radius24 py-xxl-10 py-xl-8 py-5 px-xxl-10 px-xl-8 px-5">
        <div className="d-flex flex-sm-nowrap flex-wrap align-items-center justify-content-sm-between justify-content-center gap-3">
          <div className="trans-pribox d-flex align-items-center border radius24 px-xxl-10 px-4 py-4">
            <div className="box">
              <h3 className="n4-clr mb-2">
                {isLoading ? '...' : `$${balance?.balance.toFixed(2) ?? '0.00'}`}
              </h3>
              <span className="fw_600 n3-clr">{t('TRANSACTIONS.availableBalance')}</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-xl-6 gap-4">
            <Link href="#0" className="deposit-box text-center d-center border radius24 d-center">
              <span className="box">
                <span className="icon mb-xxl-5 mb-xl-4 mb-lg-3 mb-2 s1-bg radius-circle d-center">
                  <WalletIcon className="ph ph-wallet fs-three n0-clr"></WalletIcon>
                </span>
                <span className="n3-clr fw_600">{t('TRANSACTIONS.deposit')}</span>
              </span>
            </Link>
            <Link href="#0" className="deposit-box text-center d-center border radius24 d-center">
              <span className="box">
                <span className="icon mb-xxl-5 mb-xl-4 mb-lg-3 mb-2 s1-bg radius-circle d-center">
                  <ArrowsDownUpIcon className="ph ph-arrows-down-up fs-three n0-clr"></ArrowsDownUpIcon>
                </span>
                <span className="n3-clr fw_600">{t('TRANSACTIONS.withdraw')}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="cmn-box-addingbg win40-ragba border radius24 pt-xxl-10 pt-xl-8 pt-lg-6 pt-5 pb-5">
        <div className="mb-xxl-10 mb-xl-8 mb-lg-6 mb-5 d-flex align-items-center justify-content-between flex-wrap gap-3 px-xxl-10 px-xl-8 px-5">
          <h3 className="user-title n4-clr">{t('TRANSACTIONS.title')}</h3>
        </div>

        {isLoading && <p className="n4-clr text-center px-5">{t('TRANSACTIONS.loading')}</p>}

        {error && <p className="text-danger text-center px-5">{t('TRANSACTIONS.error')}</p>}

        {!isLoading && !error && transactions.length === 0 && (
          <p className="n4-clr text-center px-5">{t('TRANSACTIONS.empty')}</p>
        )}

        {!isLoading && !error && transactions.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <span className="n4-clr fs20 fw_700">{t('TRANSACTIONS.date')}</span>
                    </th>
                    <th>
                      <span className="n4-clr fs20 fw_700">{t('TRANSACTIONS.description')}</span>
                    </th>
                    <th>
                      <span className="n4-clr fs20 fw_700">{t('TRANSACTIONS.type')}</span>
                    </th>
                    <th>
                      <span className="n4-clr fs20 fw_700">{t('TRANSACTIONS.amount')}</span>
                    </th>
                    <th>
                      <span className="n4-clr fs20 fw_700">{t('TRANSACTIONS.status')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.transactionGuid}>
                      <td>
                        <span className="n3-clr">{formatDate(tx.createdAt)}</span>
                      </td>
                      <td>
                        <span className="n3-clr">{tx.description || '-'}</span>
                      </td>
                      <td>
                        <span className="n3-clr">{getTypeLabel(tx.type)}</span>
                      </td>
                      <td>
                        <span className={`fw_600 ${getAmountClass(tx.direction)}`}>
                          {formatAmount(tx.amount, tx.direction)}
                        </span>
                      </td>
                      <td>
                        <span className={`fw_600 ${getStatusClass(tx.status)}`}>
                          {getStatusLabel(tx.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <ul className="custom-pagination pt-xxl-15 pt-xl-10 pt-8 d-flex align-items-center justify-content-center gap-xxl-3 gap-2">
                {currentPage > 1 && (
                  <li>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="cmn-60 d-center radius-circle nw1-clr n2-bg"
                    >
                      <CaretLeftIcon className="ph ph-caret-left nw1-clr fs20" />
                    </button>
                  </li>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page}>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`cmn-60 d-center radius-circle nw1-clr n2-bg fs20 fw_700 ${
                        page === currentPage ? 'active' : ''
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                {currentPage < totalPages && (
                  <li>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="cmn-60 d-center radius-circle nw1-clr n2-bg"
                    >
                      <CaretRightIcon className="ph ph-caret-right nw1-clr fs20" />
                    </button>
                  </li>
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionSection;
