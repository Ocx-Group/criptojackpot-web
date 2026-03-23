'use client';

import { FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';
import { CreateTestimonialRequest } from '@/interfaces/testimonial';
import { testimonialService, digitalOceanStorageService } from '@/services';
import { CreateTestimonialFormData } from '../types/createTestimonialFormData';
import { createCreateTestimonialSchema } from '../schemas/testimonialSchema';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useCreateTestimonialForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);
  const user = useUserStore(state => state.user);

  const schema = useMemo(() => createCreateTestimonialSchema(t), [t]);

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
  } = useForm<CreateTestimonialFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      authorName: '',
      authorLocation: '',
      authorImageUrl: '',
      text: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      isActive: true,
      sortOrder: 0,
    },
  });

  const formData = watch();

  const createMutation = useMutation({
    mutationFn: async (data: CreateTestimonialRequest) => {
      return testimonialService.createTestimonial(data);
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('TESTIMONIALS_ADMIN.create.success', 'Reseña creada exitosamente'),
        t('TESTIMONIALS_ADMIN.create.successMessage', 'La reseña se ha creado correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setTimeout(() => {
        router.push('/admin/testimonials');
      }, 1000);
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || t('TESTIMONIALS_ADMIN.create.error', 'Error al crear la reseña. Intente nuevamente.');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setValue(name as keyof CreateTestimonialFormData, (Number.parseFloat(value) || 0) as any, {
        shouldValidate: false,
      });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValue(name as keyof CreateTestimonialFormData, checked as any, { shouldValidate: false });
    } else {
      setValue(name as keyof CreateTestimonialFormData, value as any, { shouldValidate: false });
    }
  };

  const handleAuthorImageUpload = async (file: File): Promise<void> => {
    const userId = user?.id ?? 0;
    try {
      const cdnUrl = await digitalOceanStorageService.uploadPrizeImage(file, userId);
      setValue('authorImageUrl', cdnUrl, { shouldValidate: false });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al subir la imagen';
      showNotification('error', t('COMMON.error', 'Error'), msg);
      throw error;
    }
  };

  const handleAuthorImageUrlChange = (url: string) => {
    setValue('authorImageUrl', url, { shouldValidate: false });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    rhfHandleSubmit(
      data => {
        const submitData: CreateTestimonialRequest = {
          authorName: data.authorName,
          authorLocation: data.authorLocation,
          authorImageUrl: data.authorImageUrl || undefined,
          text: data.text,
          rating: data.rating,
          date: data.date || undefined,
          isActive: data.isActive,
          sortOrder: data.sortOrder,
        };

        createMutation.mutate(submitData);
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', t('COMMON.error', 'Error'), msg);
      }
    )();
  };

  return {
    formData,
    isSubmitting: createMutation.isPending,
    handleInputChange,
    handleAuthorImageUpload,
    handleAuthorImageUrlChange,
    handleSubmit,
  };
};
