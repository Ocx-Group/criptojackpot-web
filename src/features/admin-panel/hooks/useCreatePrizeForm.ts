'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/store/notificationStore';
import { CreatePrizeRequest, PrizeType, PrizeImageRequest } from '@/interfaces/prize';
import { prizeService } from '@/services';
import { CreatePrizeFormData } from '../types/createPrizeFormData';
import { validateCreatePrizeForm } from '../validators/prizeValidations';

export const useCreatePrizeForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const [formData, setFormData] = useState<CreatePrizeFormData>({
    lotteryId: '',
    tier: 1,
    name: '',
    description: '',
    estimatedValue: 0,
    type: PrizeType.Physical,
    mainImageUrl: '',
    additionalImages: [],
    specifications: {},
    cashAlternative: 0,
    isDeliverable: true,
    isDigital: false,
  });

  const createPrizeMutation = useMutation({
    mutationFn: async (data: CreatePrizeRequest) => {
      return prizeService.createPrize(data);
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('PRIZES_ADMIN.create.success', 'Premio creado exitosamente'),
        t('PRIZES_ADMIN.create.successMessage', 'El premio se ha creado y está disponible')
      );
      queryClient.invalidateQueries({ queryKey: ['prizes'] });
      setTimeout(() => {
        router.push('/admin/prizes');
      }, 1000);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        t('PRIZES_ADMIN.create.error', 'Error al crear el premio. Intente nuevamente.');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number.parseFloat(value) || 0 }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeChange = (type: PrizeType) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleMainImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, mainImageUrl: url }));
  };

  const handleAddAdditionalImage = (image: PrizeImageRequest) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: [...prev.additionalImages, image],
    }));
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const handleRemoveSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateCreatePrizeForm(formData, t, showNotification)) {
      return;
    }

    // Preparar datos para enviar
    const submitData: CreatePrizeRequest = {
      lotteryId: formData.lotteryId || undefined,
      tier: formData.tier,
      name: formData.name,
      description: formData.description,
      estimatedValue: formData.estimatedValue,
      type: formData.type,
      mainImageUrl: formData.mainImageUrl,
      additionalImages: formData.additionalImages,
      specifications: formData.specifications,
      cashAlternative: formData.cashAlternative || undefined,
      isDeliverable: formData.isDeliverable,
      isDigital: formData.isDigital,
    };

    createPrizeMutation.mutate(submitData);
  };

  return {
    formData,
    isSubmitting: createPrizeMutation.isPending,
    handleInputChange,
    handleTypeChange,
    handleMainImageUrlChange,
    handleAddAdditionalImage,
    handleRemoveAdditionalImage,
    handleSpecificationChange,
    handleRemoveSpecification,
    handleSubmit,
    prizeTypes: PrizeType,
  };
};
