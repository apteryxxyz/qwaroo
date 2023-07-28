import type { PropsWithChildren } from 'react';

export function Card(p: PropsWithChildren) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '50px',
      }}
    >
      {p.children}
    </div>
  );
}
