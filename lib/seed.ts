import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { resources as sampleResources } from '@/data/resources';

export async function seedDatabase() {
  const batch = writeBatch(db);

  // 1. Users (admin + tutor + student)
  const users = [
    { uid:'admin_main', name:'Admin User',  email:'admin@tute.pk', role:'admin',   university:'NUST', isVerified:true,  photoURL:'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
    { uid:'tutor_001',  name:'Omar Farooq', email:'omar@nust.edu.pk',  role:'tutor',   university:'NUST', isVerified:true,  photoURL:'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar', rating:4.8, sessions:120 },
    { uid:'tutor_002',  name:'Sana Malik',  email:'sana@lums.edu.pk',  role:'tutor',   university:'LUMS', isVerified:true,  photoURL:'https://api.dicebear.com/7.x/avataaars/svg?seed=Sana', rating:4.9, sessions:85 },
    { uid:'student_001',name:'Ali Hassan',  email:'ali@fast.edu.pk',   role:'student', university:'FAST', isVerified:false, photoURL:'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali' },
    { uid:'student_002',name:'Zara Ahmed',  email:'zara@uet.edu.pk',   role:'student', university:'UET',  isVerified:false, photoURL:'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara' },
  ];
  users.forEach(u => batch.set(doc(db,'users',u.uid), u, { merge:true }));

  // 2. Resources
  sampleResources.slice(0,10).forEach(r => {
    batch.set(doc(db,'resources',r.id), {
      ...r,
      fileUrl:'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1',
      previewUrl:'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1',
    }, { merge:true });
  });

  // 3. Universities
  const unis = [
    { name:'National University of Sciences and Technology', shortName:'NUST', city:'Islamabad', type:'public', programs:150, ranking:1, students:15000, established:1991 },
    { name:'Lahore University of Management Sciences', shortName:'LUMS', city:'Lahore', type:'private', programs:80, ranking:2, students:5000, established:1984 },
    { name:'FAST National University', shortName:'FAST', city:'Multiple', type:'private', programs:60, ranking:3, students:12000, established:2000 },
    { name:'University of Engineering and Technology', shortName:'UET', city:'Lahore', type:'public', programs:100, ranking:4, students:20000, established:1921 },
    { name:'Quaid-i-Azam University', shortName:'QAU', city:'Islamabad', type:'public', programs:120, ranking:5, students:18000, established:1967 },
  ];
  unis.forEach(u => batch.set(doc(collection(db,'universities'),u.shortName), u, { merge:true }));

  // 4. Marketplace requests
  const mkRequests = [
    { title:'Need DSA tutor — urgent', subject:'Data Structures', budget:3000, status:'open', studentName:'Ali Hassan', studentId:'student_001', sessionType:'online', duration:'4 sessions', deadline:'2025-06-01', description:'Need help with graphs and dynamic programming.', bidsCount:3 },
    { title:'Linear Algebra help for finals', subject:'Mathematics', budget:2500, status:'in-progress', studentName:'Zara Ahmed', studentId:'student_002', sessionType:'both', duration:'3 sessions', deadline:'2025-06-15', description:'Struggling with eigenvalues and vector spaces.', bidsCount:5 },
    { title:'OOP concepts in Java', subject:'Object Oriented Programming', budget:1800, status:'open', studentName:'Ali Hassan', studentId:'student_001', sessionType:'online', duration:'2 sessions', deadline:'2025-06-20', description:'Need clear explanation of polymorphism and design patterns.', bidsCount:1 },
    { title:'Network security exam prep', subject:'Computer Networks', budget:4000, status:'closed', studentName:'Zara Ahmed', studentId:'student_002', sessionType:'in-person', duration:'5 sessions', deadline:'2025-05-20', description:'Preparing for midterm on network protocols.', bidsCount:7 },
  ];
  mkRequests.forEach((req,i) => batch.set(doc(collection(db,'marketplace'),`req_${i+1}`), req, { merge:true }));

  await batch.commit();
}
