import Bootstrap from '@/components/Bootstrap';
import Cursor from '@/components/Cursor';
import Providers from '@/components/Providers';
import SessionProvider from '@/components/SessionProvider';

import type { Metadata } from 'next';
import Script from 'next/script';
import 'swiper/css';
import '../styles/scss/style.scss';
import React from 'react';

export const metadata: Metadata = {
  title: 'Criptojackpot App',
  description: 'Lottery & Giveaway',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Bootstrap>
        <body>
          <Providers>
            <SessionProvider>
              <Cursor />
              {children}
            </SessionProvider>
          </Providers>
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "a8ef18c9640c46f083a3d760ef6cb878"}'
            strategy="afterInteractive"
          />
        </body>
      </Bootstrap>
    </html>
  );
}
