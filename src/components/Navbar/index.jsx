import React, { useEffect, useState } from 'react';
import {
  MobileIcon,
  Nav,
  NavbarContainer,
  NavBtn,
  NavBtnLink,
  NavItem,
  NavLinks,
  NavLinkRouter,
  NavLogo,
  NavMenu,
} from './NavbarElements';
import { FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { animateScroll as scroll } from 'react-scroll';
import { useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'NYU', id: 'nyu' },
  { label: 'MDRhythm', id: 'mdrhythm' },
  { label: 'Lenovo', id: 'lenovo' },
  { label: 'LTIMindtree', id: 'ltimindtree' },
  { label: 'Entrepreneurship', id: 'entrepreneurship' },
  { label: 'Research', id: 'research' },
];

const Navbar = ({ toggle }) => {
  const [scrollNav, setScrollNav] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/data/JayJhangianiNYU.pdf';
    link.download = 'JayJhangianiNYU.pdf';
    link.click();
  };

  useEffect(() => {
    window.addEventListener('scroll', changeNav);
  }, []);

  const toggleHome = () => {
    scroll.scrollToTop();
  };

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav $scrollNav={scrollNav} $solid={!isHome}>
          <NavbarContainer>
            <NavLogo to="/" onClick={toggleHome}>
              Jay Jhangiani
            </NavLogo>
            <MobileIcon onClick={toggle}>
              <FaBars />
            </MobileIcon>
            <NavMenu>
              {NAV_ITEMS.map(({ label, id }) => (
                <NavItem key={id}>
                  {isHome ? (
                    <NavLinks
                      to={id}
                      smooth={true}
                      duration={500}
                      spy={true}
                      exact="true"
                      offset={-80}
                    >
                      {label}
                    </NavLinks>
                  ) : (
                    <NavLinkRouter to={`/#${id}`}>{label}</NavLinkRouter>
                  )}
                </NavItem>
              ))}
              <NavItem>
                <NavLinkRouter to="/ai">AI</NavLinkRouter>
              </NavItem>
            </NavMenu>
            <NavBtn>
              <NavBtnLink onClick={handleDownload}>Resume</NavBtnLink>
            </NavBtn>
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;
