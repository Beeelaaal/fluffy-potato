import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// 1. Load Firebase configuration
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

const logosDir = './public/logos';
if (!existsSync(logosDir)) {
  mkdirSync(logosDir, { recursive: true });
}

// Universities and their preferred Wikipedia file names
const unis = [
  { id: 'QAU', fullName: 'Quaid-i-Azam University', preferredFile: 'File:Quaid-i-Azam University logo.png' },
  { id: 'NUST', fullName: 'National University of Sciences and Technology', preferredFile: 'File:NUST MainOffice.png' },
  { id: 'LUMS', fullName: 'Lahore University of Management Sciences', preferredFile: 'File:Lums logo.jpg' },
  { id: 'PU', fullName: 'University of the Punjab', preferredFile: 'File:University of the Punjab logo.png' },
  { id: 'AKU', fullName: 'Aga Khan University', preferredFile: 'File:Aga Khan University Logo.png' },
  { id: 'COMSATS', fullName: 'COMSATS University Islamabad', preferredFile: 'File:COMSATS new logo.jpg' },
  { id: 'UET', fullName: 'University of Engineering and Technology Lahore', preferredFile: 'File:University of Engineering and Technology Lahore logo.svg' },
  { id: 'GCU', fullName: 'Government College University Lahore', preferredFile: 'File:Government College University,Logo.png' },
  { id: 'KU', fullName: 'University of Karachi', preferredFile: 'File:Karachi University logo.png' },
  { id: 'AU', fullName: 'Air University', preferredFile: 'File:Air University Pakistan Insignia.png' },
  { id: 'BU', fullName: 'Bahria University', preferredFile: 'File:Bahria University (BU) Islamabad.png' },
  { id: 'IIUI', fullName: 'International Islamic University Islamabad', preferredFile: 'File:International Islamic University, Islamabad (crest).png' },
  { id: 'UOP', fullName: 'University of Peshawar', preferredFile: 'File:University of Peshawar logo.png' },
  { id: 'UAF', fullName: 'University of Agriculture Faisalabad', preferredFile: 'File:Agriculture University Faisalabad emblem.png' },
  { id: 'MUET', fullName: 'Mehran University of Engineering and Technology', preferredFile: 'File:Mehran University of Engineering and Technology logo.svg' },
  { id: 'IBA', fullName: 'Institute of Business Administration', preferredFile: 'File:Institute of Business Administration, Karachi (logo).png' },
  { id: 'GIKI', fullName: 'Ghulam Ishaq Khan Institute', preferredFile: 'File:Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (insignia).png' },
  { id: 'FAST', fullName: 'FAST National University of Computer and Emerging Sciences', preferredFile: 'File:National University of Computer and Emerging Sciences logo.png' },
  { id: 'UHS', fullName: 'University of Health Sciences Lahore', preferredFile: 'File:University of Health Sciences, Lahore logo.png' },
  { id: 'BZU', fullName: 'Bahauddin Zakariya University', preferredFile: 'File:BZU-Multan.png' }
];

async function getImageUrlForTitle(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TuteLogoSearch/1.0' } });
    const json = await res.json();
    const pages = json.query?.pages || {};
    for (const pageId in pages) {
      const page = pages[pageId];
      if (page.imageinfo?.[0]?.url) {
        return page.imageinfo[0].url;
      }
    }
  } catch (err) {
    console.error(`Error querying imageinfo for ${title}:`, err.message);
  }
  return null;
}

async function searchWikipediaForLogo(fullName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(fullName + ' logo')}&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TuteLogoSearch/1.0' } });
    const json = await res.json();
    const firstResult = json.query?.search?.[0];
    if (firstResult) {
      console.log(`Found fallback file on Wikipedia: ${firstResult.title}`);
      return firstResult.title;
    }
  } catch (err) {
    console.error(`Error searching Wikipedia for ${fullName}:`, err.message);
  }
  return null;
}

async function searchCommonsForLogo(fullName) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(fullName + ' logo')}&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TuteLogoSearch/1.0' } });
    const json = await res.json();
    const firstResult = json.query?.search?.[0];
    if (firstResult) {
      console.log(`Found fallback file on Wikimedia Commons: ${firstResult.title}`);
      return firstResult.title;
    }
  } catch (err) {
    console.error(`Error searching Commons for ${fullName}:`, err.message);
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
      if (stats.size > 500) {
        return true;
      } else {
        console.log(`Downloaded file is too small (${stats.size} bytes), likely an error page.`);
      }
    }
  } catch (err) {
    console.error(`Curl execution failed for ${url}:`, err.message);
  }
  return false;
}

async function run() {
  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Successfully authenticated with Firebase.');
  } catch (err) {
    console.error('Firebase authentication failed:', err.message);
    return;
  }

  for (const uni of unis) {
    console.log(`\n======================================================`);
    console.log(`Processing logo for ${uni.fullName} (${uni.id})...`);
    let imageUrl = null;
    let titleToQuery = uni.preferredFile;

    // Try preferred file
    imageUrl = await getImageUrlForTitle(titleToQuery);
    if (!imageUrl) {
      console.log(`Preferred file not found. Searching Wikipedia...`);
      const fallbackTitle = await searchWikipediaForLogo(uni.fullName);
      if (fallbackTitle) {
        titleToQuery = fallbackTitle;
        imageUrl = await getImageUrlForTitle(titleToQuery);
      }
    }

    if (!imageUrl) {
      console.log(`Wikipedia search failed. Searching Wikimedia Commons...`);
      const commonsTitle = await searchCommonsForLogo(uni.fullName);
      if (commonsTitle) {
        titleToQuery = commonsTitle;
        // Query commons imageinfo
        const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titleToQuery)}&prop=imageinfo&iiprop=url&format=json`;
        try {
          const res = await fetch(url, { headers: { 'User-Agent': 'TuteLogoSearch/1.0' } });
          const json = await res.json();
          const pages = json.query?.pages || {};
          for (const pageId in pages) {
            imageUrl = pages[pageId].imageinfo?.[0]?.url;
          }
        } catch (e) {
          console.error(e.message);
        }
      }
    }

    if (!imageUrl) {
      console.error(`Could not resolve any logo image URL for ${uni.id}.`);
      continue;
    }

    // Determine extension from URL
    const urlLower = imageUrl.toLowerCase();
    let ext = 'png';
    if (urlLower.endsWith('.jpg') || urlLower.endsWith('.jpeg')) ext = 'jpg';
    else if (urlLower.endsWith('.svg')) ext = 'svg';
    else if (urlLower.endsWith('.gif')) ext = 'gif';
    else if (urlLower.endsWith('.webp')) ext = 'webp';

    const filename = `${uni.id.toLowerCase()}.${ext}`;
    const destPath = join(logosDir, filename);

    console.log(`Resolved URL: ${imageUrl}`);
    console.log(`Downloading with curl to ${destPath}...`);

    const success = downloadWithCurl(imageUrl, destPath);
    if (success) {
      console.log(`Success! Logo downloaded and verified.`);
      // Update Firestore
      const relativePath = `/logos/${filename}`;
      const docRef = doc(db, 'universities', uni.id);
      try {
        await updateDoc(docRef, { logoUrl: relativePath });
        console.log(`Updated Firestore document '${uni.id}' logoUrl to '${relativePath}'`);
      } catch (err) {
        console.error(`Failed to update Firestore for ${uni.id}:`, err.message);
      }
    } else {
      console.error(`Failed to download valid image for ${uni.id}`);
    }
  }

  console.log('\n======================================================');
  console.log('Logo fetching and database update complete.');
  process.exit(0);
}

run();
