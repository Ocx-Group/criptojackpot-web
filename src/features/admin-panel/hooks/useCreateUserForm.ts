'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import { useCreateUser } from '@/features/auth/hooks/useCreateUser';
import { useNotificationStore } from '@/store/notificationStore';
import { Country } from '@/interfaces/country';
import { User } from '@/interfaces/user';
import { Role } from '@/interfaces/role';
import { validateRegisterForm } from '@/features/auth/validators/registerValidations';
import { roleService } from '@/services';

interface AdminUserFormData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  identification: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  roleId: number;
  status: boolean;
}

export const useCreateUserForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);

  // Reutilizar el hook compartido de creación de usuario
  const { countries, isLoadingCountries, createUser, isCreating } = useCreateUser({
    onSuccess: () => {
      showNotification('success', t('USERS_ADMIN.create.success', 'Usuario creado exitosamente'), '');
      setTimeout(() => {
        router.push('/admin/users');
      }, 800);
    },
    showNotifications: false, // Manejamos notificaciones manualmente
  });

  // Obtener roles disponibles
  const { data: roles = [] } = useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: async () => {
      return roleService.getAllRoles();
    },
    staleTime: Infinity,
  });

  const [formData, setFormData] = useState<AdminUserFormData>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    identification: '',
    phone: '',
    state: '',
    city: '',
    address: '',
    roleId: 2, // Por defecto rol Cliente
    status: true,
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: value.replaceAll(/\D/g, '') }));
    } else if (name === 'roleId') {
      setFormData(prev => ({ ...prev, [name]: Number.parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find(c => c.id === Number.parseInt(e.target.value, 10)) || null;
    setSelectedCountry(country);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar el formulario usando la validación compartida
    if (!validateRegisterForm(formData, selectedCountry, t, showNotification)) {
      return;
    }

    // Validación adicional específica del admin
    if (!formData.roleId) {
      showNotification('error', t('USERS_ADMIN.create.errors.roleRequired', 'Debe seleccionar un rol'), '');
      return;
    }

    const userData: User = {
      ...formData,
      countryId: selectedCountry?.id ?? 0,
      statePlace: formData.state,
      country: selectedCountry || undefined,
    };

    createUser(userData);
  };

  return {
    countries,
    isLoadingCountries,
    formData,
    selectedCountry,
    roles,
    isSubmitting: isCreating,
    handleInputChange,
    handleCountryChange,
    handleSubmit,
  };
};
