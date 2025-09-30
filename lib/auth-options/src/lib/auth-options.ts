import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        userName: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TODO: Implement actual authentication logic
        if (credentials?.userName && credentials?.password) {
          return {
            id: '1',
            email: credentials.userName,
            name: credentials.userName,
          };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
};