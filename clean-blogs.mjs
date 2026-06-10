/**
 * ───────────────────────────────────────────────────────────────────────
 *  Tute — Blog Content Clean-up Script
 *  Cleans up AI formatting slop (***, ------, _____, em-dashes) from Firestore blogs.
 *
 *  Usage:
 *    node clean-blogs.mjs
 * ───────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';

// ── 1. Load .env.local ──────────────────────────────────────────────────
const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const trimmed = line.trim().replace(/\r$/, '');
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  env[key.trim()] = rest.join('=').trim();
}

const firebaseConfig = {
  apiKey:            env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── 2. Credentials ──────────────────────────────────────────────────────
const ADMIN_EMAIL    = 'admin@tutortap.pk';
const ADMIN_PASSWORD = 'TutorTap@2025';

// ── 3. Clean-up Logic ───────────────────────────────────────────────────
function cleanText(text) {
  if (typeof text !== 'string') return text;
  let cleaned = text;

  // Remove triple asterisks "***" (AI dividers)
  cleaned = cleaned.replace(/\*\*\*/g, '');

  // Remove multiple hyphens "------" or "---" (AI dividers)
  cleaned = cleaned.replace(/-{3,}/g, '');

  // Remove multiple underscores "_____" (AI dividers)
  cleaned = cleaned.replace(/_{3,}/g, '');

  // Replace em-dashes "—" with standard " - "
  cleaned = cleaned.replace(/—/g, ' - ');

  // Replace double hyphens "--" with standard " - "
  cleaned = cleaned.replace(/--/g, ' - ');

  // Replace double double quotes "" with a single double quote "
  cleaned = cleaned.replace(/""/g, '"');

  // Clean up any double spaces created by the replacements
  cleaned = cleaned.replace(/ {2,}/g, ' ');

  return cleaned.trim();
}

async function run() {
  console.log('Authenticating with Firebase...');
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('Authenticated successfully!');

  console.log('Fetching blogs from Firestore...');
  const snapshot = await getDocs(collection(db, 'blogs'));
  console.log(`Found ${snapshot.docs.length} blog posts in database.`);

  let updatedCount = 0;

  for (const docSnap of snapshot.docs) {
    const docId = docSnap.id;
    const data = docSnap.data();

    const oldTitle = data.title || '';
    const oldExcerpt = data.excerpt || '';
    const oldContent = data.content || '';

    const newTitle = cleanText(oldTitle);
    const newExcerpt = cleanText(oldExcerpt);
    const newContent = cleanText(oldContent);

    const hasChanges = (oldTitle !== newTitle) || (oldExcerpt !== newExcerpt) || (oldContent !== newContent);

    if (hasChanges) {
      console.log(`Cleaning blog [${docId}]: "${newTitle.substring(0, 30)}..."`);
      await setDoc(doc(db, 'blogs', docId), {
        title: newTitle,
        excerpt: newExcerpt,
        content: newContent
      }, { merge: true });
      updatedCount++;
    }
  }

  console.log(`\n──────────────────────────────────────────────────`);
  console.log(`Clean-up Complete!`);
  console.log(`Successfully updated: ${updatedCount} blog posts.`);
  console.log(`──────────────────────────────────────────────────`);
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error during clean-up:', err);
  process.exit(1);
});
