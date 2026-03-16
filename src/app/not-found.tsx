import errorImage from '@/../public/images/error/error.png';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe en CriptoJackpot.',
  robots: { index: false, follow: true },
};

const NotFound = () => {
  return (
    <section className="error-section d-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="error-wrapper p-xxl-8 p-xl-6 p-3">
              <div className="thumb">
                <Image src={errorImage} alt="img" />
              </div>
              <div className="cont text-center">
                <h2 className="n4-clr mb-xxl-6 mb-xl-4 mb-3">Page Not Found</h2>
                <p className="fs18 fw_600 mb-xxl-10 mb-xl-7 mb-5">
                  The page you are looking for doesn exist or has been moved
                </p>
                <Link href="/" className="kewta-btn d-inline-flex align-items-center">
                  <span className="kew-text s1-bg s1-border n0-clr">Back To Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
