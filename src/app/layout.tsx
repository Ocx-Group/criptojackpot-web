import Bootstrap from '@/components/Bootstrap';
import Cursor from '@/components/Cursor';
import Providers from '@/components/Providers';
import SessionProvider from '@/components/SessionProvider';

import type { Metadata } from 'next';
import 'swiper/css';
import '../styles/scss/style.scss';
import React from 'react';

const siteUrl = 'https://criptojackpot.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CriptoJackpot — Rifas y Sorteos con Cripto',
    template: '%s | CriptoJackpot',
  },
  description:
    'Participa en rifas y sorteos con criptomonedas. Elige tus números de la suerte, refiere amigos y gana premios. Simple, transparente y justo.',
  keywords: [
    'rifas cripto',
    'sorteos criptomonedas',
    'lottery crypto',
    'crypto raffle',
    'bitcoin lottery',
    'cripto jackpot',
    'sorteos online',
    'rifas online',
    'ganar criptomonedas',
    'win crypto',
  ],
  authors: [{ name: 'CriptoJackpot' }],
  creator: 'CriptoJackpot',
  publisher: 'CriptoJackpot',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    url: siteUrl,
    siteName: 'CriptoJackpot',
    title: 'CriptoJackpot — Rifas y Sorteos con Cripto',
    description: 'Participa en rifas y sorteos con criptomonedas. Elige tus números, refiere amigos y gana premios.',
    images: [
      {
        url: '/images/logo/cripto-jackpot-logo.png',
        width: 1200,
        height: 630,
        alt: 'CriptoJackpot - Rifas y Sorteos con Cripto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CriptoJackpot — Rifas y Sorteos con Cripto',
    description: 'Participa en rifas y sorteos con criptomonedas. Elige tus números, refiere amigos y gana premios.',
    images: ['/images/logo/cripto-jackpot-logo.png'],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      es: siteUrl,
      en: siteUrl,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <Bootstrap>
        <body>
          <Providers>
            <SessionProvider>
              <Cursor />
              {children}
            </SessionProvider>
          </Providers>
        </body>
      </Bootstrap>
    </html>
  );
}
