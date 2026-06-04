/**
 * Downloads university logos from Wikipedia using the MediaWiki API.
 * Wikipedia blocks direct hotlinking but allows API access with User-Agent.
 * Saves logos to public/logos/ for self-hosting.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

mkdirSync('public/logos', { recursive: true });

// Map: shortName -> Wikipedia article title
const wikiArticles = {
  QAU:     'Quaid-i-Azam_University',
  NUST:    'National_University_of_Sciences_%26_Technology',
  LUMS:    'Lahore_University_of_Management_Sciences',
  PU:      'University_of_the_Punjab',
  AKU:     'Aga_Khan_University',
  COMSATS: 'COMSATS_University_Islamabad',
  UET:     'University_of_Engineering_and_Technology,_Lahore',
  GCU:     'Government_College_University,_Lahore',
  KU:      'University_of_Karachi',
  AU:      'Air_University_(Pakistan)',
  BU:      'Bahria_University',
  IIUI:    'International_Islamic_University,_Islamabad',
  UOP:     'University_of_Peshawar',
  UAF:     'University_of_Agriculture,_Faisalabad',
  MUET:    'Mehran_University_of_Engineering_and_Technology',
  IBA:     'Institute_of_Business_Administration,_Karachi',
  GIKI:    'Ghulam_Ishaq_Khan_Institute_of_Engineering_Sciences_and_Technology',
  FAST:    'FAST_University',
  UHS:     'University_of_Health_Sciences,_Lahore',
  BZU:     'Bahauddin_Zakariya_University',
};

const UA = 'TuteBot/1.0 (https://tuteweb.netlify.app; admin@tutortap.pk)';

async function getLogoUrl(articleTitle) {
  // Use Wikipedia API to get the page's infobox image (logo/seal)
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${articleTitle}&prop=pageimages&format=json&pithumbsize=300`;
  const res = await fetch(apiUrl, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  if (page?.thumbnail?.source) {
    return page.thumbnail.source;
  }
  return null;
}

async function downloadImage(url, filepath) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(filepath, buf);
  return buf.length;
}

async function main() {
  console.log('🖼️  Downloading university logos from Wikipedia API...\n');

  const results = { ok: [], fail: [] };

  for (const [shortName, article] of Object.entries(wikiArticles)) {
    try {
      const imgUrl = await getLogoUrl(article);
      if (!imgUrl) {
        // Fallback: try commons API
        console.log(`   ⚠️  ${shortName.padEnd(8)} No thumbnail from API, trying fallback...`);
        results.fail.push({ name: shortName, error: 'No image in Wikipedia API' });
        continue;
      }

      const ext = imgUrl.match(/\.(png|jpg|jpeg|svg)/i)?.[1] || 'png';
      const filename = `${shortName.toLowerCase()}.${ext}`;
      const filepath = join('public', 'logos', filename);

      const size = await downloadImage(imgUrl, filepath);
      const kb = (size / 1024).toFixed(1);
      console.log(`   ✅ ${shortName.padEnd(8)} → ${filename} (${kb} KB)`);
      results.ok.push({ name: shortName, file: filename });

      // Small delay to be polite to Wikipedia
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.log(`   ❌ ${shortName.padEnd(8)} → ${e.message}`);
      results.fail.push({ name: shortName, error: e.message });
    }
  }

  console.log(`\n✅ Downloaded: ${results.ok.length}/20`);
  console.log(`❌ Failed: ${results.fail.length}/20`);
  if (results.fail.length) {
    console.log('   Failed:', results.fail.map(f => f.name).join(', '));
  }
}

main().catch(console.error);
