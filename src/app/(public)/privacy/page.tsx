import NavbarBlack from '@/components/navbar/NavbarBlack';
import Jewellery1Footer from '@/components/landing-jewellery1/Jewellery1Footer';
import LegalSection from '@/features/legal/components/LegalSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad — CriptoJackpot',
  description: 'Política de Privacidad y tratamiento de datos personales en CriptoJackpot.',
  alternates: {
    canonical: 'https://criptojackpot.com/privacy',
  },
};

const PrivacyPage = () => {
  return (
    <div>
      <NavbarBlack forceDark />
      <LegalSection ns="PRIVACY" />
      <Jewellery1Footer />
    </div>
  );
};

export default PrivacyPage;
