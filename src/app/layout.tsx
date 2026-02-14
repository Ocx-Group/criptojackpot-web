import Bootstrap from '@/components/Bootstrap';
import Cursor from '@/components/Cursor';
import Providers from '@/components/Providers';

import type { Metadata } from 'next';
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
            <Cursor />
            {children}
          </Providers>
        </body>
      </Bootstrap>
    </html>
  );
}
