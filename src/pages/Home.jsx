import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import HeroSection from '../components/HeroSection';
import InfoSection from '../components/InfoSection';
import {
  homeObjSix,
  homeObjFive,
  homeObjFour,
  homeObjOne,
  homeObjThree,
  homeObjTwo,
} from '../components/InfoSection/infoData';
import Services from '../components/ServicesSection';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        scroller.scrollTo(id, { smooth: true, duration: 500, offset: 0 });
      }, 200);
    }
  }, [location.hash]);

  return (
    <>
      <HeroSection />
      <InfoSection {...homeObjOne} />
      <InfoSection {...homeObjTwo} />
      <InfoSection {...homeObjThree} />
      <InfoSection {...homeObjFour} />
      <InfoSection {...homeObjFive} />
      <Services />
      <InfoSection {...homeObjSix} />
    </>
  );
};

export default Home;
