export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  province: string;
  type: 'public' | 'private';
  ranking: number;
  established: number;
  students: number;
  programs: number;
  logo: string;
  image: string;
  description: string;
  website: string;
  fee: { min: number; max: number };
  tags: string[];
  admissionOpen: boolean;
  deadline: string;
  programs_list: Program[];
  requirements: string[];
  howToApply: string[];
  contacts: { phone: string; email: string; address: string };
  campuses?: Campus[];
  reviews?: Review[];
}

export interface Program {
  name: string;
  degree: string;
  duration: string;
  seats: number;
  fee: number;
  merit: number;
}

export interface Campus {
  name: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  degrees?: string[];
}

export interface Review {
  author?: string;
  rating: number;
  text: string;
  source?: string;
}

export const universities: University[] = [
  {
    id: 'nust',
    name: 'National University of Sciences and Technology',
    shortName: 'NUST',
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
    contacts: {
      phone: '+92-51-9085-1000',
      email: 'admissions@nust.edu.pk',
      address: 'H-12, Islamabad, Pakistan',
    },
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
    id: 'lums',
    name: 'Lahore University of Management Sciences',
    shortName: 'LUMS',
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
    tags: ['Business', 'Law', 'Computer Science', 'Humanities'],
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
    contacts: {
      phone: '+92-42-3560-8000',
      email: 'admissions@lums.edu.pk',
      address: 'DHA, Lahore Cantt., Lahore 54792',
    },
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
    id: 'pu',
    name: 'University of the Punjab',
    shortName: 'PU',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    ranking: 3,
    established: 1882,
    students: 35000,
    programs: 200,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PU&backgroundColor=1a1a35&textColor=06b6d4',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    description: 'University of the Punjab is the oldest university in Pakistan, offering a vast range of programs across sciences, arts, commerce, law, and professional disciplines.',
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
    contacts: {
      phone: '+92-42-99231246',
      email: 'info@pu.edu.pk',
      address: 'Quaid-e-Azam Campus, Lahore',
    },
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
    id: 'aku',
    name: 'Aga Khan University',
    shortName: 'AKU',
    city: 'Karachi',
    province: 'Sindh',
    type: 'private',
    ranking: 4,
    established: 1983,
    students: 3500,
    programs: 30,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AKU&backgroundColor=1a1a35&textColor=ec4899',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    description: 'AKU is a world-class institution known for excellence in medicine, nursing, education, and development policy. It maintains a strong focus on research and community health.',
    website: 'https://aku.edu',
    fee: { min: 400000, max: 900000 },
    tags: ['Medicine', 'Nursing', 'Education', 'Health Sciences'],
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
    contacts: {
      phone: '+92-21-3486-1900',
      email: 'admissions@aku.edu',
      address: 'Stadium Road, Karachi 74800',
    },
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
    id: 'fast',
    name: 'FAST National University of Computer and Emerging Sciences',
    shortName: 'FAST-NUCES',
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
    tags: ['Computer Science', 'Engineering', 'Business', 'AI'],
    admissionOpen: true,
    deadline: '2025-07-15',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 400, fee: 352000, merit: 83 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 250, fee: 352000, merit: 81 },
      { name: 'Artificial Intelligence', degree: 'BS', duration: '4 years', seats: 150, fee: 352000, merit: 82 },
      { name: 'Data Science', degree: 'BS', duration: '4 years', seats: 120, fee: 352000, merit: 81 },
      { name: 'Cyber Security', degree: 'BS', duration: '4 years', seats: 100, fee: 352000, merit: 82 },
      { name: 'Electrical Engineering', degree: 'BS', duration: '4 years', seats: 150, fee: 352000, merit: 78 },
      { name: 'Civil Engineering (Lahore Only)', degree: 'BS', duration: '4 years', seats: 80, fee: 352000, merit: 75 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 150, fee: 352000, merit: 70 },
      { name: 'Accounting & Finance', degree: 'BS', duration: '4 years', seats: 120, fee: 352000, merit: 68 },
      { name: 'Financial Technology', degree: 'BS', duration: '4 years', seats: 80, fee: 352000, merit: 72 },
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
    contacts: {
      phone: '+92-51-2855-072',
      email: 'admission@nu.edu.pk',
      address: 'A.K. Brohi Road, H-11/4, Islamabad',
    },
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
    id: 'itu',
    name: 'Information Technology University',
    shortName: 'ITU',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    ranking: 6,
    established: 2012,
    students: 2500,
    programs: 20,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ITU&backgroundColor=1a1a35&textColor=06b6d4',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop',
    description: 'ITU Punjab is a focused technology and innovation university offering cutting-edge programs in CS, AI, Data Science, and Entrepreneurship.',
    website: 'https://itu.edu.pk',
    fee: { min: 120000, max: 250000 },
    tags: ['Technology', 'AI', 'Data Science', 'Entrepreneurship'],
    admissionOpen: true,
    deadline: '2025-08-01',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 120, fee: 200000, merit: 85 },
      { name: 'Artificial Intelligence', degree: 'BS', duration: '4 years', seats: 80, fee: 220000, merit: 86 },
      { name: 'Data Science', degree: 'BS', duration: '4 years', seats: 80, fee: 200000, merit: 84 },
    ],
    requirements: [
      'FSc/ICS with 60%+',
      'ITU Entry Test',
      'Domicile of Punjab',
    ],
    howToApply: [
      'Apply via itu.edu.pk admissions section',
      'Submit entry test form and fee',
      'Appear for ITU Entry Test',
      'Merit list announcement',
    ],
    contacts: {
      phone: '+92-42-35880007',
      email: 'admissions@itu.edu.pk',
      address: '346-B, Old Muslim Town, Lahore',
    },
    reviews: [
      {
        author: 'Usman K. (CS Graduate)',
        rating: 4,
        text: 'Very modern curriculum and research labs. Since it is relatively small, you get good attention from professors who mostly have international PhDs. Good startup incubator.',
        source: 'Google Reviews',
      }
    ]
  },
  {
    id: 'uet',
    name: 'University of Engineering and Technology Lahore',
    shortName: 'UET',
    city: 'Lahore',
    province: 'Punjab',
    type: 'public',
    ranking: 7,
    established: 1921,
    students: 14000,
    programs: 60,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=UET&backgroundColor=1a1a35&textColor=f59e0b',
    image: 'https://images.unsplash.com/photo-1606761568289-4014d5573422?q=80&w=1200&auto=format&fit=crop',
    description: 'UET Lahore is Pakistan\'s oldest engineering university, offering top-class education in multiple disciplines of engineering, architecture, and technology.',
    website: 'https://uet.edu.pk',
    fee: { min: 80000, max: 200000 },
    tags: ['Engineering', 'Architecture', 'Technology'],
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
    contacts: {
      phone: '+92-42-9029-2349',
      email: 'info@uet.edu.pk',
      address: 'Grand Trunk Road, Lahore',
    },
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
    id: 'comsats',
    name: 'COMSATS University Islamabad',
    shortName: 'COMSATS',
    city: 'Islamabad',
    province: 'Federal',
    type: 'public',
    ranking: 8,
    established: 1998,
    students: 28000,
    programs: 100,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=COMSATS&backgroundColor=1a1a35&textColor=ec4899',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop',
    description: 'COMSATS is a federal university with multiple campuses across Pakistan offering programs in technology, sciences, and management.',
    website: 'https://comsats.edu.pk',
    fee: { min: 100000, max: 250000 },
    tags: ['Technology', 'Sciences', 'Management', 'Multiple Campuses'],
    admissionOpen: true,
    deadline: '2025-08-31',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 500, fee: 200000, merit: 75 },
      { name: 'Software Engineering', degree: 'BS', duration: '4 years', seats: 300, fee: 200000, merit: 74 },
      { name: 'Bioinformatics', degree: 'BS', duration: '4 years', seats: 100, fee: 180000, merit: 72 },
    ],
    requirements: ['FSc/ICS 50%+', 'COMSATS Entry Test', 'CNIC and Domicile'],
    howToApply: [
      'Apply online via admission.comsats.edu.pk',
      'Select preferred campus and program',
      'Pay entry test fee',
      'Appear for test at selected campus',
    ],
    contacts: {
      phone: '+92-51-9049-3059',
      email: 'info@comsats.edu.pk',
      address: 'Park Road, Islamabad',
    },
    campuses: [
      { name: 'Islamabad Campus (Main)', city: 'Islamabad', address: 'Park Road, Chak Shahzad, Islamabad', phone: '+92-51-9247000' },
      { name: 'Lahore Campus', city: 'Lahore', address: 'Defence Road, Off Raiwind Road, Lahore', phone: '+92-42-111-001-007' },
      { name: 'Abbottabad Campus', city: 'Abbottabad', address: 'University Road, Tobe Camp, Abbottabad', phone: '+92-992-383591' },
      { name: 'Wah Campus', city: 'Wah Cantt', address: 'G.T. Road, Wah Cantt', phone: '+92-51-4534200' },
      { name: 'Sahiwal Campus', city: 'Sahiwal', address: 'COMSATS Road, Sahiwal', phone: '+92-40-4305001' }
    ]
  },
  {
    id: 'szabist',
    name: 'Shaheed Zulfikar Ali Bhutto Institute of Science and Technology',
    shortName: 'SZABIST',
    city: 'Karachi',
    province: 'Sindh',
    type: 'private',
    ranking: 10,
    established: 1995,
    students: 10000,
    programs: 55,
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SZABIST&backgroundColor=1a1a35&textColor=5b63f5',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    description: 'SZABIST offers quality programs in computing, management, media sciences, and social sciences with a focus on industry relevance and corporate placement.',
    website: 'https://szabist.edu.pk',
    fee: { min: 200000, max: 420000 },
    tags: ['Computing', 'Management', 'Media Sciences'],
    admissionOpen: true,
    deadline: '2025-07-20',
    programs_list: [
      { name: 'Computer Science', degree: 'BS', duration: '4 years', seats: 150, fee: 320000, merit: 72 },
      { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 200, fee: 380000, merit: 70 },
      { name: 'Media Sciences', degree: 'BS', duration: '4 years', seats: 100, fee: 300000, merit: 68 },
    ],
    requirements: ['FSc/A-Levels with 50%+', 'SZABIST Entry Test or SAT'],
    howToApply: [
      'Apply online at admissions.szabist.edu.pk',
      'Upload required documents and select campus',
      'Appear for SZABIST Entry Test',
      'Attend merit-based interview',
    ],
    contacts: {
      phone: '+92-21-3452-6988',
      email: 'info@szabist.edu.pk',
      address: '90 & 100, Clifton, Karachi 75600',
    },
    campuses: [
      { name: 'Karachi Campus (Main)', city: 'Karachi', address: 'Clifton, Karachi', phone: '+92-21-111-922-478' },
      { name: 'Islamabad Campus', city: 'Islamabad', address: 'Street 9, H-8/4, Islamabad', phone: '+92-51-4863363' },
      { name: 'Hyderabad Campus', city: 'Hyderabad', address: 'Ground & 1st Floor, State Life Building, Hyderabad', phone: '+92-22-2782442' },
      { name: 'Larkana Campus', city: 'Larkana', address: 'Sachity Block, Larkana', phone: '+92-74-4752890' }
    ]
  },
  {
    id: 'iba',
    name: 'Institute of Business Administration',
    shortName: 'IBA',
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
    tags: ['Business', 'Computer Science', 'Economics'],
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
    contacts: {
      phone: '+92-21-3810-4700',
      email: 'admissions@iba.edu.pk',
      address: 'University Road, Karachi 75270',
    },
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
    id: 'giki',
    name: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    shortName: 'GIKI',
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
    contacts: {
      phone: '+92-938-271-858',
      email: 'admissions@giki.edu.pk',
      address: 'Topi, District Swabi, KP 23640',
    },
    reviews: [
      {
        author: 'Ali S. (Alumnus)',
        rating: 4.8,
        text: 'Incredible residential campus. Living away from cities teaches you independence. GIKI network is huge and highly supportive. Strong student societies make the campus life extremely lively.',
        source: 'Google Reviews',
      }
    ]
  }
];
