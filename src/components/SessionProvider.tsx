'use client';
import { useSessionValidator } from '@/hooks/useSessionValidator';
import { useUserSync } from '@/hooks/useUserSync';
import React from 'react';

/**
 * Session provider that syncs user data after authentication.
 * This component should be placed inside the Providers component.
 */
export default function SessionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useSessionValidator();
  useUserSync();

  return <>{children}</>;
}
