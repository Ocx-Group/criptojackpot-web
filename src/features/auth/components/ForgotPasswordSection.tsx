'use client';
import loginImage from 'public/images/background/back-login.png';
import logoBlack from 'public/images/logo/blue-logo.png';
import { useForgotPasswordForm } from '@/features/auth/hooks/useForgotPasswordForm';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const ForgotPasswordSection = () => {
  const { t } = useTranslation();
  const { formData, isLoading, handleInputChange, handleSubmit } = useForgotPasswordForm();

  return (
    <section className="login-section position-relative">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-4 col-md-8 col-11">
            <div className="left-logwrap d-center">
              <div className="authentication-cmn">
                <div className="container">
                  <Link href="/public" className="text-center mb-xxl-10 d-block">
                    <Image src={logoBlack} alt="img" />
                  </Link>
                </div>
                <div className="log-title mb-xxl-6 mb-xl-5 mb-4">
                  <h3 className="n3-clr fw-bold mb-3">{t('FORGOT_PASSWORD.title')}</h3>
                  <p className="n3-clr fs-seven">{t('FORGOT_PASSWORD.description')}</p>
                </div>
                <form onSubmit={handleSubmit} className="form-cmn-action">
                  <div className="row g-6">
                    <div className="col-lg-12">
                      <div className="form-cmn">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('FORGOT_PASSWORD.emailPlaceholder')}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <button
                        type="submit"
                        className="cmn-btn s1-bg radius12 w-100 fw_600 justify-content-center d-inline-flex align-items-center gap-2 py-xxl-4 py-3 px-xl-6 px-5 n0-clr"
                        disabled={isLoading}
                      >
                        <span className="fw_600 n0-clr">
                          {isLoading ? t('FORGOT_PASSWORD.loading') : t('FORGOT_PASSWORD.sendButton')}
                        </span>
                      </button>
                    </div>
                    <div className="col-lg-12">
                      <Link
                        href="/login"
                        className="d-flex text-decoration-underline act4-texthover justify-content-center fw_600 fs-eight mt-2 s1-texthover"
                      >
                        {t('FORGOT_PASSWORD.backToLogin')}
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="log-thumbwrap">
              <div className="thumb">
                <Image
                  src={loginImage}
                  alt="img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordSection;
