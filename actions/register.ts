'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { name, email, password } = validateFields.data;
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: 'Email was taken!' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  // TODO: Send verification token email.
  return { success: 'User created!' };
};
