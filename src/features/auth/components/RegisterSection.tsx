'use client';
import registerImage from 'public/images/background/back-register.png';
import logo from 'public/images/logo/cripto-jackpot-logo.png';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RegisterSectionProps {
  referralCode?: string | null;
}

const RegisterSection = ({ referralCode }: RegisterSectionProps) => {
  const { t } = useTranslation();
  const { register, login } = useKeycloakAuth();

  // Redirect to Keycloak register page on mount (or when button is clicked)
  const handleKeycloakRegister = async () => {
    // Store referral code in sessionStorage to use after registration
    if (referralCode) {
      sessionStorage.setItem('referralCode', referralCode);
    }
    await register('/user-panel');
  };

  const handleKeycloakLogin = async () => {
    await login('/user-panel');
  };

  // Auto-redirect to Keycloak registration if this page is accessed
  useEffect(() => {
    // Optional: Auto-redirect to Keycloak register page
    // Uncomment if you want immediate redirect without showing this page
    // handleKeycloakRegister();
  }, []);

  return (
    <section className="login-section position-relative min-vh-100 d-flex align-items-center overflow-hidden">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center min-vh-100 g-0">
          {/* Form Column */}
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 order-2 order-lg-1">
            <div className="left-logwrap h-100 d-flex align-items-center py-4 py-md-5">
              <div className="authentication-cmn w-100 px-3 px-sm-4 px-md-5 px-lg-4 px-xl-5">
                {/* Logo */}
                <Link href="/landing-page" className="d-block text-center mb-4">
                  <div className="d-flex justify-content-center">
                    <Image
                      src={logo}
                      alt="logo"
                      className="img-fluid"
                      style={{
                        maxWidth: '120px',
                        height: 'auto',
                      }}
                    />
                  </div>
                </Link>

                {/* Title */}
                <div className="log-title mb-4 text-center">
                  <h3 className="fs-5 fs-sm-4 mb-2">{t('REGISTER.title')}</h3>
                  <span className="n3-clr d-block fs-6">
                    {t('REGISTER.alreadyHaveAccount')}
                    <button
                      type="button"
                      onClick={handleKeycloakLogin}
                      className="s1-clr fw_500 s1-texthover bg-transparent border-0 p-0 text-decoration-underline"
                    >
                      {t('REGISTER.signIn')}
                    </button>
                  </span>
                </div>

                {/* Register Button - Redirects to Keycloak */}
                <div className="d-flex flex-column gap-4">
                  <button
                    type="button"
                    onClick={handleKeycloakRegister}
                    className="cmn-btn s1-bg radius12 w-100 fw_600 justify-content-center d-inline-flex align-items-center gap-2 py-xxl-4 py-3 px-xl-6 px-5 n0-clr"
                  >
                    <span className="fw_600 n0-clr">{t('REGISTER.createAccount', 'Crear Cuenta')}</span>
                  </button>

                  <p className="text-center n3-clr fs-6 mb-0">
                    {t('REGISTER.keycloakRedirectMessage', 'Serás redirigido a nuestra página de registro segura.')}
                  </p>
                </div>

                {/* Terms */}
                <div className="mt-4">
                  <span className="n3-clr fs-eight d-block text-center">
                    {t('REGISTER.termsAndPrivacy')}
                    <Link href="#" className="n4-clr text-decoration-none">
                      {t('REGISTER.termsLink')}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Column - Hidden on mobile */}
          <div className="col-lg-7 col-xl-8 d-none d-lg-block order-1 order-lg-2">
            <div className="log-thumbwrap h-100">
              <div className="thumb h-100 position-relative">
                <Image
                  src={registerImage}
                  alt="register"
                  fill
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Background Image */}
      <div className="d-lg-none position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: -1 }}>
        <Image
          src={registerImage}
          alt="register background"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.1,
          }}
        />
      </div>
    </section>
  );
};

export default RegisterSection;
