/**
 * Downloads remaining university logos using Wikipedia's imageinfo API.
 * This fetches the actual file URL for logos that are non-free (fair use).
 */
import { writeFileSync, existsSync } from 'fs';

const UA = 'TuteBot/1.0 (https://tuteweb.netlify.app; admin@tutortap.pk)';

// Remaining 14 that failed with pageimages API - use exact Wikipedia file names
const remaining = {
  NUST: 'File:National_University_of_Sciences_%26_Technology_logo.png',
  LUMS: 'File:LUMS_SSE.jpeg',
  PU:   'File:University_of_the_Punjab_logo.png',
  AKU:  'File:Aga_Khan_University_Hospital.png',
  UET:  'File:UET_Lahore_logo.png',
  KU:   'File:University_of_Karachi_logo.png',
  AU:   'File:Air_University,_Islamabad_logo.png',
  IIUI: 'File:International_Islamic_University,_Islamabad_logo.png',
  UAF:  'File:University_of_Agriculture,_Faisalabad_logo.png',
  MUET: 'File:Mehran_University_of_Engineering_%26_Technology_logo.png',
  IBA:  'File:IBA_Karachi_logo.png',
  GIKI: 'File:GIK_Institute_logo.png',
  FAST: 'File:FAST_NUCES_logo.png',
  UHS:  'File:University_of_Health_Sciences,_Lahore_logo.png',
};

async function getImageUrl(fileTitle) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(apiUrl, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

async function tryCommons(fileTitle) {
  // Try Wikimedia Commons API too
  const name = fileTitle.replace('File:', '');
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(apiUrl, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

async function downloadImage(url, filepath) {
  const res = await fetch(url, { 
    headers: { 'User-Agent': UA },
    redirect: 'follow'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(filepath, buf);
  return buf.length;
}

async function main() {
  console.log('🖼️  Downloading remaining 14 logos via imageinfo API...\n');

  const results = { ok: [], fail: [] };

  for (const [shortName, fileTitle] of Object.entries(remaining)) {
    const lc = shortName.toLowerCase();
    // Skip if already downloaded
    if (existsSync(`public/logos/${lc}.png`) || existsSync(`public/logos/${lc}.jpg`) || existsSync(`public/logos/${lc}.jpeg`)) {
      console.log(`   ⏭️  ${shortName.padEnd(8)} Already exists, skipping`);
      results.ok.push({ name: shortName, file: 'exists' });
      continue;
    }

    try {
      // Try en.wikipedia first
      let imgUrl = await getImageUrl(fileTitle);
      
      // Try commons if en.wikipedia didn't work
      if (!imgUrl) {
        imgUrl = await tryCommons(fileTitle);
      }

      if (!imgUrl) {
        console.log(`   ❌ ${shortName.padEnd(8)} No image URL found`);
        results.fail.push({ name: shortName, error: 'No URL' });
        continue;
      }

      const ext = imgUrl.match(/\.(png|jpg|jpeg|svg)/i)?.[1] || 'png';
      const filename = `${lc}.${ext}`;
      const filepath = `public/logos/${filename}`;

      const size = await downloadImage(imgUrl, filepath);
      const kb = (size / 1024).toFixed(1);
      console.log(`   ✅ ${shortName.padEnd(8)} → ${filename} (${kb} KB)`);
      results.ok.push({ name: shortName, file: filename });

      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.log(`   ❌ ${shortName.padEnd(8)} → ${e.message}`);
      results.fail.push({ name: shortName, error: e.message });
    }
  }

  console.log(`\n✅ Downloaded: ${results.ok.length}/14`);
  if (results.fail.length) {
    console.log(`❌ Still missing: ${results.fail.map(f => f.name).join(', ')}`);
  }
}

main().catch(console.error);
