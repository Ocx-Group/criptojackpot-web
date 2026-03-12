'use client';

import { MoneyIcon, TicketIcon, TrendUpIcon, UsersIcon } from '@phosphor-icons/react';
import { UserStatsResponse, OrderStatsResponse } from '@/services/dashboardService';

interface StatsSectionProps {
  userStats?: UserStatsResponse;
  orderStats?: OrderStatsResponse;
  isLoading: boolean;
}

function formatNumber(n: number): string {
  return n.toLocaleString('es-CO');
}

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function ChangeLabel({ value, suffix = '% este mes' }: { value: number; suffix?: string }) {
  const isPositive = value >= 0;
  return (
    <small className={isPositive ? 'text-success' : 'text-danger'}>
      {isPositive ? '+' : ''}{value}{suffix}
    </small>
  );
}

function StatSkeleton() {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="placeholder-glow">
          <span className="placeholder col-6 mb-2" style={{ height: 14 }}></span>
          <span className="placeholder col-4" style={{ height: 28 }}></span>
          <span className="placeholder col-5 mt-1" style={{ height: 12 }}></span>
        </div>
      </div>
    </div>
  );
}

const StatsSection = ({ userStats, orderStats, isLoading }: StatsSectionProps) => {
  if (isLoading) {
    return (
      <div className="row g-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="col-xl-3 col-md-6">
            <StatSkeleton />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Usuarios',
      value: formatNumber(userStats?.totalUsers ?? 0),
      change: userStats?.percentageChange ?? 0,
      icon: <UsersIcon size={32} className="text-white" />,
    },
    {
      label: 'Tickets Vendidos',
      value: formatNumber(orderStats?.totalTicketsSold ?? 0),
      change: orderStats?.ticketsPercentageChange ?? 0,
      icon: <TicketIcon size={32} className="text-white" />,
    },
    {
      label: 'Ingresos Total',
      value: formatCurrency(orderStats?.totalRevenue ?? 0),
      change: orderStats?.revenuePercentageChange ?? 0,
      icon: <MoneyIcon size={32} className="text-white" />,
    },
    {
      label: 'Tasa Conversión',
      value: `${orderStats?.conversionRate ?? 0}%`,
      change: orderStats?.conversionRateChange ?? 0,
      icon: <TrendUpIcon size={32} className="text-white" />,
    },
  ];

  return (
    <div className="row g-4 mb-6">
      {stats.map(stat => (
        <div key={stat.label} className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-2">{stat.label}</p>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
                  <ChangeLabel value={stat.change} />
                </div>
                <div className="act4-bg rounded-circle p-3">
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
