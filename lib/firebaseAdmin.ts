import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // If service account credentials are provided, use them (most secure)
  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId: projectId!, clientEmail, privateKey }),
    });
  }

  // If GOOGLE_APPLICATION_CREDENTIALS env var is set, use ADC
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ credential: applicationDefault(), projectId });
  }

  // Fallback for local dev without service account: project-id only
  // The route.ts will detect missing creds and use the client SDK fallback
  console.warn(
    '[firebaseAdmin] ⚠️  No Firebase Admin credentials found.\n' +
    'Set FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env.local\n' +
    'to enable the Admin SDK. The app will run without it but /api/set-admin\n' +
    'will use a fallback approach.'
  );
  return initializeApp({ projectId });
}

try {
  adminApp = getAdminApp();
} catch (e) {
  // Don't crash the entire server — log and continue
  console.error('[firebaseAdmin] Initialization error (non-fatal in dev):', e);
  // Create a minimal app so imports don't fail
  if (getApps().length === 0) {
    adminApp = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
  } else {
    adminApp = getApps()[0];
  }
}

export const adminDb = getFirestore(adminApp);
