'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { countryService, userService } from '@/services';
import { Country } from '@/interfaces/country';
import { User, CreateUserRequest } from '@/interfaces/user';
import { useNotificationStore } from '@/store/notificationStore';

export interface CreateUserOptions {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
  showNotifications?: boolean;
}

/**
 * Hook compartido para crear usuarios.
 * Puede ser usado tanto en el registro público como en la creación administrativa.
 */
export const useCreateUser = (options?: CreateUserOptions) => {
  const { t } = useTranslation();
  const showNotification = useNotificationStore(state => state.show);

  const {
    data: countries = [],
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: () => countryService.getAllCountries(),
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (countriesError && options?.showNotifications !== false) {
      showNotification('error', t('REGISTER.errors.countryLoadError', 'No se pudo cargar países'), '');
    }
  }, [countriesError, showNotification, t, options?.showNotifications]);

  const createMutation = useMutation({
    mutationFn: (userData: CreateUserRequest) => userService.createUser(userData),
    onSuccess: (user: User) => {
      if (options?.showNotifications !== false) {
        showNotification(
          'success',
          t('REGISTER.success', 'Usuario creado'),
          t('REGISTER.successMessage', 'El usuario fue creado correctamente.')
        );
      }
      options?.onSuccess?.(user);
    },
    onError: (error: Error) => {
      if (options?.showNotifications !== false) {
        showNotification('error', t('REGISTER.errors.serverError', 'Error al crear el usuario'), '');
      }
      options?.onError?.(error);
    },
  });

  const findCountryById = (countryId: number): Country | undefined => {
    return countries.find(c => c.id === countryId);
  };

  return {
    countries,
    isLoadingCountries,
    createUser: createMutation.mutate,
    isCreating: createMutation.isPending,
    error: createMutation.error ? (createMutation.error as Error).message : null,
    findCountryById,
  };
};
