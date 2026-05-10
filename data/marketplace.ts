export interface MarketplaceRequest {
  id: string;
  title: string;
  description: string;
  subject: string;
  university: string;
  degree: string;
  budget: number;
  deadline: string;
  status: 'open' | 'in-progress' | 'closed';
  student: {
    id: string;
    name: string;
    avatar: string;
    university: string;
    rating: number;
  };
  bids: Bid[];
  postedAt: string;
  tags: string[];
  sessionType: 'online' | 'in-person' | 'both';
  duration: string;
}

export interface Bid {
  id: string;
  requestId: string;
  tutor: {
    id: string;
    name: string;
    avatar: string;
    university: string;
    rating: number;
    completedSessions: number;
    expertise: string[];
  };
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  postedAt: string;
}

export const marketplaceRequests: MarketplaceRequest[] = [
  {
    id: 'mr001',
    title: 'Need help with DSA — Trees and Graph Algorithms',
    description: 'Struggling with tree traversal, BFS/DFS, and Dijkstra\'s algorithm. Need a tutor who can explain these topic clearly with examples. Preferably someone from NUST or FAST who has done the same course.',
    subject: 'Data Structures & Algorithms',
    university: 'NUST',
    degree: 'BS Computer Science',
    budget: 2500,
    deadline: '2025-05-15',
    status: 'open',
    student: {
      id: 'u001',
      name: 'Ali Hassan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali&backgroundColor=0f0f1a',
      university: 'NUST',
      rating: 4.5,
    },
    bids: [
      {
        id: 'b001',
        requestId: 'mr001',
        tutor: {
          id: 'u010',
          name: 'Omar Farooq',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar&backgroundColor=0f0f1a',
          university: 'NUST',
          rating: 4.9,
          completedSessions: 87,
          expertise: ['DSA', 'C++', 'Algorithms'],
        },
        amount: 2200,
        message: 'I scored A+ in DSA under Dr. Asim Karim and have tutored 20+ students. I can cover trees, graphs, and DP in 2 sessions with handouts.',
        status: 'pending',
        postedAt: '2025-04-20T10:30:00Z',
      },
      {
        id: 'b002',
        requestId: 'mr001',
        tutor: {
          id: 'u011',
          name: 'Zara Malik',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&backgroundColor=0f0f1a',
          university: 'FAST-NUCES',
          rating: 4.7,
          completedSessions: 54,
          expertise: ['Algorithms', 'Python', 'Java'],
        },
        amount: 2500,
        message: 'I help students from all universities with DSA. I have custom slides for graphs and trees with 50+ practice problems. Can start tomorrow.',
        status: 'pending',
        postedAt: '2025-04-20T12:15:00Z',
      },
    ],
    postedAt: '2025-04-20T09:00:00Z',
    tags: ['DSA', 'Graphs', 'Trees', 'BFS', 'DFS'],
    sessionType: 'online',
    duration: '2 sessions (2 hrs each)',
  },
  {
    id: 'mr002',
    title: 'LUMS Algorithms Design — need help before finals',
    description: 'Finals in 3 weeks. Need someone who has taken this exact course at LUMS and knows what Dr. Qazi focuses on in the exam. Topics: DP, Greedy, Network Flow.',
    subject: 'Algorithm Design',
    university: 'LUMS',
    degree: 'BS Computer Science',
    budget: 4000,
    deadline: '2025-05-20',
    status: 'open',
    student: {
      id: 'u002',
      name: 'Hina Baig',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hina&backgroundColor=0f0f1a',
      university: 'LUMS',
      rating: 4.8,
    },
    bids: [
      {
        id: 'b003',
        requestId: 'mr002',
        tutor: {
          id: 'u012',
          name: 'Asad Javed',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Asad&backgroundColor=0f0f1a',
          university: 'LUMS',
          rating: 5.0,
          completedSessions: 120,
          expertise: ['Algorithms', 'DP', 'LUMS Courses'],
        },
        amount: 3500,
        message: 'LUMS CS grad here. Took Dr. Qazi\'s course and scored A+. I know exactly what he tests — will share past exam analysis + concept notes.',
        status: 'pending',
        postedAt: '2025-04-21T08:00:00Z',
      },
    ],
    postedAt: '2025-04-21T07:00:00Z',
    tags: ['Algorithms', 'DP', 'Greedy', 'LUMS', 'Finals Prep'],
    sessionType: 'both',
    duration: '4 sessions',
  },
  {
    id: 'mr003',
    title: 'Need Calculus tutor — FAST Karachi student',
    description: 'Struggling with integration by parts, improper integrals, and multivariable calculus. Need patient tutor who can explain step by step. Prefer female tutor.',
    subject: 'Calculus',
    university: 'FAST-NUCES',
    degree: 'BS Computer Science',
    budget: 1500,
    deadline: '2025-05-10',
    status: 'in-progress',
    student: {
      id: 'u003',
      name: 'Sara Khan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaraK&backgroundColor=0f0f1a',
      university: 'FAST-NUCES',
      rating: 4.2,
    },
    bids: [
      {
        id: 'b004',
        requestId: 'mr003',
        tutor: {
          id: 'u013',
          name: 'Amna Riaz',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amna&backgroundColor=0f0f1a',
          university: 'University of Punjab',
          rating: 4.8,
          completedSessions: 65,
          expertise: ['Calculus', 'Mathematics', 'Physics'],
        },
        amount: 1400,
        message: 'Mathematics major here. I specialize in Calculus and have helped 30+ students. Can cover all your topics in 3 focused sessions.',
        status: 'accepted',
        postedAt: '2025-04-19T14:00:00Z',
      },
    ],
    postedAt: '2025-04-18T10:00:00Z',
    tags: ['Calculus', 'Integration', 'Multivariable'],
    sessionType: 'online',
    duration: '3 sessions',
  },
  {
    id: 'mr004',
    title: 'Database Systems assignment help — ER diagrams + SQL',
    description: 'Got a major assignment due in 5 days. Need someone who can review my ER diagram and help write efficient SQL queries. Not looking for someone to do it for me — I want to learn.',
    subject: 'Database Systems',
    university: 'COMSATS',
    degree: 'BS Computer Science',
    budget: 1800,
    deadline: '2025-04-28',
    status: 'open',
    student: {
      id: 'u004',
      name: 'Raza Ul Haq',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raza&backgroundColor=0f0f1a',
      university: 'COMSATS',
      rating: 3.9,
    },
    bids: [
      {
        id: 'b005',
        requestId: 'mr004',
        tutor: {
          id: 'u014',
          name: 'Bilal Ahmed',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal&backgroundColor=0f0f1a',
          university: 'NUST',
          rating: 4.6,
          completedSessions: 39,
          expertise: ['Databases', 'SQL', 'PostgreSQL'],
        },
        amount: 1600,
        message: 'Database developer here. Can review your ER diagram and teach query optimization with real examples. Will ensure you understand every step.',
        status: 'pending',
        postedAt: '2025-04-22T09:30:00Z',
      },
      {
        id: 'b006',
        requestId: 'mr004',
        tutor: {
          id: 'u015',
          name: 'Nida Iqbal',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nida&backgroundColor=0f0f1a',
          university: 'COMSATS',
          rating: 4.5,
          completedSessions: 28,
          expertise: ['Databases', 'SQL', 'COMSATS Courses'],
        },
        amount: 1800,
        message: 'I took this exact course at COMSATS — I know the instructor\'s style. Will help you perfect the ER diagram and review your SQL.',
        status: 'pending',
        postedAt: '2025-04-22T11:00:00Z',
      },
    ],
    postedAt: '2025-04-22T08:00:00Z',
    tags: ['Databases', 'SQL', 'ER Diagram', 'Assignment'],
    sessionType: 'online',
    duration: '1 session (3 hrs)',
  },
  {
    id: 'mr005',
    title: 'Digital Logic Design — need tutor for weekly sessions',
    description: 'Looking for a long-term tutor for DLD. I need weekly sessions to keep up with labs and theory. Seeking someone experienced with Karnaugh maps, FSMs, and VHDL.',
    subject: 'Digital Logic Design',
    university: 'UET Lahore',
    degree: 'BS Electrical Engineering',
    budget: 3000,
    deadline: '2025-06-30',
    status: 'open',
    student: {
      id: 'u005',
      name: 'Hamza Siddiqui',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hamza&backgroundColor=0f0f1a',
      university: 'UET Lahore',
      rating: 4.1,
    },
    bids: [],
    postedAt: '2025-04-22T06:00:00Z',
    tags: ['DLD', 'Karnaugh Maps', 'FSM', 'VHDL', 'Weekly Sessions'],
    sessionType: 'in-person',
    duration: 'Weekly (8 weeks)',
  },
];

export const tutorProfiles = [
  {
    id: 'u010',
    name: 'Omar Farooq',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar&backgroundColor=0f0f1a',
    university: 'NUST',
    degree: 'BS Computer Science',
    role: 'tutor',
    rating: 4.9,
    completedSessions: 87,
    expertise: ['Data Structures', 'Algorithms', 'C++', 'Python'],
    bio: 'CGPA 3.9 CS student at NUST. Passionate about teaching and have helped 50+ students improve their grades. My sessions are structured, engaging, and results-driven.',
    hourlyRate: 1100,
    languages: ['Urdu', 'English'],
    joinedAt: '2023-08-01',
    totalEarnings: 95700,
    responseTime: '< 1 hour',
    verified: true,
  },
  {
    id: 'u011',
    name: 'Zara Malik',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&backgroundColor=0f0f1a',
    university: 'FAST-NUCES',
    degree: 'BS Computer Science',
    role: 'tutor',
    rating: 4.7,
    completedSessions: 54,
    expertise: ['Algorithms', 'Python', 'Java', 'OOP'],
    bio: 'Final year CS student at FAST. I love breaking complex topics into simple explanations. Specializing in algorithms, OOP, and Python.',
    hourlyRate: 1000,
    languages: ['Urdu', 'English'],
    joinedAt: '2023-11-15',
    totalEarnings: 54000,
    responseTime: '< 2 hours',
    verified: true,
  },
];
