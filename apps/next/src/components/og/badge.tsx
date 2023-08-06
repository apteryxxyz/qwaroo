import type { PropsWithChildren } from 'react';

export function BadgeRow(p: PropsWithChildren) {
  return (
    <div
      style={{
        display: 'flex',
        marginTop: 'auto',
        fontSize: '32px',
        gap: '20px',
      }}
    >
      {p.children}
    </div>
  );
}

export function Badge(p: PropsWithChildren<{ text: string }>) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg
        viewBox="0 0 24 24"
        width={32}
        height={32}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        {p.children}
      </svg>

      <div
        style={{
          marginLeft: '4px',
          fontWeight: 'bold',
        }}
      >
        {p.text}
      </div>
    </div>
  );
}
