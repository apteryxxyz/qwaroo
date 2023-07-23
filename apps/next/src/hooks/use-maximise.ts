import { useMemo } from 'react';

export function useMaximise() {
  const header = useMemo(
    () => globalThis.document?.querySelector('header'),
    [],
  );
  const main = useMemo(() => globalThis.document?.querySelector('main'), []);

  return [
    () => {
      if (header) header.remove();
      if (main) main.classList.remove('container', 'py-10');
      document.body.style.overflow = 'hidden';
    },
    () => {
      if (header) document.body.prepend(header);
      if (main) main.classList.add('container', 'py-10');
      document.body.style.overflow = 'auto';
    },
  ];
}
