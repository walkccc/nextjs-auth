import { useSession } from 'next-auth/react';

export const useCurrentRole = () => {
  return useSession().data?.user?.role;
};
