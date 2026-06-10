import { readFileSync, writeFileSync } from 'fs';

// Load the 51 blogs
const blogs = JSON.parse(readFileSync('scratch/all-blogs.json', 'utf-8'));

// 1. Compile rich pools of unique Unsplash IDs
const pools = {
  tech: [
    '1484417894907-623942c8ea29',
    '1531482615713-2afd69097998',
    '1516321318423-f06f85e504b3',
    '1494809610410-160fed040535',
    '1555066931-4365d14bab8c',
    '1607799279861-4dd421887fb3',
    '1517694712202-14dd9538aa97',
    '1587620962725-abab7fe55159',
    '1542831371-29b0f74f9713',
    '1550751827-4bd374c3f58b',
    '1515879218367-8466d910aaa4',
    '1531297484001-80022131f5a1',
    '1461749280684-dccba630e2f6',
    '1498050108023-c5249f4df085',
    '1504639725590-34d0984388bd',
    '1526374965328-7f61d4dc18c5'
  ],
  medical: [
    '1576091160550-2173dba999ef',
    '1584515979956-d9f6e5d09982',
    '1576602976044-1d8f8d9bbfb9',
    '1530026405186-ed1ea000373f',
    '1505751172107-f2959c0c8360',
    '1551076805-e186902b152e',
    '1579684385109-c3f877c0a220',
    '1532187643603-ba119ca4109e',
    '1559839734-d07a4dd46eeb',
    '1581594693736-3a07856f6b55'
  ],
  business: [
    '1507679799987-c73779587ccf',
    '1560523132-9618b4793df6',
    '1454165804606-c3d57bc86b40',
    '1506377247377-2a5b3b417ebb',
    '1427504494785-3a9ca7044f45',
    '1431540015160-d99c578fef04',
    '1441890426893-fbfd94141a8e',
    '1519085360753-af0119f7cbe7',
    '1551836022-d5d88e9218df',
    '1557800634-75a7a1956580'
  ],
  scholarships: [
    '1579621970563-ebec7560ff3e',
    '1516321318423-f06f85e504b3',
    '1501504905252-473c47e087f8',
    '1513258496099-48168024aec0',
    '1523050854058-8df90110c9f1',
    '1553731901-48059e630248',
    '1589330273591-651478b5967b',
    '1509062522246-3755977927d7',
    '1542435509-003a73c9f28d',
    '1450133064473-719d3b7588a5'
  ],
  deadlines: [
    '1506784983877-45594efa4cbe',
    '1506377247377-2a5b3b417ebb',
    '1491841573178-8f191b400a7f',
    '1584438784851-ddb7c894e253',
    '1512756290460-1d874d9b4194',
    '1508873696983-7d30f475f585',
    '1531346878353-c9fc9476abf6',
    '1493934558023-e18e7e170c58',
    '1488998527837-c7f7eb0c8113',
    '1504489029917-15fe1a76d6f0'
  ],
  hostels: [
    '1555854877-bab0e564b8d5',
    '1505691938895-1758d7f8f94e',
    '1598900487000-84a140d39e23',
    '1522771739844-6a9f6d5f14af',
    '1618220179428-22790b461013'
  ],
  tutor: [
    '1522202176988-66273c2fd55f',
    '1434030216411-0b793f4b4173',
    '1515187029135-18ee286d815b',
    '1524178232363-1fb2b075b655',
    '1503676260728-1c00da094a0b'
  ],
  architecture: [
    '1513542789411-b6a5d4f31634',
    '1503387762464-88481bc5f393',
    '1512917774080-9991f1c4c750',
    '1600585154340-be6161a56a0c',
    '1513694203232-719a280e022f'
  ],
  exam_study: [
    '1434030216411-0b793f4b4173',
    '1513258496099-48168024aec0',
    '1456513080510-7bf3a84b82f8',
    '1497633762265-9d179a990aa6',
    '1509062522246-3755977927d7',
    '1519452635485-7bc0fd6359f8',
    '1576267423013-5a3b2b07d6a5',
    '1522885148-356cf6e1f0e4',
    '1507537297725-24a1c029d3ca',
    '1501504905252-473c47e087f8',
    '1588072432836-efdf7a4b522a',
    '1506224477000-efbab73a5a22',
    '1521587760476-6c12b4b040cd',
    '1516972810930-07752f6f5888',
    '1448153325161-9c86a40c329b',
    '1506880018603-83d5b814b5a6'
  ],
  campus: [
    '1541339907198-e08756dedf3f',
    '1498243691581-b145c3f54a91',
    '1524995997946-a1c2e315a42f',
    '1580537659466-0a9bfa916a54',
    '1562774053-701939374585',
    '1525921429624-479b6c294560',
    '1492538368577-a28b000ec4ae',
    '1457369804613-52c61a468e7d',
    '1519452635485-7bc0fd6359f8',
    '1527891751199-7225231a68dd',
    '1506880018603-83d5b814b5a6',
    '1529070538774-1843cb3265df',
    '1506157786161-984e98952467',
    '1543269865-c74094eab6b5',
    '1510074377623-8cf13fb86c08',
    '1522071820081-009f0129c71c',
    '1592280771190-3e2e4d571952',
    '1606761568289-4014d5573422',
    '1498243691581-b145c3f54a5a',
    '1503676260728-1c00da094a0b'
  ]
};

// Track assigned Unsplash IDs globally to prevent ANY duplicates
const assigned = new Set();

const pickUnique = (theme) => {
  const list = pools[theme];
  for (const id of list) {
    if (!assigned.has(id)) {
      assigned.add(id);
      return `https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`;
    }
  }
  
  // Fallback if that theme is empty: search other themes
  for (const t of Object.keys(pools)) {
    for (const id of pools[t]) {
      if (!assigned.has(id)) {
        assigned.add(id);
        return `https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`;
      }
    }
  }

  // Absolute fallback: random image if all pool items are exhausted
  const randomId = '1523050854058-' + Math.random().toString(36).substring(2, 14);
  return `https://images.unsplash.com/photo-${randomId}?q=80&w=600&auto=format&fit=crop`;
};

// 2. Perform the classification mapping
const mapping = {};

blogs.forEach(b => {
  const t = b.title.toLowerCase();
  const s = b.slug.toLowerCase();
  const c = b.category.toLowerCase();
  
  let theme = 'campus'; // Default fallback theme
  
  // Check keywords in slug or title
  if (s.includes('hostel') || t.includes('hostel')) {
    theme = 'hostels';
  } else if (s.includes('medical') || t.includes('medical') || s.includes('mdcat') || t.includes('mdcat') || s.includes('aku') || t.includes('aku') || s.includes('mbbs') || t.includes('mbbs')) {
    theme = 'medical';
  } else if (s.includes('architect') || t.includes('architect') || s.includes('nca') || t.includes('nca') || s.includes('sada') || t.includes('sada')) {
    theme = 'architecture';
  } else if (s.includes('tute') || t.includes('tute') || s.includes('tutor') || t.includes('tutor')) {
    theme = 'tutor';
  } else if (s.includes('fast') || t.includes('fast') || s.includes('coding') || t.includes('coding') || s.includes('cs-') || s.includes('-cs') || t.includes('computer science') || s.includes('computing') || t.includes('placements') || s.includes('placement')) {
    theme = 'tech';
  } else if (s.includes('iba') || t.includes('iba') || s.includes('business') || t.includes('business') || s.includes('sdsb') || t.includes('sdsb')) {
    theme = 'business';
  } else if (c.includes('scholarship') || s.includes('scholarship') || t.includes('scholarship') || s.includes('financial-aid') || t.includes('financial aid') || s.includes('funding') || t.includes('funding') || s.includes('fee') || t.includes('fee') || s.includes('nop') || t.includes('nop')) {
    theme = 'scholarships';
  } else if (c.includes('deadline') || s.includes('deadline') || t.includes('deadline') || s.includes('calendar') || t.includes('calendar') || s.includes('date') || t.includes('dates')) {
    theme = 'deadlines';
  } else if (c.includes('exam') || s.includes('exam') || t.includes('exam') || s.includes('prep') || t.includes('prep') || s.includes('test') || t.includes('test') || s.includes('study-hacks') || t.includes('study hacks') || s.includes('vocabulary') || t.includes('vocabulary') || s.includes('notes') || t.includes('notes') || s.includes('gpa') || t.includes('gpa')) {
    theme = 'exam_study';
  } else {
    // Rely on category mapping
    if (c === 'scholarships') theme = 'scholarships';
    else if (c === 'deadlines') theme = 'deadlines';
    else if (c === "do's & don'ts") theme = 'exam_study';
    else if (c === 'exam sessions') theme = 'exam_study';
  }
  
  mapping[b.slug] = pickUnique(theme);
});

// Also map static posts to unique images
const staticSlugs = [
  'nust-admission-guide-net-prep-eligibility',
  'fast-nu-surviving-guide-dos-donts-freshmen',
  'higher-education-scholarships-pakistan-hec-need-based',
  'university-application-deadlines-cheat-sheet-fall-2026',
  'mastering-exam-prep-midterms-finals'
];

staticSlugs.forEach(slug => {
  if (slug.includes('nust')) {
    mapping[slug] = pickUnique('campus');
  } else if (slug.includes('fast')) {
    mapping[slug] = pickUnique('tech');
  } else if (slug.includes('scholarships')) {
    mapping[slug] = pickUnique('scholarships');
  } else if (slug.includes('deadlines')) {
    mapping[slug] = pickUnique('deadlines');
  } else if (slug.includes('exam')) {
    mapping[slug] = pickUnique('exam_study');
  } else {
    mapping[slug] = pickUnique('campus');
  }
});

writeFileSync('scratch/blog-image-mapping.json', JSON.stringify(mapping, null, 2));
console.log(`Generated mapping in scratch/blog-image-mapping.json with ${Object.keys(mapping).length} entries.`);
console.log(`Unique images used: ${assigned.size}`);
process.exit(0);
