'use client';

import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

export function ThemeToggle() {
    const { setTheme } = useTheme();

    return <DropdownMenu data-side="client">
        <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="sm" className="w-5 h-5 px-0">
                <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="end">
            <DropdownMenu.Item onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item onClick={() => setTheme('system')}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu>;
}
