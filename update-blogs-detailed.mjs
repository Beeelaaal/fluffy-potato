import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

function parseMarkdown(filePath) {
  const fileContent = readFileSync(filePath, 'utf-8');
  const parts = fileContent.split('---');
  
  if (parts.length < 3) {
    throw new Error(`File ${filePath} does not have valid frontmatter`);
  }
  
  const frontmatterText = parts[1];
  const content = parts.slice(2).join('---').trim();
  
  const frontmatter = {};
  for (const line of frontmatterText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    const key = trimmed.substring(0, colonIndex).trim();
    let val = trimmed.substring(colonIndex + 1).trim();
    // Remove wrapping quotes if any
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    frontmatter[key] = val;
  }
  
  return { frontmatter, content };
}

async function run() {
  console.log('Authenticating with Firebase...');
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('Authenticated successfully!');

  const dirPath = 'expanded-blogs';
  const files = readdirSync(dirPath).filter(file => file.endsWith('.md'));
  console.log(`Found ${files.length} markdown files in ${dirPath}.`);

  let updatedCount = 0;

  for (const file of files) {
    const slug = file.replace('.md', '');
    const filePath = join(dirPath, file);
    
    try {
      const { frontmatter, content } = parseMarkdown(filePath);
      
      const title = frontmatter.title || 'Untitled';
      const category = frontmatter.category || 'General';
      const excerpt = frontmatter.excerpt || '';
      const authorName = frontmatter.authorName || 'Anonymous Author';
      const date = frontmatter.date || 'June 10, 2026';
      const readTime = frontmatter.readTime || '5 min read';
      
      console.log(`Syncing [${slug}]: "${title}" (${readTime})`);
      
      await setDoc(doc(db, 'blogs', slug), {
        title,
        category,
        excerpt,
        authorName,
        date,
        readTime,
        content
      }, { merge: true });
      
      updatedCount++;
    } catch (err) {
      console.error(`Error parsing/syncing ${file}:`, err);
    }
  }

  console.log(`\n──────────────────────────────────────────────────`);
  console.log(`Sync Complete!`);
  console.log(`Successfully synced: ${updatedCount} blog posts.`);
  console.log(`──────────────────────────────────────────────────`);
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error during sync:', err);
  process.exit(1);
});
