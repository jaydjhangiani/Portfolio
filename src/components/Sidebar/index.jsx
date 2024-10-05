import React from 'react';
import {
  SidebarContainer,
  CloseIcon,
  SidebarRoute,
  Icon,
  SidebarLink,
  SideBtnWrap,
  SidebarWrapper,
  SidebarMenu,
} from './SidebarElements';

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <>
      <SidebarContainer
        isOpen={isOpen}
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
              to="ai"
              onClick={toggle}
            >
              AI
            </SidebarLink>
          </SidebarMenu>
          <SideBtnWrap>
            <SidebarRoute to="/resume">Resume</SidebarRoute>
          </SideBtnWrap>
        </SidebarWrapper>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
