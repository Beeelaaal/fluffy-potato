async function searchLogo(uniName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(uniName + ' logo')}&format=json&origin=*`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TuteLogoSearch/1.0 (admin@tutortap.pk; Node.js)'
      }
    });
    const json = await res.json();
    const results = json.query?.search || [];
    console.log(`\nSearch results for "${uniName}":`);
    results.slice(0, 3).forEach(r => {
      console.log(`- File Title: ${r.title}`);
    });
    
    // Also try commons search
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(uniName + ' logo')}&format=json&origin=*`;
    const commonsRes = await fetch(commonsUrl, {
      headers: {
        'User-Agent': 'TuteLogoSearch/1.0 (admin@tutortap.pk; Node.js)'
      }
    });
    const commonsJson = await commonsRes.json();
    const commonsResults = commonsJson.query?.search || [];
    if (commonsResults.length > 0) {
      console.log(`  Commons results:`);
      commonsResults.slice(0, 3).forEach(r => {
        console.log(`  - File Title: ${r.title}`);
      });
    }
  } catch (err) {
    console.error(`Error searching for ${uniName}:`, err.message);
  }
}

async function start() {
  const missing = [
    'Aga Khan University',
    'University of Engineering and Technology Lahore',
    'Air University',
    'International Islamic University Islamabad',
    'University of Agriculture Faisalabad',
    'Mehran University of Engineering and Technology',
    'Institute of Business Administration Karachi',
    'Ghulam Ishaq Khan Institute',
    'FAST NUCES'
  ];
  
  for (const name of missing) {
    await searchLogo(name);
    await new Promise(r => setTimeout(r, 500));
  }
}

start();
