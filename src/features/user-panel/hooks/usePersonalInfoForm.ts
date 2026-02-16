import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { userService } from '@/services';
import { FormData, ShowPwd, UpdateUserRequest } from '@/features/user-panel/types';
import { createPersonalInfoSchema } from '@/features/user-panel/schemas/personalInfoSchema';
import { getFirstFieldError } from '@/utils/getFirstFieldError';

export function usePersonalInfoForm() {
  const { t } = useTranslation();
  const { user, updateUser } = useUserStore();
  const showNotification = useNotificationStore(state => state.show);
  const queryClient = useQueryClient(); // Opcional, para invalidar queries si es necesario

  const schema = useMemo(() => createPersonalInfoSchema(t), [t]);

  const {
    watch,
    setValue,
    handleSubmit: rhfHandleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const formData = watch();

  const [showPwd, setShowPwd] = React.useState<ShowPwd>({
    password: false,
    confirmPassword: false,
  });

  // Efecto para inicializar el formulario con los datos del usuario
  useEffect(() => {
    if (user) {
      setValue('firstName', user.name || '');
      setValue('lastName', user.lastName || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  // Mutación de React Query para actualizar el usuario
  const updateUserMutation = useMutation({
    mutationFn: (userData: { id: number; data: UpdateUserRequest }) =>
      userService.updateUserAsync(userData.id, userData.data),
    onSuccess: updatedUserData => {
      updateUser(updatedUserData);
      showNotification('success', t('PERSONAL_INFO.notifications.updateSuccess'), '');

      // invalidar queries
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] }).then();
    },
    onError: (error: Error) => {
      console.error('Failed to update profile:', error);
      showNotification('error', t('PERSONAL_INFO.notifications.updateError'), '');
    },
  });

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setValue(field, value, { shouldValidate: false });
    },
    [setValue]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    rhfHandleSubmit(
      data => {
        if (user && user.id) {
          const updatedUserData: UpdateUserRequest = {
            name: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            password: '',
          };

          if (data.password) {
            updatedUserData.password = data.password;
          }

          updateUserMutation.mutate({ id: user.id, data: updatedUserData });
        }
      },
      fieldErrors => {
        const msg = getFirstFieldError(fieldErrors);
        if (msg) showNotification('error', msg, '');
      }
    )();
  };

  return {
    formData,
    showPwd,
    setShowPwd,
    handleChange,
    handleSubmit,
    isLoading: updateUserMutation.isPending,
    error: updateUserMutation.error,
  };
}
