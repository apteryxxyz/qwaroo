'use client';

import Link from 'next/link';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function ProfileButton() {
  const session = useSession();

  return (
    <>
      {session.status === 'loading' && (
        <Button>
          <LogInIcon className="mr-1 h-5 w-5" />
          Loading
        </Button>
      )}

      {session.status !== 'loading' && session.data?.user && (
        <Link href="/auth/signout">
          <Button onClick={() => signOut()}>
            <LogOutIcon className="mr-1 h-5 w-5" />
            Sign out
          </Button>
        </Link>
      )}

      {session.status !== 'loading' && !session.data?.user && (
        <Link href="/auth/signin" onClick={() => false}>
          <Button onClick={() => signIn()}>
            <LogInIcon className="mr-1 h-5 w-5" />
            Sign in
          </Button>
        </Link>
      )}
    </>
  );
}
