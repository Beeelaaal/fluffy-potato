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

const BLOG_CUSTOM_COVERS: Record<string, string> = {
  "aku-mbbs-admissions-secrets-white-coat-guide": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
  "aku-nursing-scholarships-work-study-guaranteed-jobs": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
  "architect-schools-in-pakistan-nca-vs-nust-design-rizz": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop",
  "best-business-schools-iba-lums-szabist-tier-list": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
  "bzu-multan-admissions-merit-list-south-punjab": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop",
  "chevening-uk-scholarship-pakistan-essay-prompts-guide": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop",
  "ehsaas-undergraduate-scholarship-full-fee-cover": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
  "entry-test-books-to-buy-and-avoid-valid-vs-mid": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
  "entry-test-deadlines-survival-calendar-pakistan": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop",
  "entry-test-vocabulary-hacks-100-words-in-10-minutes": "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=600&auto=format&fit=crop",
  "fast-nu-campus-life-surviving-strict-gpa-grind": "https://images.unsplash.com/photo-1484417894907-623942c8ea29?q=80&w=600&auto=format&fit=crop",
  "fast-nu-fees-structure-semester-cost-breakdown": "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
  "fast-university-placements-merit-rates-recruiter-secrets": "https://images.unsplash.com/photo-1494809610410-160fed040535?q=80&w=600&auto=format&fit=crop",
  "fast-vs-nust-for-computer-science-the-ultimate-showdown": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
  "female-scholarships-stem-pakistan-tech-girls": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop",
  "gcu-lahore-admissions-ravian-spirit-gothic-campus": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
  "giki-admissions-engineering-the-future-at-topi": "https://images.unsplash.com/photo-1498243691581-b145c3f54a91?q=80&w=600&auto=format&fit=crop",
  "giki-financial-aid-hack-afford-topi-vibe": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
  "giki-vs-nust-for-engineering-topi-hills-vs-h12": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop",
  "hec-foreign-scholarships-study-phd-abroad-fully-funded": "https://images.unsplash.com/photo-1553731901-48059e630248?q=80&w=600&auto=format&fit=crop",
  "hec-need-based-scholarship-ultimate-jugaad": "https://images.unsplash.com/photo-1589330273591-651478b5967b?q=80&w=600&auto=format&fit=crop",
  "hidden-gem-universities-in-pakistan-affordable-placement": "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
  "hostel-life-101-survival-guide-for-outstation-students": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop",
  "how-to-fund-your-degree-scholarships-financial-aid-in-pakistan": "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
  "how-to-study-abroad-from-pakistan-fully-funded-fulbright-chevening": "https://images.unsplash.com/photo-1542435509-003a73c9f28d?q=80&w=600&auto=format&fit=crop",
  "iba-karachi-aptitude-test-demystifying-the-hurdle": "https://images.unsplash.com/photo-1560523132-9618b4793df6?q=80&w=600&auto=format&fit=crop",
  "iba-karachi-national-talent-hunt-program-nthp-guide": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
  "itu-lahore-computing-placements-review-software-houses": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
  "kips-vs-step-for-entry-test-prep-academy-comparison": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
  "ku-karachi-university-admissions-guide-evening-morning": "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=600&auto=format&fit=crop",
  "lums-lcat-secrets-how-to-secure-a-spot-without-losing-your-mind": "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
  "lums-nop-aur-apka-future-flex-12-crore-degree": "https://images.unsplash.com/photo-1450133064473-719d3b7588a5?q=80&w=600&auto=format&fit=crop",
  "lums-sbasse-versus-sdsb-merit-showdown": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop",
  "medical-admissions-in-pakistan-mdcat-tips-uhs-guide": "https://images.unsplash.com/photo-1576602976044-1d8f8d9bbfb9?q=80&w=600&auto=format&fit=crop",
  "medical-colleges-merit-formula-uhs-kmu-mdcat-panic": "https://images.unsplash.com/photo-1530026405186-ed1ea000373f?q=80&w=600&auto=format&fit=crop",
  "muet-jamshoro-vs-uet-lahore-engineering-giants": "https://images.unsplash.com/photo-1525921429624-479b6c294560?q=80&w=600&auto=format&fit=crop",
  "net-prep-without-going-insane-nust-survival-manual": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
  "nust-closing-merit-positions-detailed-guide": "https://images.unsplash.com/photo-1492538368577-a28b000ec4ae?q=80&w=600&auto=format&fit=crop",
  "nust-entry-test-net-deadlines-and-dates-explained": "https://images.unsplash.com/photo-1491841573178-8f191b400a7f?q=80&w=600&auto=format&fit=crop",
  "nust-hostel-life-room-allocation-mess-rules": "https://images.unsplash.com/photo-1505691938895-1758d7f8f94e?q=80&w=600&auto=format&fit=crop",
  "peef-scholarship-punjab-students-guide": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop",
  "sat-requirements-for-pakistan-unis-bypass-entry-tests": "https://images.unsplash.com/photo-1519452635485-7bc0fd6359f8?q=80&w=600&auto=format&fit=crop",
  "seecs-nust-vs-itu-lahore-silicon-valley": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop",
  "spring-admissions-pakistan-unis-list-second-chance": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop",
  "survival-kit-for-cs-freshmen-beyond-coding": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
  "szabist-karachi-admissions-review-is-it-good": "https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=600&auto=format&fit=crop",
  "top-5-cs-unis-pakistan-ranked-ncap": "https://images.unsplash.com/photo-1503387762464-88481bc5f393?q=80&w=600&auto=format&fit=crop",
  "top-medical-colleges-punjab-kemc-vs-aimc": "https://images.unsplash.com/photo-1505751172107-f2959c0c8360?q=80&w=600&auto=format&fit=crop",
  "tutor-tap-side-income-guide-earn-teaching-juniors": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
  "uaf-faisalabad-agriculture-tech-careers-aura": "https://images.unsplash.com/photo-1576267423013-5a3b2b07d6a5?q=80&w=600&auto=format&fit=crop",
  "which-university-should-you-choose-after-a-levels-or-inter-fast-nust-lums-or-iba": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
  "nust-admission-guide-net-prep-eligibility": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
  "fast-nu-surviving-guide-dos-donts-freshmen": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop",
  "higher-education-scholarships-pakistan-hec-need-based": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format&fit=crop",
  "university-application-deadlines-cheat-sheet-fall-2026": "https://images.unsplash.com/photo-1584438784851-ddb7c894e253?q=80&w=600&auto=format&fit=crop",
  "mastering-exam-prep-midterms-finals": "https://images.unsplash.com/photo-1522885148-356cf6e1f0e4?q=80&w=600&auto=format&fit=crop"
};

export const getBlogCoverImage = (category: string, title?: string, slug?: string): string => {
  const t = title ? title.toLowerCase() : '';
  const s = slug ? slug.toLowerCase() : '';
  const c = category.toLowerCase();
  
  // If slug is explicitly mapped in our static unique lookup table, use it! (guarantees NO duplicates)
  if (s && BLOG_CUSTOM_COVERS[s]) {
    return BLOG_CUSTOM_COVERS[s];
  }

  const seed = s || t || 'default';

  // Fallback unique pools (significantly expanded to 10-20 images each to minimize collisions)
  if (s.includes('hostel') || t.includes('hostel')) {
    const images = [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7f8f94e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598900487000-84a140d39e23?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (s.includes('medical') || t.includes('medical') || s.includes('mdcat') || t.includes('mdcat') || s.includes('aku') || t.includes('aku') || s.includes('mbbs') || t.includes('mbbs')) {
    const images = [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576602976044-1d8f8d9bbfb9?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1530026405186-ed1ea000373f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505751172107-f2959c0c8360?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551076805-e186902b152e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579684385109-c3f877c0a220?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559839734-d07a4dd46eeb?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581594693736-3a07856f6b55?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (s.includes('architect') || t.includes('architect') || s.includes('nca') || t.includes('nca') || s.includes('sada') || t.includes('sada')) {
    const images = [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762464-88481bc5f393?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (s.includes('fast') || t.includes('fast') || s.includes('coding') || t.includes('coding') || t.includes('computer science') || s.includes('programming') || s.includes('tech') || t.includes('software')) {
    const images = [
      'https://images.unsplash.com/photo-1484417894907-623942c8ea29?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494809610410-160fed040535?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }
  
  if (s.includes('nust') || t.includes('nust') || s.includes('lums') || t.includes('lums') || s.includes('giki') || t.includes('giki')) {
    const images = [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525921429624-479b6c294560?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492538368577-a28b000ec4ae?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519452635485-7bc0fd6359f8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (s.includes('iba') || t.includes('iba') || s.includes('business') || t.includes('business')) {
    const images = [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560523132-9618b4793df6?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1431540015160-d99c578fef04?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441890426893-fbfd94141a8e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557800634-75a7a1956580?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }

  // 3. Category-specific pools
  if (c === 'scholarships') {
    const images = [
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553731901-48059e630248?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589330273591-651478b5967b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542435509-003a73c9f28d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1450133064473-719d3b7588a5?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (c === 'deadlines') {
    const images = [
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1491841573178-8f191b400a7f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584438784851-ddb7c894e253?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512756290460-1d874d9b4194?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508873696983-7d30f475f585?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531346878353-c9fc9476abf6?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493934558023-e18e7e170c58?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488998527837-c7f7eb0c8113?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504489029917-15fe1a76d6f0?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (c === "do's & don'ts") {
    const images = [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492538368577-a28b000ec4ae?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543269865-c74094eab6b5?q=80&w=600&auto=format&fit=crop'
    ];
    return images[getHashIndex(seed, images.length)];
  }

  if (c === 'exam sessions') {
    const images = [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519452635485-7bc0fd6359f8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576267423013-5a3b2b07d6a5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522885148-356cf6e1f0e4?q=80&w=600&auto=format&fit=crop'
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
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606761568289-4014d5573422?q=80&w=600&auto=format&fit=crop'
  ];
  return genericPool[getHashIndex(seed, genericPool.length)];
};
