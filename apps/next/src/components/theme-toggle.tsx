'use client';

import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu data-side="client">
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="sm" className="px-0">
          <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end">
        <DropdownMenu.Item onClick={() => setTheme('light')}>
          <SunIcon className="mr-1 h-4 w-4" />
          <span>Light</span>
        </DropdownMenu.Item>

        <DropdownMenu.Item onClick={() => setTheme('dark')}>
          <MoonIcon className="mr-1 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenu.Item>

        <DropdownMenu.Item onClick={() => setTheme('system')}>
          <LaptopIcon className="mr-1 h-4 w-4" />
          <span>System</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
