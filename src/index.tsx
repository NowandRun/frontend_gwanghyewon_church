import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { client } from './types/apollo';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';
import App from './App';
import GlobalStyle from './Style/GlobalStyle';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ApolloProvider client={client}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ApolloProvider>
    </RecoilRoot>
  </React.StrictMode>
);
