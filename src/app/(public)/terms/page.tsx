import NavbarBlack from '@/components/navbar/NavbarBlack';
import Jewellery1Footer from '@/components/landing-jewellery1/Jewellery1Footer';
import LegalSection from '@/features/legal/components/LegalSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — CriptoJackpot',
  description: 'Términos y Condiciones de uso de la plataforma CriptoJackpot.',
  alternates: {
    canonical: 'https://criptojackpot.com/terms',
  },
};

const TermsPage = () => {
  return (
    <div>
      <NavbarBlack forceDark />
      <LegalSection ns="TERMS" />
      <Jewellery1Footer />
    </div>
  );
};

export default TermsPage;
