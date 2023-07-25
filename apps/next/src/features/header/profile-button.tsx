'use client';

import Link from 'next/link';
import { LogInIcon, UserIcon } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/button';

export function ProfileButton() {
  const session = useSession();

  return (
    <>
      {session.status === 'loading' && (
        <Button>
          <LogInIcon className="mr-1 h-4 w-4" />
          Loading
        </Button>
      )}

      {session.status !== 'loading' && session.data?.user && (
        <Link href="/profile">
          <Button>
            <UserIcon className="mr-1 h-4 w-4" />
            Profile
          </Button>
        </Link>
      )}

      {session.status !== 'loading' && !session.data?.user && (
        <Link href="/auth/signin" onClick={() => false}>
          <Button onClick={() => signIn()}>
            <LogInIcon className="mr-1 h-4 w-4" />
            Sign in
          </Button>
        </Link>
      )}
    </>
  );
}
