const titles = [
  'File:Aga Khan University Logo.png',
  'File:University of Engineering and Technology Lahore logo.svg',
  'File:Air University Pakistan Insignia.png',
  'File:International Islamic University, Islamabad (crest).png',
  'File:Agriculture University Faisalabad emblem.png',
  'File:Mehran University of Engineering and Technology logo.svg',
  'File:Institute of Business Administration, Karachi (logo).png',
  'File:Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (insignia).png',
  'File:FAST_NUCES_logo.png'
];

async function getUrls() {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles.join('|'))}&prop=imageinfo&iiprop=url&format=json`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TuteLogoSearch/1.0 (admin@tutortap.pk; Node.js)'
      }
    });
    const json = await res.json();
    const pages = json.query?.pages || {};
    console.log('Wikipedia API Results:');
    for (const pageId in pages) {
      const page = pages[pageId];
      const info = page.imageinfo?.[0];
      console.log(`- Title: ${page.title} | URL: ${info?.url}`);
    }
  } catch (err) {
    console.error('Error fetching URLs:', err.message);
  }
}

getUrls();
