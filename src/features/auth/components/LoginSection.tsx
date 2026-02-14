'use client';
import loginImage from 'public/images/background/back-register.png';
import logoBlack from 'public/images/logo/cripto-jackpot-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const LoginSection = () => {
  const { t } = useTranslation();

  const handleLogin = () => {
    console.log('Login functionality not implemented');
  };

  const handleRegister = () => {
    console.log('Register functionality not implemented');
  };

  return (
    <section className="login-section position-relative">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-4 col-md-8 col-11">
            <div className="left-logwrap d-center">
              <div className="authentication-cmn">
                <div className="container">
                  <Link href="/landing-page" className="text-center mb-xxl-10 d-block">
                    <Image src={logoBlack} alt="img" />
                  </Link>
                </div>
                <div className="log-title mb-xxl-10 mb-xl-7 mb-6">
                  <h3 className="n3-clr mb-3">{t('LOGIN.title', 'Iniciar Sesión')}</h3>
                  <span className="n3-clr">
                    {t('LOGIN.newUser')}{' '}
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="s1-clr s1-texthover bg-transparent border-0 p-0 text-decoration-underline"
                    >
                      {t('LOGIN.createAccount')}
                    </button>
                  </span>
                </div>

                <div className="d-flex flex-column gap-4">
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="cmn-btn s1-bg radius12 w-100 fw_600 justify-content-center d-inline-flex align-items-center gap-2 py-xxl-4 py-3 px-xl-6 px-5 n0-clr"
                  >
                    <span className="fw_600 n0-clr">{t('LOGIN.loginButton', 'Iniciar Sesión')}</span>
                  </button>
                </div>
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

export default LoginSection;
