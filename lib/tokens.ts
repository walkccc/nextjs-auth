import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { getEmailVerificationTokenByEmail } from '@/data/email-verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorCodeByEmail } from '@/data/two-factor-code';
import { db } from '@/lib/db';

export const generateEmailVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getEmailVerificationTokenByEmail(email);
  if (existingToken) {
    await db.emailVerificationToken.delete({ where: { id: existingToken.id } });
  }

  return await db.emailVerificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({ where: { id: existingToken.id } });
  }

  return await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
};

export const generateTwoFactorCode = async (email: string) => {
  const code = crypto.randomInt(1000, 10_000).toString();
  const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorCodeByEmail(email);
  if (existingToken) {
    await db.twoFactorCode.delete({ where: { id: existingToken.id } });
  }

  return await db.twoFactorCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });
};
