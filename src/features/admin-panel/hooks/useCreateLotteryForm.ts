'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';

import { useNotificationStore } from '@/store/notificationStore';
import { CreateLotteryRequest } from '@/interfaces/lottery';
import { lotteryService } from '@/services';
import { validateCreateLotteryForm } from '../validators/lotteryValidations';
import { initialFormData } from '../types/createLotteryFormData';

export const useCreateLotteryForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const showNotification = useNotificationStore(state => state.show);

  const [formData, setFormData] = useState<CreateLotteryRequest>(initialFormData);

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
    onError: (error: any) => {
      const errorMessage =
        error?.message || t('LOTTERY_ADMIN.create.error', 'Error al crear la lotería. Intente nuevamente.');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number.parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRestrictedCountriesChange = (countries: string[]) => {
    setFormData(prev => ({ ...prev, restrictedCountries: countries }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateCreateLotteryForm(formData, t, showNotification)) {
      return;
    }

    // Preparar datos para enviar
    const submitData: CreateLotteryRequest = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      status: Number(formData.status),
      type: Number(formData.type),
    };

    createLotteryMutation.mutate(submitData);
  };

  const resetForm = () => {
    setFormData(initialFormData);
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
