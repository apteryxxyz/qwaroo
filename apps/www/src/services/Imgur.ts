import { ImgurClient } from 'imgur';

const imgur = new ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID!,
    clientSecret: process.env.IMGUR_CLIENT_SECRET!,
});

export { imgur };
