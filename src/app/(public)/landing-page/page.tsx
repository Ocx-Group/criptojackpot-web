import Faq from '@/components/home-one/Faq';
import Jewellery1CallToAction from '@/components/landing-jewellery1/Jewellery1CallToAction';
import Jewellery1Footer from '@/components/landing-jewellery1/Jewellery1Footer';
import LotteryList from '@/components/landing-nft1/LotteryList';
import Nft2Banner from '@/components/landing-nft2/Nft2Banner';
import Nft2HowItWork from '@/components/landing-nft2/Nft2HowItWork';
import Nft2Testimonial from '@/components/landing-nft2/Nft2Testimonial';
import NavbarBlack from '@/components/navbar/NavbarBlack';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CriptoJackpot — Rifas y Sorteos con Cripto',
  description:
    'Descubre, juega y gana con CriptoJackpot. Participa en rifas con criptomonedas, elige tus números de la suerte, refiere amigos y gana premios. Simple, transparente y justo.',
  alternates: {
    canonical: 'https://criptojackpot.com',
  },
};

const LandingPage = () => {
  return (
    <div>
      <NavbarBlack />
      <Nft2Banner />
      <Nft2HowItWork />
      <LotteryList />
      <Jewellery1CallToAction />
      <Nft2Testimonial />
      <Faq />
      <Jewellery1Footer />
    </div>
  );
};

export default LandingPage;
