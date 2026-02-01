import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/features/auth/api/auth.api';
import type { JWT as _JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        try {
          const response = await login({
            phone: credentials.phone,
            password: credentials.password,
          });

          return {
            id: response.user.id,
            name: response.user.name,
            lastName: response.user.lastName,
            phone: response.user.phone,
            email: response.user.email,
            accessToken: response.accessToken,
          };
        } catch (_error) {
          // El error ya se mostrará en el interceptor de axios
          // Solo retornamos null para que NextAuth muestre el error genérico
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.lastName = token.lastName;
        session.user.phone = token.phone;
        session.user.email = token.email;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días (mismo que el token del backend)
  },
  secret: process.env.NEXTAUTH_SECRET,
};
