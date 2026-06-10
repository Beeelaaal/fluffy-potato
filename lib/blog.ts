export const mapCategory = (dbCat: string, title?: string, slug?: string): string => {
  const cat = dbCat ? dbCat.trim().toLowerCase() : '';
  const t = title ? title.trim().toLowerCase() : '';
  const s = slug ? slug.trim().toLowerCase() : '';

  // Explicit keyword mapping for Deadlines
  if (
    s.includes('deadline') || 
    t.includes('deadline') || 
    cat.includes('deadline') ||
    s.includes('calendar') ||
    t.includes('calendar')
  ) {
    return 'Deadlines';
  }

  // Scholarships mapping
  if (
    cat === 'scholarships' || 
    cat === 'scholarship' || 
    cat.includes('aid') || 
    s.includes('scholarship') || 
    t.includes('scholarship') ||
    s.includes('financial-aid') ||
    t.includes('financial aid') ||
    s.includes('funding') ||
    t.includes('funding') ||
    s.includes('ehsaas') ||
    t.includes('ehsaas') ||
    s.includes('peef') ||
    t.includes('peef') ||
    s.includes('nop') ||
    t.includes('nop') ||
    s.includes('nthp') ||
    t.includes('nthp')
  ) {
    return 'Scholarships';
  }

  // Do's & Don'ts / Student Life mapping
  if (
    cat === 'student life' || 
    cat === "do's & don'ts" || 
    cat === 'dos & donts' ||
    s.includes('survival-guide') || 
    t.includes('survival guide') ||
    s.includes('hostel-life') || 
    t.includes('hostel life') ||
    s.includes('freshmen') ||
    t.includes('freshmen') ||
    s.includes('campus-life') ||
    t.includes('campus life') ||
    s.includes('surviving') ||
    t.includes('surviving') ||
    s.includes('dos-donts') ||
    t.includes("do's and don'ts") ||
    t.includes("dos and donts")
  ) {
    return "Do's & Don'ts";
  }

  // Exam Sessions / Academics mapping
  if (
    cat === 'academics' || 
    cat === 'exam sessions' || 
    s.includes('exam') || 
    t.includes('exam') || 
    s.includes('prep') || 
    t.includes('prep') ||
    s.includes('test') ||
    t.includes('test') ||
    s.includes('study-hacks') ||
    t.includes('study hacks') ||
    s.includes('vocabulary') ||
    t.includes('vocabulary') ||
    s.includes('notes') ||
    t.includes('notes') ||
    s.includes('midterm') ||
    t.includes('midterm') ||
    s.includes('final') ||
    t.includes('final') ||
    s.includes('gpa') ||
    t.includes('gpa')
  ) {
    return 'Exam Sessions';
  }

  // Admissions & Comparisons mapping
  if (
    cat === 'admissions' || 
    cat === 'comparisons' || 
    cat === 'admission guides' ||
    cat === 'admission' ||
    s.includes('admission') ||
    t.includes('admission') ||
    s.includes('comparison') ||
    t.includes('comparison') ||
    s.includes('vs') ||
    t.includes(' vs ') ||
    s.includes('choose-after') ||
    t.includes('choose after') ||
    s.includes('tier-list') ||
    t.includes('tier list') ||
    s.includes('ranked') ||
    t.includes('ranked')
  ) {
    return 'Admission Guides';
  }

  return 'Admission Guides'; // Default fallback
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Admission Guides':
      return '#0066FF';
    case 'Deadlines':
      return '#FF5C7A';
    case 'Scholarships':
      return '#FF7A18';
    case "Do's & Don'ts":
      return '#2EF2FF';
    case 'Exam Sessions':
      return '#D8FF3E';
    default:
      return '#0066FF';
  }
};

const getHashIndex = (str: string, max: number): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
};

export const getBlogCoverImage = (category: string, title?: string, slug?: string): string => {
  const t = title ? title.toLowerCase() : '';
  const s = slug ? slug.toLowerCase() : '';
  const c = category.toLowerCase();
  
  const seed = s || t || 'default';

  // 1. High-priority specific keyword check
  if (s.includes('hostel') || t.includes('hostel')) {
    return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop';
  }
  if (s.includes('medical') || t.includes('medical') || s.includes('mdcat') || t.includes('mdcat') || s.includes('aku') || t.includes('aku')) {
    return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop';
  }
  if (s.includes('architect') || t.includes('architect') || s.includes('nca') || t.includes('nca')) {
    return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop';
  }

  // 2. University-specific pools (hashing distributes images uniquely)
  if (s.includes('fast') || t.includes('fast')) {
    const images = [
      'https://images.unsplash.com/photo-1484417894907-623942c8ea29?q=80&w=600&auto=format&fit=crop', // coding
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop', // tech group
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', // group
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop', // screen
      'https://images.unsplash.com/photo-1494809610410-160fed040535?q=80&w=600&auto=format&fit=crop'  // dev desk
    ];
    return images[getHashIndex(seed, images.length)];
  }
  
  if (s.includes('nust') || t.includes('nust')) {
    const images = [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop', // brick campus
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?q=80&w=600&auto=format&fit=crop', // books row
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop', // library
      'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=600&auto=format&fit=crop', // modern hall
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'  // students graduating
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (s.includes('lums') || t.includes('lums')) {
    const images = [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop', // students
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop', // library tables
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop', // laughing
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=600&auto=format&fit=crop', // talking lawn
      'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=600&auto=format&fit=crop'  // student cafe
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (s.includes('iba') || t.includes('iba')) {
    const images = [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop', // business suit
      'https://images.unsplash.com/photo-1560523132-9618b4793df6?q=80&w=600&auto=format&fit=crop', // business discussion
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop', // workspace
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop', // stats board
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop'  // presentation
    ];
    return images[getHashIndex(seed, images.length)];
  }

  // 3. Category-specific pools
  if (c === 'scholarships') {
    const images = [
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop', // coins
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop', // online form
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop', // writing desk
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=600&auto=format&fit=crop'  // paperwork
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (c === 'deadlines') {
    const images = [
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop', // calendar
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop', // plan chart
      'https://images.unsplash.com/photo-1491841573178-8f191b400a7f?q=80&w=600&auto=format&fit=crop'  // notebook plan
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (c === "do's & don'ts") {
    const images = [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop', // students table
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop', // laughing
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop'  // group outdoors
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (c === 'exam sessions') {
    const images = [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop', // exam write
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=600&auto=format&fit=crop', // desk study
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop', // heap of books
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop'  // professor chalkboard
    ];
    return images[getHashIndex(seed, images.length)];
  }

  // 4. Broad generic pool fallback
  const genericPool = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop'
  ];
  return genericPool[getHashIndex(seed, genericPool.length)];
};
