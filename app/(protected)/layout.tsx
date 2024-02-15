import { Navbar } from './_components/navbar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-y-10 bg-gradient-to-tr from-sky-200 to-sky-600">
      <Navbar />
      {children}
    </div>
  );
}
