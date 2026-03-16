import ResetPasswordSection from '@/features/auth/components/ResetPasswordSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restablecer Contraseña',
  description: 'Restablece tu contraseña de CriptoJackpot.',
  robots: { index: false, follow: false },
};

const ResetPasswordPage = () => {
  return <ResetPasswordSection />;
};

export default ResetPasswordPage;
