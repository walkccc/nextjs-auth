import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';

import { currentRole } from '@/lib/auth';

export async function GET() {
  const role = await currentRole();
  return role === UserRole.ADMIN
    ? new NextResponse(null, { status: 200 })
    : new NextResponse(null, { status: 403 });
}
