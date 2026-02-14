'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/store/notificationStore';
import { UpdatePrizeRequest, PrizeType, PrizeImage, Prize } from '@/interfaces/prize';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { prizeService } from '@/services';
import { EditPrizeFormData } from '../types/editPrizeFormData';
import { validateEditPrizeForm } from '../validators/prizeValidations';

export const useEditPrizeForm = (prizeId: string) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const [formData, setFormData] = useState<EditPrizeFormData>({
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
  });

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
      setFormData({
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
  }, [isSuccess, prize]);

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

  const handleAddAdditionalImage = (image: Omit<PrizeImage, 'id'>) => {
    const newImage: PrizeImage = {
      ...image,
      id: crypto.randomUUID(),
    };
    setFormData(prev => ({
      ...prev,
      additionalImages: [...prev.additionalImages, newImage],
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

    if (!validateEditPrizeForm(formData, t, showNotification)) {
      return;
    }

    // Preparar datos para enviar
    const submitData: UpdatePrizeRequest = {
      name: formData.name,
      description: formData.description,
      estimatedValue: formData.estimatedValue,
      mainImageUrl: formData.mainImageUrl,
      additionalImages: formData.additionalImages,
      specifications: formData.specifications,
      cashAlternative: formData.cashAlternative || undefined,
      isDeliverable: formData.isDeliverable,
      isDigital: formData.isDigital,
    };

    updatePrizeMutation.mutate(submitData);
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
