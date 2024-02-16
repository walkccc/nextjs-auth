'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { unstable_update } from '@/auth';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendEmailVerificationEmail } from '@/lib/mail';
import { generateEmailVerificationToken } from '@/lib/tokens';
import { SettingsSchema } from '@/schemas';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.twoFactorEnabled = undefined;
  }

  let hashedPassword = undefined;

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!' };
    }

    const verificationToken = await generateEmailVerificationToken(
      values.email,
    );
    await sendEmailVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: 'Verification email sent!' };
  }

  if (values.password && values.newPassword && dbUser.hashedPassword) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.hashedPassword,
    );

    if (!passwordsMatch) {
      return { error: 'Incorrect password!' };
    }

    hashedPassword = await bcrypt.hash(values.newPassword, 10);
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      name: values.name,
      email: values.email,
      role: values.role,
      twoFactorEnabled: values.twoFactorEnabled,
      hashedPassword,
    },
  });

  unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      twoFactorEnabled: updatedUser.twoFactorEnabled,
    },
  });

  return { success: 'Settings Updated!' };
};
