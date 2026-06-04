/**
 * Downloads remaining university logos directly from their official websites
 * and from Wikipedia imageinfo API with proper delays.
 */
import { writeFileSync, existsSync } from 'fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Sources: direct logo URLs from university websites, verified Wikipedia imageinfo URLs
const sources = {
  NUST: 'https://nust.edu.pk/wp-content/uploads/2023/12/NUST-logo.webp',
  LUMS: 'https://lums.edu.pk/sites/default/files/inline-images/LUMS%20Logo_0.png',
  AKU:  'https://www.aku.edu/Style%20Library/Images/AKU-logo.png',
  UET:  'https://uet.edu.pk/home/wp-content/uploads/2024/02/uet-logo.png',
  KU:   'https://uok.edu.pk/images/logo.png',
  AU:   'https://au.edu.pk/images/logo.png',
  IIUI: 'https://www.iiu.edu.pk/wp-content/themes/flavor/images/logo-new.png',
  UAF:  'https://uaf.edu.pk/images/uaf_logo.png',
  MUET: 'https://muet.edu.pk/images/muet-logo.png',
  IBA:  'https://iba.edu.pk/images/IBA-Logo.png',
  GIKI: 'https://giki.edu.pk/wp-content/uploads/2021/08/giki-logo.png',
  FAST: 'https://nu.edu.pk/Content/images/nu-logo-new.png',
  UHS:  'https://uhs.edu.pk/images/logo.png',
};

async function downloadImage(url, filepath) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': UA },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(filepath, buf);
    return buf.length;
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

async function main() {
  console.log('🖼️  Downloading remaining logos from university websites...\n');
  
  let success = 0, fail = 0;
  const failed = [];

  for (const [shortName, url] of Object.entries(sources)) {
    const lc = shortName.toLowerCase();
    // Check if already downloaded
    const exts = ['png', 'jpg', 'jpeg', 'webp'];
    const exists = exts.some(e => existsSync(`public/logos/${lc}.${e}`));
    if (exists) {
      console.log(`   ⏭️  ${shortName.padEnd(8)} Already exists`);
      success++;
      continue;
    }

    try {
      const ext = url.match(/\.(png|jpg|jpeg|webp|svg)/i)?.[1] || 'png';
      const filename = `${lc}.${ext}`;
      const filepath = `public/logos/${filename}`;

      const size = await downloadImage(url, filepath);
      const kb = (size / 1024).toFixed(1);
      console.log(`   ✅ ${shortName.padEnd(8)} → ${filename} (${kb} KB)`);
      success++;

      // Polite delay
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`   ❌ ${shortName.padEnd(8)} → ${e.message}`);
      fail++;
      failed.push(shortName);
    }
  }

  console.log(`\n✅ Success: ${success}/13`);
  if (fail) console.log(`❌ Failed: ${failed.join(', ')}`);

  // List all files in public/logos/
  console.log('\n📁 Files in public/logos/:');
  const { readdirSync } = await import('fs');
  const files = readdirSync('public/logos');
  files.forEach(f => console.log(`   ${f}`));
  console.log(`   Total: ${files.length} files`);
}

main().catch(console.error);
