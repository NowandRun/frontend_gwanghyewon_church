import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/styles.css';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HelmetProvider>
        <Router>
          <App />
        </Router>
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>
);
