import { AuthAdapter } from '@qwaroo/auth-adapter';
import type { AuthOptions, DefaultUser } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { waitForDatabase } from './Database';

const authOptions: AuthOptions = {
    adapter: AuthAdapter(waitForDatabase),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) session.user.id = token.sub!.toString();
            return session;
        },
    },
    session: { strategy: 'jwt' },
    pages: { signIn: '/auth/signin', signOut: '/auth/signout' },
};

declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & {
            id: string;
        };
    }
}

export { authOptions };
