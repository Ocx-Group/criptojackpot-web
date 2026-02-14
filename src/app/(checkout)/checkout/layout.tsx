import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import NavbarBlack from '@/components/navbar/NavbarBlack';
import Footer from '@/components/home-one/Footer';

export default function CheckoutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard requireAuth={true} requiredRole="client">
      <div>
        <NavbarBlack />
        <div className="checkout-section pt-120 pb-120 n1-bg" style={{ minHeight: '100vh' }}>
          {children}
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}
