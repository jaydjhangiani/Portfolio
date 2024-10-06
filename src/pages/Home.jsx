import React from 'react';
import HeroSection from '../components/HeroSection';
import InfoSection from '../components/InfoSection';
import {
  homeObjFive,
  homeObjFour,
  homeObjOne,
  homeObjThree,
  homeObjTwo,
} from '../components/InfoSection/infoData';
import Services from '../components/ServicesSection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <InfoSection {...homeObjOne} />
      <InfoSection {...homeObjTwo} />
      <InfoSection {...homeObjThree} />
      <InfoSection {...homeObjFour} />
      <Services />
      <InfoSection {...homeObjFive} />
    </>
  );
};

export default Home;
