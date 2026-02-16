'use client';

import { FormEvent, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { UpdatePrizeRequest, PrizeType, PrizeImage, Prize } from '@/interfaces/prize';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { prizeService } from '@/services';
import { EditPrizeFormData } from '../types/editPrizeFormData';
import { createEditPrizeSchema } from '../schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useEditPrizeForm = (prizeId: string) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const schema = useMemo(() => createEditPrizeSchema(t), [t]);

  const {
    watch,
    setValue,
    reset,
    handleSubmit: rhfHandleSubmit,
  } = useForm<EditPrizeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: '',
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
      tier: 1,
    },
  });

  const formData = watch();

  // Query para obtener todos los premios y filtrar el que necesitamos
  const {
    data: prizesResponse,
    isLoading,
    isSuccess,
  } = useQuery<PaginatedResponse<Prize>, Error>({
    queryKey: ['prizes'],
    queryFn: async () => {
      return prizeService.getAllPrizes({ pageNumber: 1, pageSize: 100 });
    },
    enabled: !!prizeId,
  });

  // Encontrar el premio específico de la lista
  const prize = prizesResponse?.data?.items?.find((p: Prize) => p.prizeGuid === prizeId);

  // Actualizar formData cuando se encuentra el premio
  useEffect(() => {
    if (isSuccess && prize) {
      reset({
        id: prize.prizeGuid,
        name: prize.name || '',
        description: prize.description || '',
        estimatedValue: prize.estimatedValue ?? 0,
        type: prize.type ?? PrizeType.Physical,
        mainImageUrl: prize.mainImageUrl || '',
        additionalImages: prize.additionalImages || [],
        specifications: prize.specifications || {},
        cashAlternative: prize.cashAlternative ?? 0,
        isDeliverable: prize.isDeliverable ?? true,
        isDigital: prize.isDigital ?? false,
        tier: prize.tier ?? 1,
      });
    }
  }, [isSuccess, prize, reset]);

  const updatePrizeMutation = useMutation({
    mutationFn: async (data: UpdatePrizeRequest) => {
      return prizeService.updatePrize(prizeId, data);
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('PRIZES_ADMIN.edit.success', 'Premio actualizado exitosamente'),
        t('PRIZES_ADMIN.edit.successMessage', 'Los cambios han sido guardados correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['prizes'] });
      setTimeout(() => {
        router.push('/admin/prizes');
      }, 1000);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        t('PRIZES_ADMIN.edit.error', 'Error al actualizar el premio. Intente nuevamente.');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setValue(name as keyof EditPrizeFormData, (Number.parseFloat(value) || 0) as any, { shouldValidate: false });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValue(name as keyof EditPrizeFormData, checked as any, { shouldValidate: false });
    } else {
      setValue(name as keyof EditPrizeFormData, value as any, { shouldValidate: false });
    }
  };

  const handleTypeChange = (type: PrizeType) => {
    setValue('type', type, { shouldValidate: false });
  };

  const handleMainImageUrlChange = (url: string) => {
    setValue('mainImageUrl', url, { shouldValidate: false });
  };

  const handleAddAdditionalImage = (image: Omit<PrizeImage, 'id'>) => {
    const newImage: PrizeImage = {
      ...image,
      id: crypto.randomUUID(),
    };
    setValue('additionalImages', [...formData.additionalImages, newImage], { shouldValidate: false });
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
        const submitData: UpdatePrizeRequest = {
          name: data.name,
          description: data.description,
          estimatedValue: data.estimatedValue,
          mainImageUrl: data.mainImageUrl,
          additionalImages: data.additionalImages,
          specifications: data.specifications,
          cashAlternative: data.cashAlternative || undefined,
          isDeliverable: data.isDeliverable,
          isDigital: data.isDigital,
        };

        updatePrizeMutation.mutate(submitData);
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', t('COMMON.error', 'Error'), msg);
      }
    )();
  };

  return {
    formData,
    isLoading,
    isSubmitting: updatePrizeMutation.isPending,
    handleInputChange,
    handleTypeChange,
    handleMainImageUrlChange,
    handleAddAdditionalImage,
    handleRemoveAdditionalImage,
    handleSpecificationChange,
    handleRemoveSpecification,
    handleSubmit,
  };
};
