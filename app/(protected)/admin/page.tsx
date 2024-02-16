'use client';

import { UserRole } from '@prisma/client';
import { toast } from 'sonner';

import { admin } from '@/actions/admin';
import { RoleGate } from '@/components/auth/role-gate';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AdminPage() {
  const onServerActionClick = async () => {
    const data = await admin();
    if (data.error) {
      toast.error(data.error);
    }
    if (data.success) {
      toast.success(data.success);
    }
  };

  const onApiRouteClick = async () => {
    const response = await fetch('/api/admin');
    if (response.ok) {
      toast.success('Allowed API Route!');
    } else {
      toast.error('Forbidden API Route!');
    }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Test</Button>
        </div>
      </CardContent>
    </Card>
  );
}
