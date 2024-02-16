'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { UserButton } from '@/components/auth/user-button';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="w-11/12 md:w-[600px] bg-secondary flex flex-wrap justify-between items-center p-2 rounded-xl shadow-sm">
      <div className="flex gap-x-2">
        <Button
          size="sm"
          variant={pathname === '/server' ? 'default' : 'outline'}
          asChild
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          size="sm"
          variant={pathname === '/client' ? 'default' : 'outline'}
          asChild
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button
          size="sm"
          variant={pathname === '/admin' ? 'default' : 'outline'}
          asChild
        >
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          size="sm"
          variant={pathname === '/settings' ? 'default' : 'outline'}
          asChild
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
