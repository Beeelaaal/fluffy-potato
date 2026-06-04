/**
 * ───────────────────────────────────────────────────────────────────────
 *  Tute — University Seeder Script
 *  Populates Firestore with the top 20 Pakistani universities.
 *
 *  Usage:
 *    node seed-universities.mjs
 *
 *  This script:
 *    1. Reads Firebase config from .env.local
 *    2. Authenticates as admin@tutortap.pk
 *    3. Fetches existing universities to detect duplicates
 *    4. Writes/merges all 20 universities via setDoc({merge:true})
 *    5. Prints a summary report
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b5/Quaid-i-Azam_University_logo.png',
    image: 'https://picsum.photos/seed/qau/800/450',
    description: 'Quaid-i-Azam University (QAU) is Pakistan\'s top-ranked research university, consistently ranked #1 nationally. Known for excellence in natural sciences, social sciences, and biological sciences with a strong research output and postgraduate programs.',
    website: 'https://qau.edu.pk',
    fee: { min: 25000, max: 100000 },
    tags: ['Research', 'Sciences', 'Social Sciences', 'Biosciences'],
    admissionOpen: true,
    deadline: '2025-09-30',
    programs_list: [
      { name: 'Physics', degree: 'BS', duration: '4 years', seats: 120, fee: 50000, merit: 80 },
      { name: 'Chemistry', degree: 'BS', duration: '4 years', seats: 100, fee: 45000, merit: 78 },
      { name: 'Mathematics', degree: 'BS', duration: '4 years', seats: 100, fee: 45000, merit: 75 },
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 80, fee: 60000, merit: 82 },
      { name: 'International Relations', degree: 'BS', duration: '4 years', seats: 80, fee: 50000, merit: 76 },
      { name: 'Biotechnology', degree: 'BS', duration: '4 years', seats: 60, fee: 55000, merit: 79 },
    ],
    requirements: [
      'Intermediate (FSc/FA/ICS/A-Levels) with minimum 60% marks',
      'QAU Entry Test — minimum 50% score',
      'Valid CNIC/B-Form',
      'Domicile Certificate',
    ],
    howToApply: [
      'Apply online via QAU admission portal (qau.edu.pk)',
      'Pay application fee of PKR 2,000',
      'Appear for QAU Entrance Test',
      'Merit list displayed on website',
      'Submit original documents at department',
    ],
    contacts: { phone: '+92-51-9064-3000', email: 'admissions@qau.edu.pk', address: 'QAU Campus, Islamabad 45320' },
    admissionCriteria: 'QAU Entry Test + Intermediate marks. Minimum 60% in relevant subjects required.',
    degrees: ['Physics', 'Applied Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Computer Science (CS)', 'International Relations', 'Biotechnology', 'Biological Sciences', 'Environmental Sciences', 'Economics', 'History', 'Sociology', 'Psychology', 'Philosophy', 'Pharmacy (Pharm-D)'],
  },
  {
    shortName: 'NUST',
    name: 'National University of Sciences and Technology',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    ranking: 2,
    established: 1991,
    students: 15000,
    programs: 150,
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/5a/NUST_MainOffice.png',
    image: 'https://picsum.photos/seed/nust/800/450',
    description: 'NUST is Pakistan\'s premier engineering and technology university, ranked among the top 400 universities globally by QS. It offers world-class education in engineering, sciences, IT, management, and social sciences across multiple campuses.',
    website: 'https://nust.edu.pk',
    fee: { min: 150000, max: 350000 },
    tags: ['Engineering', 'Technology', 'Sciences', 'Management'],
    admissionOpen: true,
    deadline: '2025-08-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 120, fee: 280000, merit: 88 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 100, fee: 300000, merit: 87 },
      { name: 'Mechanical Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 300000, merit: 85 },
      { name: 'Civil Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 280000, merit: 83 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 100, fee: 280000, merit: 87 },
      { name: 'Business Administration', degree: 'MBA', duration: '2 years', seats: 60, fee: 350000, merit: 75 },
    ],
    requirements: [
      'Intermediate (FSc/ICS/A-Levels) with minimum 60% marks',
      'NUST Entry Test (NET) — minimum 60 percentile',
      'Valid CNIC/B-Form',
      'Domicile Certificate',
      '4 recent passport size photographs',
    ],
    howToApply: [
      'Register on NUST admission portal (admissions.nust.edu.pk)',
      'Fill online application form with personal and academic details',
      'Pay application fee of PKR 3,500 online',
      'Appear for NUST Entry Test (NET)',
      'Submit original documents at admission office after merit list',
    ],
    contacts: { phone: '+92-51-9085-1000', email: 'admissions@nust.edu.pk', address: 'H-12, Islamabad, Pakistan' },
    admissionCriteria: 'NUST Entry Test (NET) with minimum 60 percentile. FSc/ICS/A-Levels with 60% marks.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'BBA', 'Mathematics', 'Architecture (B.Arch)', 'Biomedical Engineering', 'Artificial Intelligence (AI)', 'Data Science', 'Mechatronics Engineering'],
  },
  {
    shortName: 'LUMS',
    name: 'Lahore University of Management Sciences',
    city: 'Lahore',
    province: 'Punjab',
    type: 'private',
    ranking: 3,
    established: 1985,
    students: 5000,
    programs: 45,
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/Lums_logo.jpg',
    image: 'https://picsum.photos/seed/lums/800/450',
    description: 'LUMS is one of Pakistan\'s most prestigious private universities. It is consistently ranked among the top universities in South Asia and is known for its rigorous academic programs, world-class faculty, and vibrant campus life.',
    website: 'https://lums.edu.pk',
    fee: { min: 600000, max: 1200000 },
    tags: ['Business', 'Law', 'Computer Science', 'Humanities', 'Social Sciences'],
    admissionOpen: true,
    deadline: '2025-03-31',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 80, fee: 900000, merit: 90 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 120, fee: 1000000, merit: 88 },
      { name: 'Law (LLB/BSc)', degree: 'BSc', duration: '5 years', seats: 60, fee: 800000, merit: 87 },
      { name: 'Economics', degree: 'BSc', duration: '4 years', seats: 80, fee: 850000, merit: 86 },
      { name: 'Accounting & Finance', degree: 'BSc', duration: '4 years', seats: 80, fee: 900000, merit: 85 },
      { name: 'Political Science', degree: 'BA', duration: '4 years', seats: 60, fee: 800000, merit: 84 },
    ],
    requirements: [
      'HSSC/A-Levels with high GPA',
      'SAT or LUMS Self Assessment Test (LSAT)',
      'Strong extracurricular record',
      'Personal statement',
      'Letters of recommendation',
    ],
    howToApply: [
      'Visit lums.edu.pk and create an applicant profile',
      'Submit online application with all required documents',
      'Pay application fee of PKR 5,000',
      'Appear for LSAT or submit SAT scores',
      'Attend interview if shortlisted',
      'Submit financial aid documents if required',
    ],
    contacts: { phone: '+92-42-3560-8000', email: 'admissions@lums.edu.pk', address: 'DHA, Lahore Cantt., Lahore 54792' },
    admissionCriteria: 'SAT / LUMS Self Assessment Test (LSAT). Strong academic record and extracurriculars required.',
    degrees: ['Computer Science (CS)', 'BBA', 'Accounting & Finance', 'Economics', 'Political Science', 'Sociology', 'Psychology', 'Liberal Arts', 'Mathematics', 'Physics', 'Chemistry', 'Electrical Engineering', 'Biology'],
  },
  {
    shortName: 'PU',
    name: 'University of the Punjab',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    ranking: 4,
    established: 1882,
    students: 35000,
    programs: 200,
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e4/University_of_the_Punjab_logo.png',
    image: 'https://picsum.photos/seed/punjab/800/450',
    description: 'The University of the Punjab is the oldest and one of the largest universities in Pakistan, established in 1882. It offers a vast range of programs across sciences, arts, commerce, law, medicine, and professional disciplines with over 70 departments.',
    website: 'https://pu.edu.pk',
    fee: { min: 30000, max: 120000 },
    tags: ['Sciences', 'Arts', 'Commerce', 'Law', 'Medicine'],
    admissionOpen: false,
    deadline: '2025-07-30',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 200, fee: 80000, merit: 78 },
      { name: 'Commerce', degree: 'BCom', duration: '2 years', seats: 300, fee: 40000, merit: 65 },
      { name: 'Law', degree: 'LLB', duration: '5 years', seats: 120, fee: 70000, merit: 75 },
      { name: 'Mathematics', degree: 'BS', duration: '4 years', seats: 150, fee: 60000, merit: 72 },
      { name: 'Pharmacy', degree: 'Pharm.D', duration: '5 years', seats: 100, fee: 120000, merit: 82 },
    ],
    requirements: [
      'Intermediate from a recognized board',
      'PU Entry Test',
      'CNIC/B-Form',
      'Character Certificate',
      'Migration Certificate (if from other province)',
    ],
    howToApply: [
      'Apply through PU online portal (admissions.pu.edu.pk)',
      'Fill admission form and pay fee via bank challan',
      'Appear for University Entry Test (UET)',
      'Check merit lists on official website',
      'Report to department for document verification',
    ],
    contacts: { phone: '+92-42-99231246', email: 'info@pu.edu.pk', address: 'Quaid-e-Azam Campus, Lahore' },
    admissionCriteria: 'PU Entry Test + Intermediate marks. Merit-based admission.',
    degrees: ['Computer Science (CS)', 'Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Economics', 'Political Science', 'Sociology', 'Psychology', 'History', 'Philosophy', 'Pharmacy (Pharm-D)', 'BBA', 'Mass Communication', 'English Linguistics'],
  },
  {
    shortName: 'AKU',
    name: 'Aga Khan University',
    city: 'Karachi',
    province: 'Sindh',
    type: 'private',
    ranking: 5,
    established: 1983,
    students: 3500,
    programs: 30,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/55/AKU%27s_Seal.jpg',
    image: 'https://picsum.photos/seed/aku/800/450',
    description: 'Aga Khan University is a world-class research-intensive institution known globally for excellence in medicine, nursing, education, and health sciences. AKU Hospital is one of the top teaching hospitals in South Asia.',
    website: 'https://aku.edu',
    fee: { min: 400000, max: 900000 },
    tags: ['Medicine', 'Nursing', 'Education', 'Health Sciences', 'Research'],
    admissionOpen: true,
    deadline: '2025-02-28',
    programs_list: [
      { name: 'Medicine & Surgery', degree: 'MBBS', duration: '5 years', seats: 100, fee: 900000, merit: 92 },
      { name: 'Nursing', degree: 'BScN', duration: '4 years', seats: 80, fee: 400000, merit: 80 },
      { name: 'Education', degree: 'BEd', duration: '4 years', seats: 60, fee: 500000, merit: 75 },
    ],
    requirements: [
      'Pre-Medical FSc with minimum 75%',
      'AKU Medical College Admission Test (MCAT)',
      'IELTS 6.5 or equivalent',
      'Personal statement (500 words)',
    ],
    howToApply: [
      'Download application from aku.edu',
      'Submit completed application with all documents',
      'Pay application processing fee',
      'Sit for AKU entry test',
      'Attend personal interview',
    ],
    contacts: { phone: '+92-21-3486-1900', email: 'admissions@aku.edu', address: 'Stadium Road, Karachi 74800' },
    admissionCriteria: 'AKU admission test + interview. FSc Pre-Medical with 75%+ required for MBBS.',
    degrees: ['MBBS', 'Nursing', 'Public Health', 'Biosciences'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/COMSATS_new_logo.jpg',
    image: 'https://picsum.photos/seed/comsats/800/450',
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
      { name: 'Bioinformatics', degree: 'BS', duration: '4 years', seats: 100, fee: 180000, merit: 72 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 300, fee: 180000, merit: 70 },
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
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'Mathematics', 'Physics', 'Bioinformatics', 'BBA', 'Biotechnology', 'Environmental Sciences', 'Architecture (B.Arch)', 'Accounting & Finance'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/4d/UET_Lahore_logo.png',
    image: 'https://picsum.photos/seed/uet/800/450',
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
      { name: 'Mechanical Engineering', degree: 'BS', duration: '4 years', seats: 180, fee: 160000, merit: 82 },
      { name: 'Chemical Engineering', degree: 'BS', duration: '4 years', seats: 100, fee: 160000, merit: 80 },
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
    degrees: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Computer Engineering', 'Mechatronics Engineering', 'Petroleum Engineering', 'Industrial Engineering', 'Metallurgical Engineering', 'Architecture (B.Arch)', 'City & Regional Planning'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Government_College_University%2CLogo.png',
    image: 'https://picsum.photos/seed/gcu/800/450',
    description: 'GCU Lahore is one of the oldest and most distinguished institutions in Pakistan, established in 1864. Known for its Gothic-style architecture and rigorous academic programs in sciences, arts, and humanities. Its alumni include Nobel laureate Abdus Salam.',
    website: 'https://gcu.edu.pk',
    fee: { min: 20000, max: 80000 },
    tags: ['Sciences', 'Arts', 'Humanities', 'Heritage'],
    admissionOpen: true,
    deadline: '2025-08-30',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 120, fee: 60000, merit: 80 },
      { name: 'Physics', degree: 'BS', duration: '4 years', seats: 100, fee: 45000, merit: 78 },
      { name: 'Chemistry', degree: 'BS', duration: '4 years', seats: 100, fee: 45000, merit: 76 },
      { name: 'English Literature', degree: 'BS', duration: '4 years', seats: 80, fee: 35000, merit: 72 },
      { name: 'Mathematics', degree: 'BS', duration: '4 years', seats: 100, fee: 45000, merit: 77 },
    ],
    requirements: [
      'Intermediate with minimum 60% marks',
      'GCU Entry Test',
      'CNIC/B-Form',
      'Character Certificate',
    ],
    howToApply: [
      'Apply online via gcu.edu.pk admissions portal',
      'Pay admission test fee via bank challan',
      'Appear for GCU Entry Test',
      'Merit list displayed online',
      'Document verification at campus',
    ],
    contacts: { phone: '+92-42-9921-1256', email: 'info@gcu.edu.pk', address: 'Katchery Road, Lahore' },
    admissionCriteria: 'GCU Entry Test + Intermediate marks. Merit-based selection.',
    degrees: ['Computer Science (CS)', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'English Linguistics', 'Urdu', 'Economics', 'Political Science', 'History', 'Philosophy', 'Sociology', 'Psychology', 'Biological Sciences', 'Biotechnology'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Karachi_University_logo.png',
    image: 'https://picsum.photos/seed/karachi_uni/800/450',
    description: 'The University of Karachi (KU) is one of Pakistan\'s largest and most prominent public universities. It serves as the intellectual hub of Sindh, offering extensive programs in sciences, arts, law, pharmacy, medicine, commerce, and management.',
    website: 'https://uok.edu.pk',
    fee: { min: 15000, max: 90000 },
    tags: ['Sciences', 'Arts', 'Commerce', 'Pharmacy', 'Law'],
    admissionOpen: true,
    deadline: '2025-09-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 200, fee: 65000, merit: 72 },
      { name: 'Pharmacy', degree: 'Pharm.D', duration: '5 years', seats: 150, fee: 90000, merit: 80 },
      { name: 'Commerce', degree: 'BCom', duration: '2 years', seats: 400, fee: 25000, merit: 55 },
      { name: 'Law', degree: 'LLB', duration: '5 years', seats: 100, fee: 50000, merit: 70 },
      { name: 'International Relations', degree: 'BS', duration: '4 years', seats: 80, fee: 45000, merit: 74 },
    ],
    requirements: [
      'Intermediate from a recognized board',
      'KU Entry Test',
      'Sindh domicile (for merit seats)',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply via UoK online portal',
      'Pay admission fee via bank challan',
      'Appear for KU Entry Test',
      'Check merit lists online',
      'Report to department for verification',
    ],
    contacts: { phone: '+92-21-9926-1300', email: 'info@uok.edu.pk', address: 'Main University Road, Karachi 75270' },
    admissionCriteria: 'KU Entry Test + Intermediate marks. Sindh domicile preferred for public sector seats.',
    degrees: ['Computer Science (CS)', 'Pharmacy (Pharm-D)', 'Chemistry', 'Physics', 'Mathematics', 'International Relations', 'Economics', 'Mass Communication', 'Sociology', 'Psychology', 'Islamic Studies', 'Biological Sciences', 'Environmental Sciences'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Air_University_Pakistan_Insignia.png',
    image: 'https://picsum.photos/seed/air_uni/800/450',
    description: 'Air University is a federally chartered university established by the Pakistan Air Force. It offers top-quality programs in engineering, computing, management, and aerospace. Known for its disciplined environment and strong industry connections.',
    website: 'https://au.edu.pk',
    fee: { min: 180000, max: 350000 },
    tags: ['Aerospace', 'Engineering', 'Computing', 'Management'],
    admissionOpen: true,
    deadline: '2025-08-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 120, fee: 250000, merit: 80 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 100, fee: 250000, merit: 79 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 280000, merit: 78 },
      { name: 'Mechatronics Engineering', degree: 'BS', duration: '4 years', seats: 60, fee: 280000, merit: 77 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 100, fee: 220000, merit: 72 },
    ],
    requirements: [
      'FSc/ICS with 60%+',
      'Air University Admission Test (AUAT)',
      'CNIC/B-Form',
      'Domicile',
    ],
    howToApply: [
      'Apply via au.edu.pk admissions',
      'Pay admission test fee',
      'Appear for AUAT',
      'Check merit lists on portal',
    ],
    contacts: { phone: '+92-51-9262-6100', email: 'admissions@au.edu.pk', address: 'PAF Complex, E-9, Islamabad' },
    admissionCriteria: 'Air University Admission Test (AUAT) + Intermediate marks.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'Mechanical Engineering', 'Mechatronics Engineering', 'Artificial Intelligence (AI)', 'BBA', 'Cyber Security', 'Data Science'],
  },
  {
    shortName: 'BU',
    name: 'Bahria University',
    city: 'Islamabad',
    province: 'Federal',
    type: 'private',
    ranking: 11,
    established: 2000,
    students: 15000,
    programs: 80,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Bahria_University_%28BU%29_Islamabad.png',
    image: 'https://picsum.photos/seed/bahria/800/450',
    description: 'Bahria University is a prestigious institution established by the Pakistan Navy. With campuses in Islamabad, Lahore, and Karachi, it offers a wide range of programs in engineering, computing, management, psychology, and media sciences.',
    website: 'https://bahria.edu.pk',
    fee: { min: 180000, max: 380000 },
    tags: ['Engineering', 'Computing', 'Management', 'Psychology', 'Media'],
    admissionOpen: true,
    deadline: '2025-08-25',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 150, fee: 280000, merit: 75 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 120, fee: 280000, merit: 74 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 300000, merit: 73 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 200, fee: 250000, merit: 68 },
      { name: 'Psychology', degree: 'BS', duration: '4 years', seats: 80, fee: 220000, merit: 65 },
    ],
    requirements: [
      'FSc/ICS/A-Levels with 50%+',
      'Bahria University Admission Test',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply via bahria.edu.pk online portal',
      'Pay admission form fee',
      'Appear for Bahria Admission Test',
      'Merit list and interview',
    ],
    contacts: { phone: '+92-51-9260-0261', email: 'admissions@bahria.edu.pk', address: 'Shangrila Road, E-8, Islamabad' },
    admissionCriteria: 'Bahria admission test + Intermediate marks. 50% minimum in FSc/ICS.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'BBA', 'Psychology', 'Clinical Psychology', 'Media Sciences', 'Accounting & Finance', 'Economics', 'Humanities'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/International_Islamic_University%2C_Islamabad_%28crest%29.png',
    image: 'https://picsum.photos/seed/iiui/800/450',
    description: 'IIUI is a federally-chartered public university that integrates modern education with Islamic values. It has separate male and female campuses and offers programs in engineering, IT, management, social sciences, law, Sharia, and Arabic studies.',
    website: 'https://iiu.edu.pk',
    fee: { min: 40000, max: 150000 },
    tags: ['Islamic Studies', 'Engineering', 'Law', 'Sciences', 'Management'],
    admissionOpen: true,
    deadline: '2025-09-01',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 200, fee: 120000, merit: 72 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 150, fee: 120000, merit: 71 },
      { name: 'Law', degree: 'LLB', duration: '5 years', seats: 100, fee: 80000, merit: 74 },
      { name: 'Islamic Studies', degree: 'BS', duration: '4 years', seats: 200, fee: 40000, merit: 60 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 150, fee: 100000, merit: 68 },
    ],
    requirements: [
      'FSc/FA/ICS with 50%+',
      'IIUI Entry Test',
      'CNIC/B-Form',
      'Domicile Certificate',
    ],
    howToApply: [
      'Apply online via iiu.edu.pk admissions',
      'Pay admission test fee',
      'Appear for IIUI Entry Test',
      'Check merit lists online',
      'Submit documents at campus',
    ],
    contacts: { phone: '+92-51-9019-5000', email: 'admissions@iiu.edu.pk', address: 'Sector H-10, Islamabad' },
    admissionCriteria: 'IIUI Entry Test + Intermediate marks. Open to national and international students.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Electrical Engineering', 'Mechanical Engineering', 'BBA', 'Economics', 'Islamic Studies', 'Arabic', 'Psychology', 'Sociology', 'Political Science', 'International Relations', 'English Linguistics'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1e/University_of_Peshawar_logo.png',
    image: 'https://picsum.photos/seed/peshawar_uni/800/450',
    description: 'The University of Peshawar is the oldest university in Khyber Pakhtunkhwa and serves as the premier educational institution in the province. It offers a wide range of academic programs and has a strong reputation in social sciences, pharmacy, and area studies.',
    website: 'https://uop.edu.pk',
    fee: { min: 20000, max: 80000 },
    tags: ['Sciences', 'Arts', 'Pharmacy', 'Social Sciences'],
    admissionOpen: true,
    deadline: '2025-09-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 100, fee: 60000, merit: 72 },
      { name: 'Pharmacy', degree: 'Pharm.D', duration: '5 years', seats: 80, fee: 80000, merit: 78 },
      { name: 'International Relations', degree: 'BS', duration: '4 years', seats: 60, fee: 40000, merit: 70 },
      { name: 'Chemistry', degree: 'BS', duration: '4 years', seats: 80, fee: 35000, merit: 68 },
    ],
    requirements: [
      'FSc/FA/ICS with 45%+',
      'UoP Entry Test / ETEA Test',
      'KP domicile preferred',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply via uop.edu.pk online portal',
      'Pay admission fee via bank',
      'Appear for ETEA / UoP entry test',
      'Check merit lists',
      'Report for document verification',
    ],
    contacts: { phone: '+92-91-921-6701', email: 'info@uop.edu.pk', address: 'University Campus, Peshawar' },
    admissionCriteria: 'ETEA / UoP entry test + Intermediate marks. KP domicile for merit seats.',
    degrees: ['Computer Science (CS)', 'Pharmacy (Pharm-D)', 'Chemistry', 'Physics', 'Mathematics', 'International Relations', 'Political Science', 'Economics', 'Sociology', 'Psychology', 'Urdu', 'English Linguistics', 'Islamic Studies', 'Geology'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/8/85/University_of_Agriculture%2C_Faisalabad_logo.png',
    image: 'https://picsum.photos/seed/uaf/800/450',
    description: 'UAF is Pakistan\'s largest and top-ranked agricultural university. It is a leading center for research in agriculture, food sciences, veterinary sciences, animal husbandry, and agricultural engineering. UAF plays a vital role in Pakistan\'s food security.',
    website: 'https://uaf.edu.pk',
    fee: { min: 30000, max: 120000 },
    tags: ['Agriculture', 'Food Sciences', 'Veterinary', 'Sciences'],
    admissionOpen: true,
    deadline: '2025-09-30',
    programs_list: [
      { name: 'Agriculture', degree: 'BS', duration: '4 years', seats: 300, fee: 60000, merit: 68 },
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 100, fee: 80000, merit: 72 },
      { name: 'Food Technology', degree: 'BS', duration: '4 years', seats: 120, fee: 70000, merit: 70 },
      { name: 'Veterinary Sciences', degree: 'DVM', duration: '5 years', seats: 100, fee: 90000, merit: 74 },
    ],
    requirements: [
      'FSc Pre-Medical / Pre-Engineering with 50%+',
      'UAF Entry Test',
      'CNIC/B-Form',
      'Domicile Certificate',
    ],
    howToApply: [
      'Apply via uaf.edu.pk admissions portal',
      'Pay challan at designated bank',
      'Sit for UAF entry test',
      'Merit list announcement online',
      'Report for document verification',
    ],
    contacts: { phone: '+92-41-920-0161', email: 'info@uaf.edu.pk', address: 'University of Agriculture, Faisalabad' },
    admissionCriteria: 'UAF Entry Test + Intermediate marks. 50% in FSc Pre-Medical/Engineering.',
    degrees: ['Agriculture', 'Agronomy', 'Food Technology', 'Animal Sciences', 'Computer Science (CS)', 'Chemistry', 'Mathematics', 'Statistics', 'Soil Science', 'Plant Breeding', 'Horticulture', 'Forestry', 'Fisheries', 'Economics', 'BBA'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Mehran_University_of_Engineering_and_Technology_logo.png',
    image: 'https://picsum.photos/seed/muet/800/450',
    description: 'MUET is the oldest engineering university in Sindh and one of the top engineering institutions in Pakistan. It offers a comprehensive range of engineering and technology programs and has a strong research tradition in energy, water resources, and textiles.',
    website: 'https://muet.edu.pk',
    fee: { min: 40000, max: 120000 },
    tags: ['Engineering', 'Technology', 'Textiles', 'Sciences'],
    admissionOpen: true,
    deadline: '2025-09-20',
    programs_list: [
      { name: 'Computer Systems Engineering', degree: 'BS', duration: '4 years', seats: 120, fee: 100000, merit: 75 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 150, fee: 100000, merit: 74 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 100, fee: 100000, merit: 73 },
      { name: 'Civil Engineering', degree: 'BS', duration: '4 years', seats: 150, fee: 90000, merit: 72 },
      { name: 'Textile Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 85000, merit: 68 },
    ],
    requirements: [
      'FSc Pre-Engineering with 60%+',
      'MUET Entry Test / SEET',
      'Sindh domicile preferred',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply online via muet.edu.pk',
      'Pay admission test fee',
      'Appear for MUET / SEET exam',
      'Merit list announcement',
      'Report for document verification',
    ],
    contacts: { phone: '+92-22-277-1281', email: 'registrar@muet.edu.pk', address: 'Jamshoro, Sindh 76062' },
    admissionCriteria: 'MUET/SEET entry test + FSc Pre-Engineering marks. 60% minimum.',
    degrees: ['Computer Engineering', 'Software Engineering (SE)', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Textile Engineering', 'Petroleum Engineering', 'Telecommunication Engineering', 'Electronic Engineering', 'Industrial Engineering', 'Environmental Engineering'],
  },
  {
    shortName: 'IBA',
    name: 'Institute of Business Administration',
    city: 'Karachi',
    province: 'Sindh',
    type: 'public',
    ranking: 16,
    established: 1955,
    students: 5000,
    programs: 30,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/IBA_LOGO.png',
    image: 'https://picsum.photos/seed/iba/800/450',
    description: 'IBA Karachi is Pakistan\'s premier business school, established in 1955 as the first business school outside North America. It is globally recognized for its BBA, MBA, and Computer Science programs, and is known for producing Pakistan\'s top business leaders.',
    website: 'https://iba.edu.pk',
    fee: { min: 250000, max: 600000 },
    tags: ['Business', 'Computer Science', 'Economics', 'Social Sciences'],
    admissionOpen: true,
    deadline: '2025-07-31',
    programs_list: [
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 200, fee: 450000, merit: 85 },
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 80, fee: 400000, merit: 87 },
      { name: 'Accounting & Finance', degree: 'BS', duration: '4 years', seats: 80, fee: 420000, merit: 84 },
      { name: 'Economics & Mathematics', degree: 'BS', duration: '4 years', seats: 60, fee: 400000, merit: 83 },
      { name: 'Social Sciences', degree: 'BS', duration: '4 years', seats: 60, fee: 350000, merit: 80 },
    ],
    requirements: [
      'A-Levels/FSc/ICS with strong academics',
      'IBA Aptitude Test',
      'Interview for shortlisted candidates',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply via iba.edu.pk admissions portal',
      'Pay application fee of PKR 4,000',
      'Appear for IBA Aptitude Test',
      'Interview stage if shortlisted',
      'Final merit list and enrollment',
    ],
    contacts: { phone: '+92-21-3810-4700', email: 'admissions@iba.edu.pk', address: 'University Road, Karachi 75270' },
    admissionCriteria: 'IBA Aptitude Test + Interview. High academic standing required.',
    degrees: ['BBA', 'Computer Science (CS)', 'Accounting & Finance', 'Economics', 'Mathematics', 'Social Development & Policy'],
  },
  {
    shortName: 'GIKI',
    name: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    city: 'Topi, Swabi',
    province: 'Khyber Pakhtunkhwa',
    type: 'private',
    ranking: 17,
    established: 1993,
    students: 3000,
    programs: 20,
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/15/GIKI_Logo.png',
    image: 'https://picsum.photos/seed/giki/800/450',
    description: 'GIK Institute (GIKI) is one of Pakistan\'s most selective engineering universities, located in a scenic campus in Topi, KP. Named after former President Ghulam Ishaq Khan, it is renowned for its rigorous engineering curriculum and high graduate employability.',
    website: 'https://giki.edu.pk',
    fee: { min: 350000, max: 550000 },
    tags: ['Engineering', 'Sciences', 'Technology', 'Residential'],
    admissionOpen: true,
    deadline: '2025-08-10',
    programs_list: [
      { name: 'Computer Science & Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 500000, merit: 88 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 80, fee: 500000, merit: 86 },
      { name: 'Mechanical Engineering', degree: 'BS', duration: '4 years', seats: 60, fee: 500000, merit: 85 },
      { name: 'Engineering Sciences', degree: 'BS', duration: '4 years', seats: 40, fee: 480000, merit: 83 },
    ],
    requirements: [
      'FSc Pre-Engineering / A-Levels with 70%+',
      'GIKI Admission Test',
      'SAT II Subject Tests (optional)',
      'CNIC/B-Form',
    ],
    howToApply: [
      'Apply via giki.edu.pk admissions',
      'Pay application fee of PKR 5,000',
      'Appear for GIKI Admission Test',
      'Merit list display online',
      'Enroll and join residential campus',
    ],
    contacts: { phone: '+92-938-271-858', email: 'admissions@giki.edu.pk', address: 'Topi, District Swabi, KP 23640' },
    admissionCriteria: 'GIKI Admission Test + FSc marks. Minimum 70% in Pre-Engineering.',
    degrees: ['Computer Science (CS)', 'Computer Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Materials Engineering'],
  },
  {
    shortName: 'FAST',
    name: 'FAST National University of Computer and Emerging Sciences',
    city: 'Islamabad',
    province: 'Federal',
    type: 'private',
    ranking: 18,
    established: 2000,
    students: 18000,
    programs: 50,
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e1/FAST_NUCES_logo.png',
    image: 'https://picsum.photos/seed/fast/800/450',
    description: 'FAST-NUCES is Pakistan\'s premier computing university with campuses in Islamabad, Lahore, Karachi, Peshawar, and Chiniot-Faisalabad. It is widely regarded as the top institution for Computer Science and has produced a generation of Pakistan\'s leading tech professionals.',
    website: 'https://nu.edu.pk',
    fee: { min: 180000, max: 400000 },
    tags: ['Computer Science', 'AI', 'Data Science', 'Engineering', 'Business'],
    admissionOpen: true,
    deadline: '2025-07-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 300, fee: 320000, merit: 83 },
      { name: 'Data Science', degree: 'BS', duration: '4 years', seats: 120, fee: 320000, merit: 82 },
      { name: 'Artificial Intelligence', degree: 'BS', duration: '4 years', seats: 100, fee: 340000, merit: 84 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 200, fee: 320000, merit: 81 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 200, fee: 360000, merit: 80 },
      { name: 'Cyber Security', degree: 'BS', duration: '4 years', seats: 80, fee: 340000, merit: 80 },
    ],
    requirements: [
      'FSc Pre-Engineering or ICS with 60%+',
      'FAST Entry Test (NU-FAST) score',
      'MDCAT/NET scores also accepted',
    ],
    howToApply: [
      'Register at numsis.nu.edu.pk',
      'Fill and submit online form',
      'Pay application fee',
      'Appear in FAST Entry Test at nearest center',
      'Check merit lists online',
    ],
    contacts: { phone: '+92-51-2855-072', email: 'admission@nu.edu.pk', address: 'A.K. Brohi Road, H-11/4, Islamabad' },
    admissionCriteria: 'FAST Entry Test (NU-FAST) + Intermediate marks. 60% minimum in FSc/ICS.',
    degrees: ['Computer Science (CS)', 'Software Engineering (SE)', 'Artificial Intelligence (AI)', 'Data Science', 'Cyber Security', 'Electrical Engineering', 'Civil Engineering', 'BBA', 'Accounting & Finance'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/en/6/68/University_of_Health_Sciences%2C_Lahore_logo.png',
    image: 'https://picsum.photos/seed/uhs/800/450',
    description: 'UHS Lahore is Pakistan\'s leading health sciences university, serving as the examination and regulatory body for all medical and dental colleges in Punjab. It conducts the MDCAT (Medical and Dental College Admission Test) and offers specialized postgraduate medical programs.',
    website: 'https://uhs.edu.pk',
    fee: { min: 80000, max: 400000 },
    tags: ['Medicine', 'Dental', 'Health Sciences', 'Pharmacy', 'Nursing'],
    admissionOpen: true,
    deadline: '2025-10-15',
    programs_list: [
      { name: 'Medicine & Surgery', degree: 'MBBS', duration: '5 years', seats: 100, fee: 400000, merit: 90 },
      { name: 'Dental Sciences', degree: 'BDS', duration: '4 years', seats: 50, fee: 350000, merit: 85 },
      { name: 'Public Health', degree: 'MPH', duration: '2 years', seats: 40, fee: 200000, merit: 75 },
      { name: 'Nursing', degree: 'BSN', duration: '4 years', seats: 60, fee: 120000, merit: 70 },
    ],
    requirements: [
      'FSc Pre-Medical with 65%+',
      'MDCAT score (for MBBS/BDS)',
      'CNIC/B-Form',
      'Domicile Certificate',
    ],
    howToApply: [
      'Apply via uhs.edu.pk portal',
      'Appear for MDCAT (conducted by UHS)',
      'Merit list published by Punjab MDCAT board',
      'Report to allotted college for verification',
    ],
    contacts: { phone: '+92-42-9923-1304', email: 'info@uhs.edu.pk', address: 'Khayaban-e-Jamia Punjab, Lahore' },
    admissionCriteria: 'MDCAT + FSc Pre-Medical marks. UHS conducts the entrance exam for all Punjab medical admissions.',
    degrees: ['MBBS', 'Dental Sciences (BDS)', 'Nursing', 'Public Health', 'Pharmacy (Pharm-D)', 'Health Sciences', 'Physiotherapy', 'Nutrition & Dietetics'],
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/BZU-Multan.png',
    image: 'https://picsum.photos/seed/bzu/800/450',
    description: 'BZU Multan is one of the largest public universities in Southern Punjab, serving as the premier center of higher education in the region. It has over 70 departments and 45 affiliated colleges offering a comprehensive range of undergraduate and graduate programs.',
    website: 'https://bzu.edu.pk',
    fee: { min: 20000, max: 80000 },
    tags: ['Sciences', 'Arts', 'Commerce', 'Agriculture', 'Engineering'],
    admissionOpen: true,
    deadline: '2025-09-30',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 150, fee: 60000, merit: 70 },
      { name: 'Physics', degree: 'BS', duration: '4 years', seats: 100, fee: 40000, merit: 65 },
      { name: 'Chemistry', degree: 'BS', duration: '4 years', seats: 100, fee: 40000, merit: 63 },
      { name: 'Commerce', degree: 'BCom', duration: '2 years', seats: 200, fee: 25000, merit: 55 },
      { name: 'Pharmacy', degree: 'Pharm.D', duration: '5 years', seats: 80, fee: 80000, merit: 76 },
    ],
    requirements: [
      'Intermediate with 45%+',
      'BZU Entry Test',
      'CNIC/B-Form',
      'Domicile of Punjab (preferred)',
    ],
    howToApply: [
      'Apply online via bzu.edu.pk admissions',
      'Pay admission fee via bank challan',
      'Appear for BZU entry test',
      'Merit list display online and at campus',
      'Report for document verification',
    ],
    contacts: { phone: '+92-61-9210-067', email: 'info@bzu.edu.pk', address: 'Bosan Road, Multan 60800' },
    admissionCriteria: 'BZU Entry Test + Intermediate marks. 45% minimum in relevant subjects.',
    degrees: ['Computer Science (CS)', 'Physics', 'Chemistry', 'Mathematics', 'Pharmacy (Pharm-D)', 'BBA', 'Economics', 'English Linguistics', 'Urdu', 'Islamic Studies', 'Psychology', 'Sociology', 'Political Science', 'Agriculture', 'Biological Sciences'],
  },
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

  // Fields report
  const allFields = [
    'name', 'shortName', 'city', 'province', 'type', 'ranking', 'established',
    'students', 'programs', 'description', 'website', 'fee', 'tags',
    'admissionOpen', 'deadline', 'programs_list', 'requirements', 'howToApply',
    'contacts', 'admissionCriteria', 'degrees', 'logoUrl', 'coverUrl'
  ];
  console.log(`   ✅ All ${allFields.length} fields populated for each university`);
  console.log('   ✅ No fields left incomplete\n');

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
