import styled from 'styled-components';

export const Container = styled.div`
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100vw;
  height: 100px;
  z-index: 10;
  display: flex;
  align-items: center;
  box-shadow: 3px 3px 10px 0px lightgray;
  font-size: 18px;

  @media screen and (min-width: 768px) and (max-width: 1024px) {
    height: 90px;
    font-size: 16px;
  }

  @media screen and (max-width: 767px) {
    height: 70px;
    font-size: 14px;
  }
`;

export const Navbar = styled.div`
  max-width: 1920px;
  width: 95vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  .admin {
    font-size: 14px;
    color: var(--main-yellow-color);
  }
  @media screen and (max-width: 767px) {
    width: 90vw;
  }
`;

export const MenuButton = styled.button`
  display: none;
  @media screen and (max-width: 767px) {
    display: flex;
    width: 100%;
    background-color: transparent;
    justify-content: end;
    padding: 0;
    &.side {
      padding: 20px 5vw;
    }
  }
`;

export const Logo = styled.img`
  cursor: pointer;
  @media screen and (min-width: 1025px) {
    width: 100px;
    height: 100px;
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    width: 100px;
    height: 100px;
  }

  @media screen and (max-width: 767px) {
    width: 75px;
    height: 75px;
  }
`;

export const NavitemContainer = styled.div`
  display: flex;
  width: 85%;
  justify-content: space-between;

  @media screen and (max-width: 767px) {
    display: block;
    width: 100vw;
    position: absolute;
    margin: 0 auto;
    z-index: 12;
    top: 0;
    right: 0;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
    background-color: var(--main-yellow-color);
    box-shadow: 3px 3px 10px 0px lightgray;
    &.side {
      transform: translateY(0);
    }
  }
`;

export const Navitem = styled.nav`
  cursor: pointer;
  display: flex;
  width: auto;
  align-items: center;
  text-align: center;
  justify-content: center;
  margin: 0 10px;
  border-radius: 10px;
  padding: 10px 15px;
  &:hover {
    background-color: #ffe794;
    transition: 0.5s;
  }

  &.active {
    background-color: var(--main-yellow-color);
  }

  @media screen and (min-width: 768px) and (max-width: 1024px) {
    padding: 10px;
    margin: 0 5px;
  }

  @media screen and (max-width: 767px) {
    display: block;
    margin: 10px 0;
  }
`;

export const Space = styled.div`
  width: 40%;
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    width: 15%;
  }
`;
