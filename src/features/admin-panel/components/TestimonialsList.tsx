'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useTestimonials } from '@/features/admin-panel/hooks';
import { Testimonial } from '@/interfaces/testimonial';
import Table from '@/components/table/Table';
import { TableColumn } from '@/components/table';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';

const TestimonialsList: React.FC = () => {
  const { t } = useTranslation();
  const { testimonials, isLoading, isDeleting, pagination, goToPage, deleteTestimonial } = useTestimonials({
    pageNumber: 1,
    pageSize: 10,
  });
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const { show } = useNotificationStore();

  const handleDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      await deleteTestimonial(testimonialToDelete.testimonialGuid);
      show(
        'success',
        t('COMMON.success', 'Éxito'),
        t('TESTIMONIALS_ADMIN.delete.success', 'Reseña eliminada correctamente')
      );
      setTestimonialToDelete(null);
    } catch {
      show('error', t('COMMON.error', 'Error'), t('TESTIMONIALS_ADMIN.delete.error', 'Error al eliminar la reseña'));
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="d-flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={14} className={i <= rating ? 'text-warning' : 'text-muted'} fill={i <= rating ? 'currentColor' : 'none'} />
        ))}
      </div>
    );
  };

  const columns: TableColumn[] = [
    { key: 'author', header: t('TESTIMONIALS_ADMIN.columns.author', 'Autor') },
    { key: 'text', header: t('TESTIMONIALS_ADMIN.columns.text', 'Texto') },
    { key: 'rating', header: t('TESTIMONIALS_ADMIN.columns.rating', 'Rating') },
    { key: 'status', header: t('TESTIMONIALS_ADMIN.columns.status', 'Estado') },
    { key: 'order', header: t('TESTIMONIALS_ADMIN.columns.order', 'Orden') },
    { key: 'actions', header: t('TESTIMONIALS_ADMIN.columns.actions', 'Acciones') },
  ];

  const tableData = testimonials.map((item: Testimonial) => ({
    id: item.testimonialGuid,
    author: (
      <div>
        <div className="fw-semibold">{item.authorName}</div>
        <small className="text-muted">{item.authorLocation}</small>
      </div>
    ),
    text: (
      <div style={{ maxWidth: '300px' }}>
        <small className="text-muted">{item.text.length > 80 ? `${item.text.substring(0, 80)}...` : item.text}</small>
      </div>
    ),
    rating: renderStars(item.rating),
    status: item.isActive ? (
      <span className="badge bg-success d-inline-flex align-items-center gap-1">
        <Eye size={12} />
        {t('TESTIMONIALS_ADMIN.active', 'Activa')}
      </span>
    ) : (
      <span className="badge bg-secondary d-inline-flex align-items-center gap-1">
        <EyeOff size={12} />
        {t('TESTIMONIALS_ADMIN.inactive', 'Inactiva')}
      </span>
    ),
    order: <span className="badge bg-light text-dark">{item.sortOrder}</span>,
    actions: (
      <div className="btn-group btn-group-sm">
        <Link
          href={`/admin/testimonials/${item.testimonialGuid}/edit`}
          className="btn btn-outline-primary"
          title={t('COMMON.edit', 'Editar')}
        >
          <Pencil size={14} />
        </Link>
        <button
          onClick={() => setTestimonialToDelete(item)}
          className="btn btn-outline-danger"
          title={t('COMMON.delete', 'Eliminar')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
  }));

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`btn ${pagination.pageNumber === i ? 'btn-primary' : 'btn-outline-secondary'}`}
          style={{ minWidth: '40px' }}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="text-muted">
          {t('COMMON.showing', 'Mostrando')} <strong>{(pagination.pageNumber - 1) * pagination.pageSize + 1}</strong> -{' '}
          <strong>{Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}</strong>{' '}
          {t('COMMON.of', 'de')} <strong>{pagination.totalCount}</strong> {t('COMMON.results', 'resultados')}
        </div>
        <div className="btn-group" aria-label="Paginación">
          <button
            className="btn btn-outline-secondary"
            onClick={() => goToPage(pagination.pageNumber - 1)}
            disabled={pagination.pageNumber === 1}
            title={t('COMMON.previous', 'Anterior')}
          >
            ←
          </button>
          {pages}
          <button
            className="btn btn-outline-secondary"
            onClick={() => goToPage(pagination.pageNumber + 1)}
            disabled={pagination.pageNumber === pagination.totalPages}
            title={t('COMMON.next', 'Siguiente')}
          >
            →
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="col-lg-9">
        <div className="user-panel-wrapper">
          <div className="text-center py-5">
            <div className="spinner-border text-primary">
              <span className="visually-hidden">{t('COMMON.loading', 'Cargando...')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-9">
      <div className="user-panel-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-xxl-10 mb-6">
          <h3 className="n4-clr fw_700 mb-0">{t('TESTIMONIALS_ADMIN.title', 'Gestión de Reseñas')}</h3>
          <Link href="/admin/testimonials/create" className="btn btn-primary">
            <Plus size={18} className="me-2" />
            {t('TESTIMONIALS_ADMIN.create.button', 'Crear Reseña')}
          </Link>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{t('TESTIMONIALS_ADMIN.list.title', 'Lista de Reseñas')}</h5>
            <small className="text-muted">
              {t('TESTIMONIALS_ADMIN.totalCount', 'Total')}: {pagination.totalCount}
            </small>
          </div>
          <div className="card-body p-0">
            {testimonials && testimonials.length > 0 ? (
              <>
                <Table columns={columns} data={tableData} />
                <div className="p-4 border-top bg-light">{renderPagination()}</div>
              </>
            ) : (
              <div className="text-center py-5">
                <Star size={48} className="text-muted mb-3" />
                <h5 className="text-muted">{t('TESTIMONIALS_ADMIN.empty', 'No hay reseñas creadas')}</h5>
                <p className="text-muted mb-4">
                  {t('TESTIMONIALS_ADMIN.emptyMessage', 'Comienza creando tu primera reseña para el landing page')}
                </p>
                <Link href="/admin/testimonials/create" className="btn btn-primary">
                  <Plus size={18} className="me-2" />
                  {t('TESTIMONIALS_ADMIN.create.button', 'Crear Reseña')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {testimonialToDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('TESTIMONIALS_ADMIN.delete.title', 'Eliminar Reseña')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setTestimonialToDelete(null)}
                  disabled={isDeleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  {t('TESTIMONIALS_ADMIN.delete.confirm', '¿Estás seguro de que deseas eliminar la reseña de')}{' '}
                  <strong>{testimonialToDelete.authorName}</strong>?
                </p>
                <p className="text-muted small">
                  {t('TESTIMONIALS_ADMIN.delete.warning', 'Esta acción no se puede deshacer.')}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setTestimonialToDelete(null)}
                  disabled={isDeleting}
                >
                  {t('COMMON.cancel', 'Cancelar')}
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {t('COMMON.deleting', 'Eliminando...')}
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="me-2" />
                      {t('COMMON.delete', 'Eliminar')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsList;
