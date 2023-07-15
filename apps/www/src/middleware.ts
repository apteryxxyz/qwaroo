export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/games/create',
        '/games/create/properties',
        '/games/create/details',
        '/games/create/process',
        '/games/create/socket',
        '/profile',
    ],
};
