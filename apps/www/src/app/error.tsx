'use client';

import { ServerCrashIcon } from 'lucide-react';
import { Alert } from '@/components/Alert';

export default function Error() {
    return <Alert variant="destructive">
        <ServerCrashIcon className="w-5 h-5 mr-2" />
        <Alert.Title>Something went wrong!</Alert.Title>
        <Alert.Description>Please try again later.</Alert.Description>
    </Alert>;
}
