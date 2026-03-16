import LoginSection from '@/features/auth/components/LoginSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Inicia sesión en CriptoJackpot para participar en rifas y sorteos con criptomonedas.',
  alternates: {
    canonical: 'https://criptojackpot.com/login',
  },
};
const Login = () => {
  return (
    <div>
      <LoginSection />
    </div>
  );
};

export default Login;
