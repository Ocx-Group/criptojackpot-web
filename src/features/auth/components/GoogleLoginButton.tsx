'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { GoogleLoginRequest } from '@/features/auth/types';
import { GOOGLE_CLIENT_ID } from '@/components/Providers';
import axios from 'axios';

const GoogleLoginButtonInner = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const setRememberMe = useAuthStore(state => state.setRememberMe);
  const setUser = useUserStore(state => state.setUser);
  const showNotification = useNotificationStore(state => state.show);

  const googleLoginMutation = useMutation({
    mutationFn: (request: GoogleLoginRequest) => authService.googleLogin(request),
    onSuccess: data => {
      if (data.requiresTwoFactor) {
        setRememberMe(false);
        router.push('/verify-2fa');
        return;
      }

      const userData = data.data;
      setUser({
        id: undefined,
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        imagePath: userData.imagePath,
        status: userData.status,
        emailVerified: userData.emailVerified,
        password: '',
        countryId: 0,
        statePlace: '',
        city: '',
        roleId: userData.role?.id ?? 0,
        role: userData.role ? { id: userData.role.id, name: userData.role.name } : undefined,
        userGuid: userData.userGuid,
      });
      showNotification('success', t('LOGIN.success'), '');

      if (userData.role?.name === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user-panel');
      }
    },
    onError: (error: Error) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || t('LOGIN.errors.googleLoginFailed', 'Error al iniciar sesión con Google')
        : error.message || t('LOGIN.errors.googleLoginFailed', 'Error al iniciar sesión con Google');
      showNotification('error', message, '');
    },
  });

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async codeResponse => {
      googleLoginMutation.mutate({
        idToken: codeResponse.code,
      });
    },
    onError: () => {
      showNotification('error', t('LOGIN.errors.googleLoginFailed', 'Error al iniciar sesión con Google'), '');
    },
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={googleLoginMutation.isPending}
      className="cmn-btn radius12 w-100 fw_600 justify-content-center d-inline-flex align-items-center gap-2 py-xxl-4 py-3 px-xl-6 px-5 mt-1"
      style={{
        background: '#ffffff',
        border: '1px solid #dadce0',
        color: '#3c4043',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
          fill="#34A853"
        />
        <path
          d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
          fill="#EA4335"
        />
      </svg>
      <span className="fw_600" style={{ color: '#3c4043' }}>
        {googleLoginMutation.isPending ? t('LOGIN.loading') : t('LOGIN.googleLogin', 'Continuar con Google')}
      </span>
    </button>
  );
};

export const GoogleLoginButton = () => {
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return <GoogleLoginButtonInner />;
};
