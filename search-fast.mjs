async function searchLogo(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(query)}&format=json`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TuteLogoSearch/1.0 (admin@tutortap.pk; Node.js)'
      }
    });
    const json = await res.json();
    console.log(`Results for "${query}":`);
    json.query?.search?.forEach(s => {
      console.log(`- ${s.title}`);
    });
  } catch (err) {
    console.error(err.message);
  }
}

async function start() {
  await searchLogo("National University of Computer and Emerging Sciences logo");
  await searchLogo("FAST university logo");
}

start();
