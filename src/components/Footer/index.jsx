import React from 'react';
import {
  FooterContainer,
  FooterWrap,
  SocialIconLink,
  SocialIconDiv,
  SocialIcons,
  SocialLogo,
  SocialMedia,
  SocialMediaWrap,
  WebsiteRights,
} from './FooterElements';
import { FaGithub, FaLinkedin, FaReact } from 'react-icons/fa';
import { animateScroll as scroll } from 'react-scroll';

const Footer = () => {
  const toggleHome = () => {
    scroll.scrollToTop();
  };

  return (
    <FooterContainer>
      <FooterWrap>
        <SocialMedia>
          <SocialMediaWrap>
            <SocialLogo
              to="/"
              onClick={toggleHome}
            >
              Jay Jhangiani
            </SocialLogo>
            <WebsiteRights>Powered by JXOS</WebsiteRights>
            <SocialIcons>
              <SocialIconLink
                href="https://github.com/jaydjhangiani"
                target="_blank"
                aria-label="Github"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </SocialIconLink>
              <SocialIconDiv aria-label="MADE WITH REACT">
                <FaReact />
              </SocialIconDiv>
              <SocialIconLink
                href="https://linkedin.com/in/jaydjhangiani"
                target="_blank"
                aria-label="Linkedin"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </SocialIconLink>
            </SocialIcons>
          </SocialMediaWrap>
        </SocialMedia>
      </FooterWrap>
    </FooterContainer>
  );
};

export default Footer;
