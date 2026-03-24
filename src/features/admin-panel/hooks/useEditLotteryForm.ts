'use client';

import { FormEvent, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotificationStore } from '@/store/notificationStore';
import { Lottery, LotteryStatus, UpdateLotteryRequest } from '@/interfaces/lottery';
import { Prize } from '@/interfaces/prize';
import { CoinPaymentCurrency } from '@/interfaces/coinPaymentCurrency';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { lotteryService, prizeService, orderService } from '@/services';
import { EditLotteryFormData } from '../types/editLotteryFormData';
import { createEditLotterySchema } from '../schemas';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export const useEditLotteryForm = (lotteryId: string) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const schema = useMemo(() => createEditLotterySchema(t), [t]);

  const {
    watch,
    setValue,
    reset,
    handleSubmit: rhfHandleSubmit,
  } = useForm<EditLotteryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      drawDate: '',
      drawTime: '',
      totalTickets: 0,
      status: LotteryStatus.Draft,
      prizeId: undefined,
      minNumber: 1,
      maxNumber: 49,
      totalSeries: 1,
      terms: '',
      cryptoCurrencyId: '',
      cryptoCurrencySymbol: '',
    },
  });

  const formData = watch();

  // Obtener la lotería actual
  const {
    data: lottery,
    isLoading: isLoadingLottery,
    error: lotteryError,
  } = useQuery<Lottery, Error>({
    queryKey: ['lottery', lotteryId],
    queryFn: async () => {
      return lotteryService.getLotteryById(lotteryId);
    },
    enabled: !!lotteryId,
  });

  // Obtener lista de premios disponibles
  const { data: prizesResponse } = useQuery<PaginatedResponse<Prize>, Error>({
    queryKey: ['prizes', 'available'],
    queryFn: async () => {
      return prizeService.getAllPrizes({ pageNumber: 1, pageSize: 100 }, true);
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

  // Cargar datos de la lotería en el formulario
  useEffect(() => {
    if (lottery) {
      const endDate = new Date(lottery.endDate);
      // Extraer hora en UTC para mantener consistencia con la fecha
      const hours = endDate.getUTCHours().toString().padStart(2, '0');
      const minutes = endDate.getUTCMinutes().toString().padStart(2, '0');
      reset({
        name: lottery.title,
        description: lottery.description || '',
        price: lottery.ticketPrice,
        drawDate: endDate.toISOString().split('T')[0],
        drawTime: `${hours}:${minutes}`,
        totalTickets: lottery.maxTickets,
        status: lottery.status,
        prizeId: lottery.prizes?.[0]?.prizeGuid,
        minNumber: lottery.minNumber,
        maxNumber: lottery.maxNumber,
        totalSeries: lottery.totalSeries,
        terms: lottery.terms || '',
        cryptoCurrencyId: lottery.cryptoCurrencyId || '',
        cryptoCurrencySymbol: lottery.cryptoCurrencySymbol || '',
      });
    }
  }, [lottery, reset]);

  const updateLotteryMutation = useMutation({
    mutationFn: async (data: UpdateLotteryRequest) => {
      return lotteryService.updateLottery(lotteryId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
      queryClient.invalidateQueries({ queryKey: ['lottery', lotteryId] });
      queryClient.invalidateQueries({ queryKey: ['prizes'] });
      showNotification(
        'success',
        t('LOTTERIES_ADMIN.edit.success', 'Lotería actualizada'),
        t('LOTTERIES_ADMIN.edit.successMessage', 'La lotería se ha actualizado correctamente')
      );
      setTimeout(() => {
        router.push('/admin/lotteries');
      }, 1000);
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || t('LOTTERIES_ADMIN.edit.error', 'Error al actualizar la lotería. Intente nuevamente.');
      showNotification('error', t('COMMON.error', 'Error'), errorMessage);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setValue(name as keyof EditLotteryFormData, checked as any, { shouldValidate: false });
    } else if (type === 'number') {
      setValue(name as keyof EditLotteryFormData, (Number.parseFloat(value) || 0) as any, { shouldValidate: false });
    } else if (name === 'status') {
      setValue(name, Number(value) as LotteryStatus, { shouldValidate: false });
    } else {
      setValue(name as keyof EditLotteryFormData, value as any, { shouldValidate: false });
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
        // Crear fecha en UTC para evitar desfases de zona horaria
        const endDateISO = `${data.drawDate}T${data.drawTime}:00.000Z`;

        const submitData: UpdateLotteryRequest = {
          id: lotteryId,
          title: data.name,
          description: data.description,
          minNumber: data.minNumber,
          maxNumber: data.maxNumber,
          totalSeries: data.totalSeries,
          ticketPrice: data.price,
          maxTickets: data.totalTickets,
          startDate: lottery?.startDate,
          endDate: endDateISO,
          status: data.status,
          terms: data.terms,
          cryptoCurrencyId: data.cryptoCurrencyId,
          cryptoCurrencySymbol: data.cryptoCurrencySymbol,
          prizeId: data.prizeId,
        };

        updateLotteryMutation.mutate(submitData);
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', t('COMMON.error', 'Error'), msg);
      }
    )();
  };

  return {
    formData,
    lottery,
    prizes,
    currencies,
    isLoadingCurrencies,
    selectedPrize: prizes.find(p => p.prizeGuid === formData.prizeId),
    isLoading: isLoadingLottery,
    isSubmitting: updateLotteryMutation.isPending,
    error: lotteryError,
    handleInputChange,
    handleCurrencyChange,
    handleSubmit,
  };
};
