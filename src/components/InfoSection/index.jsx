import React from 'react';
import {
  InfoContainer,
  InfoRow,
  InfoWrapper,
  TextWrapper,
  Heading,
  SubTitle,
  SubFotfTitle,
  Column1,
  TopLine,
  Column2,
  ImgWrap,
  Img,
} from './InfoElements';
const InfoSection = ({
  lightText,
  lightBg,
  id,
  alt,
  img,
  description,
  headLine,
  topLine,
  imgStart,
  darkText,
}) => {
  return (
    <>
      <InfoContainer
        lightBg={lightBg}
        id={id}
      >
        <InfoWrapper>
          <InfoRow imgStart={imgStart}>
            <Column1>
              <TextWrapper>
                <TopLine>{topLine}</TopLine>
                <Heading lightText={lightText}>{headLine}</Heading>
                <SubTitle darkText={darkText}>{description}</SubTitle>
              </TextWrapper>
            </Column1>
            <Column2>
              <ImgWrap>
                <Img
                  src={img}
                  alt={alt}
                  height="100%"
                  width="100%"
                />
              </ImgWrap>
            </Column2>
          </InfoRow>
        </InfoWrapper>
      </InfoContainer>
    </>
  );
};

export default InfoSection;
