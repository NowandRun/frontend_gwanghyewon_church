import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/styles.css';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>
);
