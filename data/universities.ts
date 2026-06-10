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
  generalPerception?: string;
  pros?: string[];
  cons?: string[];
  ratings?: Ratings;
  admissionCriteria?: string;
  degrees?: string[];
}

export interface Program {
  name: string;
  degree: string;
  duration: string;
  seats: number;
  fee: number;
  merit: number;
  description?: string;
  scope?: string;
  careerPaths?: string[];
  difficultyLevel?: string;
  practicalExposure?: string;
  industryDemand?: string;
  higherStudyOptions?: string;
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

export interface Ratings {
  academicRigor: number;
  jobPlacement: number;
  practicalSkills: number;
  sportsLife: number;
  facultyQuality: number;
  valueForMoney: number;
  feesAffordability: number;
  campusLife: number;
  researchOpportunities: number;
  hostelFacilities: number;
  overall: number;
}

export const universities: University[] = [
  {
    "id": "qau",
    "shortName": "QAU",
    "name": "Quaid-i-Azam University",
    "city": "Islamabad",
    "province": "Islamabad",
    "type": "public",
    "ranking": 1,
    "established": 1967,
    "students": 12000,
    "programs": 120,
    "logo": "/logos/qau.png",
    "image": "/covers/qau.jpg",
    "description": "Quaid-i-Azam University (QAU) is Pakistan's top-ranked research university, consistently ranked #1 nationally. Renowned for its physics, chemistry, mathematics, and social sciences departments, QAU is a premier public sector research institution.",
    "website": "https://qau.edu.pk",
    "fee": {
      "min": 35000,
      "max": 120000
    },
    "tags": [
      "Research",
      "Sciences",
      "Social Sciences",
      "Federal"
    ],
    "admissionOpen": true,
    "deadline": "2025-09-30",
    "generalPerception": "Highly respected research powerhouse in Pakistan. Widely known for academic excellence in natural sciences, though the campus experiences political activity and strikes.",
    "pros": [
      "Top-tier research output and highly cited faculty.",
      "Extremely affordable tuition fees.",
      "Diverse student body representing all provinces.",
      "Beautiful, vast scenic campus at the foot of Margalla Hills."
    ],
    "cons": [
      "Frequent strikes and student political group clashes.",
      "Aging lab equipment and hostel infrastructure.",
      "Slow administrative and bureaucratic processes."
    ],
    "ratings": {
      "academicRigor": 4.5,
      "jobPlacement": 4,
      "practicalSkills": 3.5,
      "sportsLife": 3.5,
      "facultyQuality": 4.7,
      "valueForMoney": 4.9,
      "feesAffordability": 4.8,
      "campusLife": 3.8,
      "researchOpportunities": 4.8,
      "hostelFacilities": 2.8,
      "overall": 4.3
    },
    "programs_list": [
      {
        "name": "Physics",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 45000,
        "merit": 82,
        "description": "Studies fundamental properties of nature, mechanics, quantum theory, electrodynamics, and astrophysics research.",
        "scope": "Fundamental science path leading to academic research, theoretical work, and computational modelling.",
        "careerPaths": [
          "Astrophysicist",
          "Quantitative Finance Modeller",
          "Research Associate",
          "Lecturer"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Medium",
        "industryDemand": "Medium",
        "higherStudyOptions": "MS Physics, PhD in Theoretical or Applied Physics"
      },
      {
        "name": "Chemistry",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 45000,
        "merit": 78,
        "description": "Studies chemical compounds, structure, properties, organic synthesis, biochemistry, and industrial analytical chemistry.",
        "scope": "Key role in dye, paint, textile, food testing, pharmaceutical research, and plastics manufacturing.",
        "careerPaths": [
          "Quality Assurance Chemist",
          "Pharmaceutical Researcher",
          "Lab Supervisor",
          "Industrial Chemist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Chemistry, M.Phil Organic Chemistry, PhD"
      },
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 75000,
        "merit": 88,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "International Relations",
        "degree": "BS",
        "duration": "4 years",
        "seats": 90,
        "fee": 40000,
        "merit": 75,
        "description": "Focuses on diplomacy, foreign policies of nations, international security systems, global institutions, and conflict resolutions.",
        "scope": "Highly targeted path for foreign service examinations, embassies, NGOs, journalism, and public administration.",
        "careerPaths": [
          "Diplomatic Attaché",
          "Political Analyst",
          "NGO Specialist",
          "Foreign Journalist"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS International Relations, Public Policy, Master of Public Administration"
      },
      {
        "name": "Biotechnology",
        "degree": "BS",
        "duration": "4 years",
        "seats": 60,
        "fee": 55000,
        "merit": 84,
        "description": "Harnessing cellular and biomolecular processes to develop technologies for healthcare, agriculture, and industry.",
        "scope": "Expanding frontier in scientific research, genetics, crop yield improvements, and pharmaceutical labs.",
        "careerPaths": [
          "Biotech Researcher",
          "Lab Technician",
          "Genetic Analyst",
          "Bioinformatics Officer"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Medium-High",
        "higherStudyOptions": "MS Biotechnology, Genetics, Bioinformatics"
      },
      {
        "name": "Mathematics",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 40000,
        "merit": 76,
        "description": "Studies algebra, calculus, statistical modelling, actuarial sciences, and mathematical frameworks.",
        "scope": "Vast application in data science, cryptography, banking, and academic instruction.",
        "careerPaths": [
          "Risk Modeller",
          "Actuarial Specialist",
          "Cryptanalyst",
          "Maths Professor"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Mathematics, MS Financial Math"
      }
    ],
    "requirements": [
      "Intermediate (FSc/FA/ICS/A-Levels) with minimum 60% marks",
      "QAU Entry Test — minimum 50% score",
      "Valid CNIC/B-Form"
    ],
    "howToApply": [
      "Apply online via QAU admission portal (qau.edu.pk)",
      "Pay application fee of PKR 2,000",
      "Appear for QAU Entrance Test"
    ],
    "contacts": {
      "phone": "+92-51-9064-3000",
      "email": "admissions@qau.edu.pk",
      "address": "QAU Campus, Islamabad 45320"
    },
    "admissionCriteria": "QAU Entry Test + Intermediate marks. Minimum 60% in relevant subjects required.",
    "degrees": [
      "BS Physics",
      "BS Chemistry",
      "BS Mathematics",
      "BS Computer Science",
      "BS Biotechnology",
      "BS International Relations"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Islamabad",
        "address": "QAU Campus, Islamabad 45320",
        "phone": "+92-51-9064-3000"
      }
    ]
  },
  {
    "id": "nust",
    "shortName": "NUST",
    "name": "National University of Sciences and Technology",
    "city": "Islamabad",
    "province": "Islamabad",
    "type": "public",
    "ranking": 2,
    "established": 1991,
    "students": 15000,
    "programs": 150,
    "logo": "/logos/nust.png",
    "image": "/covers/nust.jpg",
    "description": "NUST is Pakistan's premier public engineering and technology university, ranked among the top 400 universities globally. It offers world-class education in engineering, computing, management, and biological sciences across multiple specialized campuses.",
    "website": "https://nust.edu.pk",
    "fee": {
      "min": 394100,
      "max": 550800
    },
    "tags": [
      "Engineering",
      "Technology",
      "Sciences",
      "Management"
    ],
    "admissionOpen": true,
    "deadline": "2025-08-15",
    "generalPerception": "Widely regarded as the most complete and prestigious engineering and business university. Features a sprawling, ultra-modern campus in H-12 Islamabad with a highly disciplined, premium student environment.",
    "pros": [
      "Superb campus infrastructure and sports facilities (including equestrian and indoor arena).",
      "Extremely high corporate employability and active campus placement drives.",
      "NSTP (National Science & Technology Park) on-site offers great startup incubator networks.",
      "Active international exchange programs and research collaboration."
    ],
    "cons": [
      "High stress academic environment with rapid-fire quizzes and relative grading system.",
      "Highly competitive merit; admissions are extremely difficult.",
      "Relatively higher fee structure for a public sector university."
    ],
    "ratings": {
      "academicRigor": 4.6,
      "jobPlacement": 4.8,
      "practicalSkills": 4.5,
      "sportsLife": 4.8,
      "facultyQuality": 4.6,
      "valueForMoney": 4.2,
      "feesAffordability": 2.8,
      "campusLife": 4.6,
      "researchOpportunities": 4.6,
      "hostelFacilities": 4,
      "overall": 4.5
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 394100,
        "merit": 88,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Software Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 394100,
        "merit": 87,
        "description": "Systematic application of engineering principles to the design, development, maintenance, and testing of complex software systems.",
        "scope": "Massive demand in global tech startups, software houses, and corporate IT divisions.",
        "careerPaths": [
          "Full-Stack Developer",
          "DevOps Engineer",
          "QA Automation Engineer",
          "Software Architect"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Software Engineering, Master of Engineering Management"
      },
      {
        "name": "Artificial Intelligence",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 394100,
        "merit": 88,
        "description": "Covers machine learning models, neural networks, computer vision, natural language processing, and advanced robotics engineering.",
        "scope": "Explosive demand globally in autonomous driving, smart analytics, and high-tech sectors.",
        "careerPaths": [
          "Machine Learning Engineer",
          "NLP Scientist",
          "Computer Vision Specialist",
          "Data Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Artificial Intelligence, PhD in Machine Learning"
      },
      {
        "name": "Data Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 394100,
        "merit": 86,
        "description": "Interdisciplinary study of statistics, data mining, predictive algorithms, data visualisations, and database systems.",
        "scope": "Critical for data-driven corporate decision-making, tech giants, financial entities, and marketing firms.",
        "careerPaths": [
          "Data Scientist",
          "Business Intelligence Analyst",
          "Big Data Architect",
          "Data Engineer"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Data Science, Business Analytics"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 120,
        "fee": 394100,
        "merit": 85,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      },
      {
        "name": "Mechanical Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 100,
        "fee": 394100,
        "merit": 84,
        "description": "Deals with the design, thermal analysis, manufacturing, and maintenance of machines, engines, and mechanical systems.",
        "scope": "Vast industrial applications in automotive, aerospace, heating/cooling systems, and robotics.",
        "careerPaths": [
          "Design Engineer",
          "Automotive Specialist",
          "Manufacturing Consultant",
          "Maintenance Manager"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Mechanical Engineering, robotics, materials science, or fluid dynamics"
      },
      {
        "name": "Civil Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 100,
        "fee": 394100,
        "merit": 82,
        "description": "Focuses on designing, construction, and managing structural public works like bridges, highways, dams, and skyscrapers.",
        "scope": "Vital for public infrastructures, real-estate developers, construction conglomerates, and structural consultants.",
        "careerPaths": [
          "Structural Engineer",
          "Project Site Manager",
          "Transportation Planner",
          "Geotechnical Engineer"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Structural Engineering, Construction Project Management"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 120,
        "fee": 550800,
        "merit": 78,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Accounting & Finance",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 550800,
        "merit": 77,
        "description": "Studies corporate financial reporting, taxation, commercial audit procedures, accounting information systems, and corporate law.",
        "scope": "Essential for financial accountability, audit firms, commercial banking, and public accounting.",
        "careerPaths": [
          "Corporate Accountant",
          "External/Internal Auditor",
          "Tax Consultant",
          "Financial Controller"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Very High",
        "higherStudyOptions": "CFA, ACCA, MS Finance, MBA"
      },
      {
        "name": "Naval Architecture (Karachi PNEC)",
        "degree": "BE",
        "duration": "4 years",
        "seats": 50,
        "fee": 394100,
        "merit": 80,
        "description": "Five-year professional study in architectural design, building structures, urban planning, and historic conservation.",
        "scope": "lucrative sector in urban design firms, private practice, and construction firms.",
        "careerPaths": [
          "Architect",
          "Urban Designer",
          "Interior Designer",
          "Landscape Consultant"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Very High",
        "industryDemand": "High",
        "higherStudyOptions": "M.Arch (Master of Architecture), Urban Planning"
      },
      {
        "name": "Maritime Sciences (Karachi PNEC)",
        "degree": "BS",
        "duration": "4 years",
        "seats": 60,
        "fee": 394100,
        "merit": 75,
        "description": "Detailed study of Maritime Sciences (Karachi PNEC), focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "Intermediate (FSc/ICS/A-Levels) with minimum 60% marks",
      "NUST Entry Test (NET) — minimum 60 percentile",
      "Valid CNIC/B-Form",
      "Domicile Certificate"
    ],
    "howToApply": [
      "Register on NUST admission portal (admissions.nust.edu.pk)",
      "Fill online application form and choose test centers/campuses",
      "Pay application fee of PKR 3,500 online",
      "Appear for NUST Entry Test (NET)",
      "Submit original documents at admission office after merit list"
    ],
    "contacts": {
      "phone": "+92-51-9085-1000",
      "email": "admissions@nust.edu.pk",
      "address": "H-12, Islamabad, Pakistan"
    },
    "admissionCriteria": "NUST Entry Test (NET) with minimum 60 percentile. FSc/ICS/A-Levels with 60% marks.",
    "degrees": [
      "BS Computer Science",
      "BS Software Engineering",
      "BS Artificial Intelligence",
      "BS Data Science",
      "BE Electrical Engineering",
      "BE Mechanical Engineering",
      "BE Civil Engineering",
      "BE Chemical Engineering",
      "BBA",
      "BS Mathematics",
      "B.Arch (Architecture)",
      "BE Naval Architecture",
      "BS Maritime Sciences"
    ],
    "campuses": [
      {
        "name": "Islamabad Campus (H-12)",
        "city": "Islamabad",
        "address": "Sector H-12, Islamabad, Federal Capital",
        "phone": "+92-51-9085-1000",
        "email": "admissions@nust.edu.pk",
        "degrees": [
          "BS Computer Science",
          "BS Software Engineering",
          "BS Artificial Intelligence",
          "BS Data Science",
          "BE Electrical Engineering",
          "BE Mechanical Engineering",
          "BE Civil Engineering",
          "BE Chemical Engineering",
          "BBA",
          "BS Mathematics",
          "B.Arch (Architecture)"
        ]
      },
      {
        "name": "Karachi Campus (PNEC)",
        "city": "Karachi",
        "address": "Pakistan Navy Engineering College (PNEC), Habib Ibrahim Rehmatullah Road, Karsaz, Karachi",
        "phone": "+92-21-48503070",
        "email": "admissions.pnec@nust.edu.pk",
        "degrees": [
          "BS Computer Science",
          "BE Mechanical Engineering",
          "BE Electrical Engineering",
          "BE Naval Architecture",
          "BS Maritime Sciences"
        ]
      },
      {
        "name": "Rawalpindi Campus (College of EME)",
        "city": "Rawalpindi",
        "address": "College of Electrical & Mechanical Engineering, Peshawar Road, Rawalpindi",
        "phone": "+92-51-5444-4079",
        "email": "admissions.eme@nust.edu.pk",
        "degrees": [
          "BE Mechatronics Engineering",
          "BE Mechanical Engineering",
          "BE Electrical Engineering",
          "BS Computer Science"
        ]
      },
      {
        "name": "Rawalpindi Campus (MCS)",
        "city": "Rawalpindi",
        "address": "Military College of Signals, Humayun Road, Lalkurti, Rawalpindi",
        "phone": "+92-51-9272097",
        "email": "admissions.mcs@nust.edu.pk",
        "degrees": [
          "BS Software Engineering",
          "BE Information Security Engineering"
        ]
      },
      {
        "name": "Risalpur Campus (CAE)",
        "city": "Risalpur",
        "address": "College of Aeronautical Engineering, Risalpur, Khyber Pakhtunkhwa",
        "phone": "+92-937-873241",
        "email": "admissions.cae@nust.edu.pk",
        "degrees": [
          "BE Aerospace Engineering",
          "BE Avionics Engineering"
        ]
      }
    ],
    "reviews": [
      {
        "author": "Ayesha M. (EE Alumna, Class of 2023)",
        "rating": 5,
        "text": "NUST H-12 has the most beautiful and complete campus life in Pakistan. The academic environment is competitive but highly rewarding. The research labs are top-notch and the student culture with various societies is super vibrant.",
        "source": "Google Reviews"
      },
      {
        "author": "Usman S. (PNEC Karachi Graduate)",
        "rating": 4.5,
        "text": "PNEC (Karachi) provides a highly disciplined and structured environment since it's run under the Pakistan Navy. The Naval Architecture program is unique and has excellent links to naval dockyards and marine industries.",
        "source": "Student Survey"
      },
      {
        "author": "Bilal A. (Computer Science Student)",
        "rating": 4,
        "text": "Academics can be exhausting with the strict absolute grading system in some departments. However, the peer group is brilliant and the internship opportunities at the NSTP tech park on campus are fantastic.",
        "source": "Reddit Community"
      }
    ]
  },
  {
    "id": "lums",
    "shortName": "LUMS",
    "name": "Lahore University of Management Sciences",
    "city": "Lahore",
    "province": "Punjab",
    "type": "private",
    "ranking": 3,
    "established": 1985,
    "students": 5000,
    "programs": 45,
    "logo": "/logos/lums.png",
    "image": "/covers/lums.jpg",
    "description": "LUMS is one of Pakistan's most prestigious private universities, offering exceptional programs in business, law, humanities, social sciences, and computer science. It is renowned for its liberal arts education and corporate links.",
    "website": "https://lums.edu.pk",
    "fee": {
      "min": 1280000,
      "max": 1450000
    },
    "tags": [
      "Business",
      "Law",
      "Computer Science",
      "Humanities",
      "Social Sciences"
    ],
    "admissionOpen": true,
    "deadline": "2025-03-31",
    "generalPerception": "The ultimate premier private business and liberal arts university in the country. Attracts the intellectual and financial elite, offering unmatched networking opportunities and an internationally recognized degree.",
    "pros": [
      "Unrivalled networking opportunities and prestige.",
      "Flexible liberal arts curriculum with multiple choices.",
      "Stellar corporate recruitment with top multinational partnerships.",
      "Active student societies and highly inclusive, liberal campus culture."
    ],
    "cons": [
      "Extremely high tuition fees, making it unaffordable for many.",
      "High peer pressure and intense workload (known as LUMS stress).",
      "Admissions are highly selective with a heavy focus on SAT scores."
    ],
    "ratings": {
      "academicRigor": 4.5,
      "jobPlacement": 4.9,
      "practicalSkills": 4.6,
      "sportsLife": 4.5,
      "facultyQuality": 4.7,
      "valueForMoney": 3.5,
      "feesAffordability": 1.5,
      "campusLife": 4.8,
      "researchOpportunities": 4.2,
      "hostelFacilities": 4.5,
      "overall": 4.6
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 1450000,
        "merit": 90,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 1450000,
        "merit": 87,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 150,
        "fee": 1374000,
        "merit": 88,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Accounting & Finance",
        "degree": "BSc",
        "duration": "4 years",
        "seats": 100,
        "fee": 1374000,
        "merit": 86,
        "description": "Studies corporate financial reporting, taxation, commercial audit procedures, accounting information systems, and corporate law.",
        "scope": "Essential for financial accountability, audit firms, commercial banking, and public accounting.",
        "careerPaths": [
          "Corporate Accountant",
          "External/Internal Auditor",
          "Tax Consultant",
          "Financial Controller"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Very High",
        "higherStudyOptions": "CFA, ACCA, MS Finance, MBA"
      },
      {
        "name": "Economics",
        "degree": "BSc",
        "duration": "4 years",
        "seats": 120,
        "fee": 1280000,
        "merit": 85,
        "description": "Detailed study of Economics, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Law (LLB)",
        "degree": "LLB",
        "duration": "5 years",
        "seats": 80,
        "fee": 1300000,
        "merit": 85,
        "description": "Comprehensive study of constitutional law, criminal/civil procedures, contract laws, corporate jurisprudence, and human rights.",
        "scope": "Standard qualification for legal practice, corporate counsel, and judicial services (civil judges).",
        "careerPaths": [
          "Corporate Lawyer",
          "Litigation Attorney",
          "Legal Consultant",
          "Civil Judge"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "High",
        "higherStudyOptions": "LLM (Master of Laws), Bar-at-Law, PhD in Law"
      }
    ],
    "requirements": [
      "HSSC/A-Levels with high GPA",
      "SAT or LUMS Self Assessment Test (LSAT)",
      "Strong extracurricular record",
      "Personal statement"
    ],
    "howToApply": [
      "Visit lums.edu.pk and create an applicant profile",
      "Submit online application with all required documents",
      "Pay application fee of PKR 5,000",
      "Appear for LSAT or submit SAT scores"
    ],
    "contacts": {
      "phone": "+92-42-3560-8000",
      "email": "admissions@lums.edu.pk",
      "address": "DHA, Lahore Cantt., Lahore 54792"
    },
    "admissionCriteria": "SAT / LUMS Self Assessment Test (LSAT). Strong academic record and extracurriculars required.",
    "degrees": [
      "BS Computer Science",
      "BS Electrical Engineering",
      "BBA",
      "BSc Accounting & Finance",
      "BSc Economics",
      "LLB Law"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Lahore",
        "address": "DHA, Lahore Cantt., Lahore 54792",
        "phone": "+92-42-3560-8000"
      }
    ],
    "reviews": [
      {
        "author": "Sarah D. (BBA Alumna, Class of 2024)",
        "rating": 5,
        "text": "LUMS changed my entire perspective on education. The campus is a safe haven and encourages free speech and critical thinking. It's expensive, but the networking and career opportunities are outstanding.",
        "source": "Google Reviews"
      },
      {
        "author": "Farhan M. (Economics Major)",
        "rating": 4.5,
        "text": "The library is world-class, open 24/7 during exams. The academic pressure is high, but the campus life and sports facilities are second to none in Pakistan.",
        "source": "EduOpinions"
      }
    ]
  },
  {
    "id": "pu",
    "shortName": "PU",
    "name": "University of the Punjab",
    "city": "Lahore",
    "province": "Punjab",
    "type": "public",
    "ranking": 4,
    "established": 1882,
    "students": 35000,
    "programs": 200,
    "logo": "/logos/pu.png",
    "image": "/covers/pu.jpg",
    "description": "The University of the Punjab is the oldest and one of the largest public universities in Pakistan, established in 1882. It offers a vast range of programs across sciences, arts, commerce, law, medicine, and professional disciplines with over 70 departments.",
    "website": "https://pu.edu.pk",
    "fee": {
      "min": 40000,
      "max": 150000
    },
    "tags": [
      "Sciences",
      "Arts",
      "Commerce",
      "Law",
      "Medicine"
    ],
    "admissionOpen": false,
    "deadline": "2025-07-30",
    "generalPerception": "Historic public titan of Punjab. Extremely affordable with massive campuses and a vast list of departments. Fosters a very traditional academic environment with strong focus on exams.",
    "pros": [
      "Extremely affordable tuition fees (nominal pricing).",
      "Historic legacy and massive local brand name in public sectors.",
      "Huge campus with ample greenery and historical architecture.",
      "Broad range of degree programs and massive student network."
    ],
    "cons": [
      "Bureaucracy is sluggish and slow.",
      "Hostel security issues and active student political unions.",
      "Crowded classes and standard old school teaching patterns."
    ],
    "ratings": {
      "academicRigor": 3.8,
      "jobPlacement": 3.8,
      "practicalSkills": 3.5,
      "sportsLife": 4,
      "facultyQuality": 4,
      "valueForMoney": 4.9,
      "feesAffordability": 4.9,
      "campusLife": 4.2,
      "researchOpportunities": 3.8,
      "hostelFacilities": 3,
      "overall": 4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 200,
        "fee": 80000,
        "merit": 85,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Software Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 85000,
        "merit": 84,
        "description": "Systematic application of engineering principles to the design, development, maintenance, and testing of complex software systems.",
        "scope": "Massive demand in global tech startups, software houses, and corporate IT divisions.",
        "careerPaths": [
          "Full-Stack Developer",
          "DevOps Engineer",
          "QA Automation Engineer",
          "Software Architect"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Software Engineering, Master of Engineering Management"
      },
      {
        "name": "Information Technology",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 80000,
        "merit": 83,
        "description": "Detailed study of Information Technology, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Law (LLB)",
        "degree": "LLB",
        "duration": "5 years",
        "seats": 120,
        "fee": 70000,
        "merit": 78,
        "description": "Comprehensive study of constitutional law, criminal/civil procedures, contract laws, corporate jurisprudence, and human rights.",
        "scope": "Standard qualification for legal practice, corporate counsel, and judicial services (civil judges).",
        "careerPaths": [
          "Corporate Lawyer",
          "Litigation Attorney",
          "Legal Consultant",
          "Civil Judge"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "High",
        "higherStudyOptions": "LLM (Master of Laws), Bar-at-Law, PhD in Law"
      },
      {
        "name": "Commerce",
        "degree": "BCom",
        "duration": "2 years",
        "seats": 300,
        "fee": 40000,
        "merit": 65,
        "description": "Detailed study of Commerce, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 180,
        "fee": 65000,
        "merit": 75,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "Intermediate from a recognized board",
      "PU Entry Test",
      "CNIC/B-Form"
    ],
    "howToApply": [
      "Apply through PU online portal (admissions.pu.edu.pk)",
      "Fill admission form and pay fee via bank challan",
      "Appear for University Entry Test",
      "Check merit lists on official website"
    ],
    "contacts": {
      "phone": "+92-42-99231246",
      "email": "info@pu.edu.pk",
      "address": "Quaid-e-Azam Campus, Lahore"
    },
    "admissionCriteria": "PU Entry Test + Intermediate marks. Merit-based admission.",
    "degrees": [
      "BS Computer Science",
      "BS Software Engineering",
      "BS Information Technology",
      "LLB Law",
      "BCom",
      "BBA"
    ],
    "campuses": [
      {
        "name": "Quaid-e-Azam Campus (New Campus)",
        "city": "Lahore",
        "address": "Bosan Road/Canal Road, Lahore",
        "phone": "+92-42-99231246"
      },
      {
        "name": "Allama Iqbal Campus (Old Campus)",
        "city": "Lahore",
        "address": "The Mall Road, Lahore",
        "phone": "+92-42-99211612"
      },
      {
        "name": "Gujranwala Campus",
        "city": "Gujranwala",
        "address": "Near Gift University, Gujranwala",
        "phone": "+92-55-9201222",
        "degrees": [
          "BS Computer Science",
          "BS Information Technology",
          "BBA",
          "BCom"
        ]
      },
      {
        "name": "Jhelum Campus",
        "city": "Jhelum",
        "address": "Near Jhelum Bridge, Jhelum",
        "phone": "+92-544-444444",
        "degrees": [
          "BS Computer Science",
          "BBA",
          "BCom",
          "LLB"
        ]
      }
    ],
    "reviews": [
      {
        "author": "Mohammad R. (Alumnus)",
        "rating": 4,
        "text": "The oldest university in Pakistan has a historical vibe. Old Campus is beautiful. Fees are extremely nominal, making it accessible to everyone. Academics are good but administrative speed can be improved.",
        "source": "Google Reviews"
      }
    ]
  },
  {
    "id": "aku",
    "shortName": "AKU",
    "name": "Aga Khan University",
    "city": "Karachi",
    "province": "Sindh",
    "type": "private",
    "ranking": 5,
    "established": 1983,
    "students": 3500,
    "programs": 30,
    "logo": "/logos/aku.png",
    "image": "/covers/aku.jpg",
    "description": "Aga Khan University is a world-class research-intensive institution known globally for excellence in medicine, nursing, education, and health sciences. AKU Hospital is one of the top teaching hospitals in South Asia.",
    "website": "https://aku.edu",
    "fee": {
      "min": 450000,
      "max": 1800000
    },
    "tags": [
      "Medicine",
      "Nursing",
      "Education",
      "Health Sciences",
      "Research"
    ],
    "admissionOpen": true,
    "deadline": "2025-02-28",
    "generalPerception": "Unquestionably the best medical university in Pakistan. It maintains rigorous international standards, an elite hospital training environment, and highly competitive entry requirements.",
    "pros": [
      "Unmatched clinical training at the JCI-accredited AKU Hospital.",
      "Extensive research culture and international recognition.",
      "High placement in international residencies (US/UK).",
      "State-of-the-art medical libraries and simulation labs."
    ],
    "cons": [
      "Admissions are extremely selective (highly competitive test/interview).",
      "Very demanding workload with heavy stress.",
      "High fees compared to public medical colleges."
    ],
    "ratings": {
      "academicRigor": 4.9,
      "jobPlacement": 5,
      "practicalSkills": 4.9,
      "sportsLife": 3.5,
      "facultyQuality": 4.9,
      "valueForMoney": 4,
      "feesAffordability": 1.5,
      "campusLife": 4.2,
      "researchOpportunities": 4.8,
      "hostelFacilities": 4.2,
      "overall": 4.8
    },
    "programs_list": [
      {
        "name": "Medicine & Surgery",
        "degree": "MBBS",
        "duration": "5 years",
        "seats": 100,
        "fee": 1800000,
        "merit": 92,
        "description": "Five-year professional medical training in anatomy, pharmacology, pathology, and clinical diagnosis of human diseases.",
        "scope": "Highest ethical calling with absolute career stability in healthcare, research, and specialized clinical settings.",
        "careerPaths": [
          "Medical Practitioner",
          "Resident Surgeon",
          "Clinical Researcher",
          "Hospital Administrator"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Extreme",
        "industryDemand": "Excellent",
        "higherStudyOptions": "FCPS, FRCS, MD, Master of Public Health"
      },
      {
        "name": "Nursing",
        "degree": "BScN",
        "duration": "4 years",
        "seats": 80,
        "fee": 450000,
        "merit": 80,
        "description": "Focuses on patient care, clinical nursing practices, medical support, healthcare ethics, and community health management.",
        "scope": "High demand in healthcare systems globally with massive opportunities for migration to UK, US, and Middle East.",
        "careerPaths": [
          "Registered Nurse",
          "Nursing Supervisor",
          "Public Health Officer",
          "Clinical Instructor"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Extreme",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Nursing, Health Administration"
      },
      {
        "name": "Biosciences",
        "degree": "BS",
        "duration": "4 years",
        "seats": 50,
        "fee": 600000,
        "merit": 82,
        "description": "Detailed study of Biosciences, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "Pre-Medical FSc with minimum 75%",
      "AKU Medical College Admission Test (MCAT)",
      "IELTS 6.5 or equivalent"
    ],
    "howToApply": [
      "Download application from aku.edu",
      "Submit completed application with all documents",
      "Pay application processing fee",
      "Sit for AKU entry test and interview"
    ],
    "contacts": {
      "phone": "+92-21-3486-1900",
      "email": "admissions@aku.edu",
      "address": "Stadium Road, Karachi 74800"
    },
    "admissionCriteria": "AKU admission test + interview. FSc Pre-Medical with 75%+ required for MBBS.",
    "degrees": [
      "MBBS",
      "BScN Nursing",
      "BS Biosciences"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Karachi",
        "address": "Stadium Road, Karachi 74800",
        "phone": "+92-21-3486-1900"
      }
    ],
    "reviews": [
      {
        "author": "Dr. Faisal (MBBS Graduate)",
        "rating": 5,
        "text": "Best medical college in the country by a mile. The hospital facilities are internationally accredited and the hands-on clinical experience is outstanding. Extremely competitive but worth it.",
        "source": "Doctor Network"
      }
    ]
  },
  {
    "id": "comsats",
    "shortName": "COMSATS",
    "name": "COMSATS University Islamabad",
    "city": "Islamabad",
    "province": "Federal",
    "type": "public",
    "ranking": 6,
    "established": 1998,
    "students": 28000,
    "programs": 100,
    "logo": "/logos/comsats.jpg",
    "image": "/covers/comsats.jpg",
    "description": "COMSATS University Islamabad (CUI) is one of Pakistan's largest public universities with 7 campuses nationwide. It is recognized for affordable quality education in computing, engineering, business, and sciences.",
    "website": "https://comsats.edu.pk",
    "fee": {
      "min": 180000,
      "max": 240000
    },
    "tags": [
      "Technology",
      "Sciences",
      "Management",
      "Multiple Campuses"
    ],
    "admissionOpen": true,
    "deadline": "2025-08-31",
    "generalPerception": "Highly dependable public computing and engineering option. Noted for a large student body, affordable fees, and very active IT and CS departments.",
    "pros": [
      "Excellent balance between cost and education quality.",
      "Active coding cultures and computing contests.",
      "Nice main campus in Islamabad (Chak Shahzad).",
      "Wide presence across Punjab and KP."
    ],
    "cons": [
      "Admin processes can be bureaucratic.",
      "High student volume makes individual counseling hard.",
      "Job placement is good but depends heavily on student initiative."
    ],
    "ratings": {
      "academicRigor": 4.2,
      "jobPlacement": 4.2,
      "practicalSkills": 4.1,
      "sportsLife": 3.5,
      "facultyQuality": 4.1,
      "valueForMoney": 4.4,
      "feesAffordability": 3.5,
      "campusLife": 3.8,
      "researchOpportunities": 4,
      "hostelFacilities": 3.2,
      "overall": 4.1
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 500,
        "fee": 220000,
        "merit": 82,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Software Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 300,
        "fee": 220000,
        "merit": 81,
        "description": "Systematic application of engineering principles to the design, development, maintenance, and testing of complex software systems.",
        "scope": "Massive demand in global tech startups, software houses, and corporate IT divisions.",
        "careerPaths": [
          "Full-Stack Developer",
          "DevOps Engineer",
          "QA Automation Engineer",
          "Software Architect"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Software Engineering, Master of Engineering Management"
      },
      {
        "name": "Artificial Intelligence",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 220000,
        "merit": 80,
        "description": "Covers machine learning models, neural networks, computer vision, natural language processing, and advanced robotics engineering.",
        "scope": "Explosive demand globally in autonomous driving, smart analytics, and high-tech sectors.",
        "careerPaths": [
          "Machine Learning Engineer",
          "NLP Scientist",
          "Computer Vision Specialist",
          "Data Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Artificial Intelligence, PhD in Machine Learning"
      },
      {
        "name": "Data Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 210000,
        "merit": 79,
        "description": "Interdisciplinary study of statistics, data mining, predictive algorithms, data visualisations, and database systems.",
        "scope": "Critical for data-driven corporate decision-making, tech giants, financial entities, and marketing firms.",
        "careerPaths": [
          "Data Scientist",
          "Business Intelligence Analyst",
          "Big Data Architect",
          "Data Engineer"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Data Science, Business Analytics"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 200,
        "fee": 240000,
        "merit": 75,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 250,
        "fee": 200000,
        "merit": 70,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "FSc/ICS 50%+",
      "COMSATS Entry Test",
      "CNIC and Domicile"
    ],
    "howToApply": [
      "Apply online via admission.comsats.edu.pk",
      "Select preferred campus",
      "Pay entry test fee",
      "Appear for test at selected campus"
    ],
    "contacts": {
      "phone": "+92-51-9049-3059",
      "email": "info@comsats.edu.pk",
      "address": "Park Road, Islamabad"
    },
    "admissionCriteria": "COMSATS entry test + FSc/ICS marks. Minimum 50% in intermediate.",
    "degrees": [
      "BS Computer Science",
      "BS Software Engineering",
      "BS Artificial Intelligence",
      "BS Data Science",
      "BS Electrical Engineering",
      "BBA"
    ],
    "campuses": [
      {
        "name": "Islamabad Campus (Main)",
        "city": "Islamabad",
        "address": "Park Road, Chak Shahzad, Islamabad",
        "phone": "+92-51-9247000"
      },
      {
        "name": "Lahore Campus",
        "city": "Lahore",
        "address": "Defence Road, Off Raiwind Road, Lahore",
        "phone": "+92-42-111-001-007"
      },
      {
        "name": "Abbottabad Campus",
        "city": "Abbottabad",
        "address": "University Road, Tobe Camp, Abbottabad",
        "phone": "+92-992-383591"
      },
      {
        "name": "Wah Campus",
        "city": "Wah Cantt",
        "address": "G.T. Road, Wah Cantt",
        "phone": "+92-51-4534200"
      },
      {
        "name": "Sahiwal Campus",
        "city": "Sahiwal",
        "address": "COMSATS Road, Sahiwal",
        "phone": "+92-40-4305001"
      }
    ]
  },
  {
    "id": "uet",
    "shortName": "UET",
    "name": "University of Engineering and Technology Lahore",
    "city": "Lahore",
    "province": "Punjab",
    "type": "public",
    "ranking": 7,
    "established": 1921,
    "students": 14000,
    "programs": 60,
    "logo": "/logos/uet.svg",
    "image": "/covers/uet.jpg",
    "description": "UET Lahore is Pakistan's oldest and most prestigious engineering university, established in 1921. It has produced many of Pakistan's leading engineers and technologists, offering programs in over 40 engineering and technology disciplines.",
    "website": "https://uet.edu.pk",
    "fee": {
      "min": 80000,
      "max": 350000
    },
    "tags": [
      "Engineering",
      "Architecture",
      "Technology",
      "Sciences"
    ],
    "admissionOpen": false,
    "deadline": "2025-09-10",
    "generalPerception": "Historic pioneer of engineering in the country. Fosters a very traditional, rigorous engineering curriculum. Holds massive public sector value and boasts a giant alumni network.",
    "pros": [
      "Huge historical brand value in public and private sectors.",
      "Vast alumni network holding key positions in global industries.",
      "Low tuition fee for regular merit students.",
      "Excellent labs and research facilities for civil and mechanical engineering."
    ],
    "cons": [
      "Sluggish administrative operations and bureaucracy.",
      "Traditional rote teaching style in some departments.",
      "High fees for self-finance students."
    ],
    "ratings": {
      "academicRigor": 4.4,
      "jobPlacement": 4.3,
      "practicalSkills": 4,
      "sportsLife": 3.8,
      "facultyQuality": 4.2,
      "valueForMoney": 4.8,
      "feesAffordability": 4.5,
      "campusLife": 3.8,
      "researchOpportunities": 4.2,
      "hostelFacilities": 3.2,
      "overall": 4.1
    },
    "programs_list": [
      {
        "name": "Civil Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 200,
        "fee": 120000,
        "merit": 84,
        "description": "Focuses on designing, construction, and managing structural public works like bridges, highways, dams, and skyscrapers.",
        "scope": "Vital for public infrastructures, real-estate developers, construction conglomerates, and structural consultants.",
        "careerPaths": [
          "Structural Engineer",
          "Project Site Manager",
          "Transportation Planner",
          "Geotechnical Engineer"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Structural Engineering, Construction Project Management"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 200,
        "fee": 120000,
        "merit": 83,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      },
      {
        "name": "Mechanical Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 200,
        "fee": 120000,
        "merit": 82,
        "description": "Deals with the design, thermal analysis, manufacturing, and maintenance of machines, engines, and mechanical systems.",
        "scope": "Vast industrial applications in automotive, aerospace, heating/cooling systems, and robotics.",
        "careerPaths": [
          "Design Engineer",
          "Automotive Specialist",
          "Manufacturing Consultant",
          "Maintenance Manager"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Mechanical Engineering, robotics, materials science, or fluid dynamics"
      },
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 150000,
        "merit": 86,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Architecture",
        "degree": "B.Arch",
        "duration": "5 years",
        "seats": 80,
        "fee": 130000,
        "merit": 80,
        "description": "Five-year professional study in architectural design, building structures, urban planning, and historic conservation.",
        "scope": "lucrative sector in urban design firms, private practice, and construction firms.",
        "careerPaths": [
          "Architect",
          "Urban Designer",
          "Interior Designer",
          "Landscape Consultant"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Very High",
        "industryDemand": "High",
        "higherStudyOptions": "M.Arch (Master of Architecture), Urban Planning"
      }
    ],
    "requirements": [
      "FSc Pre-Engineering with 60%+",
      "ECAT (Engineering College Admission Test)",
      "Domicile Certificate"
    ],
    "howToApply": [
      "Apply via UET ECAT portal",
      "Register and appear for ECAT",
      "Fill admission form online",
      "Submit documents at chosen campus"
    ],
    "contacts": {
      "phone": "+92-42-9029-2349",
      "email": "info@uet.edu.pk",
      "address": "Grand Trunk Road, Lahore"
    },
    "admissionCriteria": "ECAT score + FSc Pre-Engineering marks. Merit-based selection.",
    "degrees": [
      "BE Civil Engineering",
      "BE Electrical Engineering",
      "BE Mechanical Engineering",
      "BS Computer Science",
      "B.Arch Architecture"
    ],
    "campuses": [
      {
        "name": "UET Lahore (Main)",
        "city": "Lahore",
        "address": "G.T. Road, Lahore",
        "phone": "+92-42-99029202"
      },
      {
        "name": "Kala Shah Kaku Campus (KSK)",
        "city": "Sheikhupura",
        "address": "KSK, Punjab",
        "phone": "+92-42-35515685"
      },
      {
        "name": "Faisalabad Campus (UET-FSD)",
        "city": "Faisalabad",
        "address": "Faisalabad, Punjab",
        "phone": "+92-41-2433501"
      },
      {
        "name": "Narowal Campus",
        "city": "Narowal",
        "address": "Narowal, Punjab",
        "phone": "+92-54-2500511"
      }
    ],
    "reviews": [
      {
        "author": "Saad M. (Mechanical Graduate)",
        "rating": 4.2,
        "text": "The absolute pioneer of engineering in Punjab. The alumni network is present in every industry. Main campus has classic brick architecture. Very competitive entry via ECAT.",
        "source": "Alumni Network"
      }
    ]
  },
  {
    "id": "gcu",
    "shortName": "GCU",
    "name": "Government College University Lahore",
    "city": "Lahore",
    "province": "Punjab",
    "type": "public",
    "ranking": 8,
    "established": 1864,
    "students": 16000,
    "programs": 80,
    "logo": "/logos/gcu.png",
    "image": "/covers/gcu.jpg",
    "description": "GCU Lahore is one of the oldest and most distinguished institutions in Pakistan, established in 1864. Known for its Gothic-style architecture and rigorous academic programs. Its alumni include Nobel laureate Abdus Salam.",
    "website": "https://gcu.edu.pk",
    "fee": {
      "min": 55000,
      "max": 130000
    },
    "tags": [
      "Sciences",
      "Arts",
      "Humanities",
      "Heritage"
    ],
    "admissionOpen": true,
    "deadline": "2025-08-30",
    "generalPerception": "Venerable, historic liberal arts college turned university. Famous for debate/drama culture, iconic Gothic main building, and prestigious historical heritage.",
    "pros": [
      "Stellar debates, sports, and dramatics clubs (historic Ravian legacy).",
      "Scenic Gothic revival architecture.",
      "Central Lahore location with easy commute.",
      "Very strong legacy in Urdu, English Literature, and Natural Sciences."
    ],
    "cons": [
      "Infrastructure is crowded due to limited space.",
      "Bureaucratic administrative machinery.",
      "Less focus on modern software coding compared to NUST/FAST."
    ],
    "ratings": {
      "academicRigor": 4,
      "jobPlacement": 3.8,
      "practicalSkills": 3.6,
      "sportsLife": 4.5,
      "facultyQuality": 4.2,
      "valueForMoney": 4.6,
      "feesAffordability": 4.7,
      "campusLife": 4.2,
      "researchOpportunities": 3.8,
      "hostelFacilities": 3.2,
      "overall": 4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 90000,
        "merit": 80,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "English Literature",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 55000,
        "merit": 75,
        "description": "Detailed study of English Literature, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Physics",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 65000,
        "merit": 78,
        "description": "Studies fundamental properties of nature, mechanics, quantum theory, electrodynamics, and astrophysics research.",
        "scope": "Fundamental science path leading to academic research, theoretical work, and computational modelling.",
        "careerPaths": [
          "Astrophysicist",
          "Quantitative Finance Modeller",
          "Research Associate",
          "Lecturer"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Medium",
        "industryDemand": "Medium",
        "higherStudyOptions": "MS Physics, PhD in Theoretical or Applied Physics"
      },
      {
        "name": "Chemistry",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 65000,
        "merit": 76,
        "description": "Studies chemical compounds, structure, properties, organic synthesis, biochemistry, and industrial analytical chemistry.",
        "scope": "Key role in dye, paint, textile, food testing, pharmaceutical research, and plastics manufacturing.",
        "careerPaths": [
          "Quality Assurance Chemist",
          "Pharmaceutical Researcher",
          "Lab Supervisor",
          "Industrial Chemist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Chemistry, M.Phil Organic Chemistry, PhD"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 120,
        "fee": 95000,
        "merit": 74,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "Intermediate with minimum 60% marks",
      "GCU Entry Test",
      "CNIC/B-Form"
    ],
    "howToApply": [
      "Apply online via gcu.edu.pk admissions portal",
      "Pay admission test fee via bank challan",
      "Appear for GCU Entry Test"
    ],
    "contacts": {
      "phone": "+92-42-9921-1256",
      "email": "info@gcu.edu.pk",
      "address": "Katchery Road, Lahore"
    },
    "admissionCriteria": "GCU Entry Test + Intermediate marks. Merit-based selection.",
    "degrees": [
      "BS Computer Science",
      "BS English Literature",
      "BS Physics",
      "BS Chemistry",
      "BBA"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Lahore",
        "address": "Katchery Road, Lahore",
        "phone": "+92-42-99211256"
      },
      {
        "name": "Kala Shah Kaku Campus",
        "city": "Sheikhupura",
        "address": "KSK, Punjab",
        "phone": "+92-42-3790123"
      }
    ]
  },
  {
    "id": "ku",
    "shortName": "KU",
    "name": "University of Karachi",
    "city": "Karachi",
    "province": "Sindh",
    "type": "public",
    "ranking": 9,
    "established": 1951,
    "students": 32000,
    "programs": 180,
    "logo": "/logos/ku.png",
    "image": "/covers/ku.jpg",
    "description": "The University of Karachi (KU) is one of Pakistan's largest public universities, serving as the primary intellectual hub of Sindh with programs across sciences, arts, law, pharmacy, and commerce.",
    "website": "https://uok.edu.pk",
    "fee": {
      "min": 40000,
      "max": 95000
    },
    "tags": [
      "Sciences",
      "Arts",
      "Commerce",
      "Pharmacy",
      "Law"
    ],
    "admissionOpen": true,
    "deadline": "2025-09-15",
    "generalPerception": "A massive public university representing Karachi's diverse communities. Features a gigantic campus, affordable fee structures, and is highly respected in Sindh for science and pharmacy.",
    "pros": [
      "Very affordable fee structure.",
      "Vast array of departments and degree courses.",
      "Strong local corporate recognition in Karachi.",
      "Large research hubs in organic chemistry."
    ],
    "cons": [
      "Complex student union politics.",
      "Sluggish administrative response.",
      "Transport and security challenges on campus."
    ],
    "ratings": {
      "academicRigor": 3.9,
      "jobPlacement": 3.8,
      "practicalSkills": 3.6,
      "sportsLife": 3.8,
      "facultyQuality": 4.1,
      "valueForMoney": 4.7,
      "feesAffordability": 4.7,
      "campusLife": 3.8,
      "researchOpportunities": 4,
      "hostelFacilities": 2.8,
      "overall": 4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 200,
        "fee": 65000,
        "merit": 78,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Pharmacy",
        "degree": "Pharm.D",
        "duration": "5 years",
        "seats": 150,
        "fee": 90000,
        "merit": 82,
        "description": "Professional studies in drug composition, manufacturing processes, toxicology, drug discovery, and clinical dispensing.",
        "scope": "High placement in pharmaceutical manufacturing, hospital pharmacies, and government health regulatory bodies.",
        "careerPaths": [
          "Industrial Pharmacist",
          "Quality Control Manager",
          "Clinical Pharmacist",
          "Drug Inspector"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "High",
        "higherStudyOptions": "M.Phil in Pharmaceutics, Pharmacology, or Pharmaceutical Chemistry"
      },
      {
        "name": "Chemistry",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 45000,
        "merit": 70,
        "description": "Studies chemical compounds, structure, properties, organic synthesis, biochemistry, and industrial analytical chemistry.",
        "scope": "Key role in dye, paint, textile, food testing, pharmaceutical research, and plastics manufacturing.",
        "careerPaths": [
          "Quality Assurance Chemist",
          "Pharmaceutical Researcher",
          "Lab Supervisor",
          "Industrial Chemist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Chemistry, M.Phil Organic Chemistry, PhD"
      },
      {
        "name": "International Relations",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 40000,
        "merit": 68,
        "description": "Focuses on diplomacy, foreign policies of nations, international security systems, global institutions, and conflict resolutions.",
        "scope": "Highly targeted path for foreign service examinations, embassies, NGOs, journalism, and public administration.",
        "careerPaths": [
          "Diplomatic Attaché",
          "Political Analyst",
          "NGO Specialist",
          "Foreign Journalist"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS International Relations, Public Policy, Master of Public Administration"
      }
    ],
    "requirements": [
      "Intermediate from a recognized board",
      "KU Entry Test",
      "Sindh domicile"
    ],
    "howToApply": [
      "Apply via UoK online portal",
      "Pay challan and sit for entry test",
      "Check merit lists online"
    ],
    "contacts": {
      "phone": "+92-21-9926-1300",
      "email": "info@uok.edu.pk",
      "address": "Main University Road, Karachi 75270"
    },
    "admissionCriteria": "KU Entry Test + Intermediate marks. Sindh domicile preferred for public sector seats.",
    "degrees": [
      "BS Computer Science",
      "Pharm.D Pharmacy",
      "BS Chemistry",
      "BS International Relations"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Karachi",
        "address": "Main University Road, Karachi 75270",
        "phone": "+92-21-9926-1300"
      }
    ]
  },
  {
    "id": "au",
    "shortName": "AU",
    "name": "Air University",
    "city": "Islamabad",
    "province": "Islamabad",
    "type": "public",
    "ranking": 10,
    "established": 2002,
    "students": 8000,
    "programs": 50,
    "logo": "/logos/au.png",
    "image": "/covers/au.jpg",
    "description": "Air University is a federally chartered university established by the Pakistan Air Force, specializing in engineering, computing, management, and aerospace technologies.",
    "website": "https://au.edu.pk",
    "fee": {
      "min": 240000,
      "max": 280000
    },
    "tags": [
      "Aerospace",
      "Engineering",
      "Computing",
      "Management"
    ],
    "admissionOpen": true,
    "deadline": "2025-08-15",
    "generalPerception": "Disciplined and security-focused university run under PAF auspices. Recognized for cyber security, aerospace studies, and computing in a central Islamabad location.",
    "pros": [
      "Very safe and highly disciplined campus environment.",
      "Excellent cyber security and specialized engineering programs.",
      "Centrally located inside Islamabad (E-9 complex).",
      "Solid labs and equipment."
    ],
    "cons": [
      "Relatively small campus size.",
      "Strict dress codes and tight security protocols.",
      "Moderate campus life compared to public universities like NUST/LUMS."
    ],
    "ratings": {
      "academicRigor": 4.1,
      "jobPlacement": 4.1,
      "practicalSkills": 4.2,
      "sportsLife": 3.5,
      "facultyQuality": 4.1,
      "valueForMoney": 4,
      "feesAffordability": 3.2,
      "campusLife": 3.6,
      "researchOpportunities": 3.8,
      "hostelFacilities": 3.5,
      "overall": 4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 250000,
        "merit": 80,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Software Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 250000,
        "merit": 79,
        "description": "Systematic application of engineering principles to the design, development, maintenance, and testing of complex software systems.",
        "scope": "Massive demand in global tech startups, software houses, and corporate IT divisions.",
        "careerPaths": [
          "Full-Stack Developer",
          "DevOps Engineer",
          "QA Automation Engineer",
          "Software Architect"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Software Engineering, Master of Engineering Management"
      },
      {
        "name": "Cyber Security",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 250000,
        "merit": 78,
        "description": "Focuses on cryptography, threat assessment, secure coding protocols, digital forensics, and network penetration testing.",
        "scope": "Critical necessity for global banking, defence systems, ecommerce, and national security grids.",
        "careerPaths": [
          "Certified Ethical Hacker",
          "Security Operations Lead",
          "Information Auditor",
          "Forensic Analyst"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Cyber Security, Industry standard certifications (CISSP, CEH)"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 100,
        "fee": 260000,
        "merit": 72,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      },
      {
        "name": "Mechanical Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 100,
        "fee": 260000,
        "merit": 70,
        "description": "Deals with the design, thermal analysis, manufacturing, and maintenance of machines, engines, and mechanical systems.",
        "scope": "Vast industrial applications in automotive, aerospace, heating/cooling systems, and robotics.",
        "careerPaths": [
          "Design Engineer",
          "Automotive Specialist",
          "Manufacturing Consultant",
          "Maintenance Manager"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Mechanical Engineering, robotics, materials science, or fluid dynamics"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 120,
        "fee": 240000,
        "merit": 68,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "FSc/ICS with 60%+",
      "Air University Admission Test (AUAT)",
      "CNIC/B-Form"
    ],
    "howToApply": [
      "Apply via au.edu.pk admissions",
      "Pay test fee and appear for AUAT",
      "Check merit lists"
    ],
    "contacts": {
      "phone": "+92-51-9262-6100",
      "email": "admissions@au.edu.pk",
      "address": "PAF Complex, E-9, Islamabad"
    },
    "admissionCriteria": "Air University Admission Test (AUAT) + Intermediate marks.",
    "degrees": [
      "BS Computer Science",
      "BS Software Engineering",
      "BS Cyber Security",
      "BE Electrical Engineering",
      "BE Mechanical Engineering",
      "BBA"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Islamabad",
        "address": "PAF Complex, E-9, Islamabad",
        "phone": "+92-51-9262-6100"
      }
    ]
  },
  {
    "id": "bu",
    "shortName": "BU",
    "name": "Bahria University",
    "city": "Islamabad",
    "province": "Islamabad",
    "type": "public",
    "ranking": 11,
    "established": 2000,
    "students": 15000,
    "programs": 80,
    "logo": "/logos/bu.png",
    "image": "/covers/bu.jpg",
    "description": "Bahria University is a federal university established by the Pakistan Navy. It operates campuses in Islamabad, Lahore, and Karachi offering courses in engineering, IT, management, and psychology.",
    "website": "https://bahria.edu.pk",
    "fee": {
      "min": 240000,
      "max": 320000
    },
    "tags": [
      "Engineering",
      "Computing",
      "Management",
      "Psychology"
    ],
    "admissionOpen": true,
    "deadline": "2025-08-25",
    "generalPerception": "Run by the Pakistan Navy. Offers a very structured, clean, and disciplined atmosphere. Particularly famous for business, computing, and its professional psychology degrees.",
    "pros": [
      "Very safe and secure environment.",
      "Diverse selection of degrees, including psychology and business.",
      "Presence in three major cities.",
      "Active student events and neat campus maintenance."
    ],
    "cons": [
      "Rigid discipline and strict attendance rules.",
      "Medium research impact compared to tech-heavy schools.",
      "Moderate campus area in Islamabad."
    ],
    "ratings": {
      "academicRigor": 4,
      "jobPlacement": 4.1,
      "practicalSkills": 4,
      "sportsLife": 3.5,
      "facultyQuality": 4.1,
      "valueForMoney": 4,
      "feesAffordability": 3,
      "campusLife": 3.8,
      "researchOpportunities": 3.5,
      "hostelFacilities": 3.5,
      "overall": 4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 280000,
        "merit": 75,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Software Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 280000,
        "merit": 74,
        "description": "Systematic application of engineering principles to the design, development, maintenance, and testing of complex software systems.",
        "scope": "Massive demand in global tech startups, software houses, and corporate IT divisions.",
        "careerPaths": [
          "Full-Stack Developer",
          "DevOps Engineer",
          "QA Automation Engineer",
          "Software Architect"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Software Engineering, Master of Engineering Management"
      },
      {
        "name": "Information Technology",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 260000,
        "merit": 70,
        "description": "Detailed study of Information Technology, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 150,
        "fee": 290000,
        "merit": 70,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Professional Psychology",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 240000,
        "merit": 65,
        "description": "Scientific study of human behavioral patterns, cognitive functions, mental health diagnostics, and therapeutic interventions.",
        "scope": "Growing social importance in hospital clinics, rehabilitation clinics, corporate HR departments, and educational setups.",
        "careerPaths": [
          "Clinical Counselor",
          "HR Generalist",
          "Behavioral Therapist",
          "School Psychologist"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Clinical Psychology, MS Applied Psychology"
      }
    ],
    "requirements": [
      "FSc/ICS/A-Levels with 50%+",
      "Bahria University Admission Test"
    ],
    "howToApply": [
      "Apply via bahria.edu.pk online portal",
      "Pay fee, sit for Bahria Admission Test",
      "Interview"
    ],
    "contacts": {
      "phone": "+92-51-9260-0261",
      "email": "admissions@bahria.edu.pk",
      "address": "Shangrila Road, E-8, Islamabad"
    },
    "admissionCriteria": "Bahria admission test + Intermediate marks. 50% minimum in FSc/ICS.",
    "degrees": [
      "BS Computer Science",
      "BS Software Engineering",
      "BS Information Technology",
      "BBA",
      "BS Professional Psychology"
    ],
    "campuses": [
      {
        "name": "Islamabad Campus (Main)",
        "city": "Islamabad",
        "address": "Shangrila Road, E-8, Islamabad",
        "phone": "+92-51-92600261"
      },
      {
        "name": "Karachi Campus",
        "city": "Karachi",
        "address": "13 National Stadium Road, Karachi",
        "phone": "+92-21-99240002"
      },
      {
        "name": "Lahore Campus",
        "city": "Lahore",
        "address": "47-C, Civic Centre, Johar Town, Lahore",
        "phone": "+92-42-99233401"
      }
    ]
  },
  {
    "id": "iiui",
    "shortName": "IIUI",
    "name": "International Islamic University Islamabad",
    "city": "Islamabad",
    "province": "Islamabad",
    "type": "public",
    "ranking": 12,
    "established": 1980,
    "students": 30000,
    "programs": 140,
    "logo": "/logos/iiui.png",
    "image": "/covers/iiui.jpg",
    "description": "IIUI is a federal public university integrating modern education with Islamic values. It has separate male and female campuses and offers programs in engineering, IT, management, social sciences, and Islamic studies.",
    "website": "https://iiu.edu.pk",
    "fee": {
      "min": 80000,
      "max": 160000
    },
    "tags": [
      "Islamic Studies",
      "Engineering",
      "Law",
      "Sciences",
      "Management"
    ],
    "admissionOpen": true,
    "deadline": "2025-09-01",
    "generalPerception": "A unique public university combining conventional professional courses with Islamic studies. Famous for its large international student population and separate campuses for males and females.",
    "pros": [
      "Low tuition fee with public sector backing.",
      "Strong international representation, particularly from Middle East and Africa.",
      "Beautiful main campus adjacent to Faisal Mosque.",
      "Excellent integration of Islamic values in the curriculum."
    ],
    "cons": [
      "Strict separation of male and female campuses.",
      "Campus politics and bureaucratic admin processes.",
      "Vast student size makes registration processes tedious."
    ],
    "ratings": {
      "academicRigor": 4,
      "jobPlacement": 3.8,
      "practicalSkills": 3.7,
      "sportsLife": 3.8,
      "facultyQuality": 4.1,
      "valueForMoney": 4.7,
      "feesAffordability": 4.5,
      "campusLife": 3.5,
      "researchOpportunities": 4,
      "hostelFacilities": 3,
      "overall": 4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 200,
        "fee": 120000,
        "merit": 72,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Software Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 120000,
        "merit": 74,
        "description": "Systematic application of engineering principles to the design, development, maintenance, and testing of complex software systems.",
        "scope": "Massive demand in global tech startups, software houses, and corporate IT divisions.",
        "careerPaths": [
          "Full-Stack Developer",
          "DevOps Engineer",
          "QA Automation Engineer",
          "Software Architect"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Software Engineering, Master of Engineering Management"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 100,
        "fee": 140000,
        "merit": 70,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      },
      {
        "name": "Law (LLB)",
        "degree": "LLB",
        "duration": "5 years",
        "seats": 100,
        "fee": 90000,
        "merit": 75,
        "description": "Comprehensive study of constitutional law, criminal/civil procedures, contract laws, corporate jurisprudence, and human rights.",
        "scope": "Standard qualification for legal practice, corporate counsel, and judicial services (civil judges).",
        "careerPaths": [
          "Corporate Lawyer",
          "Litigation Attorney",
          "Legal Consultant",
          "Civil Judge"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "High",
        "higherStudyOptions": "LLM (Master of Laws), Bar-at-Law, PhD in Law"
      },
      {
        "name": "Islamic Studies",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 50000,
        "merit": 60,
        "description": "Detailed study of Islamic Studies, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "FSc/FA/ICS with 50%+",
      "IIUI Entry Test"
    ],
    "howToApply": [
      "Apply online via iiu.edu.pk admissions",
      "Pay test fee, sit for Entry Test",
      "Submit documents"
    ],
    "contacts": {
      "phone": "+92-51-9019-5000",
      "email": "admissions@iiu.edu.pk",
      "address": "Sector H-10, Islamabad"
    },
    "admissionCriteria": "IIUI Entry Test + Intermediate marks. Open to national and international students.",
    "degrees": [
      "BS Computer Science",
      "BS Software Engineering",
      "BE Electrical Engineering",
      "LLB Law",
      "BS Islamic Studies"
    ],
    "campuses": [
      {
        "name": "Main Campus (H-10)",
        "city": "Islamabad",
        "address": "Sector H-10, Islamabad",
        "phone": "+92-51-9019-5000"
      }
    ]
  },
  {
    "id": "uop",
    "shortName": "UOP",
    "name": "University of Peshawar",
    "city": "Peshawar",
    "province": "KPK",
    "type": "public",
    "ranking": 13,
    "established": 1950,
    "students": 15000,
    "programs": 100,
    "logo": "/logos/uop.png",
    "image": "/covers/uop.jpg",
    "description": "The University of Peshawar is the oldest university in Khyber Pakhtunkhwa, serving as the premier educational institution in the province with a strong reputation in sciences and social sciences.",
    "website": "https://uop.edu.pk",
    "fee": {
      "min": 50000,
      "max": 100000
    },
    "tags": [
      "Sciences",
      "Arts",
      "Pharmacy",
      "Social Sciences"
    ],
    "admissionOpen": true,
    "deadline": "2025-09-15",
    "generalPerception": "The oldest, largest, and most historic center of learning in Khyber Pakhtunkhwa. Fosters a very traditional, heritage-rich academic culture, acting as the intellectual baseline of the province.",
    "pros": [
      "Very low fee structure.",
      "Vast historical campus with rich heritage.",
      "Strongest alumni network in KPK's public sector services.",
      "Respected science and literature departments."
    ],
    "cons": [
      "Active student political unions sometimes lead to strikes.",
      "Administrative processes are slow and bureaucratic.",
      "Hostel infrastructure requires maintenance."
    ],
    "ratings": {
      "academicRigor": 4,
      "jobPlacement": 3.8,
      "practicalSkills": 3.6,
      "sportsLife": 4,
      "facultyQuality": 4.1,
      "valueForMoney": 4.8,
      "feesAffordability": 4.8,
      "campusLife": 3.8,
      "researchOpportunities": 4,
      "hostelFacilities": 2.8,
      "overall": 4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 65000,
        "merit": 72,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Pharmacy",
        "degree": "Pharm.D",
        "duration": "5 years",
        "seats": 80,
        "fee": 90000,
        "merit": 78,
        "description": "Professional studies in drug composition, manufacturing processes, toxicology, drug discovery, and clinical dispensing.",
        "scope": "High placement in pharmaceutical manufacturing, hospital pharmacies, and government health regulatory bodies.",
        "careerPaths": [
          "Industrial Pharmacist",
          "Quality Control Manager",
          "Clinical Pharmacist",
          "Drug Inspector"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "High",
        "higherStudyOptions": "M.Phil in Pharmaceutics, Pharmacology, or Pharmaceutical Chemistry"
      },
      {
        "name": "Physics",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 55000,
        "merit": 68,
        "description": "Studies fundamental properties of nature, mechanics, quantum theory, electrodynamics, and astrophysics research.",
        "scope": "Fundamental science path leading to academic research, theoretical work, and computational modelling.",
        "careerPaths": [
          "Astrophysicist",
          "Quantitative Finance Modeller",
          "Research Associate",
          "Lecturer"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Medium",
        "industryDemand": "Medium",
        "higherStudyOptions": "MS Physics, PhD in Theoretical or Applied Physics"
      },
      {
        "name": "English",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 50000,
        "merit": 70,
        "description": "Detailed study of English, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "FSc/FA/ICS with 45%+",
      "UoP Entry Test / ETEA Test",
      "KP domicile preferred"
    ],
    "howToApply": [
      "Apply via uop.edu.pk online portal",
      "Pay fee, appear for test",
      "Verification at campus"
    ],
    "contacts": {
      "phone": "+92-91-921-6701",
      "email": "info@uop.edu.pk",
      "address": "University Campus, Peshawar"
    },
    "admissionCriteria": "ETEA / UoP entry test + Intermediate marks. KP domicile for merit seats.",
    "degrees": [
      "BS Computer Science",
      "Pharm.D Pharmacy",
      "BS Physics",
      "BS English"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Peshawar",
        "address": "University Campus, Peshawar",
        "phone": "+92-91-921-6701"
      }
    ]
  },
  {
    "id": "uaf",
    "shortName": "UAF",
    "name": "University of Agriculture Faisalabad",
    "city": "Faisalabad",
    "province": "Punjab",
    "type": "public",
    "ranking": 14,
    "established": 1961,
    "students": 20000,
    "programs": 90,
    "logo": "/logos/uaf.png",
    "image": "/covers/uaf.jpg",
    "description": "UAF is Pakistan's largest and top-ranked agricultural university, leading research in agriculture, food sciences, and veterinary sciences.",
    "website": "https://uaf.edu.pk",
    "fee": {
      "min": 40000,
      "max": 110000
    },
    "tags": [
      "Agriculture",
      "Food Sciences",
      "Veterinary",
      "Sciences"
    ],
    "admissionOpen": true,
    "deadline": "2025-09-30",
    "generalPerception": "The premier agricultural university of Pakistan. Noted for its vast experimental fields, strong focus on food security and veterinary sciences, and highly economical studies.",
    "pros": [
      "Nationwide leader in agricultural research and agronomy.",
      "Vast land area with research farms and crop testing units.",
      "Nominal fee structure with extensive scholarship schemes.",
      "Top-class veterinary (DVM) clinical setups."
    ],
    "cons": [
      "Very specialized academic focus; less renowned for mainstream IT/CS.",
      "Traditional administrative structures.",
      "Located away from major industrial corporate offices."
    ],
    "ratings": {
      "academicRigor": 4.1,
      "jobPlacement": 4.2,
      "practicalSkills": 4.3,
      "sportsLife": 4.2,
      "facultyQuality": 4.2,
      "valueForMoney": 4.8,
      "feesAffordability": 4.8,
      "campusLife": 4,
      "researchOpportunities": 4.6,
      "hostelFacilities": 3.5,
      "overall": 4.2
    },
    "programs_list": [
      {
        "name": "Agriculture",
        "degree": "BS",
        "duration": "4 years",
        "seats": 300,
        "fee": 60000,
        "merit": 68,
        "description": "Focuses on crop production, soil sciences, agribusiness management, pest controls, and sustainable farming systems.",
        "scope": "Critical for Pakistan's agrarian economy, food processing firms, and government research departments.",
        "careerPaths": [
          "Agricultural Officer",
          "Farm Supervisor",
          "Agribusiness Consultant",
          "Food inspector"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Agronomy, Plant Pathology, Soil Science"
      },
      {
        "name": "Veterinary Medicine",
        "degree": "DVM",
        "duration": "5 years",
        "seats": 100,
        "fee": 90000,
        "merit": 75,
        "description": "Five-year professional medical training in anatomy, pharmacology, pathology, and clinical diagnosis of human diseases.",
        "scope": "Highest ethical calling with absolute career stability in healthcare, research, and specialized clinical settings.",
        "careerPaths": [
          "Medical Practitioner",
          "Resident Surgeon",
          "Clinical Researcher",
          "Hospital Administrator"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Extreme",
        "industryDemand": "Excellent",
        "higherStudyOptions": "FCPS, FRCS, MD, Master of Public Health"
      },
      {
        "name": "Food Science & Technology",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 70000,
        "merit": 70,
        "description": "Detailed study of Food Science & Technology, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 80000,
        "merit": 74,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      }
    ],
    "requirements": [
      "FSc Pre-Medical / Pre-Engineering with 50%+",
      "UAF Entry Test",
      "CNIC/B-Form"
    ],
    "howToApply": [
      "Apply via uaf.edu.pk portal",
      "Pay challan and sit for entry test",
      "Merit announcement"
    ],
    "contacts": {
      "phone": "+92-41-920-0161",
      "email": "info@uaf.edu.pk",
      "address": "University of Agriculture, Faisalabad"
    },
    "admissionCriteria": "UAF Entry Test + Intermediate marks. 50% in FSc Pre-Medical/Engineering.",
    "degrees": [
      "BS Agriculture",
      "DVM Veterinary Medicine",
      "BS Food Science & Technology",
      "BS Computer Science"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Faisalabad",
        "address": "University of Agriculture, Faisalabad",
        "phone": "+92-41-920-0161"
      }
    ]
  },
  {
    "id": "muet",
    "shortName": "MUET",
    "name": "Mehran University of Engineering and Technology",
    "city": "Jamshoro",
    "province": "Sindh",
    "type": "public",
    "ranking": 15,
    "established": 1963,
    "students": 10000,
    "programs": 55,
    "logo": "/logos/muet.svg",
    "image": "/covers/muet.jpg",
    "description": "MUET is a leading engineering institution in Jamshoro, Sindh, offering a comprehensive range of programs in engineering and technology disciplines.",
    "website": "https://muet.edu.pk",
    "fee": {
      "min": 60000,
      "max": 130000
    },
    "tags": [
      "Engineering",
      "Technology",
      "Sciences"
    ],
    "admissionOpen": true,
    "deadline": "2025-09-20",
    "generalPerception": "A key engineering hub for Sindh. Highly selective for regional quotas, producing quality technical professionals for construction, power, and industrial plants.",
    "pros": [
      "Respected engineering degree with strong industrial recognition in Sindh.",
      "Low fee structure for merit seats.",
      "Affiliated with various international institutions.",
      "Vibrant campus life alongside Sindh University."
    ],
    "cons": [
      "Remote campus location in Jamshoro (away from Karachi center).",
      "Bureaucratic system and old-school campus infrastructure.",
      "Relative lack of tech startups compared to urban centers."
    ],
    "ratings": {
      "academicRigor": 4.1,
      "jobPlacement": 4.1,
      "practicalSkills": 4.1,
      "sportsLife": 4,
      "facultyQuality": 4.2,
      "valueForMoney": 4.7,
      "feesAffordability": 4.7,
      "campusLife": 4,
      "researchOpportunities": 4,
      "hostelFacilities": 3,
      "overall": 4.1
    },
    "programs_list": [
      {
        "name": "Computer Systems Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 120,
        "fee": 100000,
        "merit": 75,
        "description": "Detailed study of Computer Systems Engineering, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Software Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 100,
        "fee": 100000,
        "merit": 76,
        "description": "Systematic application of engineering principles to the design, development, maintenance, and testing of complex software systems.",
        "scope": "Massive demand in global tech startups, software houses, and corporate IT divisions.",
        "careerPaths": [
          "Full-Stack Developer",
          "DevOps Engineer",
          "QA Automation Engineer",
          "Software Architect"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Software Engineering, Master of Engineering Management"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 150,
        "fee": 95000,
        "merit": 74,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      },
      {
        "name": "Civil Engineering",
        "degree": "BE",
        "duration": "4 years",
        "seats": 150,
        "fee": 95000,
        "merit": 75,
        "description": "Focuses on designing, construction, and managing structural public works like bridges, highways, dams, and skyscrapers.",
        "scope": "Vital for public infrastructures, real-estate developers, construction conglomerates, and structural consultants.",
        "careerPaths": [
          "Structural Engineer",
          "Project Site Manager",
          "Transportation Planner",
          "Geotechnical Engineer"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Structural Engineering, Construction Project Management"
      }
    ],
    "requirements": [
      "FSc Pre-Engineering with 60%+",
      "MUET Entry Test / SEET",
      "Sindh domicile preferred"
    ],
    "howToApply": [
      "Apply online via muet.edu.pk",
      "Pay test fee and appear for Entry Test",
      "Merit list announcement"
    ],
    "contacts": {
      "phone": "+92-22-277-1281",
      "email": "registrar@muet.edu.pk",
      "address": "Jamshoro, Sindh 76062"
    },
    "admissionCriteria": "MUET/SEET entry test + FSc Pre-Engineering marks. 60% minimum.",
    "degrees": [
      "BE Computer Systems Engineering",
      "BE Software Engineering",
      "BE Electrical Engineering",
      "BE Civil Engineering"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Jamshoro",
        "address": "Jamshoro, Sindh 76062",
        "phone": "+92-22-277-1281"
      }
    ]
  },
  {
    "id": "iba",
    "shortName": "IBA",
    "name": "Institute of Business Administration",
    "city": "Karachi",
    "province": "Sindh",
    "type": "public",
    "ranking": 16,
    "established": 1955,
    "students": 5000,
    "programs": 30,
    "logo": "/logos/iba.png",
    "image": "/covers/iba.jpg",
    "description": "IBA Karachi is Pakistan's premier business school. Highly recognized for its BBA, MBA, and Computer Science programs, it boasts corporate linkages and an outstanding campus infrastructure.",
    "website": "https://iba.edu.pk",
    "fee": {
      "min": 400000,
      "max": 750000
    },
    "tags": [
      "Business",
      "Computer Science",
      "Economics",
      "Social Sciences"
    ],
    "admissionOpen": true,
    "deadline": "2025-07-31",
    "generalPerception": "Preeminent business school of the country. Possesses an elite corporate network, beautiful modern campus inside Karachi University, and excellent job placement rates.",
    "pros": [
      "Top-class placement cell connecting directly to MNCs and banks.",
      "Vast, highly active corporate alumni network.",
      "Excellent infrastructure with state-of-the-art classrooms and library.",
      "Rigorous academic programs keeping pace with global standards."
    ],
    "cons": [
      "Highly competitive and selective admissions.",
      "Strict attendance policy (minimum 80% is non-negotiable).",
      "Tuition fees are high compared to other public institutions."
    ],
    "ratings": {
      "academicRigor": 4.4,
      "jobPlacement": 4.8,
      "practicalSkills": 4.3,
      "sportsLife": 4,
      "facultyQuality": 4.5,
      "valueForMoney": 3.8,
      "feesAffordability": 2.2,
      "campusLife": 4.5,
      "researchOpportunities": 3.8,
      "hostelFacilities": 4,
      "overall": 4.5
    },
    "programs_list": [
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 200,
        "fee": 750000,
        "merit": 85,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 650000,
        "merit": 87,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Accounting & Finance",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 680000,
        "merit": 84,
        "description": "Studies corporate financial reporting, taxation, commercial audit procedures, accounting information systems, and corporate law.",
        "scope": "Essential for financial accountability, audit firms, commercial banking, and public accounting.",
        "careerPaths": [
          "Corporate Accountant",
          "External/Internal Auditor",
          "Tax Consultant",
          "Financial Controller"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Very High",
        "higherStudyOptions": "CFA, ACCA, MS Finance, MBA"
      },
      {
        "name": "Economics",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 600000,
        "merit": 80,
        "description": "Detailed study of Economics, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "A-Levels/FSc/ICS with strong academics",
      "IBA Aptitude Test",
      "Interview for shortlisted candidates"
    ],
    "howToApply": [
      "Apply via iba.edu.pk admissions portal",
      "Pay application fee of PKR 4,000",
      "Appear for IBA Aptitude Test",
      "Attend interview if shortlisted"
    ],
    "contacts": {
      "phone": "+92-21-3810-4700",
      "email": "admissions@iba.edu.pk",
      "address": "University Road, Karachi 75270"
    },
    "admissionCriteria": "IBA Aptitude Test + Interview. High academic standing required.",
    "degrees": [
      "BBA",
      "BS Computer Science",
      "BS Accounting & Finance",
      "BS Economics"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Karachi",
        "address": "University Road, Karachi",
        "phone": "+92-21-38104700"
      },
      {
        "name": "City Campus",
        "city": "Karachi",
        "address": "Kiyani Shaheed Road, Garden, Karachi",
        "phone": "+92-21-38104701"
      }
    ],
    "reviews": [
      {
        "author": "Mustafa H. (BBA Student)",
        "rating": 5,
        "text": "IBA is the premier business school in the country. The campus at University Road is stunning with modern architecture and green lawns. The placement cell is incredibly active and connects you directly with top multinational companies.",
        "source": "Google Reviews"
      },
      {
        "author": "Rida K. (Computer Science Alumna)",
        "rating": 4.5,
        "text": "Although IBA is famous for business, its CS department is rapidly catching up with excellent faculty and modern labs. The corporate linkage is a massive advantage for all graduates.",
        "source": "Student Portal"
      }
    ]
  },
  {
    "id": "giki",
    "shortName": "GIKI",
    "name": "Ghulam Ishaq Khan Institute of Engineering Sciences and Technology",
    "city": "Topi",
    "province": "KPK",
    "type": "private",
    "ranking": 17,
    "established": 1993,
    "students": 3000,
    "programs": 20,
    "logo": "/logos/giki.png",
    "image": "/covers/giki.jpg",
    "description": "GIK Institute is one of Pakistan's most selective residential engineering universities, located in a beautiful campus in Topi, KP. It is renowned for its engineering rigor and high graduate employability.",
    "website": "https://giki.edu.pk",
    "fee": {
      "min": 950000,
      "max": 950000
    },
    "tags": [
      "Engineering",
      "Sciences",
      "Technology",
      "Residential"
    ],
    "admissionOpen": true,
    "deadline": "2025-08-10",
    "generalPerception": "Elite residential engineering institute. Known for extreme academic rigor and high-bonding campus life, far away from urban hubs in the peaceful Swabi district.",
    "pros": [
      "Outstanding residential life and close student-faculty bonding.",
      "State-of-the-art engineering and computing labs.",
      "Excellent placement record with international headhunting.",
      "Vibrant extracurricular activities and student societies (e.g. SOPHEP)."
    ],
    "cons": [
      "Very expensive tuition and hostel fees.",
      "Remote location (Topi, Swabi) limits urban access and internships.",
      "Severe weather conditions in summers."
    ],
    "ratings": {
      "academicRigor": 4.6,
      "jobPlacement": 4.8,
      "practicalSkills": 4.5,
      "sportsLife": 4.2,
      "facultyQuality": 4.4,
      "valueForMoney": 3.6,
      "feesAffordability": 1.8,
      "campusLife": 4.6,
      "researchOpportunities": 4,
      "hostelFacilities": 4.5,
      "overall": 4.4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 950000,
        "merit": 88,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Artificial Intelligence",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 950000,
        "merit": 88,
        "description": "Covers machine learning models, neural networks, computer vision, natural language processing, and advanced robotics engineering.",
        "scope": "Explosive demand globally in autonomous driving, smart analytics, and high-tech sectors.",
        "careerPaths": [
          "Machine Learning Engineer",
          "NLP Scientist",
          "Computer Vision Specialist",
          "Data Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Artificial Intelligence, PhD in Machine Learning"
      },
      {
        "name": "Computer Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 60,
        "fee": 950000,
        "merit": 85,
        "description": "Detailed study of Computer Engineering, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      },
      {
        "name": "Mechanical Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 950000,
        "merit": 84,
        "description": "Deals with the design, thermal analysis, manufacturing, and maintenance of machines, engines, and mechanical systems.",
        "scope": "Vast industrial applications in automotive, aerospace, heating/cooling systems, and robotics.",
        "careerPaths": [
          "Design Engineer",
          "Automotive Specialist",
          "Manufacturing Consultant",
          "Maintenance Manager"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Mechanical Engineering, robotics, materials science, or fluid dynamics"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 950000,
        "merit": 83,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      }
    ],
    "requirements": [
      "FSc Pre-Engineering / A-Levels with 70%+",
      "GIKI Admission Test",
      "CNIC/B-Form"
    ],
    "howToApply": [
      "Apply via giki.edu.pk admissions",
      "Pay application fee of PKR 5,000",
      "Appear for GIKI Admission Test",
      "Enroll and join residential campus"
    ],
    "contacts": {
      "phone": "+92-938-271-858",
      "email": "admissions@giki.edu.pk",
      "address": "Topi, District Swabi, KP 23640"
    },
    "admissionCriteria": "GIKI Admission Test + FSc marks. Minimum 70% in Pre-Engineering.",
    "degrees": [
      "BS Computer Science",
      "BS Artificial Intelligence",
      "BS Computer Engineering",
      "BS Mechanical Engineering",
      "BS Electrical Engineering"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Topi",
        "address": "Topi, Swabi, KP 23640",
        "phone": "+92-938-271-858"
      }
    ],
    "reviews": [
      {
        "author": "Ali S. (Alumnus)",
        "rating": 4.8,
        "text": "Incredible residential campus. Living away from cities teaches you independence. GIKI network is huge and highly supportive. Strong student societies make the campus life extremely lively.",
        "source": "Google Reviews"
      }
    ]
  },
  {
    "id": "fast",
    "shortName": "FAST-NUCES",
    "name": "FAST National University of Computer and Emerging Sciences",
    "city": "Islamabad",
    "province": "Federal",
    "type": "private",
    "ranking": 18,
    "established": 2000,
    "students": 18000,
    "programs": 50,
    "logo": "/logos/fast.png",
    "image": "/covers/fast.jpg",
    "description": "FAST-NUCES specializes in computing, artificial intelligence, software engineering, and business. Famous for its rigorous coding standards, it produces Pakistan's top tech graduates who lead the national and international tech sector.",
    "website": "https://nu.edu.pk",
    "fee": {
      "min": 352000,
      "max": 352000
    },
    "tags": [
      "Computer Science",
      "AI",
      "Data Science",
      "Engineering",
      "Business"
    ],
    "admissionOpen": true,
    "deadline": "2025-07-15",
    "generalPerception": "Unrivalled coding powerhouse. Famous for creating the most resilient and skilled programming minds in the country. Known for a tough academic curriculum and high local employer demand.",
    "pros": [
      "Industry-wide reputation as the best coding and tech university.",
      "Stellar job placements and immediate corporate hiring.",
      "Intensive hands-on practical coding assignments.",
      "Dispersed across 5 major cities offering broad accessibility."
    ],
    "cons": [
      "Extremely high workload with continuous quizzes/projects.",
      "Very strict absolute grading system (hard to score high GPAs).",
      "Relatively basic campus life and limited sports spaces."
    ],
    "ratings": {
      "academicRigor": 4.8,
      "jobPlacement": 4.9,
      "practicalSkills": 4.8,
      "sportsLife": 2,
      "facultyQuality": 4.2,
      "valueForMoney": 4.2,
      "feesAffordability": 3.2,
      "campusLife": 3,
      "researchOpportunities": 3.5,
      "hostelFacilities": 2.5,
      "overall": 4.4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 400,
        "fee": 352000,
        "merit": 83,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Software Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 250,
        "fee": 352000,
        "merit": 81,
        "description": "Systematic application of engineering principles to the design, development, maintenance, and testing of complex software systems.",
        "scope": "Massive demand in global tech startups, software houses, and corporate IT divisions.",
        "careerPaths": [
          "Full-Stack Developer",
          "DevOps Engineer",
          "QA Automation Engineer",
          "Software Architect"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Software Engineering, Master of Engineering Management"
      },
      {
        "name": "Artificial Intelligence",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 352000,
        "merit": 82,
        "description": "Covers machine learning models, neural networks, computer vision, natural language processing, and advanced robotics engineering.",
        "scope": "Explosive demand globally in autonomous driving, smart analytics, and high-tech sectors.",
        "careerPaths": [
          "Machine Learning Engineer",
          "NLP Scientist",
          "Computer Vision Specialist",
          "Data Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Artificial Intelligence, PhD in Machine Learning"
      },
      {
        "name": "Data Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 120,
        "fee": 352000,
        "merit": 81,
        "description": "Interdisciplinary study of statistics, data mining, predictive algorithms, data visualisations, and database systems.",
        "scope": "Critical for data-driven corporate decision-making, tech giants, financial entities, and marketing firms.",
        "careerPaths": [
          "Data Scientist",
          "Business Intelligence Analyst",
          "Big Data Architect",
          "Data Engineer"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Data Science, Business Analytics"
      },
      {
        "name": "Cyber Security",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 352000,
        "merit": 82,
        "description": "Focuses on cryptography, threat assessment, secure coding protocols, digital forensics, and network penetration testing.",
        "scope": "Critical necessity for global banking, defence systems, ecommerce, and national security grids.",
        "careerPaths": [
          "Certified Ethical Hacker",
          "Security Operations Lead",
          "Information Auditor",
          "Forensic Analyst"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Cyber Security, Industry standard certifications (CISSP, CEH)"
      },
      {
        "name": "Electrical Engineering",
        "degree": "BS",
        "duration": "4 years",
        "seats": 200,
        "fee": 352000,
        "merit": 75,
        "description": "Studies electrical systems, power generation, control systems, signal processing, and micro-electronics manufacturing.",
        "scope": "Core engineering discipline essential for power companies, robotics, hardware design, and telecommunications.",
        "careerPaths": [
          "Power Grid Engineer",
          "Embedded Systems Developer",
          "Control Engineer",
          "Telecom Specialist"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Electrical Engineering, Specialized control or hardware tracks"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 150,
        "fee": 352000,
        "merit": 70,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "FSc Pre-Engineering or ICS with 60%+",
      "FAST Entry Test (NU-FAST) score",
      "MDCAT/NET scores also accepted"
    ],
    "howToApply": [
      "Register at numsis.nu.edu.pk",
      "Fill and submit online form specifying campuses and cities",
      "Pay application fee online or via bank",
      "Appear in FAST Entry Test at nearest center",
      "Check merit lists online"
    ],
    "contacts": {
      "phone": "+92-51-2855-072",
      "email": "admission@nu.edu.pk",
      "address": "A.K. Brohi Road, H-11/4, Islamabad"
    },
    "admissionCriteria": "FAST Entry Test (NU-FAST) + Intermediate marks. 60% minimum in FSc/ICS.",
    "degrees": [
      "BS Computer Science",
      "BS Software Engineering",
      "BS Artificial Intelligence",
      "BS Data Science",
      "BS Cyber Security",
      "BS Electrical Engineering",
      "BBA"
    ],
    "campuses": [
      {
        "name": "Islamabad Campus (Main Campus)",
        "city": "Islamabad",
        "address": "A.K. Brohi Road, H-11/4, Islamabad",
        "phone": "+92-51-111-128-128",
        "email": "admissions.isb@nu.edu.pk",
        "degrees": [
          "BS Computer Science",
          "BS Software Engineering",
          "BS Artificial Intelligence",
          "BS Data Science",
          "BS Cyber Security",
          "BBA"
        ]
      },
      {
        "name": "Lahore Campus",
        "city": "Lahore",
        "address": "Block-B, Faisal Town, Lahore",
        "phone": "+92-42-111-128-128",
        "email": "admissions.lhr@nu.edu.pk",
        "degrees": [
          "BS Computer Science",
          "BS Software Engineering",
          "BS Artificial Intelligence",
          "BS Data Science",
          "BS Electrical Engineering",
          "BBA"
        ]
      },
      {
        "name": "Karachi Campus",
        "city": "Karachi",
        "address": "Shah Latif Town (Main Campus) / Clifton (City Campus), Karachi",
        "phone": "+92-21-111-128-128",
        "email": "admissions.khi@nu.edu.pk",
        "degrees": [
          "BS Computer Science",
          "BS Software Engineering",
          "BS Artificial Intelligence",
          "BS Data Science",
          "BS Cyber Security",
          "BS Electrical Engineering",
          "BBA"
        ]
      },
      {
        "name": "Peshawar Campus",
        "city": "Peshawar",
        "address": "1-A, Sector B-3, Phase V, Hayatabad, Peshawar",
        "phone": "+92-91-111-128-128",
        "email": "admissions.pwr@nu.edu.pk",
        "degrees": [
          "BS Computer Science",
          "BS Software Engineering",
          "BS Electrical Engineering",
          "BBA"
        ]
      },
      {
        "name": "Chiniot-Faisalabad Campus",
        "city": "Faisalabad",
        "address": "Loonaywala, Faisalabad-Sargodha Road, Chiniot-Faisalabad",
        "phone": "+92-41-111-128-128",
        "email": "admissions.cfd@nu.edu.pk",
        "degrees": [
          "BS Computer Science",
          "BS Software Engineering",
          "BS Artificial Intelligence",
          "BS Data Science",
          "BS Electrical Engineering",
          "BBA"
        ]
      }
    ],
    "reviews": [
      {
        "author": "Zainab R. (CS Alumna, Class of 2024)",
        "rating": 5,
        "text": "FAST is a coding bootcamp disguised as a university. The curriculum is extremely up-to-date and practical. If you survive the intense workload and programming projects, you'll find job hunting incredibly easy since employers actively headhunt Fastians.",
        "source": "Google Reviews"
      },
      {
        "author": "Ali K. (Software Engineering Student)",
        "rating": 4,
        "text": "Academic pressure is very high. Quizzes and assignments are endless, and maintaining a GPA above 3.0 is a struggle. But the problem-solving and programming skills you build here are unmatched in Pakistan.",
        "source": "Reddit Community"
      },
      {
        "author": "Hamza T. (Data Science Alumnus)",
        "rating": 4.5,
        "text": "Grading is very strict, which can make it hard to get admission in foreign graduate programs. However, for local job placements, it is hands down the best. You learn resilience and raw coding power.",
        "source": "EduOpinions"
      }
    ]
  },
  {
    "id": "uhs",
    "shortName": "UHS",
    "name": "University of Health Sciences Lahore",
    "city": "Lahore",
    "province": "Punjab",
    "type": "public",
    "ranking": 19,
    "established": 2002,
    "students": 5000,
    "programs": 35,
    "logo": "/logos/uhs.png",
    "image": "/covers/uhs.jpg",
    "description": "UHS Lahore is Pakistan's leading health sciences university, serving as the examination and regulatory body for all medical and dental colleges in Punjab. It conducts the MDCAT and offers postgraduate medical programs.",
    "website": "https://uhs.edu.pk",
    "fee": {
      "min": 80000,
      "max": 400000
    },
    "tags": [
      "Medicine",
      "Dental",
      "Health Sciences",
      "Pharmacy"
    ],
    "admissionOpen": true,
    "deadline": "2025-10-15",
    "generalPerception": "The regulatory and testing authority for medical colleges in Punjab. Highly structured medical curriculum, overseeing MDCAT admissions and final MBBS/BDS examinations.",
    "pros": [
      "Directly regulates all Punjab public medical college credentials.",
      "Highly recognized medical and dental qualifications.",
      "Nominal fee structure for merit seats in public sector affiliates.",
      "Comprehensive syllabus guidelines."
    ],
    "cons": [
      "Purely academic/examination body; main campus has limited student life.",
      "Sluggish administrative and result processing.",
      "Very high competition for MDCAT admission seats."
    ],
    "ratings": {
      "academicRigor": 4.5,
      "jobPlacement": 4.8,
      "practicalSkills": 4.5,
      "sportsLife": 2.5,
      "facultyQuality": 4.3,
      "valueForMoney": 4.8,
      "feesAffordability": 4.8,
      "campusLife": 2.8,
      "researchOpportunities": 4,
      "hostelFacilities": 3,
      "overall": 4.2
    },
    "programs_list": [
      {
        "name": "Medicine & Surgery",
        "degree": "MBBS",
        "duration": "5 years",
        "seats": 100,
        "fee": 80000,
        "merit": 91,
        "description": "Five-year professional medical training in anatomy, pharmacology, pathology, and clinical diagnosis of human diseases.",
        "scope": "Highest ethical calling with absolute career stability in healthcare, research, and specialized clinical settings.",
        "careerPaths": [
          "Medical Practitioner",
          "Resident Surgeon",
          "Clinical Researcher",
          "Hospital Administrator"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Extreme",
        "industryDemand": "Excellent",
        "higherStudyOptions": "FCPS, FRCS, MD, Master of Public Health"
      },
      {
        "name": "Dental Sciences",
        "degree": "BDS",
        "duration": "4 years",
        "seats": 50,
        "fee": 80000,
        "merit": 88,
        "description": "Professional degree in dental surgery focusing on oral anatomy, orthodontics, oral surgeries, and root canal procedures.",
        "scope": "lucrative field in private dental clinical practice and public hospital units.",
        "careerPaths": [
          "Dentist",
          "Orthodontist",
          "Maxillofacial Surgeon",
          "Oral Pathologist"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Extreme",
        "industryDemand": "High",
        "higherStudyOptions": "MDS (Master of Dental Surgery), FCPS"
      },
      {
        "name": "Pharmacy",
        "degree": "Pharm.D",
        "duration": "5 years",
        "seats": 60,
        "fee": 120000,
        "merit": 80,
        "description": "Professional studies in drug composition, manufacturing processes, toxicology, drug discovery, and clinical dispensing.",
        "scope": "High placement in pharmaceutical manufacturing, hospital pharmacies, and government health regulatory bodies.",
        "careerPaths": [
          "Industrial Pharmacist",
          "Quality Control Manager",
          "Clinical Pharmacist",
          "Drug Inspector"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "High",
        "higherStudyOptions": "M.Phil in Pharmaceutics, Pharmacology, or Pharmaceutical Chemistry"
      },
      {
        "name": "Nursing",
        "degree": "BS",
        "duration": "4 years",
        "seats": 80,
        "fee": 100000,
        "merit": 75,
        "description": "Focuses on patient care, clinical nursing practices, medical support, healthcare ethics, and community health management.",
        "scope": "High demand in healthcare systems globally with massive opportunities for migration to UK, US, and Middle East.",
        "careerPaths": [
          "Registered Nurse",
          "Nursing Supervisor",
          "Public Health Officer",
          "Clinical Instructor"
        ],
        "difficultyLevel": "Medium-High",
        "practicalExposure": "Extreme",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Nursing, Health Administration"
      }
    ],
    "requirements": [
      "FSc Pre-Medical with 65%+",
      "MDCAT score",
      "CNIC/B-Form",
      "Domicile Certificate"
    ],
    "howToApply": [
      "Apply via uhs.edu.pk portal",
      "Appear for MDCAT",
      "Select medical college preferences",
      "Merit publication"
    ],
    "contacts": {
      "phone": "+92-42-9923-1304",
      "email": "info@uhs.edu.pk",
      "address": "Khayaban-e-Jamia Punjab, Lahore"
    },
    "admissionCriteria": "MDCAT + FSc Pre-Medical marks. UHS conducts the entrance exam for all Punjab medical admissions.",
    "degrees": [
      "MBBS",
      "BDS Dental Sciences",
      "Pharm.D Pharmacy",
      "BS Nursing"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Lahore",
        "address": "Khayaban-e-Jamia Punjab, Lahore",
        "phone": "+92-42-9923-1304"
      }
    ]
  },
  {
    "id": "bzu",
    "shortName": "BZU",
    "name": "Bahauddin Zakariya University",
    "city": "Multan",
    "province": "Punjab",
    "type": "public",
    "ranking": 20,
    "established": 1975,
    "students": 25000,
    "programs": 120,
    "logo": "/logos/bzu.png",
    "image": "/covers/bzu.jpg",
    "description": "BZU Multan is one of the largest public universities in Southern Punjab, serving as the premier center of higher learning in the region across sciences, humanities, agriculture, and engineering.",
    "website": "https://bzu.edu.pk",
    "fee": {
      "min": 45000,
      "max": 110000
    },
    "tags": [
      "Sciences",
      "Arts",
      "Agriculture",
      "Engineering"
    ],
    "admissionOpen": true,
    "deadline": "2025-09-30",
    "generalPerception": "The primary educational pillar of Southern Punjab. Offers massive and diverse departments in a vast campus, though campus discipline suffers from political activity.",
    "pros": [
      "Low cost of education (extremely economical).",
      "Very strong brand name in Southern Punjab region.",
      "Vast campus grounds with active sports activities.",
      "Strong research in agricultural sciences."
    ],
    "cons": [
      "Administrative processes are slow.",
      "Frequent political issues and strikes.",
      "Hostel amenities require renovation."
    ],
    "ratings": {
      "academicRigor": 4,
      "jobPlacement": 3.8,
      "practicalSkills": 3.6,
      "sportsLife": 4.2,
      "facultyQuality": 4,
      "valueForMoney": 4.7,
      "feesAffordability": 4.7,
      "campusLife": 3.8,
      "researchOpportunities": 4,
      "hostelFacilities": 3,
      "overall": 4
    },
    "programs_list": [
      {
        "name": "Computer Science",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 75000,
        "merit": 72,
        "description": "Core study of computation, algorithmic processes, software design, artificial intelligence, and database architectures.",
        "scope": "High-growth sector leading the global digital transformation across all industries.",
        "careerPaths": [
          "Software Engineer",
          "AI/ML Engineer",
          "Data Analyst",
          "Systems Architect"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "Very High",
        "industryDemand": "Excellent",
        "higherStudyOptions": "MS Computer Science, PhD in Computing, Specialized AI/Data Science tracks"
      },
      {
        "name": "Pharmacy",
        "degree": "Pharm.D",
        "duration": "5 years",
        "seats": 80,
        "fee": 95000,
        "merit": 78,
        "description": "Professional studies in drug composition, manufacturing processes, toxicology, drug discovery, and clinical dispensing.",
        "scope": "High placement in pharmaceutical manufacturing, hospital pharmacies, and government health regulatory bodies.",
        "careerPaths": [
          "Industrial Pharmacist",
          "Quality Control Manager",
          "Clinical Pharmacist",
          "Drug Inspector"
        ],
        "difficultyLevel": "High",
        "practicalExposure": "High",
        "industryDemand": "High",
        "higherStudyOptions": "M.Phil in Pharmaceutics, Pharmacology, or Pharmaceutical Chemistry"
      },
      {
        "name": "Physics",
        "degree": "BS",
        "duration": "4 years",
        "seats": 100,
        "fee": 55000,
        "merit": 65,
        "description": "Studies fundamental properties of nature, mechanics, quantum theory, electrodynamics, and astrophysics research.",
        "scope": "Fundamental science path leading to academic research, theoretical work, and computational modelling.",
        "careerPaths": [
          "Astrophysicist",
          "Quantitative Finance Modeller",
          "Research Associate",
          "Lecturer"
        ],
        "difficultyLevel": "Very High",
        "practicalExposure": "Medium",
        "industryDemand": "Medium",
        "higherStudyOptions": "MS Physics, PhD in Theoretical or Applied Physics"
      },
      {
        "name": "Agriculture",
        "degree": "BS",
        "duration": "4 years",
        "seats": 150,
        "fee": 50000,
        "merit": 62,
        "description": "Focuses on crop production, soil sciences, agribusiness management, pest controls, and sustainable farming systems.",
        "scope": "Critical for Pakistan's agrarian economy, food processing firms, and government research departments.",
        "careerPaths": [
          "Agricultural Officer",
          "Farm Supervisor",
          "Agribusiness Consultant",
          "Food inspector"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "High",
        "industryDemand": "Good",
        "higherStudyOptions": "MS Agronomy, Plant Pathology, Soil Science"
      },
      {
        "name": "Business Administration",
        "degree": "BBA",
        "duration": "4 years",
        "seats": 120,
        "fee": 65000,
        "merit": 68,
        "description": "Detailed study of Business Administration, focusing on core principles and practical skills.",
        "scope": "Fosters wide career opportunities in local and international fields.",
        "careerPaths": [
          "General Practitioner",
          "Researcher",
          "Field Analyst"
        ],
        "difficultyLevel": "Medium",
        "practicalExposure": "Medium",
        "industryDemand": "Good",
        "higherStudyOptions": "MS in relevant discipline"
      }
    ],
    "requirements": [
      "Intermediate with 45%+",
      "BZU Entry Test",
      "CNIC/B-Form"
    ],
    "howToApply": [
      "Apply online via bzu.edu.pk portal",
      "Pay fee challan and sit for Entry Test",
      "Merit lists check"
    ],
    "contacts": {
      "phone": "+92-61-9210-067",
      "email": "info@bzu.edu.pk",
      "address": "Bosan Road, Multan 60800"
    },
    "admissionCriteria": "BZU Entry Test + Intermediate marks. 45% minimum in relevant subjects.",
    "degrees": [
      "BS Computer Science",
      "Pharm.D Pharmacy",
      "BS Physics",
      "BS Agriculture",
      "BBA"
    ],
    "campuses": [
      {
        "name": "Main Campus",
        "city": "Multan",
        "address": "Bosan Road, Multan 60800",
        "phone": "+92-61-9210-067"
      }
    ]
  }
];
