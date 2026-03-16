import ForgotPasswordSection from '@/features/auth/components/ForgotPasswordSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recuperar Contraseña',
  description: 'Recupera tu contraseña de CriptoJackpot para volver a participar en rifas y sorteos.',
  alternates: {
    canonical: 'https://criptojackpot.com/forgot-password',
  },
};

const ForgotPassword = () => {
  return (
    <div>
      <ForgotPasswordSection />
    </div>
  );
};

export default ForgotPassword;
