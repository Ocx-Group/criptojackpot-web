'use client';

import React, { useState } from 'react';
import Table from '@/components/table/Table';
import { TableColumn } from '@/components/table';
import {User} from "@/interfaces/user";
import {useUsers} from "@/features/admin-panel/hooks/useUsers";
import { useTranslation } from 'react-i18next';
import AdminCreditModal from '@/features/admin-panel/components/AdminCreditModal';
import { DollarSign } from 'lucide-react';

const UsersAdminPage: React.FC = () => {
    const { users, isLoading, isError, error } = useUsers();
    const { t } = useTranslation();
    const [creditModalUser, setCreditModalUser] = useState<User | null>(null);

    const columns: TableColumn[] = [
        { key: 'id', header: t('USERS_ADMIN.columns.id') },
        { key: 'name', header: t('USERS_ADMIN.columns.name') },
        { key: 'lastName', header: t('USERS_ADMIN.columns.lastName') },
        { key: 'email', header: t('USERS_ADMIN.columns.email') },
        { key: 'phone', header: t('USERS_ADMIN.columns.phone') },
        { key: 'country', header: t('USERS_ADMIN.columns.country') },
        { key: 'city', header: t('USERS_ADMIN.columns.city') },
        { key: 'status', header: t('USERS_ADMIN.columns.status') },
        { key: 'role', header: t('USERS_ADMIN.columns.role') },
        { key: 'actions', header: t('USERS_ADMIN.columns.actions', 'Acciones') },
    ];

    // Transform users data to match the table format
    const tableData = users?.map((user: User) => ({
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || t('USERS_ADMIN.notAvailable'),
        country: user.country?.name || t('USERS_ADMIN.notAvailable'),
        city: user.city || t('USERS_ADMIN.notAvailable'),
        status: user.status ? t('USERS_ADMIN.status.active') : t('USERS_ADMIN.status.inactive'),
        role: user.role?.name || t('USERS_ADMIN.notAvailable'),
        actions: (
            <button
                className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                onClick={() => setCreditModalUser(user)}
                title={t('ADMIN_CREDIT.title', 'Agregar Saldo Interno')}
            >
                <DollarSign size={14} />
                {t('ADMIN_CREDIT.addBalance', 'Agregar Saldo')}
            </button>
        ),
    })) || [];

    // Extract content rendering logic into separate functions
    const renderLoadingContent = () => (
        <div className="text-center py-5">
            <div className="spinner-border text-primary">
                <output className="visually-hidden">{t('USERS_ADMIN.loading')}</output>
            </div>
        </div>
    );

    const renderErrorContent = () => (
        <div className="alert alert-danger" role="alert">
            {error?.message || t('USERS_ADMIN.errors.loadingError')}
        </div>
    );

    const renderSuccessContent = () => (
        <div className="card border-0 shadow-sm mb-6">
            <div className="card-header bg-white py-4 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{t('USERS_ADMIN.usersList')}</h5>
                <a href="/admin/users/create" className="btn btn-primary">
                    {t('USERS_ADMIN.createUser') || 'Crear usuario'}
                </a>
            </div>
            <div className="card-body">
                {(users?.length || 0) === 0 ? (
                    <p className="text-center py-4">{t('USERS_ADMIN.noUsers')}</p>
                ) : (
                    <Table columns={columns} data={tableData} />
                )}
            </div>
        </div>
    );

    // Determine which content to render based on state
    const renderContent = () => {
        if (isLoading) {
            return renderLoadingContent();
        }

        if (isError) {
            return renderErrorContent();
        }

        return renderSuccessContent();
    };

    return (
        <div className="col-lg-9">
            <div className="user-panel-wrapper">
                <h3 className="n4-clr fw_700 mb-xxl-10 mb-6">{t('USERS_ADMIN.title')}</h3>
                {renderContent()}
            </div>

            {creditModalUser && (
                <AdminCreditModal
                    user={creditModalUser}
                    onClose={() => setCreditModalUser(null)}
                />
            )}
        </div>
    );
};

export default UsersAdminPage;