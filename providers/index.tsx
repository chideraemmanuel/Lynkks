'use client';

import { FC } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Toaster } from 'sonner';

interface Props {
  children: React.ReactNode;
}

const Providers: FC<Props> = ({ children }) => {
  const client = new QueryClient();
  return (
    <>
      <QueryClientProvider client={client}>
        <Toaster richColors />
        {children}
      </QueryClientProvider>
    </>
  );
};

export default Providers;
