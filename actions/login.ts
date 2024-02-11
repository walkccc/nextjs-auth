'use server';

import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { sendEmailVerificationEmail } from '@/lib/mail';
import { generateEmailVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validateFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
    return { error: 'Email does not exist!' };
  }

  if (!existingUser.emailVerified) {
    const token = await generateEmailVerificationToken(email);
    await sendEmailVerificationEmail(email, token.token);
    return { success: 'Verification email sent!' };
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
