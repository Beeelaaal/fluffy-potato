import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const dir = 'expanded-blogs';
const flagshipSlugs = [
  'fast-vs-nust-for-computer-science-the-ultimate-showdown',
  'net-prep-without-going-insane-nust-survival-manual',
  'lums-nop-aur-apka-future-flex-12-crore-degree',
  'hec-need-based-scholarship-ultimate-jugaad',
  'top-5-cs-unis-pakistan-ranked-ncap'
];

try {
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  console.log(`Analyzing ${files.length} files...`);

  let undercountNormal = 0;
  let undercountFlagship = 0;

  for (const file of files) {
    const slug = file.replace('.md', '');
    const path = join(dir, file);
    const content = readFileSync(path, 'utf-8');
    
    // Count words
    const words = content.split(/\s+/).filter(Boolean).length;
    const isFlagship = flagshipSlugs.includes(slug);
    
    if (isFlagship) {
      if (words < 1500) {
        console.log(`🔴 [FLAGSHIP] ${slug}: ${words} words (Target: 1500-2500)`);
        undercountFlagship++;
      } else {
        console.log(`✅ [FLAGSHIP] ${slug}: ${words} words`);
      }
    } else {
      if (words < 400) {
        console.log(`🔴 [STANDARD] ${slug}: ${words} words (Target: >400-750)`);
        undercountNormal++;
      } else if (words < 600) {
        console.log(`⚠️ [STANDARD] ${slug}: ${words} words (Short but okay)`);
      } else {
        console.log(`✅ [STANDARD] ${slug}: ${words} words`);
      }
    }
  }

  console.log(`\nResults: ${undercountFlagship} flagships under count, ${undercountNormal} standard posts under count.`);
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
