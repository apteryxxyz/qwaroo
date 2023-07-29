import Link from 'next/link';

export function Footer() {
  return (
    <footer className="flex flex-shrink-0 flex-col items-center justify-center pb-8 text-foreground/30">
      <p>
        Made by{' '}
        <a
          className="font-semibold underline"
          href="https://github.com/apteryxxyz"
          target="_blank"
          rel="noreferrer"
        >
          Apteryx
        </a>{' '}
        in New Zealand!
      </p>

      <p>
        <Link href="/policies/privacy-policy">Privacy Policy</Link>

        <span className="mx-2">|</span>

        <Link href="/policies/terms-of-service">Terms of Service</Link>
      </p>
    </footer>
  );
}
