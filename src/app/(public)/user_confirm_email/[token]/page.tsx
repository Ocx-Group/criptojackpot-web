import ConfirmEmailSection from '@/features/auth/components/ConfirmEmailSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Email | CryptoJackpot',
  description: 'Confirm your email address',
};

interface ConfirmEmailPageProps {
  params: Promise<{
    token: string;
  }>;
}

const ConfirmEmailPage = async ({ params }: ConfirmEmailPageProps) => {
  const { token } = await params;
  return <ConfirmEmailSection token={token} />;
};

export default ConfirmEmailPage;

