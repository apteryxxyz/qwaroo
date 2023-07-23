import NextAuth from 'next-auth';
import { authOptions } from '@/services/auth';
import '@qwaroo/database/connect';

const handler = NextAuth(authOptions) as () => void;
export { handler as GET, handler as POST };
