import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const covers = {
  qau: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Quaid-i-Azam_University.jpg/960px-Quaid-i-Azam_University.jpg',
  nust: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Nust_h12.jpg/960px-Nust_h12.jpg',
  lums: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lahore_University_of_Management_Sciences_Hostels.jpg/960px-Lahore_University_of_Management_Sciences_Hostels.jpg',
  pu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Punjab_University_old_campus.jpg/960px-Punjab_University_old_campus.jpg',
  aku: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Aga_Khan_University_Hospital%2C_Karachi.jpg/960px-Aga_Khan_University_Hospital%2C_Karachi.jpg',
  comsats: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/COMSATS_Islamabad.jpg/960px-COMSATS_Islamabad.jpg',
  uet: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/UET_Lahore_Main_Block.jpg/960px-UET_Lahore_Main_Block.jpg',
  gcu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Government_College_University%2C_Lahore_-_Clock_tower_and_main_building.jpg/960px-Government_College_University%2C_Lahore_-_Clock_tower_and_main_building.jpg',
  ku: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/University_of_Karachi_campus.jpg/960px-University_of_Karachi_campus.jpg',
  au: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bahria_University_Islamabad_campus.jpg/960px-Bahria_University_Islamabad_campus.jpg',
  bu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Bahria_University_Islamabad_campus.jpg/960px-Bahria_University_Islamabad_campus.jpg',
  iiui: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Faisal_Mosque_Islamabad_Pakistan.jpg/960px-Faisal_Mosque_Islamabad_Pakistan.jpg',
  uop: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Punjab_University_old_campus.jpg/960px-Punjab_University_old_campus.jpg',
  uaf: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/University_of_Agriculture%2C_Faisalabad_main_building.jpg/960px-University_of_Agriculture%2C_Faisalabad_main_building.jpg',
  muet: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mehran_University_Main_Entrance.jpg/960px-Mehran_University_Main_Entrance.jpg',
  iba: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/IBA_Karachi_main_campus.jpg/960px-IBA_Karachi_main_campus.jpg',
  giki: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/GIKI_Clock_Tower.jpg/960px-GIKI_Clock_Tower.jpg',
  fast: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/NUCES_Lahore.jpg/960px-NUCES_Lahore.jpg',
  uhs: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Punjab_University_old_campus.jpg/960px-Punjab_University_old_campus.jpg',
  bzu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Administration_Block_of_Bahauddin_Zakariya_University.jpg/960px-Administration_Block_of_Bahauddin_Zakariya_University.jpg'
};

const outputDir = path.join('public', 'covers');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('Downloading campus cover photos locally to public/covers/ using curl.exe...\n');

for (const [uniId, url] of Object.entries(covers)) {
  const destPath = path.join(outputDir, `${uniId}.jpg`);
  console.log(`Downloading ${uniId} cover photo...`);
  try {
    const cmd = `curl.exe -L -A "Mozilla/5.0" -o "${destPath}" "${url}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✓ Saved to ${destPath}`);
  } catch (err) {
    console.error(`❌ Failed to download ${uniId}:`, err.message);
  }
}

console.log('\nAll cover downloads complete!');
