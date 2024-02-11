'use server';

import { getEmailVerificationTokenByToken } from '@/data/email-verification-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';

export const verifyEmail = async (token: string) => {
  const existingToken = await getEmailVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: 'Token does not exist!' };
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: 'Email does not exist!' };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date() },
  });
  await db.emailVerificationToken.delete({ where: { id: existingToken.id } });
  return { success: 'Email verified' };
};
