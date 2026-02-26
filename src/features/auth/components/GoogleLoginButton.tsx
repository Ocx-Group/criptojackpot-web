'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect, useState } from 'react';
import { authService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { GoogleLoginRequest } from '@/features/auth/types';
import { GOOGLE_CLIENT_ID } from '@/components/Providers';
import axios from 'axios';

const GoogleIcon = () => (
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
);

const GoogleLoginButtonInner = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setRememberMe = useAuthStore(state => state.setRememberMe);
  const setUser = useUserStore(state => state.setUser);
  const showNotification = useNotificationStore(state => state.show);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        setButtonWidth(Math.min(wrapperRef.current.offsetWidth, 400));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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
      // Refetch full user profile from server (has complete data with id)
      queryClient.invalidateQueries({ queryKey: ['current-user-profile'] });
      showNotification('success', t('LOGIN.success'), '');

      if (userData.role?.name === 'admin') {
        router.push('/admin');
      } else {
        router.push('/personal-info');
      }
    },
    onError: (error: Error) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || t('LOGIN.errors.googleLoginFailed', 'Error al iniciar sesión con Google')
        : error.message || t('LOGIN.errors.googleLoginFailed', 'Error al iniciar sesión con Google');
      showNotification('error', message, '');
    },
  });

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      googleLoginMutation.mutate({
        idToken: credentialResponse.credential,
      });
    }
  };

  const handleGoogleError = () => {
    showNotification('error', t('LOGIN.errors.googleLoginFailed', 'Error al iniciar sesión con Google'), '');
  };

  return (
    <div
      ref={wrapperRef}
      className="w-100 mt-1 google-login-wrapper"
      style={{ position: 'relative', cursor: 'pointer' }}
    >
      {/* Custom styled visual button matching app design */}
      <div
        className="google-login-btn radius12 w-100 fw_600 justify-content-center d-inline-flex align-items-center gap-2 py-xxl-4 py-3 px-xl-6 px-5"
        style={{
          background: 'var(--bg1)',
          border: '1px solid var(--borderd)',
          color: 'var(--n0)',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
          opacity: googleLoginMutation.isPending ? 0.7 : 1,
        }}
      >
        {googleLoginMutation.isPending ? (
          <span className="spinner-border spinner-border-sm" style={{ width: '18px', height: '18px' }} />
        ) : (
          <GoogleIcon />
        )}
        <span className="fw_600" style={{ color: 'var(--n0)' }}>
          {googleLoginMutation.isPending ? t('LOGIN.loading') : t('LOGIN.googleLogin', 'Continuar con Google')}
        </span>
      </div>
      {/* Invisible Google button overlay for credential (ID Token) flow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          opacity: 0.001,
          pointerEvents: googleLoginMutation.isPending ? 'none' : 'auto',
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          size="large"
          width={buttonWidth.toString()}
        />
      </div>
    </div>
  );
};

export const GoogleLoginButton = () => {
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return <GoogleLoginButtonInner />;
};
