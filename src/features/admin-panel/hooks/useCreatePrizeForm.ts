'use client';

import { FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { CreatePrizeRequest, PrizeType, PrizeImageRequest } from '@/interfaces/prize';
import { prizeService } from '@/services';
import { CreatePrizeFormData } from '../types/createPrizeFormData';
import { createCreatePrizeSchema } from '../schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useCreatePrizeForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const schema = useMemo(() => createCreatePrizeSchema(t), [t]);

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
  } = useForm<CreatePrizeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
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
    },
  });

  const formData = watch();

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
      setValue(name as keyof CreatePrizeFormData, (Number.parseFloat(value) || 0) as any, { shouldValidate: false });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValue(name as keyof CreatePrizeFormData, checked as any, { shouldValidate: false });
    } else {
      setValue(name as keyof CreatePrizeFormData, value as any, { shouldValidate: false });
    }
  };

  const handleTypeChange = (type: PrizeType) => {
    setValue('type', type, { shouldValidate: false });
  };

  const handleMainImageUrlChange = (url: string) => {
    setValue('mainImageUrl', url, { shouldValidate: false });
  };

  const handleAddAdditionalImage = (image: PrizeImageRequest) => {
    setValue('additionalImages', [...formData.additionalImages, image], { shouldValidate: false });
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setValue(
      'additionalImages',
      formData.additionalImages.filter((_, i) => i !== index),
      { shouldValidate: false }
    );
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setValue('specifications', { ...formData.specifications, [key]: value }, { shouldValidate: false });
  };

  const handleRemoveSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setValue('specifications', newSpecs, { shouldValidate: false });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    rhfHandleSubmit(
      data => {
        // Preparar datos para enviar
        const submitData: CreatePrizeRequest = {
          lotteryId: data.lotteryId || undefined,
          tier: data.tier,
          name: data.name,
          description: data.description,
          estimatedValue: data.estimatedValue,
          type: data.type,
          mainImageUrl: data.mainImageUrl,
          additionalImages: data.additionalImages,
          specifications: data.specifications,
          cashAlternative: data.cashAlternative || undefined,
          isDeliverable: data.isDeliverable,
          isDigital: data.isDigital,
        };

        createPrizeMutation.mutate(submitData);
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', t('COMMON.error', 'Error'), msg);
      }
    )();
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
