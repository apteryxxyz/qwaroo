'use client';

import { ServerCrashIcon } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

export default function Error() {
  return (
    <Alert variant="destructive">
      <ServerCrashIcon className="h-4 w-4" />
      <Alert.Title>Something went wrong!</Alert.Title>
      <Alert.Description>Please try again later.</Alert.Description>
    </Alert>
  );
}
