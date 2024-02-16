import { Navbar } from './_components/navbar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-y-5">
      <Navbar />
      {children}
    </div>
  );
}
