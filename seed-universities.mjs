/**
 * ───────────────────────────────────────────────────────────────────────
 *  Tute — University Seeder Script
 *  Populates Firestore with the top 20 Pakistani universities.
 *
 *  Usage:
 *    node seed-universities.mjs
 * ───────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

// ── 1. Load .env.local ──────────────────────────────────────────────────
const envFile = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const trimmed = line.trim().replace(/\r$/, '');
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  env[key.trim()] = rest.join('=').trim();
}

const firebaseConfig = {
  apiKey:            env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── 2. Credentials ──────────────────────────────────────────────────────
const ADMIN_EMAIL    = 'admin@tutortap.pk';
const ADMIN_PASSWORD = 'TutorTap@2025';

// ── 3. University Data ──────────────────────────────────────────────────
const universities = [
  {
    shortName: 'QAU',
    name: 'Quaid-i-Azam University',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    ranking: 1,
    established: 1967,
    students: 12000,
    programs: 120,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=QAU&backgroundColor=1a1a35&textColor=5b63f5',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    description: 'Quaid-i-Azam University (QAU) is Pakistan\'s top-ranked research university, consistently ranked #1 nationally. Known for excellence in natural sciences, social sciences, and biological sciences with a strong research output.',
    website: 'https://qau.edu.pk',
    fee: { min: 25000, max: 100000 },
    tags: ['Research', 'Sciences', 'Social Sciences'],
    admissionOpen: true,
    deadline: '2025-09-30',
    programs_list: [
      { name: 'Physics', degree: 'BS', duration: '4 years', seats: 120, fee: 50000, merit: 80 },
      { name: 'Chemistry', degree: 'BS', duration: '4 years', seats: 100, fee: 45000, merit: 78 },
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 80, fee: 60000, merit: 82 },
    ],
    requirements: [
      'Intermediate (FSc/FA/ICS/A-Levels) with minimum 60% marks',
      'QAU Entry Test — minimum 50% score',
      'Valid CNIC/B-Form',
    ],
    howToApply: [
      'Apply online via QAU admission portal (qau.edu.pk)',
      'Pay application fee of PKR 2,000',
      'Appear for QAU Entrance Test',
    ],
    contacts: { phone: '+92-51-9064-3000', email: 'admissions@qau.edu.pk', address: 'QAU Campus, Islamabad 45320' },
    admissionCriteria: 'QAU Entry Test + Intermediate marks. Minimum 60% in relevant subjects required.',
    degrees: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Biotechnology', 'International Relations'],
  },
  {
    shortName: 'NUST',
    name: 'National University of Sciences and Technology',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    ranking: 1,
    established: 1991,
    students: 15000,
    programs: 150,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NUST&backgroundColor=1a1a35&textColor=5b63f5',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Nust_h12.jpg/960px-Nust_h12.jpg',
    description: 'NUST is Pakistan\'s premier public engineering and technology university, ranked among the top 400 universities globally. It offers world-class education in engineering, computing, management, and biological sciences across multiple specialized campuses.',
    website: 'https://nust.edu.pk',
    fee: { min: 394100, max: 550800 },
    tags: ['Engineering', 'Technology', 'Sciences', 'Management'],
    admissionOpen: true,
    deadline: '2025-08-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 150, fee: 394100, merit: 88 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 120, fee: 394100, merit: 87 },
      { name: 'Artificial Intelligence', degree: 'BS', duration: '4 years', seats: 80, fee: 394100, merit: 88 },
      { name: 'Data Science', degree: 'BS', duration: '4 years', seats: 80, fee: 394100, merit: 86 },
      { name: 'Electrical Engineering', degree: 'BE', duration: '4 years', seats: 120, fee: 394100, merit: 85 },
      { name: 'Mechanical Engineering', degree: 'BE', duration: '4 years', seats: 100, fee: 394100, merit: 84 },
      { name: 'Civil Engineering', degree: 'BE', duration: '4 years', seats: 100, fee: 394100, merit: 82 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 120, fee: 550800, merit: 78 },
      { name: 'Accounting & Finance', degree: 'BS', duration: '4 years', seats: 100, fee: 550800, merit: 77 },
      { name: 'Naval Architecture (Karachi PNEC)', degree: 'BE', duration: '4 years', seats: 50, fee: 394100, merit: 80 },
      { name: 'Maritime Sciences (Karachi PNEC)', degree: 'BS', duration: '4 years', seats: 60, fee: 394100, merit: 75 },
    ],
    requirements: [
      'Intermediate (FSc/ICS/A-Levels) with minimum 60% marks',
      'NUST Entry Test (NET) — minimum 60 percentile',
      'Valid CNIC/B-Form',
      'Domicile Certificate',
    ],
    howToApply: [
      'Register on NUST admission portal (admissions.nust.edu.pk)',
      'Fill online application form and choose test centers/campuses',
      'Pay application fee of PKR 3,500 online',
      'Appear for NUST Entry Test (NET)',
      'Submit original documents at admission office after merit list',
    ],
    contacts: { phone: '+92-51-9085-1000', email: 'admissions@nust.edu.pk', address: 'H-12, Islamabad, Pakistan' },
    admissionCriteria: 'NUST Entry Test (NET) with minimum 60 percentile. FSc/ICS/A-Levels with 60% marks.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'BBA', 'Mathematics', 'Architecture (B.Arch)', 'Artificial Intelligence (AI)', 'Data Science', 'Mechatronics Engineering'],
    campuses: [
      {
        name: 'Islamabad Campus (H-12)',
        city: 'Islamabad',
        address: 'Sector H-12, Islamabad, Federal Capital',
        phone: '+92-51-9085-1000',
        email: 'admissions@nust.edu.pk',
        degrees: ['BS Computer Science', 'BS Software Engineering', 'BS Artificial Intelligence', 'BS Data Science', 'BE Electrical Engineering', 'BE Mechanical Engineering', 'BE Civil Engineering', 'BE Chemical Engineering', 'BBA', 'BS Mathematics', 'B.Arch (Architecture)'],
      },
      {
        name: 'Karachi Campus (PNEC)',
        city: 'Karachi',
        address: 'Pakistan Navy Engineering College (PNEC), Habib Ibrahim Rehmatullah Road, Karsaz, Karachi',
        phone: '+92-21-48503070',
        email: 'admissions.pnec@nust.edu.pk',
        degrees: ['BS Computer Science', 'BE Mechanical Engineering', 'BE Electrical Engineering', 'BE Naval Architecture', 'BS Maritime Sciences'],
      },
      {
        name: 'Rawalpindi Campus (College of EME)',
        city: 'Rawalpindi',
        address: 'College of Electrical & Mechanical Engineering, Peshawar Road, Rawalpindi',
        phone: '+92-51-5444-4079',
        email: 'admissions.eme@nust.edu.pk',
        degrees: ['BE Mechatronics Engineering', 'BE Mechanical Engineering', 'BE Electrical Engineering', 'BS Computer Science'],
      },
      {
        name: 'Rawalpindi Campus (MCS)',
        city: 'Rawalpindi',
        address: 'Military College of Signals, Humayun Road, Lalkurti, Rawalpindi',
        phone: '+92-51-9272097',
        email: 'admissions.mcs@nust.edu.pk',
        degrees: ['BS Software Engineering', 'BE Information Security Engineering'],
      },
      {
        name: 'Risalpur Campus (CAE)',
        city: 'Risalpur',
        address: 'College of Aeronautical Engineering, Risalpur, Khyber Pakhtunkhwa',
        phone: '+92-937-873241',
        email: 'admissions.cae@nust.edu.pk',
        degrees: ['BE Aerospace Engineering', 'BE Avionics Engineering'],
      }
    ],
    reviews: [
      {
        author: 'Ayesha M. (EE Alumna, Class of 2023)',
        rating: 5,
        text: 'NUST H-12 has the most beautiful and complete campus life in Pakistan. The academic environment is competitive but highly rewarding. The research labs are top-notch and the student culture with various societies is super vibrant.',
        source: 'Google Reviews',
      },
      {
        author: 'Usman S. (PNEC Karachi Graduate)',
        rating: 4.5,
        text: 'PNEC (Karachi) provides a highly disciplined and structured environment since it\'s run under the Pakistan Navy. The Naval Architecture program is unique and has excellent links to naval dockyards and marine industries.',
        source: 'Student Survey',
      },
      {
        author: 'Bilal A. (Computer Science Student)',
        rating: 4,
        text: 'Academics can be exhausting with the strict absolute grading system in some departments. However, the peer group is brilliant and the internship opportunities at the NSTP tech park on campus are fantastic.',
        source: 'Reddit Community',
      }
    ]
  },
  {
    shortName: 'LUMS',
    name: 'Lahore University of Management Sciences',
    city: 'Lahore',
    province: 'Punjab',
    type: 'private',
    ranking: 2,
    established: 1985,
    students: 5000,
    programs: 45,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LUMS&backgroundColor=1a1a35&textColor=7c3aed',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    description: 'LUMS is one of Pakistan\'s most prestigious private universities, offering exceptional programs in business, law, humanities, social sciences, and computer science. It is renowned for its liberal arts education and corporate links.',
    website: 'https://lums.edu.pk',
    fee: { min: 1374000, max: 1374000 },
    tags: ['Business', 'Law', 'Computer Science', 'Humanities', 'Social Sciences'],
    admissionOpen: true,
    deadline: '2025-03-31',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 100, fee: 1374000, merit: 90 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 1374000, merit: 87 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 150, fee: 1374000, merit: 88 },
      { name: 'Accounting & Finance', degree: 'BSc', duration: '4 years', seats: 100, fee: 1374000, merit: 86 },
      { name: 'Economics', degree: 'BSc', duration: '4 years', seats: 120, fee: 1374000, merit: 85 },
      { name: 'Law (LLB)', degree: 'LLB', duration: '5 years', seats: 80, fee: 1374000, merit: 85 },
    ],
    requirements: [
      'HSSC/A-Levels with high GPA',
      'SAT or LUMS Self Assessment Test (LSAT)',
      'Strong extracurricular record',
      'Personal statement',
    ],
    howToApply: [
      'Visit lums.edu.pk and create an applicant profile',
      'Submit online application with all required documents',
      'Pay application fee of PKR 5,000',
      'Appear for LSAT or submit SAT scores',
    ],
    contacts: { phone: '+92-42-3560-8000', email: 'admissions@lums.edu.pk', address: 'DHA, Lahore Cantt., Lahore 54792' },
    admissionCriteria: 'SAT / LUMS Self Assessment Test (LSAT). Strong academic record and extracurriculars required.',
    degrees: ['Computer Science (CS)', 'BBA', 'Accounting & Finance', 'Economics', 'Political Science', 'Sociology', 'Mathematics', 'Electrical Engineering'],
    reviews: [
      {
        author: 'Sarah D. (BBA Alumna, Class of 2024)',
        rating: 5,
        text: 'LUMS changed my entire perspective on education. The campus is a safe haven and encourages free speech and critical thinking. It\'s expensive, but the networking and career opportunities are outstanding.',
        source: 'Google Reviews',
      },
      {
        author: 'Farhan M. (Economics Major)',
        rating: 4.5,
        text: 'The library is world-class, open 24/7 during exams. The academic pressure is high, but the campus life and sports facilities are second to none in Pakistan.',
        source: 'EduOpinions',
      }
    ]
  },
  {
    shortName: 'PU',
    name: 'University of the Punjab',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    ranking: 3,
    established: 1882,
    students: 35000,
    programs: 200,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PU&backgroundColor=1a1a35&textColor=06b6d4',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    description: 'The University of the Punjab is the oldest and one of the largest universities in Pakistan, established in 1882. It offers a vast range of programs across sciences, arts, commerce, law, medicine, and professional disciplines with over 70 departments.',
    website: 'https://pu.edu.pk',
    fee: { min: 40000, max: 120000 },
    tags: ['Sciences', 'Arts', 'Commerce', 'Law', 'Medicine'],
    admissionOpen: false,
    deadline: '2025-07-30',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 200, fee: 80000, merit: 78 },
      { name: 'Commerce', degree: 'BCom', duration: '2 years', seats: 300, fee: 40000, merit: 65 },
      { name: 'Law', degree: 'LLB', duration: '5 years', seats: 120, fee: 70000, merit: 75 },
    ],
    requirements: [
      'Intermediate from a recognized board',
      'PU Entry Test',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply through PU online portal (admissions.pu.edu.pk)',
      'Fill admission form and pay fee via bank challan',
      'Appear for University Entry Test',
      'Check merit lists on official website',
    ],
    contacts: { phone: '+92-42-99231246', email: 'info@pu.edu.pk', address: 'Quaid-e-Azam Campus, Lahore' },
    admissionCriteria: 'PU Entry Test + Intermediate marks. Merit-based admission.',
    degrees: ['Computer Science (CS)', 'Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Economics', 'Pharmacy (Pharm-D)', 'BBA', 'Mass Communication'],
    campuses: [
      {
        name: 'Quaid-e-Azam Campus (New Campus)',
        city: 'Lahore',
        address: 'Bosan Road/Canal Road, Lahore',
        phone: '+92-42-99231246',
      },
      {
        name: 'Allama Iqbal Campus (Old Campus)',
        city: 'Lahore',
        address: 'The Mall Road, Lahore',
        phone: '+92-42-99211612',
      },
      {
        name: 'Gujranwala Campus',
        city: 'Gujranwala',
        address: 'Near Gift University, Gujranwala',
        phone: '+92-55-9201222',
        degrees: ['BS Computer Science', 'BS Information Technology', 'BBA', 'BCom'],
      },
      {
        name: 'Jhelum Campus',
        city: 'Jhelum',
        address: 'Near Jhelum Bridge, Jhelum',
        phone: '+92-544-444444',
        degrees: ['BS Computer Science', 'BBA', 'BCom', 'LLB'],
      }
    ],
    reviews: [
      {
        author: 'Mohammad R. (Alumnus)',
        rating: 4,
        text: 'The oldest university in Pakistan has a historical vibe. Old Campus is beautiful. Fees are extremely nominal, making it accessible to everyone. Academics are good but administrative speed can be improved.',
        source: 'Google Reviews',
      }
    ]
  },
  {
    shortName: 'AKU',
    name: 'Aga Khan University',
    city: 'Karachi',
    province: 'Sindh',
    type: 'private',
    ranking: 4,
    established: 1983,
    students: 3500,
    programs: 30,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AKU&backgroundColor=1a1a35&textColor=ec4899',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    description: 'Aga Khan University is a world-class research-intensive institution known globally for excellence in medicine, nursing, education, and health sciences. AKU Hospital is one of the top teaching hospitals in South Asia.',
    website: 'https://aku.edu',
    fee: { min: 400000, max: 900000 },
    tags: ['Medicine', 'Nursing', 'Education', 'Health Sciences', 'Research'],
    admissionOpen: true,
    deadline: '2025-02-28',
    programs_list: [
      { name: 'Medicine & Surgery', degree: 'MBBS', duration: '5 years', seats: 100, fee: 900000, merit: 92 },
      { name: 'Nursing', degree: 'BScN', duration: '4 years', seats: 80, fee: 400000, merit: 80 },
    ],
    requirements: [
      'Pre-Medical FSc with minimum 75%',
      'AKU Medical College Admission Test (MCAT)',
      'IELTS 6.5 or equivalent',
    ],
    howToApply: [
      'Download application from aku.edu',
      'Submit completed application with all documents',
      'Pay application processing fee',
      'Sit for AKU entry test and interview',
    ],
    contacts: { phone: '+92-21-3486-1900', email: 'admissions@aku.edu', address: 'Stadium Road, Karachi 74800' },
    admissionCriteria: 'AKU admission test + interview. FSc Pre-Medical with 75%+ required for MBBS.',
    degrees: ['MBBS', 'Nursing', 'Public Health', 'Biosciences'],
    reviews: [
      {
        author: 'Dr. Faisal (MBBS Graduate)',
        rating: 5,
        text: 'Best medical college in the country by a mile. The hospital facilities are internationally accredited and the hands-on clinical experience is outstanding. Extremely competitive but worth it.',
        source: 'Doctor Network',
      }
    ]
  },
  {
    shortName: 'COMSATS',
    name: 'COMSATS University Islamabad',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    ranking: 6,
    established: 1998,
    students: 28000,
    programs: 100,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=COMSATS&backgroundColor=1a1a35&textColor=ec4899',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop',
    description: 'COMSATS University Islamabad (CUI) is one of Pakistan\'s largest public universities with 7 campuses nationwide. It is recognized for affordable quality education in computing, engineering, business, and sciences.',
    website: 'https://comsats.edu.pk',
    fee: { min: 100000, max: 250000 },
    tags: ['Technology', 'Sciences', 'Management', 'Multiple Campuses'],
    admissionOpen: true,
    deadline: '2025-08-31',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 500, fee: 200000, merit: 75 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 300, fee: 200000, merit: 74 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 200, fee: 220000, merit: 73 },
    ],
    requirements: ['FSc/ICS 50%+', 'COMSATS Entry Test', 'CNIC and Domicile'],
    howToApply: [
      'Apply online via admission.comsats.edu.pk',
      'Select preferred campus',
      'Pay entry test fee',
      'Appear for test at selected campus',
    ],
    contacts: { phone: '+92-51-9049-3059', email: 'info@comsats.edu.pk', address: 'Park Road, Islamabad' },
    admissionCriteria: 'COMSATS entry test + FSc/ICS marks. Minimum 50% in intermediate.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'Mathematics', 'Physics', 'Bioinformatics', 'BBA'],
    campuses: [
      { name: 'Islamabad Campus (Main)', city: 'Islamabad', address: 'Park Road, Chak Shahzad, Islamabad', phone: '+92-51-9247000' },
      { name: 'Lahore Campus', city: 'Lahore', address: 'Defence Road, Off Raiwind Road, Lahore', phone: '+92-42-111-001-007' },
      { name: 'Abbottabad Campus', city: 'Abbottabad', address: 'University Road, Tobe Camp, Abbottabad', phone: '+92-992-383591' },
      { name: 'Wah Campus', city: 'Wah Cantt', address: 'G.T. Road, Wah Cantt', phone: '+92-51-4534200' },
      { name: 'Sahiwal Campus', city: 'Sahiwal', address: 'COMSATS Road, Sahiwal', phone: '+92-40-4305001' }
    ]
  },
  {
    shortName: 'UET',
    name: 'University of Engineering and Technology Lahore',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    ranking: 7,
    established: 1921,
    students: 14000,
    programs: 60,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=UET&backgroundColor=1a1a35&textColor=f59e0b',
    image: 'https://images.unsplash.com/photo-1606761568289-4014d5573422?q=80&w=1200&auto=format&fit=crop',
    description: 'UET Lahore is Pakistan\'s oldest and most prestigious engineering university, established in 1921. It has produced many of Pakistan\'s leading engineers and technologists, offering programs in over 40 engineering and technology disciplines.',
    website: 'https://uet.edu.pk',
    fee: { min: 80000, max: 200000 },
    tags: ['Engineering', 'Architecture', 'Technology', 'Sciences'],
    admissionOpen: false,
    deadline: '2025-09-10',
    programs_list: [
      { name: 'Civil Engineering', degree: 'BS', duration: '4 years', seats: 200, fee: 160000, merit: 84 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 200, fee: 170000, merit: 83 },
      { name: 'Computer Engineering', degree: 'BS', duration: '4 years', seats: 120, fee: 160000, merit: 85 },
    ],
    requirements: [
      'FSc Pre-Engineering with 60%+',
      'ECAT (Engineering College Admission Test)',
      'Domicile Certificate',
    ],
    howToApply: [
      'Apply via UET ECAT portal',
      'Register and appear for ECAT',
      'Fill admission form online',
      'Submit documents at chosen campus',
    ],
    contacts: { phone: '+92-42-9029-2349', email: 'info@uet.edu.pk', address: 'Grand Trunk Road, Lahore' },
    admissionCriteria: 'ECAT score + FSc Pre-Engineering marks. Merit-based selection.',
    degrees: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Computer Engineering', 'Architecture (B.Arch)'],
    campuses: [
      { name: 'UET Lahore (Main)', city: 'Lahore', address: 'G.T. Road, Lahore', phone: '+92-42-99029202' },
      { name: 'Kala Shah Kaku Campus (KSK)', city: 'Sheikhupura', address: 'KSK, Punjab', phone: '+92-42-35515685' },
      { name: 'Faisalabad Campus (UET-FSD)', city: 'Faisalabad', address: 'Faisalabad, Punjab', phone: '+92-41-2433501' },
      { name: 'Narowal Campus', city: 'Narowal', address: 'Narowal, Punjab', phone: '+92-54-2500511' }
    ],
    reviews: [
      {
        author: 'Saad M. (Mechanical Graduate)',
        rating: 4.2,
        text: 'The absolute pioneer of engineering in Punjab. The alumni network is present in every industry. Main campus has classic brick architecture. Very competitive entry via ECAT.',
        source: 'Alumni Network',
      }
    ]
  },
  {
    shortName: 'GCU',
    name: 'Government College University Lahore',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    ranking: 8,
    established: 1864,
    students: 16000,
    programs: 80,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GCU&backgroundColor=1a1a35&textColor=5b63f5',
    image: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=1200&auto=format&fit=crop',
    description: 'GCU Lahore is one of the oldest and most distinguished institutions in Pakistan, established in 1864. Known for its Gothic-style architecture and rigorous academic programs. Its alumni include Nobel laureate Abdus Salam.',
    website: 'https://gcu.edu.pk',
    fee: { min: 20000, max: 80000 },
    tags: ['Sciences', 'Arts', 'Humanities', 'Heritage'],
    admissionOpen: true,
    deadline: '2025-08-30',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 120, fee: 60000, merit: 80 },
      { name: 'Physics', degree: 'BS', duration: '4 years', seats: 100, fee: 45000, merit: 78 },
    ],
    requirements: [
      'Intermediate with minimum 60% marks',
      'GCU Entry Test',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply online via gcu.edu.pk admissions portal',
      'Pay admission test fee via bank challan',
      'Appear for GCU Entry Test',
    ],
    contacts: { phone: '+92-42-9921-1256', email: 'info@gcu.edu.pk', address: 'Katchery Road, Lahore' },
    admissionCriteria: 'GCU Entry Test + Intermediate marks. Merit-based selection.',
    degrees: ['Computer Science (CS)', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'English Literature', 'Economics'],
    campuses: [
      { name: 'Main Campus', city: 'Lahore', address: 'Katchery Road, Lahore', phone: '+92-42-99211256' },
      { name: 'Kala Shah Kaku Campus', city: 'Sheikhupura', address: 'KSK, Punjab', phone: '+92-42-3790123' }
    ]
  },
  {
    shortName: 'KU',
    name: 'University of Karachi',
    city: 'Karachi',
    province: 'Sindh',
    type: 'public',
    ranking: 9,
    established: 1951,
    students: 32000,
    programs: 180,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=KU&backgroundColor=1a1a35&textColor=06b6d4',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    description: 'The University of Karachi (KU) is one of Pakistan\'s largest public universities, serving as the primary intellectual hub of Sindh with programs across sciences, arts, law, pharmacy, and commerce.',
    website: 'https://uok.edu.pk',
    fee: { min: 15005, max: 90000 },
    tags: ['Sciences', 'Arts', 'Commerce', 'Pharmacy', 'Law'],
    admissionOpen: true,
    deadline: '2025-09-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 200, fee: 65000, merit: 72 },
      { name: 'Pharmacy', degree: 'Pharm.D', duration: '5 years', seats: 150, fee: 90000, merit: 80 },
    ],
    requirements: ['Intermediate from a recognized board', 'KU Entry Test', 'Sindh domicile'],
    howToApply: ['Apply via UoK online portal', 'Pay challan and sit for entry test', 'Check merit lists online'],
    contacts: { phone: '+92-21-9926-1300', email: 'info@uok.edu.pk', address: 'Main University Road, Karachi 75270' },
    admissionCriteria: 'KU Entry Test + Intermediate marks. Sindh domicile preferred for public sector seats.',
    degrees: ['Computer Science (CS)', 'Pharmacy (Pharm-D)', 'Chemistry', 'Physics', 'Mathematics', 'International Relations'],
  },
  {
    shortName: 'AU',
    name: 'Air University',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    ranking: 10,
    established: 2002,
    students: 8000,
    programs: 50,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AU&backgroundColor=1a1a35&textColor=f59e0b',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    description: 'Air University is a federally chartered university established by the Pakistan Air Force, specializing in engineering, computing, management, and aerospace technologies.',
    website: 'https://au.edu.pk',
    fee: { min: 180000, max: 350000 },
    tags: ['Aerospace', 'Engineering', 'Computing', 'Management'],
    admissionOpen: true,
    deadline: '2025-08-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 120, fee: 250000, merit: 80 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 100, fee: 250000, merit: 79 },
    ],
    requirements: ['FSc/ICS with 60%+', 'Air University Admission Test (AUAT)', 'CNIC/B-Form'],
    howToApply: ['Apply via au.edu.pk admissions', 'Pay test fee and appear for AUAT', 'Check merit lists'],
    contacts: { phone: '+92-51-9262-6100', email: 'admissions@au.edu.pk', address: 'PAF Complex, E-9, Islamabad' },
    admissionCriteria: 'Air University Admission Test (AUAT) + Intermediate marks.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'Mechanical Engineering', 'Mechatronics Engineering'],
  },
  {
    shortName: 'BU',
    name: 'Bahria University',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    ranking: 11,
    established: 2000,
    students: 15000,
    programs: 80,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BU&backgroundColor=1a1a35&textColor=5b63f5',
    image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?q=80&w=1200&auto=format&fit=crop',
    description: 'Bahria University is a federal university established by the Pakistan Navy. It operates campuses in Islamabad, Lahore, and Karachi offering courses in engineering, IT, management, and psychology.',
    website: 'https://bahria.edu.pk',
    fee: { min: 180000, max: 380000 },
    tags: ['Engineering', 'Computing', 'Management', 'Psychology'],
    admissionOpen: true,
    deadline: '2025-08-25',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 150, fee: 280000, merit: 75 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 120, fee: 280000, merit: 74 },
    ],
    requirements: ['FSc/ICS/A-Levels with 50%+', 'Bahria University Admission Test'],
    howToApply: ['Apply via bahria.edu.pk online portal', 'Pay fee, sit for Bahria Admission Test', 'Interview'],
    contacts: { phone: '+92-51-9260-0261', email: 'admissions@bahria.edu.pk', address: 'Shangrila Road, E-8, Islamabad' },
    admissionCriteria: 'Bahria admission test + Intermediate marks. 50% minimum in FSc/ICS.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'BBA', 'Psychology', 'Media Sciences'],
    campuses: [
      { name: 'Islamabad Campus (Main)', city: 'Islamabad', address: 'Shangrila Road, E-8, Islamabad', phone: '+92-51-92600261' },
      { name: 'Karachi Campus', city: 'Karachi', address: '13 National Stadium Road, Karachi', phone: '+92-21-99240002' },
      { name: 'Lahore Campus', city: 'Lahore', address: '47-C, Civic Centre, Johar Town, Lahore', phone: '+92-42-99233401' }
    ]
  },
  {
    shortName: 'IIUI',
    name: 'International Islamic University Islamabad',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    ranking: 12,
    established: 1980,
    students: 30000,
    programs: 140,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IIUI&backgroundColor=1a1a35&textColor=ec4899',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    description: 'IIUI is a federal public university integrating modern education with Islamic values. It has separate male and female campuses and offers programs in engineering, IT, management, social sciences, and Islamic studies.',
    website: 'https://iiu.edu.pk',
    fee: { min: 40000, max: 150000 },
    tags: ['Islamic Studies', 'Engineering', 'Law', 'Sciences', 'Management'],
    admissionOpen: true,
    deadline: '2025-09-01',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 200, fee: 120000, merit: 72 },
      { name: 'Law', degree: 'LLB', duration: '5 years', seats: 100, fee: 80000, merit: 74 },
    ],
    requirements: ['FSc/FA/ICS with 50%+', 'IIUI Entry Test'],
    howToApply: ['Apply online via iiu.edu.pk admissions', 'Pay test fee, sit for Entry Test', 'Submit documents'],
    contacts: { phone: '+92-51-9019-5000', email: 'admissions@iiu.edu.pk', address: 'Sector H-10, Islamabad' },
    admissionCriteria: 'IIUI Entry Test + Intermediate marks. Open to national and international students.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'LLB', 'Islamic Studies', 'Arabic'],
  },
  {
    shortName: 'UOP',
    name: 'University of Peshawar',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    type: 'public',
    ranking: 13,
    established: 1950,
    students: 15000,
    programs: 100,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=UOP&backgroundColor=1a1a35&textColor=06b6d4',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    description: 'The University of Peshawar is the oldest university in Khyber Pakhtunkhwa, serving as the premier educational institution in the province with a strong reputation in sciences and social sciences.',
    website: 'https://uop.edu.pk',
    fee: { min: 20000, max: 80000 },
    tags: ['Sciences', 'Arts', 'Pharmacy', 'Social Sciences'],
    admissionOpen: true,
    deadline: '2025-09-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 100, fee: 60000, merit: 72 },
      { name: 'Pharmacy', degree: 'Pharm.D', duration: '5 years', seats: 80, fee: 80000, merit: 78 },
    ],
    requirements: ['FSc/FA/ICS with 45%+', 'UoP Entry Test / ETEA Test', 'KP domicile preferred'],
    howToApply: ['Apply via uop.edu.pk online portal', 'Pay fee, appear for test', 'Verification at campus'],
    contacts: { phone: '+92-91-921-6701', email: 'info@uop.edu.pk', address: 'University Campus, Peshawar' },
    admissionCriteria: 'ETEA / UoP entry test + Intermediate marks. KP domicile for merit seats.',
    degrees: ['Computer Science (CS)', 'Pharmacy (Pharm-D)', 'Chemistry', 'Physics', 'Mathematics', 'International Relations'],
  },
  {
    shortName: 'UAF',
    name: 'University of Agriculture Faisalabad',
    city: 'Faisalabad',
    province: 'Punjab',
    type: 'public',
    ranking: 14,
    established: 1961,
    students: 20000,
    programs: 90,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=UAF&backgroundColor=1a1a35&textColor=f59e0b',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    description: 'UAF is Pakistan\'s largest and top-ranked agricultural university, leading research in agriculture, food sciences, and veterinary sciences.',
    website: 'https://uaf.edu.pk',
    fee: { min: 30000, max: 120000 },
    tags: ['Agriculture', 'Food Sciences', 'Veterinary', 'Sciences'],
    admissionOpen: true,
    deadline: '2025-09-30',
    programs_list: [
      { name: 'Agriculture', degree: 'BS', duration: '4 years', seats: 300, fee: 60000, merit: 68 },
      { name: 'Veterinary Sciences', degree: 'DVM', duration: '5 years', seats: 100, fee: 90000, merit: 74 },
    ],
    requirements: ['FSc Pre-Medical / Pre-Engineering with 50%+', 'UAF Entry Test', 'CNIC/B-Form'],
    howToApply: ['Apply via uaf.edu.pk portal', 'Pay challan and sit for entry test', 'Merit announcement'],
    contacts: { phone: '+92-41-920-0161', email: 'info@uaf.edu.pk', address: 'University of Agriculture, Faisalabad' },
    admissionCriteria: 'UAF Entry Test + Intermediate marks. 50% in FSc Pre-Medical/Engineering.',
    degrees: ['Agriculture', 'Agronomy', 'Food Technology', 'Animal Sciences', 'Computer Science (CS)', 'Chemistry'],
  },
  {
    shortName: 'MUET',
    name: 'Mehran University of Engineering and Technology',
    city: 'Jamshoro',
    province: 'Sindh',
    type: 'public',
    ranking: 15,
    established: 1963,
    students: 10000,
    programs: 55,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MUET&backgroundColor=1a1a35&textColor=5b63f5',
    image: 'https://images.unsplash.com/photo-1606761568289-4014d5573422?q=80&w=1200&auto=format&fit=crop',
    description: 'MUET is a leading engineering institution in Jamshoro, Sindh, offering a comprehensive range of programs in engineering and technology disciplines.',
    website: 'https://muet.edu.pk',
    fee: { min: 40000, max: 120000 },
    tags: ['Engineering', 'Technology', 'Sciences'],
    admissionOpen: true,
    deadline: '2025-09-20',
    programs_list: [
      { name: 'Computer Systems Engineering', degree: 'BS', duration: '4 years', seats: 120, fee: 100000, merit: 75 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 150, fee: 100000, merit: 74 },
    ],
    requirements: ['FSc Pre-Engineering with 60%+', 'MUET Entry Test / SEET', 'Sindh domicile preferred'],
    howToApply: ['Apply online via muet.edu.pk', 'Pay test fee and appear for Entry Test', 'Merit list announcement'],
    contacts: { phone: '+92-22-277-1281', email: 'registrar@muet.edu.pk', address: 'Jamshoro, Sindh 76062' },
    admissionCriteria: 'MUET/SEET entry test + FSc Pre-Engineering marks. 60% minimum.',
    degrees: ['Computer Engineering', 'Software Engineering (SE)', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering'],
  },
  {
    shortName: 'IBA',
    name: 'Institute of Business Administration',
    city: 'Karachi',
    province: 'Sindh',
    type: 'public',
    ranking: 9,
    established: 1955,
    students: 5000,
    programs: 30,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IBA&backgroundColor=1a1a35&textColor=ec4899',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop',
    description: 'IBA Karachi is Pakistan\'s premier business school. Highly recognized for its BBA, MBA, and Computer Science programs, it boasts corporate linkages and an outstanding campus infrastructure.',
    website: 'https://iba.edu.pk',
    fee: { min: 250000, max: 600000 },
    tags: ['Business', 'Computer Science', 'Economics', 'Social Sciences'],
    admissionOpen: true,
    deadline: '2025-07-31',
    programs_list: [
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 200, fee: 450000, merit: 85 },
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 80, fee: 400000, merit: 87 },
      { name: 'Accounting & Finance', degree: 'BS', duration: '4 years', seats: 80, fee: 420000, merit: 84 },
    ],
    requirements: [
      'A-Levels/FSc/ICS with strong academics',
      'IBA Aptitude Test',
      'Interview for shortlisted candidates',
    ],
    howToApply: [
      'Apply via iba.edu.pk admissions portal',
      'Pay application fee of PKR 4,000',
      'Appear for IBA Aptitude Test',
      'Attend interview if shortlisted',
    ],
    contacts: { phone: '+92-21-3810-4700', email: 'admissions@iba.edu.pk', address: 'University Road, Karachi 75270' },
    admissionCriteria: 'IBA Aptitude Test + Interview. High academic standing required.',
    degrees: ['BBA', 'Computer Science (CS)', 'Accounting & Finance', 'Economics', 'Mathematics'],
    campuses: [
      { name: 'Main Campus', city: 'Karachi', address: 'University Road, Karachi', phone: '+92-21-38104700' },
      { name: 'City Campus', city: 'Karachi', address: 'Kiyani Shaheed Road, Garden, Karachi', phone: '+92-21-38104701' }
    ],
    reviews: [
      {
        author: 'Mustafa H. (BBA Student)',
        rating: 5,
        text: 'IBA is the premier business school in the country. The campus at University Road is stunning with modern architecture and green lawns. The placement cell is incredibly active and connects you directly with top multinational companies.',
        source: 'Google Reviews',
      },
      {
        author: 'Rida K. (Computer Science Alumna)',
        rating: 4.5,
        text: 'Although IBA is famous for business, its CS department is rapidly catching up with excellent faculty and modern labs. The corporate linkage is a massive advantage for all graduates.',
        source: 'Student Portal',
      }
    ]
  },
  {
    shortName: 'GIKI',
    name: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    city: 'Topi',
    province: 'Khyber Pakhtunkhwa',
    type: 'private',
    ranking: 11,
    established: 1993,
    students: 3000,
    programs: 20,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GIKI&backgroundColor=1a1a35&textColor=f59e0b',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    description: 'GIK Institute is one of Pakistan\'s most selective residential engineering universities, located in a beautiful campus in Topi, KP. It is renowned for its engineering rigor and high graduate employability.',
    website: 'https://giki.edu.pk',
    fee: { min: 350000, max: 550000 },
    tags: ['Engineering', 'Sciences', 'Technology', 'Residential'],
    admissionOpen: true,
    deadline: '2025-08-10',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 80, fee: 500000, merit: 88 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 500000, merit: 86 },
      { name: 'Mechanical Engineering', degree: 'BS', duration: '4 years', seats: 60, fee: 500000, merit: 85 },
    ],
    requirements: [
      'FSc Pre-Engineering / A-Levels with 70%+',
      'GIKI Admission Test',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply via giki.edu.pk admissions',
      'Pay application fee of PKR 5,000',
      'Appear for GIKI Admission Test',
      'Enroll and join residential campus',
    ],
    contacts: { phone: '+92-938-271-858', email: 'admissions@giki.edu.pk', address: 'Topi, District Swabi, KP 23640' },
    admissionCriteria: 'GIKI Admission Test + FSc marks. Minimum 70% in Pre-Engineering.',
    degrees: ['Computer Science (CS)', 'Computer Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
    reviews: [
      {
        author: 'Ali S. (Alumnus)',
        rating: 4.8,
        text: 'Incredible residential campus. Living away from cities teaches you independence. GIKI network is huge and highly supportive. Strong student societies make the campus life extremely lively.',
        source: 'Google Reviews',
      }
    ]
  },
  {
    shortName: 'FAST',
    name: 'FAST National University of Computer and Emerging Sciences',
    city: 'Islamabad',
    province: 'Federal',
    type: 'private',
    ranking: 5,
    established: 2000,
    students: 18000,
    programs: 50,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FAST&backgroundColor=1a1a35&textColor=5b63f5',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/NUCES_Lahore.jpg/960px-NUCES_Lahore.jpg',
    description: 'FAST-NUCES specializes in computing, artificial intelligence, software engineering, and business. Famous for its rigorous coding standards, it produces Pakistan\'s top tech graduates who lead the national and international tech sector.',
    website: 'https://nu.edu.pk',
    fee: { min: 352000, max: 352000 },
    tags: ['Computer Science', 'AI', 'Data Science', 'Engineering', 'Business'],
    admissionOpen: true,
    deadline: '2025-07-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 400, fee: 352000, merit: 83 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 250, fee: 352000, merit: 81 },
      { name: 'Artificial Intelligence', degree: 'BS', duration: '4 years', seats: 150, fee: 352000, merit: 82 },
      { name: 'Data Science', degree: 'BS', duration: '4 years', seats: 120, fee: 352000, merit: 81 },
      { name: 'Cyber Security', degree: 'BS', duration: '4 years', seats: 100, fee: 352000, merit: 82 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 200, fee: 360000, merit: 80 },
    ],
    requirements: [
      'FSc Pre-Engineering or ICS with 60%+',
      'FAST Entry Test (NU-FAST) score',
      'MDCAT/NET scores also accepted',
    ],
    howToApply: [
      'Register at numsis.nu.edu.pk',
      'Fill and submit online form specifying campuses and cities',
      'Pay application fee online or via bank',
      'Appear in FAST Entry Test at nearest center',
      'Check merit lists online',
    ],
    contacts: { phone: '+92-51-2855-072', email: 'admission@nu.edu.pk', address: 'A.K. Brohi Road, H-11/4, Islamabad' },
    admissionCriteria: 'FAST Entry Test (NU-FAST) + Intermediate marks. 60% minimum in FSc/ICS.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Artificial Intelligence (AI)', 'Data Science', 'Cyber Security', 'Electrical Engineering', 'Civil Engineering', 'BBA'],
    campuses: [
      {
        name: 'Islamabad Campus (Main Campus)',
        city: 'Islamabad',
        address: 'A.K. Brohi Road, H-11/4, Islamabad',
        phone: '+92-51-111-128-128',
        email: 'admissions.isb@nu.edu.pk',
        degrees: ['BS Computer Science', 'BS Software Engineering', 'BS Artificial Intelligence', 'BS Data Science', 'BS Cyber Security', 'BS Financial Technology (FinTech)', 'BBA', 'BS Accounting & Finance', 'BS Business Analytics']
      },
      {
        name: 'Lahore Campus',
        city: 'Lahore',
        address: 'Block-B, Faisal Town, Lahore',
        phone: '+92-42-111-128-128',
        email: 'admissions.lhr@nu.edu.pk',
        degrees: ['BS Computer Science', 'BS Software Engineering', 'BS Artificial Intelligence', 'BS Data Science', 'BS Civil Engineering', 'BS Electrical Engineering', 'BBA', 'BS Accounting & Finance']
      },
      {
        name: 'Karachi Campus',
        city: 'Karachi',
        address: 'Shah Latif Town (Main Campus) / Clifton (City Campus), Karachi',
        phone: '+92-21-111-128-128',
        email: 'admissions.khi@nu.edu.pk',
        degrees: ['BS Computer Science', 'BS Software Engineering', 'BS Artificial Intelligence', 'BS Data Science', 'BS Cyber Security', 'BS Electrical Engineering', 'BBA', 'BS Accounting & Finance']
      },
      {
        name: 'Peshawar Campus',
        city: 'Peshawar',
        address: '1-A, Sector B-3, Phase V, Hayatabad, Peshawar',
        phone: '+92-91-111-128-128',
        email: 'admissions.pwr@nu.edu.pk',
        degrees: ['BS Computer Science', 'BS Software Engineering', 'BS Electrical Engineering', 'BBA', 'BS Accounting & Finance']
      },
      {
        name: 'Chiniot-Faisalabad Campus',
        city: 'Faisalabad',
        address: 'Loonaywala, Faisalabad-Sargodha Road, Chiniot-Faisalabad',
        phone: '+92-41-111-128-128',
        email: 'admissions.cfd@nu.edu.pk',
        degrees: ['BS Computer Science', 'BS Software Engineering', 'BS Artificial Intelligence', 'BS Data Science', 'BS Electrical Engineering', 'BBA']
      }
    ],
    reviews: [
      {
        author: 'Zainab R. (CS Alumna, Class of 2024)',
        rating: 5,
        text: 'FAST is a coding bootcamp disguised as a university. The curriculum is extremely up-to-date and practical. If you survive the intense workload and programming projects, you\'ll find job hunting incredibly easy since employers actively headhunt Fastians.',
        source: 'Google Reviews',
      },
      {
        author: 'Ali K. (Software Engineering Student)',
        rating: 4,
        text: 'Academic pressure is very high. Quizzes and assignments are endless, and maintaining a GPA above 3.0 is a struggle. But the problem-solving and programming skills you build here are unmatched in Pakistan.',
        source: 'Reddit Community',
      },
      {
        author: 'Hamza T. (Data Science Alumnus)',
        rating: 4.5,
        text: 'Grading is very strict, which can make it hard to get admission in foreign graduate programs. However, for local job placements, it is hands down the best. You learn resilience and raw coding power.',
        source: 'EduOpinions',
      }
    ]
  },
  {
    shortName: 'UHS',
    name: 'University of Health Sciences Lahore',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    ranking: 19,
    established: 2002,
    students: 5000,
    programs: 35,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=UHS&backgroundColor=1a1a35&textColor=ec4899',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    description: 'UHS Lahore is Pakistan\'s leading health sciences university, serving as the examination and regulatory body for all medical and dental colleges in Punjab. It conducts the MDCAT and offers postgraduate medical programs.',
    website: 'https://uhs.edu.pk',
    fee: { min: 80000, max: 400000 },
    tags: ['Medicine', 'Dental', 'Health Sciences', 'Pharmacy'],
    admissionOpen: true,
    deadline: '2025-10-15',
    programs_list: [
      { name: 'Medicine & Surgery', degree: 'MBBS', duration: '5 years', seats: 100, fee: 400000, merit: 90 },
      { name: 'Dental Sciences', degree: 'BDS', duration: '4 years', seats: 50, fee: 350000, merit: 85 },
    ],
    requirements: ['FSc Pre-Medical with 65%+', 'MDCAT score', 'CNIC/B-Form', 'Domicile Certificate'],
    howToApply: ['Apply via uhs.edu.pk portal', 'Appear for MDCAT', 'Select medical college preferences', 'Merit publication'],
    contacts: { phone: '+92-42-9923-1304', email: 'info@uhs.edu.pk', address: 'Khayaban-e-Jamia Punjab, Lahore' },
    admissionCriteria: 'MDCAT + FSc Pre-Medical marks. UHS conducts the entrance exam for all Punjab medical admissions.',
    degrees: ['MBBS', 'Dental Sciences (BDS)', 'Nursing', 'Public Health', 'Pharmacy (Pharm-D)'],
  },
  {
    shortName: 'BZU',
    name: 'Bahauddin Zakariya University',
    city: 'Multan',
    province: 'Punjab',
    type: 'public',
    ranking: 20,
    established: 1975,
    students: 25000,
    programs: 120,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BZU&backgroundColor=1a1a35&textColor=f59e0b',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    description: 'BZU Multan is one of the largest public universities in Southern Punjab, serving as the premier center of higher learning in the region across sciences, humanities, agriculture, and engineering.',
    website: 'https://bzu.edu.pk',
    fee: { min: 20000, max: 80000 },
    tags: ['Sciences', 'Arts', 'Agriculture', 'Engineering'],
    admissionOpen: true,
    deadline: '2025-09-30',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 150, fee: 60000, merit: 70 },
      { name: 'Pharmacy', degree: 'Pharm.D', duration: '5 years', seats: 80, fee: 80000, merit: 76 },
    ],
    requirements: ['Intermediate with 45%+', 'BZU Entry Test', 'CNIC/B-Form'],
    howToApply: ['Apply online via bzu.edu.pk portal', 'Pay fee challan and sit for Entry Test', 'Merit lists check'],
    contacts: { phone: '+92-61-9210-067', email: 'info@bzu.edu.pk', address: 'Bosan Road, Multan 60800' },
    admissionCriteria: 'BZU Entry Test + Intermediate marks. 45% minimum in relevant subjects.',
    degrees: ['Computer Science (CS)', 'Physics', 'Chemistry', 'Mathematics', 'Pharmacy (Pharm-D)', 'BBA'],
  }
];

// ── 4. Main Logic ───────────────────────────────────────────────────────
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   🎓  Tute University Seeder — Top 20 Pakistan Unis  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Authenticate
  console.log('🔐 Authenticating as admin...');
  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('   ✅ Logged in as', ADMIN_EMAIL, '\n');
  } catch (e) {
    console.error('   ❌ Auth failed:', e.message);
    process.exit(1);
  }

  // Fetch existing
  console.log('📡 Fetching existing universities from Firestore...');
  const existingSnap = await getDocs(collection(db, 'universities'));
  const existing = new Map();
  existingSnap.forEach(doc => existing.set(doc.id, doc.data()));
  console.log(`   Found ${existing.size} existing universities\n`);

  // Seed
  const results = { created: [], merged: [], failed: [] };

  for (const uni of universities) {
    const docId = uni.shortName.toUpperCase().trim();
    const existed = existing.has(docId);

    try {
      // Build the document — use the same structure as admin panel's saveUniversity()
      const docData = {
        id: docId,
        name: uni.name,
        shortName: uni.shortName,
        city: uni.city,
        type: uni.type,
        programs: uni.programs,
        description: uni.description,
        logoUrl: uni.logo,
        coverUrl: uni.image,
        websiteUrl: uni.website,
        deadline: uni.deadline,
        admissionCriteria: uni.admissionCriteria,
        degrees: uni.degrees,
        // Extended fields for front-end display
        province: uni.province,
        ranking: uni.ranking,
        established: uni.established,
        students: uni.students,
        logo: uni.logo,
        image: uni.image,
        website: uni.website,
        fee: uni.fee,
        tags: uni.tags,
        admissionOpen: uni.admissionOpen,
        programs_list: uni.programs_list,
        requirements: uni.requirements,
        howToApply: uni.howToApply,
        contacts: uni.contacts,
        campuses: uni.campuses || [],
        reviews: uni.reviews || [],
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'universities', docId), docData, { merge: true });

      if (existed) {
        results.merged.push(uni.shortName);
        console.log(`   🔄 MERGED  ${uni.shortName.padEnd(10)} — ${uni.name}`);
      } else {
        results.created.push(uni.shortName);
        console.log(`   ✨ CREATED ${uni.shortName.padEnd(10)} — ${uni.name}`);
      }
    } catch (e) {
      results.failed.push({ name: uni.shortName, error: e.message });
      console.log(`   ❌ FAILED  ${uni.shortName.padEnd(10)} — ${e.message}`);
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(56));
  console.log('📊  SUMMARY');
  console.log('═'.repeat(56));
  console.log(`   ✨ Created:  ${results.created.length} universities`);
  if (results.created.length) console.log(`      → ${results.created.join(', ')}`);
  console.log(`   🔄 Merged:   ${results.merged.length} universities`);
  if (results.merged.length) console.log(`      → ${results.merged.join(', ')}`);
  console.log(`   ❌ Failed:   ${results.failed.length} universities`);
  if (results.failed.length) {
    results.failed.forEach(f => console.log(`      → ${f.name}: ${f.error}`));
  }
  console.log(`   📁 Total in Firestore: ${existing.size + results.created.length}`);
  console.log('═'.repeat(56));
  console.log('');

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
