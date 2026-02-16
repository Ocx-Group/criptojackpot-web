'use client';

import React, { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateUser } from '@/features/auth/hooks/useCreateUser';
import { useNotificationStore } from '@/store/notificationStore';
import { Country } from '@/interfaces/country';
import { User, CreateUserRequest } from '@/interfaces/user';
import { Role } from '@/interfaces/role';
import { createAdminUserSchema } from '@/features/admin-panel/schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';
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

  const schema = useMemo(() => createAdminUserSchema(t), [t]);

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
  } = useForm<AdminUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
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
    },
  });

  const formData = watch();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValue(name as keyof AdminUserFormData, checked as any, { shouldValidate: false });
    } else if (name === 'phone') {
      setValue('phone', value.replaceAll(/\D/g, ''), { shouldValidate: false });
    } else if (name === 'roleId') {
      setValue('roleId', Number.parseInt(value, 10), { shouldValidate: false });
    } else {
      setValue(name as keyof AdminUserFormData, value as any, { shouldValidate: false });
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find(c => c.id === Number.parseInt(e.target.value, 10)) || null;
    setSelectedCountry(country);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Country validation (outside schema since it's a separate state)
    if (!selectedCountry) {
      showNotification('error', t('REGISTER.errors.requiredFields', 'Todos los campos son requeridos'), '');
      return;
    }

    rhfHandleSubmit(
      data => {
        const userData: CreateUserRequest = {
          ...data,
          countryId: selectedCountry?.id ?? 0,
          statePlace: data.state,
          country: selectedCountry || undefined,
        };

        createUser(userData);
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', msg, '');
      }
    )();
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
