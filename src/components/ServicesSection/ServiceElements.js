import styled from 'styled-components';

export const ServicesContainer = styled.div`
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #010606;
`;

export const ServicesWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  grid-gap: 16px;
  justify-content: center;
`;

export const ServicesCard = styled.a`
  background: #fff;
  height: 320px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  text-decoration: none;
  /* max-height: 340px; */
  color: black;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

  &:focus,
  &:active {
    text-decoration: none;
    color: inherit;
  }

  &:hover {
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    text-decoration: none;
  }

  @media screen and (max-width: 950px) {
    height: 275px;
  }

  @media screen and (max-width: 800px) {
    height: 300px;
  }
`;
export const ServicesIcon = styled.img`
  height: 160px;
  width: 160px;
  margin-bottom: 10px;
`;

export const ServicesH1 = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 50px;

  @media screen and (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

export const ServicesH2 = styled.h2`
  font-size: 1rem;
  margin-bottom: 10px;
`;
export const ServicesP = styled.p`
  font-size: 1rem;
  text-align: center;
`;
