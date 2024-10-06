import React from 'react';
import {
  ServicesCard,
  ServicesContainer,
  ServicesH2,
  ServicesH1,
  ServicesIcon,
  ServicesWrapper,
  ServicesP,
} from './ServiceElements';
import { serviceData } from './serviceData';

const Services = () => {
  return (
    <>
      <ServicesContainer id="entrepreneurship">
        <ServicesH1>Innovating Tomorrow</ServicesH1>
        <ServicesWrapper>
          {serviceData.map((item, index) => (
            <ServicesCard
              key={index}
              target="_blank"
              href={item.link}
              rel="noopener noreferrer"
            >
              <ServicesIcon
                src={item.img}
                alt={item.title}
              />
              <ServicesH2>{item.title}</ServicesH2>
              <ServicesP>{item.desc}</ServicesP>
            </ServicesCard>
          ))}
        </ServicesWrapper>
      </ServicesContainer>
    </>
  );
};

export default Services;
