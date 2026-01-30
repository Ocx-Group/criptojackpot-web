'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useNotificationStore } from '@/store/notificationStore';
import { Lottery, LotteryStatus, UpdateLotteryRequest } from '@/interfaces/lottery';
import { Prize } from '@/interfaces/prize';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';
import { getLotteryService, getPrizeService } from '@/di/serviceLocator';
import { EditLotteryFormData } from '../types/editLotteryFormData';
import { validateEditLotteryForm } from '../validators/lotteryValidations';

export const useEditLotteryForm = (lotteryId: string) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(state => state.show);

  const [formData, setFormData] = useState<EditLotteryFormData>({
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
  });

  // Obtener la lotería actual
  const {
    data: lottery,
    isLoading: isLoadingLottery,
    error: lotteryError,
  } = useQuery<Lottery, Error>({
    queryKey: ['lottery', lotteryId],
    queryFn: async () => {
      const lotteryService = getLotteryService();
      return lotteryService.getLotteryById(lotteryId);
    },
    enabled: !!lotteryId,
  });

  // Obtener lista de premios disponibles
  const { data: prizesResponse } = useQuery<PaginatedResponse<Prize>, Error>({
    queryKey: ['prizes'],
    queryFn: async () => {
      const prizeService = getPrizeService();
      return prizeService.getAllPrizes({ pageNumber: 1, pageSize: 100 });
    },
  });

  const prizes = prizesResponse?.data?.items || [];

  // Cargar datos de la lotería en el formulario
  useEffect(() => {
    if (lottery) {
      const endDate = new Date(lottery.endDate);
      // Extraer hora en UTC para mantener consistencia con la fecha
      const hours = endDate.getUTCHours().toString().padStart(2, '0');
      const minutes = endDate.getUTCMinutes().toString().padStart(2, '0');
      setFormData({
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
      });
    }
  }, [lottery]);

  const updateLotteryMutation = useMutation({
    mutationFn: async (data: UpdateLotteryRequest) => {
      const lotteryService = getLotteryService();
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
    onError: (error: any) => {
      const errorMessage =
        error?.message || t('LOTTERIES_ADMIN.edit.error', 'Error al actualizar la lotería. Intente nuevamente.');
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
    } else if (name === 'status') {
      setFormData(prev => ({ ...prev, [name]: Number(value) as LotteryStatus }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEditLotteryForm(formData, t, showNotification)) {
      return;
    }

    // Crear fecha en UTC para evitar desfases de zona horaria
    const endDateISO = `${formData.drawDate}T${formData.drawTime}:00.000Z`;

    const submitData: UpdateLotteryRequest = {
      id: lotteryId,
      title: formData.name,
      description: formData.description,
      minNumber: formData.minNumber,
      maxNumber: formData.maxNumber,
      totalSeries: formData.totalSeries,
      ticketPrice: formData.price,
      maxTickets: formData.totalTickets,
      startDate: lottery?.startDate,
      endDate: endDateISO,
      status: formData.status,
      terms: formData.terms,
      prizeId: formData.prizeId,
    };

    updateLotteryMutation.mutate(submitData);
  };

  return {
    formData,
    lottery,
    prizes,
    selectedPrize: prizes.find(p => p.prizeGuid === formData.prizeId),
    isLoading: isLoadingLottery,
    isSubmitting: updateLotteryMutation.isPending,
    error: lotteryError,
    handleInputChange,
    handleSubmit,
  };
};
