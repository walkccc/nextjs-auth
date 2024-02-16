import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getUserById } from '@/data/user';
import { db } from '@/lib/db';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth login without email verification.
      if (account?.provider !== 'credentials') return true;
      if (user.id === undefined) return false;

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.twoFactorEnabled) {
        const confirmation = await getTwoFactorConfirmationByUserId(user.id);
        if (!confirmation) return false;

        // Delete the 2FA confirmation for the next sign in.
        await db.twoFactorConfirmation.delete({
          where: { id: confirmation.id },
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      return {
        ...token,
        role: existingUser.role,
        twoFactorEnabled: existingUser.twoFactorEnabled,
      };
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
