import TwoFactorSection from '@/features/auth/components/TwoFactorSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verificación 2FA',
  description: 'Verificación en dos pasos para tu cuenta de CriptoJackpot.',
  robots: { index: false, follow: false },
};

const Verify2Fa = () => {
  return (
    <div>
      <TwoFactorSection />
    </div>
  );
};

export default Verify2Fa;
