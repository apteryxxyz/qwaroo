import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default () => {
    const router = useRouter();

    useEffect(() => {
        void router.push('/games');
    }, []);
};
