'use client';

import { FormEvent, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';
import { Testimonial, UpdateTestimonialRequest } from '@/interfaces/testimonial';
import { testimonialService, digitalOceanStorageService } from '@/services';
import { createEditTestimonialSchema } from '../schemas/testimonialSchema';
import { z } from 'zod';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useEditTestimonialForm = (testimonialId: string) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);
  const user = useUserStore(state => state.user);

  const schema = useMemo(() => createEditTestimonialSchema(t), [t]);
  type EditTestimonialFormData = z.infer<typeof schema>;

  const { data: testimonial, isLoading } = useQuery<Testimonial, Error>({
    queryKey: ['testimonial', testimonialId],
    queryFn: () => testimonialService.getTestimonialById(testimonialId),
    enabled: !!testimonialId,
  });

  const {
    watch,
    setValue,
    reset,
    handleSubmit: rhfHandleSubmit,
  } = useForm<EditTestimonialFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: testimonialId,
      authorName: '',
      authorLocation: '',
      authorImageUrl: '',
      text: '',
      rating: 5,
      date: '',
      isActive: true,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (testimonial) {
      reset({
        id: testimonial.testimonialGuid,
        authorName: testimonial.authorName,
        authorLocation: testimonial.authorLocation,
        authorImageUrl: testimonial.authorImageUrl || '',
        text: testimonial.text,
        rating: testimonial.rating,
        date: testimonial.date ? new Date(testimonial.date).toISOString().split('T')[0] : '',
        isActive: testimonial.isActive,
        sortOrder: testimonial.sortOrder,
      });
    }
  }, [testimonial, reset]);

  const formData = watch();

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateTestimonialRequest) => {
      return testimonialService.updateTestimonial(testimonialId, data);
    },
    onSuccess: () => {
      showNotification(
        'success',
        t('TESTIMONIALS_ADMIN.edit.success', 'Reseña actualizada'),
        t('TESTIMONIALS_ADMIN.edit.successMessage', 'La reseña se ha actualizado correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', testimonialId] });
      setTimeout(() => {
        router.push('/admin/testimonials');
      }, 1000);
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || t('TESTIMONIALS_ADMIN.edit.error', 'Error al actualizar la reseña. Intente nuevamente.');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setValue(name as keyof EditTestimonialFormData, (Number.parseFloat(value) || 0) as any, {
        shouldValidate: false,
      });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValue(name as keyof EditTestimonialFormData, checked as any, { shouldValidate: false });
    } else {
      setValue(name as keyof EditTestimonialFormData, value as any, { shouldValidate: false });
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
        const submitData: UpdateTestimonialRequest = {
          authorName: data.authorName,
          authorLocation: data.authorLocation,
          authorImageUrl: data.authorImageUrl || undefined,
          text: data.text,
          rating: data.rating,
          date: data.date || undefined,
          isActive: data.isActive,
          sortOrder: data.sortOrder,
        };

        updateMutation.mutate(submitData);
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
    isSubmitting: updateMutation.isPending,
    handleInputChange,
    handleAuthorImageUpload,
    handleAuthorImageUrlChange,
    handleSubmit,
  };
};
