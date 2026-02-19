import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useEffect, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { countryService, userService } from '@/services';
import { Country } from '@/interfaces/country';
import { FormData, UpdateUserRequest } from '@/features/user-panel/types';
import { createPersonalInfoSchema } from '@/features/user-panel/schemas/personalInfoSchema';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export function usePersonalInfoForm() {
  const { t } = useTranslation();
  const { user, updateUser } = useUserStore();
  const showNotification = useNotificationStore(state => state.show);
  const queryClient = useQueryClient();

  const schema = useMemo(() => createPersonalInfoSchema(t), [t]);
  const [countryError, setCountryError] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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

  const formData = watch();

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
    () => countries.find(c => c.id === formData.countryId) ?? null,
    [countries, formData.countryId]
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

  const updateUserMutation = useMutation({
    mutationFn: (userData: { id: number; data: UpdateUserRequest }) =>
      userService.updateUserAsync(userData.id, userData.data),
    onSuccess: updatedUserData => {
      updateUser(updatedUserData);
      showNotification('success', t('PERSONAL_INFO.notifications.updateSuccess'), '');
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] }).then();
    },
    onError: (error: Error) => {
      console.error('Failed to update profile:', error);
      showNotification('error', t('PERSONAL_INFO.notifications.updateError'), '');
    },
  });

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setValue(field, value, { shouldValidate: false });
    },
    [setValue]
  );

  const handleCountryChange = useCallback(
    (value: string) => {
      const parsed = Number.parseInt(value, 10);
      const countryId = Number.isNaN(parsed) ? 0 : parsed;
      setValue('countryId', countryId, { shouldValidate: false });
      setCountryError(countryId <= 0);
    },
    [setValue]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.countryId) {
      setCountryError(true);
      showNotification('error', t('REGISTER.errors.countryRequired', 'Por favor, seleccione un país'), '');
      return;
    }

    rhfHandleSubmit(
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
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', msg, '');
      }
    )();
  };

  return {
    formData,
    countries,
    selectedCountry,
    isLoadingCountries,
    countryError,
    handleChange,
    handleCountryChange,
    handleSubmit,
    isLoading: updateUserMutation.isPending,
    error: updateUserMutation.error,
  };
}
