'use client';

import { ServerThemeProvider } from 'next-themes';
import { useEffect } from 'react';

export function ServerProviders(p: React.PropsWithChildren) {
  return (
    <ServerThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {p.children}
    </ServerThemeProvider>
  );
}

export function ClientProviders(p: React.PropsWithChildren) {
  useEffect(() => {
    if (!window.gtag)
      window.gtag = (...args: unknown[]) =>
        console.info('[Google Analytics]', ...args);
  }, []);

  return <>{p.children}</>;
}
