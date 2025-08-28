import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import { darkTheme } from './Style/theme';
import { useRecoilValue } from 'recoil';
import { isdarkAtom } from './types/atoms';
import Footer from "./components/Footer/Footer";
import styled from 'styled-components';

const PageLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

function Root() {
  const isDark = useRecoilValue(isdarkAtom);
  return (
    <PageLayout>
      <Header />
      <MainContent>
        <Outlet context={{ isDark }} />
      </MainContent>
      <Footer />
    </PageLayout>
  );
}

export default Root;


