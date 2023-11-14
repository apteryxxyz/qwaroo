'use client';

import { ServerThemeProvider } from 'next-themes';

export function HTMLProviders(p: React.PropsWithChildren) {
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

export function MainProviders(p: React.PropsWithChildren) {
  return <>{p.children}</>;
}
