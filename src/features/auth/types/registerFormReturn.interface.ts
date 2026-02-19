import { FieldErrors } from 'react-hook-form';
import { Country } from '@/interfaces/country';
import { RegisterFormData } from '@/interfaces/registerFormData';
import React from 'react';

export interface UseRegisterFormReturn {
  formData: RegisterFormData;
  countries: Country[];
  selectedCountry: Country | null;
  isPasswordShow: boolean;
  isLoading: boolean;
  isLoadingCountries: boolean;
  error: string | null;
  fieldErrors: FieldErrors<Omit<RegisterFormData, 'countryId'>>;
  countryError: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setReferralCode: (code: string) => void;
}
