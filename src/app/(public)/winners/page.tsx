import NavbarBlack from '@/components/navbar/NavbarBlack';
import Jewellery1Footer from '@/components/landing-jewellery1/Jewellery1Footer';
import WinnersSection from '@/components/winners/WinnersSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Winners — CriptoJackpot',
  description:
    'Meet our lucky winners who have won amazing prizes with CriptoJackpot. Discover the latest lottery and raffle winners.',
  alternates: {
    canonical: 'https://criptojackpot.com/winners',
  },
};

const WinnersPage = () => {
  return (
    <div>
      <NavbarBlack />
      <WinnersSection />
      <Jewellery1Footer />
    </div>
  );
};

export default WinnersPage;
