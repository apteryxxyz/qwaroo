import { AuthAdapter } from '@qwaroo/adapter';
import type { AuthOptions, DefaultUser } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { env } from '../env';

export const authOptions: AuthOptions = {
  adapter: AuthAdapter(),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (session.user) session.user.id = token.sub!.toString();
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin', signOut: '/auth/signout' },
};

declare module 'next-auth' {
  interface Session {
    user: DefaultUser & { id: string };
  }
}
