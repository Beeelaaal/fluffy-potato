import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snap = await getDocs(collection(db, 'universities'));
  console.log(`Found ${snap.size} documents in 'universities':\n`);
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`  name: ${data.name}`);
    console.log(`  shortName: ${data.shortName}`);
    console.log(`  logoUrl: ${data.logoUrl}`);
    console.log(`  coverUrl: ${data.coverUrl}`);
    console.log(`  logo: ${data.logo}`);
    console.log(`  image: ${data.image}`);
    console.log(`  campuses: ${data.campuses?.length || 0}`);
    console.log(`  programs_list: ${data.programs_list?.length || 0}`);
    console.log(`  fee: ${JSON.stringify(data.fee)}`);
    console.log('---');
  });
  process.exit(0);
}

run().catch(console.error);
