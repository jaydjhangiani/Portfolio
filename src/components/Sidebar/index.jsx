import React from 'react';
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

const handleDownload = () => {
  const link = document.createElement('a');
  link.href = '/data/JayJhangianiNYU.pdf';
  link.download = 'JayJhangianiNYU.pdf';
  link.click();
};

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <>
      <SidebarContainer
        $isOpen={isOpen}
        onClick={toggle}
      >
        <Icon onClick={toggle}>
          <CloseIcon />
        </Icon>
        <SidebarWrapper>
          <SidebarMenu>
            <SidebarLink
              to="about"
              onClick={toggle}
            >
              About
            </SidebarLink>
            <SidebarLink
              to="nyu"
              onClick={toggle}
            >
              NYU
            </SidebarLink>
            <SidebarLink
              to="lenovo"
              onClick={toggle}
            >
              Lenovo
            </SidebarLink>
            <SidebarLink
              to="ltimindtree"
              onClick={toggle}
            >
              LTIMindtree
            </SidebarLink>
            <SidebarLink
              to="entrepreneurship"
              onClick={toggle}
            >
              Entrepreneurship
            </SidebarLink>
            <SidebarLink
              to="research"
              onClick={toggle}
            >
              Research
            </SidebarLink>
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
