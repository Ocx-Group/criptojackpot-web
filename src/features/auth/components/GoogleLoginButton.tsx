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

interface GoogleLoginButtonProps {
  referralCode?: string | null;
}

const GoogleLoginButtonInner = ({ referralCode }: GoogleLoginButtonProps) => {
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
        // GIS caps rendered width at 400px.
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
      const request: GoogleLoginRequest = {
        idToken: credentialResponse.credential,
      };
      if (referralCode) {
        request.referralCode = referralCode;
      }
      googleLoginMutation.mutate(request);
    }
  };

  const handleGoogleError = () => {
    showNotification('error', t('LOGIN.errors.googleLoginFailed', 'Error al iniciar sesión con Google'), '');
  };

  return (
    <div ref={wrapperRef} className="w-100 mt-1 google-login-wrapper" style={{ position: 'relative' }}>
      {/*
        We render Google's OWN button visibly (not hidden under a custom element).
        The previous approach overlaid the GIS iframe under a custom button with
        opacity:0.001, which Safari/iOS silently blocks (GIS anti-clickjacking +
        ITP third-party storage + popup blocker). Google's native button handles
        the user gesture, FedCM and the popup/redirect correctly across browsers.
      */}
      <div className="d-flex justify-content-center w-100">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_black"
          size="large"
          shape="rectangular"
          text="continue_with"
          logo_alignment="center"
          width={buttonWidth.toString()}
        />
      </div>

      {/* Loading veil shown only after a credential is received (our own element, does not cover GIS during the tap) */}
      {googleLoginMutation.isPending && (
        <div
          className="d-center gap-2"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--bg1)',
            borderRadius: 4,
            pointerEvents: 'none',
          }}
        >
          <span className="spinner-border spinner-border-sm" style={{ width: 18, height: 18, color: 'var(--n0)' }} />
          <span className="fw_600" style={{ color: 'var(--n0)' }}>
            {t('LOGIN.loading')}
          </span>
        </div>
      )}
    </div>
  );
};

export const GoogleLoginButton = ({ referralCode }: GoogleLoginButtonProps = {}) => {
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return <GoogleLoginButtonInner referralCode={referralCode} />;
};
