import crypto from 'crypto';
import https from 'https';

const universities = [
  { shortName: 'QAU', query: 'Quaid-i-Azam University campus building' },
  { shortName: 'NUST', query: 'National University of Sciences and Technology Islamabad' },
  { shortName: 'LUMS', query: 'Lahore University of Management Sciences campus' },
  { shortName: 'PU', query: 'University of the Punjab Lahore campus building' },
  { shortName: 'AKU', query: 'Aga Khan University Karachi campus' },
  { shortName: 'COMSATS', query: 'COMSATS University Islamabad campus' },
  { shortName: 'UET', query: 'University of Engineering and Technology Lahore building' },
  { shortName: 'GCU', query: 'Government College University Lahore clock tower' },
  { shortName: 'KU', query: 'University of Karachi campus' },
  { shortName: 'AU', query: 'Air University Islamabad' },
  { shortName: 'BU', query: 'Bahria University Islamabad' },
  { shortName: 'IIUI', query: 'International Islamic University Islamabad mosque building' },
  { shortName: 'UOP', query: 'University of Peshawar building' },
  { shortName: 'UAF', query: 'University of Agriculture Faisalabad building' },
  { shortName: 'MUET', query: 'Mehran University of Engineering and Technology Jamshoro' },
  { shortName: 'IBA', query: 'Institute of Business Administration Karachi campus' },
  { shortName: 'GIKI', query: 'Ghulam Ishaq Khan Institute Topi campus' },
  { shortName: 'FAST', query: 'FAST NUCES Lahore campus' },
  { shortName: 'UHS', query: 'University of Health Sciences Lahore' },
  { shortName: 'BZU', query: 'Bahauddin Zakariya University Multan building' }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'TutorTapUniversityImageResolver/1.0 (contact@tutortap.pk)'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getWikimediaUrl(fileName) {
  // Remove "File:" prefix if present
  const cleanName = fileName.replace(/^File:/, '').replace(/\s+/g, '_');
  const hash = crypto.createHash('md5').update(cleanName).digest('hex');
  const a = hash[0];
  const ab = hash.slice(0, 2);
  const encodedName = encodeURIComponent(cleanName).replace(/'/g, "%27");
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${encodedName}/960px-${encodedName}`;
}

async function run() {
  console.log('Searching Wikimedia Commons for university campus building images...\n');
  for (const uni of universities) {
    try {
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(uni.query)}&format=json&srnamespace=6&srlimit=5`;
      const res = await fetchJson(searchUrl);
      const searchResults = res?.query?.search || [];
      
      let selectedImage = null;
      for (const item of searchResults) {
        const title = item.title;
        // Exclude logos, flags, maps, or generic interior files if possible
        if (!title.toLowerCase().includes('logo') && 
            !title.toLowerCase().includes('flag') && 
            !title.toLowerCase().includes('map') && 
            (title.toLowerCase().includes('.jpg') || title.toLowerCase().includes('.png') || title.toLowerCase().includes('.jpeg') || title.toLowerCase().includes('.svg'))) {
          selectedImage = title;
          break;
        }
      }
      
      if (!selectedImage && searchResults.length > 0) {
        selectedImage = searchResults[0].title;
      }
      
      if (selectedImage) {
        const url = getWikimediaUrl(selectedImage);
        console.log(`uni: ${uni.shortName}`);
        console.log(`title: ${selectedImage}`);
        console.log(`url: ${url}`);
        console.log('---');
      } else {
        console.log(`uni: ${uni.shortName} - No image found`);
        console.log('---');
      }
    } catch (err) {
      console.error(`Error searching for ${uni.shortName}:`, err.message);
    }
  }
}

run();
