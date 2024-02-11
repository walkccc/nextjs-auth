import { db } from '@/lib/db';

export const getEmailVerificationTokenByToken = async (token: string) => {
  try {
    return await db.emailVerificationToken.findUnique({ where: { token } });
  } catch {
    return null;
  }
};

export const getEmailVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.emailVerificationToken.findFirst({ where: { email } });
  } catch {
    return null;
  }
};
