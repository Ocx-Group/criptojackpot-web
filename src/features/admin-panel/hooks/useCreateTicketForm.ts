'use client';

import { FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { LotteryType, CreateLotteryRequest } from '@/interfaces/lottery';
import { Prize } from '@/interfaces/prize';
import { CoinPaymentCurrency } from '@/interfaces/coinPaymentCurrency';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { lotteryService, prizeService, orderService } from '@/services';
import { CreateTicketFormData, UseCreateTicketFormReturn } from '../types/createTicketForm';
import { createTicketSchema } from '../schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useCreateTicketForm = (): UseCreateTicketFormReturn => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const schema = useMemo(() => createTicketSchema(t), [t]);

  // Obtener lista de premios disponibles
  const { data: prizesResponse } = useQuery<PaginatedResponse<Prize>, Error>({
    queryKey: ['prizes'],
    queryFn: async () => {
      return prizeService.getAllPrizes({ pageNumber: 1, pageSize: 100 });
    },
  });

  const prizes = prizesResponse?.data?.items || [];

  // Obtener lista de criptomonedas disponibles
  const { data: currencies = [], isLoading: isLoadingCurrencies } = useQuery<CoinPaymentCurrency[], Error>({
    queryKey: ['coinpayment-currencies'],
    queryFn: async () => {
      return orderService.getCurrencies();
    },
  });

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
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
      terms: '',
      type: LotteryType.Standard,
      hasAgeRestriction: true,
      minimumAge: 18,
      restrictedCountries: [],
      cryptoCurrencyId: '',
      cryptoCurrencySymbol: '',
    },
  });

  const formData = watch();

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
    onError: (error: Error) => {
      const errorMessage =
        error.message || t('LOTTERIES_ADMIN.create.error', 'Error al crear la lotería. Intente nuevamente.');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setValue(name as keyof CreateTicketFormData, checked as any, { shouldValidate: false });
    } else if (type === 'number') {
      setValue(name as keyof CreateTicketFormData, (Number.parseFloat(value) || 0) as any, { shouldValidate: false });
    } else {
      setValue(name as keyof CreateTicketFormData, value as any, { shouldValidate: false });
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const currency = currencies.find(c => c.id === selectedId);
    setValue('cryptoCurrencyId', selectedId, { shouldValidate: false });
    setValue('cryptoCurrencySymbol', currency?.symbol || '', { shouldValidate: false });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    rhfHandleSubmit(
      data => {
        // Calcular fecha de inicio (10 minutos en el futuro para asegurar que pase validación UTC)
        const startDate = new Date(Date.now() + 10 * 60 * 1000);
        const drawDateTime = new Date(`${data.drawDate}T${data.drawTime}`);
        const endDate = drawDateTime;

        // Mapear status del frontend al enum del backend (active = 1, upcoming/draft = 0)
        const lotteryStatus = data.status === 'active' ? 1 : 0;

        // Preparar datos
        const submitData: CreateLotteryRequest = {
          title: data.name,
          description: data.description,
          minNumber: data.minNumber,
          maxNumber: data.maxNumber,
          ticketPrice: data.price,
          maxTickets: data.totalTickets,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: lotteryStatus,
          type: 0, // Standard
          terms: data.terms,
          hasAgeRestriction: data.hasAgeRestriction,
          minimumAge: data.hasAgeRestriction ? data.minimumAge : undefined,
          cryptoCurrencyId: data.cryptoCurrencyId,
          cryptoCurrencySymbol: data.cryptoCurrencySymbol,
          restrictedCountries: data.restrictedCountries,
          prizeId: data.prizeId,
        };

        console.log('Submitting lottery data:', JSON.stringify(submitData, null, 2));

        // Enviar al servidor
        createLotteryMutation.mutate(submitData);
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', t('COMMON.error', 'Error'), msg);
      }
    )();
  };

  return {
    formData,
    prizes,
    currencies,
    isLoadingCurrencies,
    selectedPrize: prizes.find(p => p.prizeGuid === formData.prizeId),
    isSubmitting: createLotteryMutation.isPending,
    handleInputChange,
    handleCurrencyChange,
    handleSubmit,
  };
};
