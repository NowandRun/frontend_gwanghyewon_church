import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './Style/theme';
import GlobalStyle from './Style/GlobalStyle';
import { isdarkAtom } from './types/atoms';
import router from './routers/router';

const App = () => {
  /* useReactiveVar(isLoggedInAccessTokenVar); */

  const isDark = useRecoilValue(isdarkAtom);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
