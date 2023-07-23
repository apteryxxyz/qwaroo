import { env } from '@qwaroo/env/core';
import { ImgurClient } from 'imgur';

export const imgur = new ImgurClient({
  clientId: env.IMGUR_CLIENT_ID,
  clientSecret: env.IMGUR_CLIENT_SECRET,
});
