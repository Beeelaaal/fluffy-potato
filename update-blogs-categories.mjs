import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

// ── 3. Category Mapping Logic ───────────────────────────────────────────
const mapCategory = (dbCat, title, slug) => {
  const cat = dbCat ? dbCat.trim().toLowerCase() : '';
  const t = title ? title.trim().toLowerCase() : '';
  const s = slug ? slug.trim().toLowerCase() : '';

  if (s.includes('deadline') || t.includes('deadline') || cat.includes('deadline') || s.includes('calendar') || t.includes('calendar')) {
    return 'Deadlines';
  }
  if (cat === 'scholarships' || cat === 'scholarship' || cat.includes('aid') || s.includes('scholarship') || t.includes('scholarship') || s.includes('financial-aid') || t.includes('financial aid') || s.includes('funding') || t.includes('funding') || s.includes('ehsaas') || t.includes('ehsaas') || s.includes('peef') || t.includes('peef') || s.includes('nop') || t.includes('nop') || s.includes('nthp') || t.includes('nthp')) {
    return 'Scholarships';
  }
  if (cat === 'student life' || cat === "do's & don'ts" || cat === 'dos & donts' || s.includes('survival-guide') || t.includes('survival guide') || s.includes('hostel-life') || t.includes('hostel life') || s.includes('freshmen') || t.includes('freshmen') || s.includes('campus-life') || t.includes('campus life') || s.includes('surviving') || t.includes('surviving') || s.includes('dos-donts') || t.includes("do's and don'ts") || t.includes("dos and donts")) {
    return "Do's & Don'ts";
  }
  if (cat === 'academics' || cat === 'exam sessions' || s.includes('exam') || t.includes('exam') || s.includes('prep') || t.includes('prep') || s.includes('test') || t.includes('test') || s.includes('study-hacks') || t.includes('study hacks') || s.includes('vocabulary') || t.includes('vocabulary') || s.includes('notes') || t.includes('notes') || s.includes('midterm') || t.includes('midterm') || s.includes('final') || t.includes('final') || s.includes('gpa') || t.includes('gpa')) {
    if (t.includes('midterm') || t.includes('final') || t.includes('semester') || t.includes('study hacks') || t.includes('gpa') || cat === 'academics') {
      return 'Exam Sessions';
    }
    return 'Admission Guides';
  }
  if (cat === 'admissions' || cat === 'comparisons' || cat === 'admission guides' || cat === 'admission' || s.includes('admission') || t.includes('admission') || s.includes('comparison') || t.includes('comparison') || s.includes('vs') || t.includes(' vs ') || s.includes('choose-after') || t.includes('choose after') || s.includes('tier-list') || t.includes('tier list') || s.includes('ranked') || t.includes('ranked')) {
    return 'Admission Guides';
  }
  return 'Admission Guides';
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Admission Guides': return '#0066FF';
    case 'Deadlines': return '#FF5C7A';
    case 'Scholarships': return '#FF7A18';
    case "Do's & Don'ts": return '#2EF2FF';
    case 'Exam Sessions': return '#D8FF3E';
    default: return '#0066FF';
  }
};

// ── 4. Main Execution ──────────────────────────────────────────────────
async function run() {
  console.log('Authenticating with Firebase...');
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('Authenticated successfully as Admin!');

  console.log('Fetching all blogs...');
  const querySnapshot = await getDocs(collection(db, 'blogs'));
  console.log(`Found ${querySnapshot.docs.length} blog posts in Firestore.`);

  let updatedCount = 0;

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const currentCategory = data.category || '';
    const targetCategory = mapCategory(currentCategory, data.title || '', id);

    if (currentCategory !== targetCategory) {
      console.log(`Updating "${data.title}" (${id}): "${currentCategory}" ➔ "${targetCategory}"`);
      
      const docRef = doc(db, 'blogs', id);
      await updateDoc(docRef, {
        category: targetCategory,
        color: getCategoryColor(targetCategory)
      });
      
      updatedCount++;
    }
  }

  console.log(`\n──────────────────────────────────────────────────`);
  console.log(`Migration Complete!`);
  console.log(`Successfully updated ${updatedCount} blog posts.`);
  console.log(`──────────────────────────────────────────────────`);
  process.exit(0);
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
