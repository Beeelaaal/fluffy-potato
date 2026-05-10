'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  const [user, setUser]               = useState<User | null>(null);
  const [profile, setProfile]         = useState<UserProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  async function fetchProfile(firebaseUser: User): Promise<void> {
    setProfileError(null);
    try {
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data);
      } else {
        // No Firestore document yet — create a default student profile
        // so the user is never stuck with null profile after sign-in
        const defaultProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          name: firebaseUser.displayName ?? '',
          role: 'student',
          university: '',
          photoURL: firebaseUser.photoURL ?? undefined,
          isVerified: firebaseUser.emailVerified,
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile, { merge: true });
        setProfile(defaultProfile);
      }
    } catch (err: any) {
      // Surface the Firestore error so it can be shown in UI / debug page
      const msg = err?.message ?? String(err);
      console.error('[AuthContext] Firestore profile fetch failed:', msg);
      setProfileError(msg);
      // Still set a minimal profile from Firebase Auth so the app doesn't
      // break entirely on a Firestore permission issue
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName ?? '',
        role: 'student',  // safe default
        university: '',
        photoURL: firebaseUser.photoURL ?? undefined,
      });
    }
  }

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
  }, []);

  async function refetchProfile() {
    if (user) {
      await fetchProfile(user);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role: profile?.role ?? null,
      loading,
      profileError,
      refetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
