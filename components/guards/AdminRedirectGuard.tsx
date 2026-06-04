'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRedirectGuard({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    // If the logged-in user is an admin and tries to access any non-admin page
    if ((profile?.role as string) === 'admin' && !pathname.startsWith('/admin')) {
      router.replace('/admin');
    }
  }, [profile, loading, pathname, router]);

  // Prevent flash of public content for logged-in admins
  if (!loading && (profile?.role as string) === 'admin' && !pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-funky-blue/20 border-t-funky-blue" />
      </div>
    );
  }

  return <>{children}</>;
}
