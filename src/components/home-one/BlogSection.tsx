'use client';
import blog1 from '@/../public/images/blog/blog1.png';
import blog2 from '@/../public/images/blog/blog2.png';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import MotionFadeDownToTop from '../motionEffect/MotionFadeDownToTop';
import SubTitle from '../SubTitle';
import BlogCard from './BlogCard';

type BlogProps = {
  sectionBg?: boolean;
  blogCardsData?: { imageUrl: StaticImageData; date: string; title: string; description: string; link: string }[];
};

const BlogSection = ({ sectionBg, blogCardsData = data }: BlogProps) => {
  const { t } = useTranslation();
  return (
    <section className={`blog-section1 pt-120 pb-120 ${sectionBg ? 'question-section' : ''}`}>
      {/* <!--Section Header--> */}
      <div className="container">
        <div className="row g-xl-4 g-3 align-items-center justify-content-between mb-xxl-12 mb-xl-10 mb-8">
          <div className="col-lg-6 col-md-8 col-sm-8">
            <div className="section__title">
              <SubTitle text={t('BLOG.sectionLabel')} />
              <MotionFadeDownToTop>
                <h2 className="display-four d-block n4-clr">
                  {t('BLOG.title')}{' '}
                  <span className="act4-clr act4-underline" data-aos="zoom-in-left" data-aos-duration="1000">
                    {t('BLOG.titleHighlight')}
                  </span>
                </h2>
              </MotionFadeDownToTop>
            </div>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2">
            <div className="browse-more" data-aos="zoom-in-up" data-aos-duration="2000">
              <Link
                href="/landing-page"
                className="cmn__collection radius-circle s1-bg d-center position-relative ms-lg-auto"
              >
                <span className="cmn-cont-box text-center position-relative">
                  <span className="icon mb-1">
                    <ArrowUpRightIcon className="n0-clr fs-three" />
                  </span>
                  <span className="d-block n0-clr fw_700">{t('BLOG.browseMore')}</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <!--Section Header--> */}

      {/* <!--blog body Header--> */}
      <div className="container">
        <div className="row g-6">
          {blogCardsData?.map(blogCard => (
            <BlogCard
              key={`${blogCard.title}-${blogCard.date}`}
              imageUrl={blogCard.imageUrl}
              date={blogCard.date}
              title={blogCard.title}
              description={blogCard.description}
              link={blogCard.link}
            />
          ))}
        </div>
      </div>
      {/* <!--blog body Header--> */}
    </section>
  );
};

export default BlogSection;

const data = [
  {
    imageUrl: blog1,
    date: '12/',
    title: 'Behind the Wheel Driver Experiences',
    description:
      'Get ready to rev up your lottery game! Our blog featuresd from seasoned lottery players who have cracked the code to success.',
    link: 'blog-details',
  },
  {
    imageUrl: blog2,
    date: '17/',
    title: 'Best cars offer high quality affordable',
    description:
      'Learn about strategic number selection, the chill of anticipation, and the joy of claiming a dream car.',
    link: 'blog-details',
  },
];
