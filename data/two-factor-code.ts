import { db } from '@/lib/db';

export const getTwoFactorCodeByCode = async (code: string) => {
  try {
    return await db.twoFactorCode.findUnique({ where: { code } });
  } catch {
    return null;
  }
};

export const getTwoFactorCodeByEmail = async (email: string) => {
  try {
    return await db.twoFactorCode.findFirst({ where: { email } });
  } catch {
    return null;
  }
};
