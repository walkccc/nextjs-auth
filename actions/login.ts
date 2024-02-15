'use server';

import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn } from '@/auth';
import { getTwoFactorCodeByEmail } from '@/data/two-factor-code';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendEmailVerificationEmail, sendTwoFactorCodeEmail } from '@/lib/mail';
import {
  generateEmailVerificationToken,
  generateTwoFactorCode,
} from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, code } = validateFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
    return { error: 'Email does not exist!' };
  }

  if (!existingUser.emailVerified) {
    const token = await generateEmailVerificationToken(email);
    await sendEmailVerificationEmail(email, token.token);
    return { success: 'Verification email sent!' };
  }

  if (existingUser.twoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorCode = await getTwoFactorCodeByEmail(existingUser.email);
      if (!twoFactorCode || twoFactorCode.code !== code) {
        return { error: 'Invalid code!' };
      }

      const hasExpired = new Date(twoFactorCode.expiresAt) < new Date();
      if (hasExpired) {
        return { error: 'Code expired!' };
      }

      await db.twoFactorCode.delete({ where: { id: twoFactorCode.id } });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorCode = await generateTwoFactorCode(email);
      await sendTwoFactorCodeEmail(email, twoFactorCode.code);
      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Someting went wrong!' };
      }
    }

    throw error;
  }

  return { success: 'Successfully login!' };
};
