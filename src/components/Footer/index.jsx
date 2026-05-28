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
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiSubstack } from "react-icons/si";
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
            
            <SocialIcons>
              <SocialIconLink
                href="https://github.com/jaydjhangiani"
                target="_blank"
                aria-label="Github"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </SocialIconLink>
              <SocialIconLink
                href="https://jaysjournal.substack.com"
                target="_blank"
                aria-label="Substack"
                rel="noopener noreferrer"
              >
                <SiSubstack  />
              </SocialIconLink>
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
