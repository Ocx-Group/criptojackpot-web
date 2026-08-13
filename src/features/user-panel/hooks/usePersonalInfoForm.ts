import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { countryService, userService } from '@/services';
import { isApiValidationError } from '@/services/apiError';
import { Country } from '@/interfaces/country';
import { FormData, UpdateUserRequest } from '@/features/user-panel/types';
import { createPersonalInfoSchema } from '@/features/user-panel/schemas/personalInfoSchema';
import { applyServerFieldErrors, focusFirstInvalidField } from '@/utils/applyServerFieldErrors';

/** Orden visual del formulario: determina a qué campo se lleva el foco primero. */
const FIELD_ORDER: (keyof FormData)[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'countryId',
  'statePlace',
  'city',
  'address',
];

export function usePersonalInfoForm() {
  const { t } = useTranslation();
  const { user, updateUser } = useUserStore();
  const showNotification = useNotificationStore(state => state.show);
  const queryClient = useQueryClient();

  const schema = useMemo(() => createPersonalInfoSchema(t), [t]);

  const {
    register,
    watch,
    setValue,
    setError,
    handleSubmit: rhfHandleSubmit,
    formState: { errors: fieldErrors, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    // onTouched: el error aparece al salir del campo y se limpia mientras se corrige.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryId: 0,
      statePlace: '',
      city: '',
      address: '',
    },
  });

  const countryId = watch('countryId');
  // El email no se puede editar: se muestra en un input deshabilitado, por lo que
  // no se registra en RHF (un input disabled no reporta valor) y se lee del estado.
  const email = watch('email');

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

  const selectedCountry: Country | null = useMemo(
    () => countries.find(c => c.id === countryId) ?? null,
    [countries, countryId]
  );

  useEffect(() => {
    if (countriesError) {
      showNotification('error', t('REGISTER.errors.countryLoadError', 'No se pudo cargar países'), '');
    }
  }, [countriesError, showNotification, t]);

  useEffect(() => {
    if (user) {
      setValue('firstName', user.name || '');
      setValue('lastName', user.lastName || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
      setValue('countryId', user.countryId || 0);
      setValue('statePlace', user.statePlace || '');
      setValue('city', user.city || '');
      setValue('address', user.address || '');
    }
  }, [user, setValue]);

  /** Mapa propiedad del backend (en minúsculas) → campo del formulario. */
  const serverFieldMap = useMemo(
    () => ({
      name: { field: 'firstName' as const },
      lastname: { field: 'lastName' as const },
      phone: { field: 'phone' as const },
      countryid: { field: 'countryId' as const },
      stateplace: { field: 'statePlace' as const },
      city: { field: 'city' as const },
      address: { field: 'address' as const },
    }),
    []
  );

  const updateUserMutation = useMutation({
    mutationFn: (userData: { id: number; data: UpdateUserRequest }) =>
      userService.updateUserAsync(userData.id, userData.data),
    onSuccess: updatedUserData => {
      // Preserve imagePath: the update request doesn't include it, so the
      // backend response may return imagePath: null. Falling back to the
      // current value prevents the profile photo from disappearing.
      updateUser({
        ...updatedUserData,
        imagePath: updatedUserData.imagePath ?? user?.imagePath,
      });
      showNotification('success', t('PERSONAL_INFO.notifications.updateSuccess'), '');
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] }).then();
    },
    onError: (error: Error) => {
      // El backend responde 400 con el texto genérico "One or more validation
      // errors occurred": se vuelca el detalle sobre los campos afectados.
      const applied = applyServerFieldErrors<FormData>(error, serverFieldMap, setError);

      if (applied.length > 0) {
        showNotification(
          'error',
          t('REGISTER.errors.reviewHighlightedFields', 'Revisa los campos marcados en rojo'),
          ''
        );
        focusFirstInvalidField(FIELD_ORDER.filter(field => applied.includes(field)));
        return;
      }

      if (isApiValidationError(error)) {
        showNotification(
          'error',
          t('REGISTER.errors.reviewHighlightedFields', 'Revisa los campos marcados en rojo'),
          ''
        );
        return;
      }

      showNotification('error', t('PERSONAL_INFO.notifications.updateError'), '');
    },
  });

  const handleCountryChange = useCallback(
    (value: string) => {
      const parsed = Number.parseInt(value, 10);
      setValue('countryId', Number.isNaN(parsed) ? 0 : parsed, { shouldValidate: true, shouldTouch: true });
    },
    [setValue]
  );

  const handleSubmit = rhfHandleSubmit(
    data => {
      if (user && user.id) {
        const updatedUserData: UpdateUserRequest = {
          name: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          countryId: data.countryId,
          statePlace: data.statePlace,
          city: data.city,
          address: data.address,
        };

        updateUserMutation.mutate({ id: user.id, data: updatedUserData });
      }
    },
    errors => {
      const invalidFields = FIELD_ORDER.filter(field => field in errors);
      showNotification(
        'error',
        t('REGISTER.errors.missingRequiredFields', 'Faltan campos obligatorios por completar'),
        ''
      );
      focusFirstInvalidField(invalidFields);
    }
  );

  return {
    register,
    email,
    countries,
    selectedCountry,
    isLoadingCountries,
    fieldErrors,
    isSubmitted,
    handleCountryChange,
    handleSubmit,
    isLoading: updateUserMutation.isPending,
    error: updateUserMutation.error,
  };
}
