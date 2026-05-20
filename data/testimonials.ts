import { GraduationCap, Users, Building2, BookOpen } from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  university: string;
  degree: string;
  year: string;
  avatar: string;
  rating: number;
  text: string;
  role: 'student' | 'tutor';
  subject?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1', name: 'Ahmed Raza', university: 'NUST', degree: 'BS Computer Science', year: '3rd Year',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=1a1a35',
    rating: 5, role: 'student',
    text: 'Tute saved my DSA grade. I found notes, past papers, and a tutor all in one place. The bidding system helped me get help at a price I could afford.',
  },
  {
    id: 't2', name: 'Fatima Malik', university: 'LUMS', degree: 'BBA', year: '2nd Year',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=1a1a35',
    rating: 5, role: 'tutor', subject: 'Financial Accounting',
    text: 'As a tutor, this platform helped me earn while teaching subjects I love. The profile system builds credibility and students trust verified tutors.',
  },
  {
    id: 't3', name: 'Hassan Ali', university: 'FAST-NUCES', degree: 'BS Software Engineering', year: '4th Year',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan&backgroundColor=1a1a35',
    rating: 5, role: 'student',
    text: 'The resource hub is incredibly organized. I can filter by university, course, and instructor. Got 12 past papers before my finals.',
  },
  {
    id: 't4', name: 'Zainab Sheikh', university: 'University of Punjab', degree: 'BS Mathematics', year: '1st Year',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab&backgroundColor=1a1a35',
    rating: 4, role: 'student',
    text: 'I was confused about which university to apply to. The University Hub gave me a clear comparison of all programs, fees, and deadlines.',
  },
  {
    id: 't5', name: 'Usman Tariq', university: 'COMSATS', degree: 'BS Computer Science', year: '3rd Year',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Usman&backgroundColor=1a1a35',
    rating: 5, role: 'student',
    text: 'I posted a request for help with Machine Learning and got 5 bids within an hour. Found a great tutor who explained everything clearly.',
  },
  {
    id: 't6', name: 'Sara Aslam', university: 'NUST', degree: 'BS Electrical Engineering', year: '4th Year',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara&backgroundColor=1a1a35',
    rating: 5, role: 'tutor', subject: 'Circuit Analysis & Signals',
    text: 'The tutor marketplace is brilliant. I earn PKR 30,000+ monthly tutoring junior students. The platform handles everything professionally.',
  },
];

// Stats with Lucide icons instead of emojis
export const stats = [
  { label: 'Students Enrolled', value: '50,000+', Icon: GraduationCap },
  { label: 'Tutors Available',  value: '3,200+',  Icon: Users },
  { label: 'Universities Listed', value: '120+',  Icon: Building2 },
  { label: 'Resources Shared',  value: '180,000+', Icon: BookOpen },
];
