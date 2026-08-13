import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Country } from '@/interfaces/country';
import { RegisterFormData } from '@/interfaces/registerFormData';
import React from 'react';

export interface UseRegisterFormReturn {
  register: UseFormRegister<RegisterFormData>;
  countries: Country[];
  selectedCountry: Country | null;
  /** Valor actual de la contraseña, para pintar la checklist de requisitos. */
  passwordValue: string;
  isPasswordShow: boolean;
  isLoading: boolean;
  isLoadingCountries: boolean;
  isSubmitted: boolean;
  error: string | null;
  fieldErrors: FieldErrors<RegisterFormData>;
  handleCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  setReferralCode: (code: string) => void;
}
