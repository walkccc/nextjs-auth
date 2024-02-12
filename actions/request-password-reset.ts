'use server';

import { z } from 'zod';

import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { RequestResetPasswordSchema } from '@/schemas';

export const requestPasswordReset = async (
  values: z.infer<typeof RequestResetPasswordSchema>,
) => {
  const validatedFields = RequestResetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  const token = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(token.email, token.token);
  return { success: 'Password reset email sent!' };
};
