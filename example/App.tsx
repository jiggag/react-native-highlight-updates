import React from 'react';
import {QuerySelectorTest} from 'pages/QuerySelectorTest';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QuerySelectorTest />
    </QueryClientProvider>
  );
};

export default App;
