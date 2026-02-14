'use client';
import loginImage from 'public/images/background/back-register.png';
import logoBlack from 'public/images/logo/cripto-jackpot-logo.png';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const LoginSection = () => {
  const { t } = useTranslation();
  const { formData, isPasswordShow, isLoading, handleInputChange, togglePasswordVisibility, handleSubmit } =
    useLoginForm();

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
                <div className="log-title mb-xxl-10 mb-xl-7 mb-6">
                  <span className="n3-clr">
                    {t('LOGIN.newUser')}{' '}
                    <Link href="/register" className="s1-clr s1-texthover">
                      {t('LOGIN.createAccount')}
                    </Link>
                  </span>
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
                          placeholder={t('LOGIN.emailPlaceholder')}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="position-relative">
                        <div className="form-cmn">
                          <input
                            type={isPasswordShow ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="password-field"
                            placeholder={t('LOGIN.passwordPlaceholder')}
                            style={{ paddingRight: '45px' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          aria-label={isPasswordShow ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'auto',
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                          }}
                        >
                          {isPasswordShow ? (
                            <EyeIcon size={20} weight="bold" style={{ color: '#ffffff' }} />
                          ) : (
                            <EyeSlashIcon size={20} weight="bold" style={{ color: '#ffffff' }} />
                          )}
                        </button>
                      </div>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="d-flex text-decoration-underline act4-texthover justify-content-end fw_600 fs-eight mt-xxl-6 mt-3 s1-texthover"
                    >
                      {t('LOGIN.forgetPassword')}
                    </Link>
                    <div className="col-lg-12">
                      <button
                        type="submit"
                        className="cmn-btn s1-bg radius12 w-100 fw_600 justify-content-center d-inline-flex align-items-center gap-2 py-xxl-4 py-3 px-xl-6 px-5 n0-clr mt-1"
                        disabled={isLoading}
                      >
                        <span className="fw_600 n0-clr">{isLoading ? t('LOGIN.loading') : t('LOGIN.loginButton')}</span>
                      </button>
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

export default LoginSection;
