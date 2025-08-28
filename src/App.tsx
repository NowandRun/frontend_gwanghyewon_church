import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInAccessTokenVar } from './types/apollo';
import { RouterProvider } from 'react-router-dom';
import loggedInRouter from './routers/logged-in-router';
import { useRecoilValue } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './Style/theme';
import GlobalStyle from './Style/GlobalStyle';
import { isdarkAtom } from './types/atoms';
import router from "./routers/router";


const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInAccessTokenVar);
  const isDark = useRecoilValue(isdarkAtom);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <RouterProvider router={isLoggedIn ? loggedInRouter : router} />
    </ThemeProvider>
  );
};

export default App;

