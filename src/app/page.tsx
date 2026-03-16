import LandingPage from '@/app/(public)/landing-page/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CriptoJackpot — Rifas y Sorteos con Cripto',
  description:
    'Descubre, juega y gana con CriptoJackpot. Participa en rifas con criptomonedas, elige tus números de la suerte, refiere amigos y gana premios. Simple, transparente y justo.',
  openGraph: {
    title: 'CriptoJackpot — Rifas y Sorteos con Cripto',
    description:
      'Descubre, juega y gana con CriptoJackpot. Participa en rifas con criptomonedas, elige tus números de la suerte y gana premios.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CriptoJackpot',
  url: 'https://criptojackpot.com',
  description: 'Plataforma de rifas y sorteos con criptomonedas. Elige tus números, refiere amigos y gana premios.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://criptojackpot.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  inLanguage: ['es', 'en'],
};

const howItWorksJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo participar en CriptoJackpot',
  description: 'Guía paso a paso para participar en rifas y sorteos con criptomonedas en CriptoJackpot.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Elige Tu Ticket',
      text: 'Explora nuestras rifas activas, elige la que más te guste y selecciona tus números de la suerte. ¡Completa tu compra y ya estás participando!',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Refiere y Gana',
      text: 'Comparte tu enlace de referido. Cada vez que un amigo compre un ticket, ganas el 1% de comisión sobre su compra — de forma automática.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Gana la Rifa',
      text: 'Cuando llega la fecha del sorteo, se elige un ganador al azar. Si tu número es elegido, ¡te llevas el premio! Simple, transparente y justo.',
    },
  ],
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CriptoJackpot',
  url: 'https://criptojackpot.com',
  logo: 'https://criptojackpot.com/images/logo/cripto-jackpot-logo.png',
  sameAs: [],
};

export default function Home() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <LandingPage />
    </div>
  );
}
