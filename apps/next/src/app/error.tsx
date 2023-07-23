'use client';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Alert } from '@/components/alert';

export default function Error() {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <Alert.Title>Something went wrong!</Alert.Title>
      <Alert.Description>Please try again later.</Alert.Description>
    </Alert>
  );
}
