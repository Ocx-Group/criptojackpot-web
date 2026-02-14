'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/store/notificationStore';
import { LotteryType, CreateLotteryRequest } from '@/interfaces/lottery';
import { Prize } from '@/interfaces/prize';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { lotteryService, prizeService } from '@/services';
import { CreateTicketFormData, UseCreateTicketFormReturn } from '../types/createTicketForm';

export const useCreateTicketForm = (): UseCreateTicketFormReturn => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  // Obtener lista de premios disponibles
  const { data: prizesResponse } = useQuery<PaginatedResponse<Prize>, Error>({
    queryKey: ['prizes'],
    queryFn: async () => {
      return prizeService.getAllPrizes({ pageNumber: 1, pageSize: 100 });
    },
  });

  const prizes = prizesResponse?.data?.items || [];

  const [formData, setFormData] = useState<CreateTicketFormData>({
    name: '',
    description: '',
    price: 0,
    drawDate: '',
    drawTime: '',
    totalTickets: 0,
    status: 'active',
    prizeId: undefined,
    // Valores por defecto para campos de lottery
    minNumber: 1,
    maxNumber: 49,
    terms: 'Términos y condiciones estándar del sorteo.',
    type: LotteryType.Standard,
    hasAgeRestriction: true,
    minimumAge: 18,
    restrictedCountries: [],
  });

  const createLotteryMutation = useMutation({
    mutationFn: async (data: CreateLotteryRequest) => {
      return lotteryService.createLottery(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
      queryClient.invalidateQueries({ queryKey: ['prizes'] });
      showNotification(
        'success',
        t('LOTTERIES_ADMIN.create.success', 'Lotería creada exitosamente'),
        t('LOTTERIES_ADMIN.create.successMessage', 'La lotería se ha creado y está disponible')
      );
      setTimeout(() => {
        router.push('/admin/lotteries');
      }, 1000);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || t('LOTTERIES_ADMIN.create.error', 'Error al crear la lotería. Intente nuevamente.');
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      showNotification(
        'error',
        t('COMMON.error', 'Error'),
        t('LOTTERIES_ADMIN.errors.nameRequired', 'El nombre es requerido')
      );
      return;
    }

    if (!formData.description.trim()) {
      showNotification(
        'error',
        t('COMMON.error', 'Error'),
        t('LOTTERIES_ADMIN.errors.descriptionRequired', 'La descripción es requerida')
      );
      return;
    }

    if (formData.price <= 0) {
      showNotification(
        'error',
        t('COMMON.error', 'Error'),
        t('LOTTERIES_ADMIN.errors.priceInvalid', 'El precio debe ser mayor a 0')
      );
      return;
    }

    if (formData.totalTickets <= 0) {
      showNotification(
        'error',
        t('COMMON.error', 'Error'),
        t('LOTTERIES_ADMIN.errors.totalTicketsInvalid', 'El total de tickets debe ser mayor a 0')
      );
      return;
    }

    if (!formData.drawDate) {
      showNotification(
        'error',
        t('COMMON.error', 'Error'),
        t('LOTTERIES_ADMIN.errors.drawDateRequired', 'La fecha del sorteo es requerida')
      );
      return;
    }

    if (!formData.drawTime) {
      showNotification(
        'error',
        t('COMMON.error', 'Error'),
        t('LOTTERIES_ADMIN.errors.drawTimeRequired', 'La hora del sorteo es requerida')
      );
      return;
    }

    // Validar que la fecha del sorteo sea futura
    const drawDateTime = new Date(`${formData.drawDate}T${formData.drawTime}`);
    const now = new Date();
    if (drawDateTime <= now) {
      showNotification(
        'error',
        t('COMMON.error', 'Error'),
        t('LOTTERIES_ADMIN.errors.drawDatePast', 'La fecha del sorteo debe ser en el futuro')
      );
      return;
    }

    // Calcular fecha de inicio (10 minutos en el futuro para asegurar que pase validación UTC)
    const startDate = new Date(Date.now() + 10 * 60 * 1000);
    const endDate = drawDateTime;

    // Mapear status del frontend al enum del backend (active = 1, upcoming/draft = 0)
    const lotteryStatus = formData.status === 'active' ? 1 : 0;

    // Preparar datos
    const submitData: CreateLotteryRequest = {
      title: formData.name,
      description: formData.description,
      minNumber: formData.minNumber,
      maxNumber: formData.maxNumber,
      ticketPrice: formData.price,
      maxTickets: formData.totalTickets,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: lotteryStatus,
      type: 0, // Standard
      terms: formData.terms,
      hasAgeRestriction: formData.hasAgeRestriction,
      minimumAge: formData.hasAgeRestriction ? formData.minimumAge : undefined,
      restrictedCountries: formData.restrictedCountries,
      prizeId: formData.prizeId,
    };

    console.log('Submitting lottery data:', JSON.stringify(submitData, null, 2));

    // Enviar al servidor
    createLotteryMutation.mutate(submitData);
  };

  return {
    formData,
    prizes,
    selectedPrize: prizes.find(p => p.prizeGuid === formData.prizeId),
    isSubmitting: createLotteryMutation.isPending,
    handleInputChange,
    handleSubmit,
  };
};
