'use client';
import sectionIcon from '@/../public/images/global/section-icon.png';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MotionFadeDownToTop from '../motionEffect/MotionFadeDownToTop';
import MotionFadeTopToDown from '../motionEffect/MotionFadeTopToDown';
import SingleFaq from './SingleFaq';
interface Tab {
  id: number;
  title: string;
  questions: string[];
}

type Props = {
  bgColor?: boolean;
};

const Faq = ({ bgColor }: Props) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeAccordion, setActiveAccordion] = useState<{ [key: number]: number | null }>({});
  const [dropDown, setDropDown] = useState('');

  const tabs = [
    {
      id: 1,
      title: t('FAQ.tab1'),
      tab: [
        { question: t('FAQ.q1'), answer: t('FAQ.a1') },
        { question: t('FAQ.q2'), answer: t('FAQ.a2') },
        { question: t('FAQ.q3'), answer: t('FAQ.a3') },
      ],
    },
    {
      id: 2,
      title: t('FAQ.tab2'),
      tab: [
        { question: t('FAQ.q1'), answer: t('FAQ.a1') },
        { question: t('FAQ.q2'), answer: t('FAQ.a2') },
        { question: t('FAQ.q3'), answer: t('FAQ.a3') },
      ],
    },
    {
      id: 3,
      title: t('FAQ.tab3'),
      tab: [
        { question: t('FAQ.q1'), answer: t('FAQ.a1') },
        { question: t('FAQ.q2'), answer: t('FAQ.a2') },
        { question: t('FAQ.q3'), answer: t('FAQ.a3') },
      ],
    },
    {
      id: 4,
      title: t('FAQ.tab4'),
      tab: [
        { question: t('FAQ.q1'), answer: t('FAQ.a1') },
        { question: t('FAQ.q2'), answer: t('FAQ.a2') },
        { question: t('FAQ.q3'), answer: t('FAQ.a3') },
      ],
    },
  ];

  const toggleAccordion = (tabIndex: number, accordionIndex: number) => {
    setActiveAccordion(prev => ({
      ...prev,
      [tabIndex]: prev[tabIndex] === accordionIndex ? null : accordionIndex,
    }));
  };

  return (
    <section className={` pt-120 pb-120 ${bgColor ? 'question-section' : ''}`}>
      {/* Section Header */}
      <div className="container">
        <div className="row g-xl-4 g-3 justify-content-center mb-xxl-10 mb-xl-8 mb-7">
          <div className="col-lg-6">
            <div className="section__title text-center">
              <MotionFadeTopToDown
                className="subtitle-head mb-xxl-4 mb-sm-4 mb-3 d-flex justify-content-center flex-wrap align-items-center gap-3"
                data-aos="zoom-in-up"
                data-aos-duration="1400"
              >
                <Image src={sectionIcon} alt="img" />
                <h5 className="s1-clr fw_700">{t('FAQ.sectionLabel')}</h5>
              </MotionFadeTopToDown>
              <MotionFadeDownToTop>
                <h2 className="display-four d-block n4-clr" data-aos="fade-down-left" data-aos-duration="1600">
                  {t('FAQ.title')} <span className="act4-clr act4-underline"> {t('FAQ.titleHighlight')} </span>
                </h2>
              </MotionFadeDownToTop>
              <p className="n3-clr fs18 mt-xxl-4 mt-3" data-aos="zoom-in-down" data-aos-duration="1800">
                {t('FAQ.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Section Header */}

      {/* Question body */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="question-wrapper1">
              <div className="singletab">
                <div className="question-tab mb-xxl-15 mb-xl-10 mb-lg-8 mb-7">
                  <ul className="tablinks">
                    {tabs.map((tab, index) => (
                      <li key={`faq-tab-${index}`} className={`nav-links ${activeTab === index ? 'active' : ''}`}>
                        <button className="tablink" onClick={() => setActiveTab(index)}>
                          {tab.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="tabcontents">
                  {tabs.map((tab, tabIndex) => (
                    <div key={tabIndex} className={`tabitem ${activeTab === tabIndex ? 'active' : ''}`}>
                      <div className="accordion-section">
                        {tab.tab?.map(({ question, answer }, index) => (
                          <SingleFaq
                            key={`faq-${question}`}
                            id={`faq-${index}${tab.id}`}
                            question={question}
                            answer={answer}
                            dropDown={dropDown}
                            setDropDown={setDropDown}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Question body */}
    </section>
  );
};

export default Faq;
