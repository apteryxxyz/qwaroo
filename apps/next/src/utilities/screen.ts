export function maximise() {
  const header = document.querySelector('header')!;
  header.remove();

  const main = document.querySelector('main')!;
  main.classList.remove('container', 'py-10');

  document.body.style.overflow = 'hidden';

  return () => {
    document.body.prepend(header);
    main.classList.add('container', 'py-10');
    document.body.style.overflow = 'auto';
  };
}
