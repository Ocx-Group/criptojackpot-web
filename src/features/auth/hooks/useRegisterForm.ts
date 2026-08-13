'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { Country } from '@/interfaces/country';
import { RegisterFormData } from '@/interfaces/registerFormData';
import { UseRegisterFormReturn } from '@/features/auth/types';
import { CreateUserRequest } from '@/interfaces/user';
import { createRegisterSchema } from '@/features/auth/schemas';
import { applyServerFieldErrors, focusFirstInvalidField } from '@/utils/applyServerFieldErrors';
import { isApiError } from '@/services/apiError';
import { useCreateUser } from './useCreateUser';

/** Orden visual del formulario: determina a qué campo se lleva el foco primero. */
const FIELD_ORDER: (keyof RegisterFormData)[] = [
  'name',
  'lastName',
  'email',
  'password',
  'countryId',
  'identification',
  'phone',
  'state',
  'city',
  'address',
];

export const useRegisterForm = (): UseRegisterFormReturn => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);

  const schema = useMemo(() => createRegisterSchema(t), [t]);

  const {
    register,
    watch,
    setValue,
    setError,
    handleSubmit: rhfHandleSubmit,
    formState: { errors: fieldErrors, isSubmitted },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    // onTouched: el error aparece al salir del campo y se limpia mientras se corrige.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      countryId: 0,
      identification: '',
      phone: '',
      state: '',
      city: '',
      address: '',
      referralCode: '',
    },
  });

  /** Mapa propiedad del backend (en minúsculas) → campo del formulario. */
  const serverFieldMap = useMemo(
    () => ({
      name: { field: 'name' as const },
      lastname: { field: 'lastName' as const },
      email: { field: 'email' as const },
      password: { field: 'password' as const },
      countryid: { field: 'countryId' as const },
      identification: { field: 'identification' as const },
      phone: { field: 'phone' as const },
      stateplace: { field: 'state' as const },
      city: { field: 'city' as const },
      address: { field: 'address' as const },
      referralcode: { field: 'referralCode' as const },
    }),
    []
  );

  const { countries, isLoadingCountries, createUser, isCreating, error } = useCreateUser({
    onSuccess: () => {
      setTimeout(() => {
        router.push('/login');
      }, 800);
    },
    onError: mutationError => {
      // 400 con detalle por campo → se marcan en rojo los inputs concretos.
      const applied = applyServerFieldErrors<RegisterFormData>(mutationError, serverFieldMap, setError);

      // 409: el email ya existe. El backend no lo devuelve como error de campo,
      // pero para el usuario el problema está en el input de email.
      if (applied.length === 0 && isApiError(mutationError) && mutationError.status === 409) {
        setError('email', {
          type: 'server',
          message: t('REGISTER.errors.emailExists', 'Este correo electrónico ya está registrado'),
        });
        applied.push('email');
      }

      focusFirstInvalidField(FIELD_ORDER.filter(field => applied.includes(field)));
    },
    showNotifications: true,
  });

  const countryId = watch('countryId');
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const selectedCountry: Country | null = useMemo(
    () => countries.find(c => c.id === countryId) ?? null,
    [countries, countryId]
  );

  const passwordValue = watch('password');

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const parsed = Number.parseInt(e.target.value, 10);
      setValue('countryId', Number.isNaN(parsed) ? 0 : parsed, { shouldValidate: true, shouldTouch: true });
    },
    [setValue]
  );

  const togglePasswordVisibility = () => setIsPasswordShow(prev => !prev);

  const setReferralCode = useCallback(
    (code: string) => {
      if (code) {
        setValue('referralCode', code);
      }
    },
    [setValue]
  );

  const handleSubmit = rhfHandleSubmit(
    data => {
      const userData: CreateUserRequest = {
        ...data,
        countryId: data.countryId,
        statePlace: data.state,
        status: true,
      };

      createUser(userData);
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
    countries,
    selectedCountry,
    passwordValue,
    isPasswordShow,
    isLoading: isCreating,
    isLoadingCountries,
    isSubmitted,
    error,
    fieldErrors,
    handleCountryChange,
    togglePasswordVisibility,
    handleSubmit,
    setReferralCode,
  };
};
