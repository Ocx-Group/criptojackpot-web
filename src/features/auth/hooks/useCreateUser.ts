'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useEffect } from 'react';

import { countryService, userService } from '@/services';
import { isApiError, isApiValidationError } from '@/services/apiError';
import { Country } from '@/interfaces/country';
import { User, CreateUserRequest } from '@/interfaces/user';
import { useNotificationStore } from '@/store/notificationStore';

/**
 * Traduce el error del backend a un mensaje accionable.
 * El 400 de validación llega con el texto genérico "One or more validation errors
 * occurred"; en ese caso el detalle real se pinta campo a campo en el formulario,
 * así que el toast solo invita a revisar los campos marcados.
 */
export function resolveCreateUserErrorMessage(error: unknown, t: TFunction): string {
  if (isApiValidationError(error)) {
    return t('REGISTER.errors.reviewHighlightedFields', 'Revisa los campos marcados en rojo');
  }

  if (isApiError(error) && error.status === 409) {
    return t('REGISTER.errors.emailExists', 'Este correo electrónico ya está registrado');
  }

  return t('REGISTER.errors.serverError', 'Error al crear el usuario');
}

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
        showNotification('error', resolveCreateUserErrorMessage(error, t), '');
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
    // Mensaje ya traducido: el backend devuelve "One or more validation errors
    // occurred", que no le dice nada al usuario.
    error: createMutation.error ? resolveCreateUserErrorMessage(createMutation.error, t) : null,
    findCountryById,
  };
};
