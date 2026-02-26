'use client';

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyTickets } from '@/features/user-panel/hooks/useMyTickets';
import { TicketStatus } from '@/interfaces/ticket';

const PAGE_SIZE = 6;

const UserPanelSection = () => {
  const { t } = useTranslation();
  const { tickets, isLoading, error } = useMyTickets();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE));
  const paginatedTickets = tickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Active:
        return t('MY_TICKETS.statusActive');
      case TicketStatus.Won:
        return t('MY_TICKETS.statusWon');
      case TicketStatus.Lost:
        return t('MY_TICKETS.statusLost');
      case TicketStatus.Refunded:
        return t('MY_TICKETS.statusRefunded');
      default:
        return '';
    }
  };

  return (
    <div className="col-xxl-9 col-xl-8 col-lg-8">
      <div className="cmn-box-addingbg win40-ragba border radius24 py-xxl-10 py-xl-8 py-lg-6 py-5 px-xxl-8 px-xl-6 px-sm-5 px-4">
        <h3 className="user-title n4-clr mb-xxl-10 mb-xl-8 mb-lg-6 mb-5">{t('MY_TICKETS.title')}</h3>

        {isLoading && <p className="n4-clr text-center">{t('MY_TICKETS.loading')}</p>}

        {error && <p className="text-danger text-center">{t('MY_TICKETS.error')}</p>}

        {!isLoading && !error && tickets.length === 0 && (
          <p className="n4-clr text-center">{t('MY_TICKETS.empty')}</p>
        )}

        {!isLoading && !error && tickets.length > 0 && (
          <>
            <div className="row g-xl-6 g-4">
              {paginatedTickets.map(ticket => (
                <div key={`ticket-${ticket.id}`} className="col-lg-6 col-md-6">
                  <div className="my-ticket-boxwrap position-relative overflow-hidden">
                    <div className="my-ticket-box n0-bg d-grid align-items-center h-100 overflow-hidden border radius12 py-xxl-5 py-4 position-relative">
                      <div className="d-flex align-items-center justify-content-between gap-3 mb-12 px-xxl-8 px-xl-6 px-sm-5 px-3">
                        <span className="fs20 fw_700 n4-clr">
                          {t('MY_TICKETS.ticketLabel')}
                          {String(ticket.id).padStart(2, '0')}
                        </span>
                        <span className="fw_600 n4-clr">{getStatusLabel(ticket.status)}</span>
                      </div>
                      <div className="ticket-border position-relative"></div>
                      <div className="d-flex align-items-center justify-content-between gap-3 pt-xl-3 pt-5 px-xxl-8 px-xl-6 px-sm-5 px-3">
                        <div className="ticket-in text-center">
                          <span className="fs18 fw_600 n4-clr d-block mb-2">{t('MY_TICKETS.number')}</span>
                          <span className="s1-clr fw_600">{ticket.number}</span>
                        </div>
                        <div className="ticket-in text-center">
                          <span className="fs18 fw_600 n4-clr d-block mb-2">{t('MY_TICKETS.series')}</span>
                          <span className="s1-clr fw_600">{ticket.series}</span>
                        </div>
                        <div className="ticket-in text-center">
                          <span className="fs18 fw_600 n4-clr d-block mb-2">{t('MY_TICKETS.amount')}</span>
                          <span className="s1-clr fw_600">${ticket.purchaseAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

export default UserPanelSection;
