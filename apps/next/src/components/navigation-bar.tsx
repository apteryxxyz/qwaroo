import Link from 'next/link';
import { QwarooIcon } from './qwaroo-icon';
import { ThemeSwitcher } from './theme-switcher';

export function NavigationBar() {
  return (
    <div className="container h-14 items-center flex w-full">
      <Link
        href="/"
        className="inline-flex items-center text-xl font-bold text-primary"
      >
        <QwarooIcon />
        Qwaroo
      </Link>

      <div className="ml-auto">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
