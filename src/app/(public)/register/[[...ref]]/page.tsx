import RegisterSection from '@/features/auth/components/RegisterSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Cuenta',
  description:
    'Regístrate en CriptoJackpot y comienza a participar en rifas y sorteos con criptomonedas. Refiere amigos y gana comisiones.',
  alternates: {
    canonical: 'https://criptojackpot.com/register',
  },
};

interface PageProps {
  params: Promise<{
    ref?: string[];
  }>;
}

const Register = async ({ params }: PageProps) => {
  const { ref } = await params;
  const referralCode = ref && ref.length > 0 ? ref[0] : null;

  return (
    <div>
      <RegisterSection referralCode={referralCode} />
    </div>
  );
};

export default Register;
