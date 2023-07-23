'use client';

import { useParams } from 'next/navigation';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Alert } from '@/components/alert';

export default function NotFound() {
  const { id } = useParams();

  return (
    <Alert variant="destructive">
      <QuestionMarkCircledIcon className="mr-2 h-5 w-5" />
      <Alert.Title>Game was not found</Alert.Title>
      <Alert.Description>
        Game for id &quot;{id}&quot; was not found.
      </Alert.Description>
    </Alert>
  );
}
