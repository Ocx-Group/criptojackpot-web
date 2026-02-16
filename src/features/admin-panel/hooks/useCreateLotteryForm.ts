'use client';

import { FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { CreateLotteryRequest } from '@/interfaces/lottery';
import { lotteryService } from '@/services';
import { createCreateLotterySchema } from '../schemas';
import { initialFormData } from '../types/createLotteryFormData';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useCreateLotteryForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);

  const schema = useMemo(() => createCreateLotterySchema(t), [t]);

  const {
    watch,
    setValue,
    reset,
    handleSubmit: rhfHandleSubmit,
  } = useForm<CreateLotteryRequest>({
    resolver: zodResolver(schema),
    defaultValues: initialFormData,
  });

  const formData = watch();

  const createLotteryMutation = useMutation({
    mutationFn: async (data: CreateLotteryRequest) => {
      return lotteryService.createLottery(data);
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('LOTTERY_ADMIN.create.success', 'Lotería creada exitosamente'),
        t('LOTTERY_ADMIN.create.successMessage', 'La lotería se ha creado correctamente')
      );
      setTimeout(() => {
        router.push('/admin/lotteries');
      }, 1000);
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || t('LOTTERY_ADMIN.create.error', 'Error al crear la lotería. Intente nuevamente.');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setValue(name as keyof CreateLotteryRequest, checked as any, { shouldValidate: false });
    } else if (type === 'number') {
      setValue(name as keyof CreateLotteryRequest, (Number.parseFloat(value) || 0) as any, { shouldValidate: false });
    } else {
      setValue(name as keyof CreateLotteryRequest, value as any, { shouldValidate: false });
    }
  };

  const handleRestrictedCountriesChange = (countries: string[]) => {
    setValue('restrictedCountries', countries, { shouldValidate: false });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    rhfHandleSubmit(
      data => {
        // Preparar datos para enviar
        const submitData: CreateLotteryRequest = {
          ...data,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          status: Number(data.status),
          type: Number(data.type),
        };

        createLotteryMutation.mutate(submitData);
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', t('COMMON.error', 'Error'), msg);
      }
    )();
  };

  const resetForm = () => {
    reset(initialFormData);
  };

  return {
    formData,
    isSubmitting: createLotteryMutation.isPending,
    handleInputChange,
    handleRestrictedCountriesChange,
    handleSubmit,
    resetForm,
  };
};
