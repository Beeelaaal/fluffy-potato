'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { observeAuthState } from '@/lib/auth';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'tutor' | 'admin';
  university: string;
  photoURL?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: 'student' | 'tutor' | 'admin' | null;
  loading: boolean;
  profileError: string | null;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  profileError: null,
  refetchProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                 = useState<User | null>(null);
  const [profile, setProfile]           = useState<UserProfile | null>(null);
  const [loading, setLoading]           = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  /**
   * fetchProfile — reads the Firestore user document.
   *
   * KEY FIX: we NEVER overwrite the role with 'student' when we can't read Firestore.
   * If the read fails we surface the error and keep role = null so the admin guard
   * doesn't incorrectly block access. The user should fix their Firestore rules
   * or use /debug to set their role first.
   */
  const fetchProfile = useCallback(async (firebaseUser: User): Promise<void> => {
    setProfileError(null);

    try {
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (snap.exists()) {
        // Document found — trust whatever role is stored in Firestore
        const data = snap.data() as UserProfile;
        setProfile(data);
        return;
      }

      // ── No document yet ── create a default 'student' profile ──
      // Only done when the doc genuinely does not exist (first sign-up).
      const defaultProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName ?? '',
        role: 'student',
        university: '',
        photoURL: firebaseUser.photoURL ?? undefined,
        isVerified: firebaseUser.emailVerified,
      };

      try {
        // Write the default profile — this may fail if rules don't allow it yet.
        // That's OK; we still set the in-memory profile so the app works.
        await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile, { merge: true });
      } catch (writeErr: any) {
        console.warn('[AuthContext] Could not create default user doc:', writeErr?.message);
      }

      setProfile(defaultProfile);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      console.error('[AuthContext] Firestore profile fetch failed:', msg);
      setProfileError(msg);

      // IMPORTANT: Do NOT silently set role:'student' here.
      // Instead keep existing profile if we already have one (e.g. cached from earlier).
      // This means if someone is admin and Firestore momentarily fails, they stay admin.
      // Only set a minimal profile when we have nothing at all.
      setProfile((prev) => {
        if (prev && prev.uid === firebaseUser.uid) {
          // Keep existing profile (preserves admin role on transient errors)
          return prev;
        }
        // No existing profile — use a minimal one from Firebase Auth
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          name: firebaseUser.displayName ?? '',
          role: 'student', // safe default only when truly nothing exists
          university: '',
          photoURL: firebaseUser.photoURL ?? undefined,
        };
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = observeAuthState(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
        setProfileError(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  /** Re-reads the Firestore profile — call this after setting admin role */
  const refetchProfile = useCallback(async () => {
    if (user) {
      setLoading(true);
      await fetchProfile(user);
      setLoading(false);
    }
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role ?? null,
        loading,
        profileError,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
