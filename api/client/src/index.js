import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import { QueryClientProvider, QueryClient } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false}/> */}
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
