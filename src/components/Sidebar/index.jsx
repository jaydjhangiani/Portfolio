import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  SidebarContainer,
  CloseIcon,
  SidebarRoute,
  SidebarLinkRouter,
  Icon,
  SidebarLink,
  SideBtnWrap,
  SidebarWrapper,
  SidebarMenu,
} from './SidebarElements';

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'NYU', id: 'nyu' },
  { label: 'Lenovo', id: 'lenovo' },
  { label: 'LTIMindtree', id: 'ltimindtree' },
  { label: 'Entrepreneurship', id: 'entrepreneurship' },
  { label: 'Research', id: 'research' },
];

const handleDownload = () => {
  const link = document.createElement('a');
  link.href = '/data/JayJhangianiNYU.pdf';
  link.download = 'JayJhangianiNYU.pdf';
  link.click();
};

const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <SidebarContainer $isOpen={isOpen} onClick={toggle}>
        <Icon onClick={toggle}>
          <CloseIcon />
        </Icon>
        <SidebarWrapper>
          <SidebarMenu>
            {NAV_ITEMS.map(({ label, id }) =>
              isHome ? (
                <SidebarLink key={id} to={id} onClick={toggle}>
                  {label}
                </SidebarLink>
              ) : (
                <SidebarLinkRouter key={id} to={`/#${id}`} onClick={toggle}>
                  {label}
                </SidebarLinkRouter>
              )
            )}
            <SidebarLinkRouter to="/ai" onClick={toggle}>
              AI
            </SidebarLinkRouter>
          </SidebarMenu>
          <SideBtnWrap>
            <SidebarRoute onClick={() => { handleDownload(); toggle(); }}>
              Resume
            </SidebarRoute>
          </SideBtnWrap>
        </SidebarWrapper>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
