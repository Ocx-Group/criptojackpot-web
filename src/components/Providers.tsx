'use client';

import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';
import i18n from '@/locales/i18n';
import { NotificationProvider } from '@/components/notification/NotificationProvider';
import { DIProvider } from '@/components/DIProvider';
import { ProvidersProps } from '@/interfaces/providersProps';

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function Providers({ children }: Readonly<ProvidersProps>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const content = (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <NotificationProvider>{children}</NotificationProvider>
      </I18nextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );

  return (
    <DIProvider>
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {content}
        </GoogleOAuthProvider>
      ) : (
        content
      )}
    </DIProvider>
  );
}
