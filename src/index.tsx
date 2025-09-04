import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { client } from './types/apollo';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";

// ✅ QueryClient 인스턴스 생성
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ApolloProvider client={client}>
        <HelmetProvider>
          {/* ✅ QueryClientProvider로 감싸주기 */}
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </HelmetProvider>
      </ApolloProvider>
    </RecoilRoot>
  </React.StrictMode>
);
