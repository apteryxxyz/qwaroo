'use client';

import { AlertCircleIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Alert } from '@/components/Alert';

export default function NotFound() {
    const { slug } = useParams();

    return <Alert variant="destructive">
        <AlertCircleIcon className="w-5 h-5 mr-2" />
        <Alert.Title>Game was not found</Alert.Title>
        <Alert.Description>
            Game for slug "{slug}" was not found, maybe you could create it?
        </Alert.Description>
    </Alert>;
}
