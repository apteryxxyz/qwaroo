'use client';

import { ServerThemeProvider } from 'next-themes';

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
  return <>{p.children}</>;
}
