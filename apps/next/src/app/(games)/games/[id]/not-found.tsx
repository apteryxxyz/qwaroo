'use client';

import { useParams } from 'next/navigation';
import { SearchXIcon } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

export default function NotFound() {
  const { id } = useParams();

  return (
    <Alert variant="destructive">
      <SearchXIcon className="mr-2 h-5 w-5" />
      <Alert.Title>Game was not found</Alert.Title>
      <Alert.Description>
        Game for id &quot;{id}&quot; was not found.
      </Alert.Description>
    </Alert>
  );
}
