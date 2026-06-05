import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

const targets = [
  { id: 'KU', fullName: 'University of Karachi', query: 'University of Karachi logo' },
  { id: 'UHS', fullName: 'University of Health Sciences Lahore', query: 'University of Health Sciences Lahore logo' },
  { id: 'BZU', fullName: 'Bahauddin Zakariya University', query: 'Bahauddin Zakariya University logo' }
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function searchWikipedia(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(query)}&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TuteLogoSearch/1.0 (admin@tutortap.pk)' } });
    const json = await res.json();
    return json.query?.search?.[0]?.title || null;
  } catch (err) {
    console.error(`Error searching Wikipedia for "${query}":`, err.message);
  }
  return null;
}

async function getImageUrl(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TuteLogoSearch/1.0 (admin@tutortap.pk)' } });
    const json = await res.json();
    const pages = json.query?.pages || {};
    for (const pageId in pages) {
      if (pages[pageId].imageinfo?.[0]?.url) {
        return pages[pageId].imageinfo[0].url;
      }
    }
  } catch (err) {
    console.error(`Error getting image URL for ${title}:`, err.message);
  }
  return null;
}

function downloadWithCurl(url, destPath) {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const cmd = `curl.exe -A "${ua}" -L "${url}" -o "${destPath}"`;
  try {
    execSync(cmd, { stdio: 'ignore' });
    if (existsSync(destPath)) {
      const stats = statSync(destPath);
      if (stats.size > 500) return true;
    }
  } catch (err) {
    console.error(`Curl download failed for ${url}:`, err.message);
  }
  return false;
}

async function start() {
  console.log('Waiting 5 seconds to cool down rate limits...');
  await sleep(5000);

  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Firebase authenticated.');
  } catch (err) {
    console.error('Firebase Auth failed:', err.message);
    return;
  }

  for (const item of targets) {
    console.log(`\nProcessing ${item.id}...`);
    
    let fileTitle = await searchWikipedia(item.query);
    if (!fileTitle) {
      console.log(`Failed to find Wikipedia file for query "${item.query}". Trying fallback search...`);
      fileTitle = await searchWikipedia(item.fullName);
    }

    if (!fileTitle) {
      console.error(`Could not find file on Wikipedia for ${item.id}`);
      continue;
    }

    console.log(`Found Wikipedia File: ${fileTitle}`);
    await sleep(2000);

    const imageUrl = await getImageUrl(fileTitle);
    if (!imageUrl) {
      console.error(`Could not resolve direct URL for ${fileTitle}`);
      continue;
    }

    console.log(`Direct URL: ${imageUrl}`);
    
    const ext = imageUrl.toLowerCase().endsWith('.svg') ? 'svg' : 
                imageUrl.toLowerCase().endsWith('.jpg') || imageUrl.toLowerCase().endsWith('.jpeg') ? 'jpg' : 'png';
    const filename = `${item.id.toLowerCase()}.${ext}`;
    const destPath = `./public/logos/${filename}`;

    console.log(`Downloading to ${destPath}...`);
    await sleep(2000);

    const success = downloadWithCurl(imageUrl, destPath);
    if (success) {
      console.log(`Downloaded ${filename} successfully.`);
      const relativePath = `/logos/${filename}`;
      const docRef = doc(db, 'universities', item.id);
      try {
        await updateDoc(docRef, { logoUrl: relativePath });
        console.log(`Updated Firestore document '${item.id}' logoUrl to '${relativePath}'`);
      } catch (err) {
        console.error(`Failed to update Firestore for ${item.id}:`, err.message);
      }
    } else {
      console.error(`Failed to download valid image for ${item.id}`);
    }
    await sleep(3000);
  }

  console.log('Completed retries for failed universities.');
}

start();
