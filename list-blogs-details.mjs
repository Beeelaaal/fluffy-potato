import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

// 1. Load .env.local
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

const ADMIN_EMAIL    = 'admin@tutortap.pk';
const ADMIN_PASSWORD = 'TutorTap@2025';

async function run() {
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  const snapshot = await getDocs(collection(db, 'blogs'));
  
  console.log(`SLUG | TITLE | WORD_COUNT`);
  console.log(`---|---|---`);
  
  const blogs = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const slug = docSnap.id;
    const title = data.title || 'Untitled';
    const content = data.content || '';
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    blogs.push({ slug, title, wordCount });
  });

  // Sort by word count ascending
  blogs.sort((a, b) => a.wordCount - b.wordCount);

  blogs.forEach(b => {
    console.log(`${b.slug} | ${b.title} | ${b.wordCount} words`);
  });

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
