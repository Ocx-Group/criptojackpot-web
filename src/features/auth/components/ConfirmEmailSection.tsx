'use client';

import confirmEmailImage from 'public/images/background/back-register.png';
import logo from 'public/images/logo/blue-logo.png';
import { useConfirmEmail } from '@/features/auth/hooks/useConfirmEmail';
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface ConfirmEmailSectionProps {
  token: string;
}

const ConfirmEmailSection = ({ token }: ConfirmEmailSectionProps) => {
  const { t } = useTranslation();
  const { isLoading, isSuccess, isError } = useConfirmEmail(token);

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
                    <Image src={logo} alt="logo" className="img-fluid" style={{ maxWidth: '200px', height: 'auto' }} />
                  </div>
                </Link>

                <div className="log-title mb-4 text-center">
                  <h3 className="n3-clr mb-3">{t('CONFIRM_EMAIL.title')}</h3>
                </div>

                {/* Content Area */}
                <div className="text-center py-5">
                  {isLoading && (
                    <div className="d-flex flex-column align-items-center gap-4">
                      <div className="spinner-border s1-clr" style={{ width: '64px', height: '64px' }}>
                        <output className="visually-hidden">Loading...</output>
                      </div>
                      <p className="n3-clr fs-five fw-semibold">{t('CONFIRM_EMAIL.verifying')}</p>
                    </div>
                  )}

                  {isSuccess && (
                    <div className="d-flex flex-column align-items-center gap-4">
                      <CheckCircleIcon size={64} className="text-success" weight="fill" />
                      <div>
                        <h4 className="n3-clr mb-3">{t('CONFIRM_EMAIL.success')}</h4>
                        <p className="n3-clr fs-six">{t('CONFIRM_EMAIL.successMessage')}</p>
                        <p className="n3-clr fs-seven mt-3">
                          {t('CONFIRM_EMAIL.redirecting', 'Redirigiendo al login...')}
                        </p>
                      </div>
                    </div>
                  )}

                  {isError && (
                    <div className="d-flex flex-column align-items-center gap-4">
                      <XCircleIcon size={64} className="text-danger" weight="fill" />
                      <div>
                        <h4 className="n3-clr mb-3">{t('CONFIRM_EMAIL.error')}</h4>
                        <p className="n3-clr fs-six mb-4">{t('CONFIRM_EMAIL.errorMessage')}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Links */}
                <div className="d-flex flex-column gap-3 mt-4">
                  {(isSuccess || isError) && (
                    <Link
                      href="/login"
                      className="cmn-btn py-3 px-4 d-flex align-items-center justify-content-center gap-2"
                    >
                      {t('CONFIRM_EMAIL.goToLogin')}
                    </Link>
                  )}

                  <div className="text-center">
                    <Link href="/landing-page" className="n3-clr fs-seven">
                      {t('NAVBAR.Home', 'Inicio')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="col-lg-7 order-1 order-lg-2 d-none d-lg-block">
            <div className="right-logwrap h-100">
              <Image src={confirmEmailImage} alt="Confirm Email" className="w-100 h-100 object-fit-cover" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmEmailSection;
