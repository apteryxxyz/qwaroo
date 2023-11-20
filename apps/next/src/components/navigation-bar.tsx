import Link from 'next/link';
import { QwarooIcon } from './qwaroo-icon';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';

export function NavigationBar() {
  return (
    <div className="container h-14 items-center flex w-full gap-4">
      <Link
        href="/"
        className="inline-flex items-center text-xl font-bold text-primary"
      >
        <QwarooIcon />
        Qwaroo
      </Link>

      <nav className="space-x-4">
        <Button className="text-md font-semibold" variant="ghost" asChild>
          <Link href="/profile">Profile</Link>
        </Button>
      </nav>

      <div className="ml-auto">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
