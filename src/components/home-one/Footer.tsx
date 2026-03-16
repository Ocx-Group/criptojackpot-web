import bannerCar3 from '@/../public/images/banner/banner-car3.png';
import chnagingIcon from '@/../public/images/global/chnaging-icon.png';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import MotionFadeRight from '../motionEffect/MotionFadeRight';

function Footer() {
  return (
    <footer className="footer-section1 n5-bg position-relative overflow-hidden">
      <div className="footer-top pt-120 pb-120">
        <div className="container">
          <div className="row g-6 align-items-center justify-content-between">
            <div className="col-lg-6">
              <div className="footer-content1">
                <div className="d-flex align-items-center gap-xxl-3 gap-2 mb-xxl-24 mb-4">
                  <Image src={chnagingIcon} alt="img" />
                  <span className="nw1-clr fw_700 fs20"> Chasing Fortunes </span>
                </div>
                <div className="section__title mb-xxl-15 mb-xl-10 mb-8">
                  <div className="display-one d-block n0-clr">
                    Explore
                    <div className="d-flex align-items-center gap-2">
                      <span className="d-block" data-aos="zoom-in-right" data-aos-duration="1200">
                        Our
                      </span>
                      <span className="act4-clr act4-underline" data-aos="zoom-in-left" data-aos-duration="1000">
                        Lottery
                      </span>
                    </div>{' '}
                    Hub
                  </div>
                </div>
                <div className="say-helow pb-xxl-5 pb-5 d-flex flex-wrap gap-3 align-items-center justify-content-between">
                  <div className="mails">
                    <span className="nw4-clr d-block mb-xxl-2 mb-0"> Say Hello </span>
                    <Link href="#0" className="fs20 fw_600 nw1-clr">
                      {' '}
                      cruz@example.com{' '}
                    </Link>
                  </div>
                  <Link href="/landing-page" className="kewta-btn d-inline-flex align-items-center">
                    <span className="kew-text p1-bg n4-clr">
                      Participant Now
                      <ArrowUpRightIcon className="ph-bold ph-arrow-up-right n4-clr"></ArrowUpRightIcon>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="footer-thumbv1-wrap">
                <div className="footer-browse-btn">
                  <Link href="#0" className="cmn__collection radius-circle act4-bg d-center position-relative">
                    <span className="cmn-cont-box text-center position-relative">
                      <span className="icon mb-1">
                        <ArrowUpRightIcon className="ph-bold ph-arrow-up-right n0-clr fs-three"></ArrowUpRightIcon>
                      </span>
                      <span className="d-block n0-clr fw_700"> Explore Now </span>
                    </span>
                  </Link>
                </div>
                <div className="animation-boxfooter">
                  <div className="video-bg">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <MotionFadeRight className="footer-thumb1" data-aos="fade-down-left" data-aos-duration="1500">
                  <Image src={bannerCar3} alt="img" />
                </MotionFadeRight>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-botttom cmn-bb pb-xxl-8 pb-xl-6 pb-4 position-relative cus-z1">
        <div className="container">
          <div className="d-flex flex-wrap gap-4 align-items-center justify-content-md-between justify-content-center">
            <ul className="linkfooter flex-wrap justify-content-center">
              <li>
                <Link href="/"> Home </Link>
              </li>
              <li>
                <Link href="/landing-page"> Lotteries </Link>
              </li>
            </ul>
            <ul className="social d-flex align-items-center gap-3">
              <li>
                <Link href="#">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 10V14H10V21H14V14H17L18 10H14V8C14 7.73478 14.1054 7.48043 14.2929 7.29289C14.4804 7.10536 14.7348 7 15 7H18V3H15C13.6739 3 12.4021 3.52678 11.4645 4.46447C10.5268 5.40215 10 6.67392 10 8V10H7Z"
                      stroke="#F4F4F4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.5 4.5V4.51M1 5C1 3.93913 1.42143 2.92172 2.17157 2.17157C2.92172 1.42143 3.93913 1 5 1H13C14.0609 1 15.0783 1.42143 15.8284 2.17157C16.5786 2.92172 17 3.93913 17 5V13C17 14.0609 16.5786 15.0783 15.8284 15.8284C15.0783 16.5786 14.0609 17 13 17H5C3.93913 17 2.92172 16.5786 2.17157 15.8284C1.42143 15.0783 1 14.0609 1 13V5ZM6 9C6 9.79565 6.31607 10.5587 6.87868 11.1213C7.44129 11.6839 8.20435 12 9 12C9.79565 12 10.5587 11.6839 11.1213 11.1213C11.6839 10.5587 12 9.79565 12 9C12 8.20435 11.6839 7.44129 11.1213 6.87868C10.5587 6.31607 9.79565 6 9 6C8.20435 6 7.44129 6.31607 6.87868 6.87868C6.31607 7.44129 6 8.20435 6 9Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.9822 3L15.1052 3.006C17.1192 3.22 18.6322 3.678 20.0712 4.679C20.2429 4.79882 20.3726 4.96951 20.4422 5.167C22.3182 10.482 22.8152 15.154 21.8932 17.447C20.8902 19.452 19.2872 21 17.4992 21C16.5592 21 15.2422 19.404 14.7222 18.031L14.7022 18.036C15.5402 17.905 16.3922 17.713 17.2742 17.462C17.4005 17.4259 17.5185 17.3652 17.6214 17.2835C17.7243 17.2018 17.8101 17.1006 17.8739 16.9858C17.9377 16.8709 17.9782 16.7446 17.9932 16.6141C18.0082 16.4835 17.9973 16.3513 17.9612 16.225C17.9251 16.0987 17.8644 15.9807 17.7827 15.8778C17.701 15.7749 17.5998 15.6891 17.4849 15.6253C17.3701 15.5615 17.2438 15.521 17.1132 15.506C16.9827 15.491 16.8505 15.5019 16.7242 15.538C13.4042 16.488 10.5942 16.488 7.27417 15.538C7.01903 15.4651 6.74537 15.4965 6.51338 15.6253C6.2814 15.7541 6.1101 15.9699 6.03717 16.225C5.96423 16.4801 5.99564 16.7538 6.12448 16.9858C6.25331 17.2178 6.46903 17.3891 6.72417 17.462C7.44917 17.669 8.15517 17.835 8.85017 17.961L9.29417 18.035C8.81717 19.405 7.59917 21 6.66717 21C4.92417 21 3.39117 19.445 2.40017 17.356C1.55917 15.15 2.03117 10.488 3.81417 5.182C3.87986 4.98553 4.00496 4.81431 4.17217 4.692C5.56417 3.676 6.97917 3.217 8.88917 3.007C9.07031 2.98716 9.25343 3.0172 9.41875 3.09386C9.58407 3.17053 9.72529 3.29091 9.82717 3.442L9.89017 3.549L10.5422 4.837L10.7022 4.818C11.5792 4.728 12.4202 4.728 13.2972 4.818L13.4552 4.837L14.1052 3.55C14.1779 3.40579 14.2845 3.28135 14.4158 3.18731C14.5471 3.09327 14.6992 3.03243 14.8592 3.01L14.9822 3ZM8.99917 9C8.52123 8.99998 8.05908 9.17111 7.69642 9.48241C7.33377 9.7937 7.09457 10.2246 7.02217 10.697L7.00417 10.851L6.99917 11L7.00417 11.15C7.03335 11.538 7.17511 11.9092 7.41207 12.2178C7.64902 12.5265 7.97089 12.7594 8.33821 12.8878C8.70553 13.0163 9.10236 13.0349 9.48006 12.9412C9.85775 12.8475 10.1999 12.6456 10.4646 12.3604C10.7293 12.0751 10.905 11.7188 10.9702 11.3352C11.0355 10.9516 10.9873 10.5572 10.8318 10.2005C10.6762 9.84383 10.42 9.54025 10.0945 9.32701C9.76897 9.11377 9.38831 9.00012 8.99917 9ZM14.9992 9C14.5212 8.99998 14.0591 9.17111 13.6964 9.48241C13.3338 9.7937 13.0946 10.2246 13.0222 10.697L13.0042 10.851L12.9992 11L13.0042 11.15C13.0334 11.538 13.1751 11.9092 13.4121 12.2178C13.649 12.5265 13.9709 12.7594 14.3382 12.8878C14.7055 13.0163 15.1024 13.0349 15.4801 12.9412C15.8578 12.8475 16.1999 12.6456 16.4646 12.3604C16.7293 12.0751 16.905 11.7188 16.9702 11.3352C17.0355 10.9516 16.9873 10.5572 16.8318 10.2005C16.6762 9.84383 16.42 9.54025 16.0945 9.32701C15.769 9.11377 15.3883 9.00012 14.9992 9Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="privacy-policy-footer pb-xxl-8 pb-xl-6 pb-4 pt-xxl-8 pt-xl-6 pt-4 position-relative cus-z1">
        <div className="container">
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-md-between justify-content-center">
            <ul className="pri-link d-flex align-items-center gap-xxl-6 gap-sm-6 gap-3">
              <li>
                <Link href="terms-condition"> Terms & Service </Link>
              </li>
              <li>
                <Link href="#"> Privacy Policy </Link>
              </li>
            </ul>
            <p className="footer-copyright flex-wrap justify-content-center">
              <span className="copy n0-clr">
                {' '}
                Copyright &copy; 2026 <Link href="#">Criptojackpot</Link>{' '}
              </span>
              <span className="midbor"> </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
