import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only once
if (!getApps().length) {
  // Use the project ID from env vars — no service account key needed for
  // local dev if GOOGLE_APPLICATION_CREDENTIALS is set, but we can also
  // use the REST API approach. For now initialise with projectId only.
  initializeApp({
    credential: cert({
      projectId:   process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
    }),
  });
}

export const adminDb = getFirestore();
