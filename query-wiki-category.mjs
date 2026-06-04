async function getCategoryMembers() {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Logos_of_universities_and_colleges_in_Pakistan&cmlimit=100&format=json';
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TuteLogoDownloader/1.0 (admin@tutortap.pk; Node.js fetch)'
      }
    });
    const json = await res.json();
    if (!json.query) {
      console.log('No query result, response:', json);
      return;
    }
    const members = json.query.categorymembers;
    console.log(`Found ${members.length} members in category:`);
    members.forEach(member => {
      console.log(`- Title: ${member.title} | PageID: ${member.pageid}`);
    });
  } catch (err) {
    console.error('Error fetching category members:', err);
  }
}

getCategoryMembers();
