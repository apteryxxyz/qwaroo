'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ServerThemeProvider } from 'next-themes';
import { Tooltip } from '@/components/ui/tooltip';
import { getClientConfig, trpc } from '@/services/trpc';

export function HTMLProviders({ children }: React.PropsWithChildren) {
  return (
    <ServerThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ServerThemeProvider>
  );
}

export function MainProviders({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient(getClientConfig()));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <Tooltip.Provider>{children}</Tooltip.Provider>
        </SessionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
