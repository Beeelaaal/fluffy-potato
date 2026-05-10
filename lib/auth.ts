import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// IMPORTANT: We only write a new doc if one doesn't exist.
// If it does exist we NEVER overwrite the role — we only update safe fields.
async function ensureUserDoc(user: User, extraData?: { name?: string; role?: string; university?: string }) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // First time — create document
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? '',
      name: extraData?.name || user.displayName || '',
      role: extraData?.role || 'student',
      university: extraData?.university || '',
      photoURL: user.photoURL ?? '',
      isVerified: user.emailVerified,
      createdAt: new Date(),
    });
  } else {
    // Existing user — ONLY update non-role fields so we never clobber admin role
    await setDoc(ref, {
      email: user.email ?? '',
      photoURL: user.photoURL ?? snap.data().photoURL ?? '',
      isVerified: user.emailVerified,
      // name: only update if provided and not already set
      ...(extraData?.name ? { name: extraData.name } : {}),
    }, { merge: true });
  }
}

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(result.user);
  return result.user;
};

export const signInWithGitHub = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  await ensureUserDoc(result.user);
  return result.user;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  extraData: { name: string; role: string; university: string }
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(result.user, extraData);
  return result.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  // Don't touch Firestore on email sign-in — just return the user.
  // AuthContext will read the profile from Firestore.
  return result.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
