'use client';

import { ServerCrashIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Error() {
  return (
    <Alert variant="destructive">
      <ServerCrashIcon className="h-4 w-4" />
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription>Please try again later.</AlertDescription>
    </Alert>
  );
}
