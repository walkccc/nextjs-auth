'use server';

import { UserRole } from '@prisma/client';

import { currentRole } from '@/lib/auth';

export const admin = async () => {
  const role = await currentRole();
  return role === UserRole.ADMIN
    ? { success: 'Allowed Server Action!' }
    : { error: 'Forbidden Server Action!' };
};
