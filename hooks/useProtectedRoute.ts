'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteOptions {
  requiredRole?: 'student' | 'tutor' | 'admin';
  redirectTo?: string;
  redirectOnRoleMismatch?: boolean;
}

export function useProtectedRoute(options?: ProtectedRouteOptions) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(options?.redirectTo || '/login');
      return;
    }

    if (options?.requiredRole && profile?.role) {
      if (profile.role !== options.requiredRole && profile.role !== 'admin') {
        const shouldRedirect = options.redirectOnRoleMismatch ?? true;
        if (shouldRedirect) {
          router.replace('/');
        }
      }
    }
  }, [user, profile, loading, router, options?.requiredRole, options?.redirectTo, options?.redirectOnRoleMismatch]);

  return { user, profile, loading };
}
