'use client';

import { useRouter } from 'next/navigation';
import React, { FormEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { Country } from '@/interfaces/country';
import { RegisterFormData } from '@/interfaces/registerFormData';
import { UseRegisterFormReturn } from '@/features/auth/types';
import { User, CreateUserRequest } from '@/interfaces/user';
import { createRegisterSchema } from '@/features/auth/schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';
import { useCreateUser } from './useCreateUser';

export const useRegisterForm = (): UseRegisterFormReturn => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);

  const { countries, isLoadingCountries, createUser, isCreating, error } = useCreateUser({
    onSuccess: () => {
      setTimeout(() => {
        router.push('/login');
      }, 800);
    },
    showNotifications: true,
  });

  const schema = useMemo(() => createRegisterSchema(t), [t]);

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
  } = useForm<Omit<RegisterFormData, 'countryId'>>({
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
      referralCode: '',
    },
  });

  const formData = watch();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setValue(name as keyof Omit<RegisterFormData, 'countryId'>, value.replaceAll(/\D/g, ''), {
        shouldValidate: false,
      });
    } else {
      setValue(name as keyof Omit<RegisterFormData, 'countryId'>, value, { shouldValidate: false });
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find(c => c.id === Number.parseInt(e.target.value, 10)) || null;
    setSelectedCountry(country);
  };

  const togglePasswordVisibility = () => setIsPasswordShow(prev => !prev);

  const setReferralCode = useCallback(
    (code: string) => {
      if (code) {
        setValue('referralCode', code);
      }
    },
    [setValue]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Country validation (outside schema since it's a separate state)
    if (!selectedCountry) {
      showNotification('error', t('REGISTER.errors.requiredFields'), '');
      return;
    }

    rhfHandleSubmit(
      data => {
        const userData: CreateUserRequest = {
          ...data,
          countryId: selectedCountry?.id ?? 0,
          statePlace: data.state,
          status: true,
          roleId: 2, // Siempre rol Cliente para registro público
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
    formData: formData as RegisterFormData,
    countries,
    selectedCountry,
    isPasswordShow,
    isLoading: isCreating,
    isLoadingCountries,
    error,
    handleInputChange,
    handleCountryChange,
    togglePasswordVisibility,
    handleSubmit,
    setReferralCode,
  };
};
