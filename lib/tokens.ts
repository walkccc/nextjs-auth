import { v4 as uuidv4 } from 'uuid';

import { getEmailVerificationTokenByEmail } from '@/data/verify-email-token';
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
