'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminOrdersList from '@/features/admin-panel/components/AdminOrdersList';
import AdminTransactionsList from '@/features/admin-panel/components/AdminTransactionsList';
import AdminWithdrawalsList from '@/features/admin-panel/components/AdminWithdrawalsList';
import { ShoppingCart, ArrowsLeftRight, ArrowsDownUp } from '@phosphor-icons/react';

type FinanceTab = 'orders' | 'transactions' | 'withdrawals';

const FinancePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FinanceTab>('orders');

  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <h3 className="n4-clr fw_700 mb-xxl-10 mb-6">
          {t('FINANCE.title', 'Gestión de Finanzas')}
        </h3>

        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart size={18} weight="bold" />
              {t('FINANCE.orders_tab', 'Órdenes')}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <ArrowsLeftRight size={18} weight="bold" />
              {t('FINANCE.transactions_tab', 'Transacciones')}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'withdrawals' ? 'active' : ''}`}
              onClick={() => setActiveTab('withdrawals')}
            >
              <ArrowsDownUp size={18} weight="bold" />
              {t('FINANCE.withdrawals_tab', 'Retiros')}
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === 'orders' && <AdminOrdersList />}
        {activeTab === 'transactions' && <AdminTransactionsList />}
        {activeTab === 'withdrawals' && <AdminWithdrawalsList />}
      </div>
    </div>
  );
};

export default FinancePage;
