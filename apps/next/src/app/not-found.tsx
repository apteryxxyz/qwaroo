'use client';

import { FileQuestionIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NotFound() {
  return (
    <Alert>
      <FileQuestionIcon className="h-4 w-4" />
      <AlertTitle>Not found!</AlertTitle>
      <AlertDescription>
        The page you are looking for does not exist.
      </AlertDescription>
    </Alert>
  );
}
