import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const logosDir = './public/logos';
if (!existsSync(logosDir)) {
  mkdirSync(logosDir, { recursive: true });
}

const universities = [
  { id: 'QAU', url: 'https://upload.wikimedia.org/wikipedia/en/b/b5/Quaid-i-Azam_University_logo.png', ext: 'png' },
  { id: 'NUST', url: 'https://upload.wikimedia.org/wikipedia/en/5/5a/NUST_MainOffice.png', ext: 'png' },
  { id: 'LUMS', url: 'https://upload.wikimedia.org/wikipedia/en/4/47/Lums_logo.jpg', ext: 'jpg' },
  { id: 'PU', url: 'https://upload.wikimedia.org/wikipedia/en/e/e4/University_of_the_Punjab_logo.png', ext: 'png' },
  { id: 'AKU', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/AKU%27s_Seal.jpg', ext: 'jpg' },
  { id: 'COMSATS', url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/COMSATS_new_logo.jpg', ext: 'jpg' },
  { id: 'UET', url: 'https://upload.wikimedia.org/wikipedia/en/4/4d/UET_Lahore_logo.png', ext: 'png' },
  { id: 'GCU', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Government_College_University%2CLogo.png', ext: 'png' },
  { id: 'KU', url: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Karachi_University_logo.png', ext: 'png' },
  { id: 'AU', url: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Air_University_Pakistan_Insignia.png', ext: 'png' },
  { id: 'BU', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Bahria_University_%28BU%29_Islamabad.png', ext: 'png' },
  { id: 'IIUI', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/International_Islamic_University%2C_Islamabad_%28crest%29.png', ext: 'png' },
  { id: 'UOP', url: 'https://upload.wikimedia.org/wikipedia/en/1/1e/University_of_Peshawar_logo.png', ext: 'png' },
  { id: 'UAF', url: 'https://upload.wikimedia.org/wikipedia/en/8/85/University_of_Agriculture%2C_Faisalabad_logo.png', ext: 'png' },
  { id: 'MUET', url: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Mehran_University_of_Engineering_and_Technology_logo.png', ext: 'png' },
  { id: 'IBA', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/IBA_LOGO.png', ext: 'png' },
  { id: 'GIKI', url: 'https://upload.wikimedia.org/wikipedia/en/1/15/GIKI_Logo.png', ext: 'png' },
  { id: 'FAST', url: 'https://upload.wikimedia.org/wikipedia/en/e/e1/FAST_NUCES_logo.png', ext: 'png' },
  { id: 'UHS', url: 'https://upload.wikimedia.org/wikipedia/en/6/68/University_of_Health_Sciences%2C_Lahore_logo.png', ext: 'png' },
  { id: 'BZU', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/BZU-Multan.png', ext: 'png' }
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://en.wikipedia.org/'
};

async function download(uni) {
  const filePath = join(logosDir, `${uni.id.toLowerCase()}.${uni.ext}`);
  console.log(`Downloading ${uni.id} logo to ${filePath}...`);
  try {
    const res = await fetch(uni.url, { headers });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const buffer = await res.arrayBuffer();
    writeFileSync(filePath, Buffer.from(buffer));
    console.log(`Successfully downloaded ${uni.id} logo.`);
    return true;
  } catch (err) {
    console.error(`Failed to download ${uni.id}:`, err.message);
    return false;
  }
}

async function start() {
  let successCount = 0;
  for (const uni of universities) {
    // Add small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 800));
    const success = await download(uni);
    if (success) successCount++;
  }
  console.log(`\nCompleted! Downloaded ${successCount}/${universities.length} logos.`);
}

start();
