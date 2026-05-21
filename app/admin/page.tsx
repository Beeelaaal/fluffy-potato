'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Building, Database, ExternalLink, GraduationCap, Plus, RefreshCw, Shield, Trash2, TrendingUp, Users, X, Edit2, CheckCircle, Clock, AlertCircle, Mail, Briefcase, MessageSquare, FileText } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { seedDatabase } from '@/lib/seed';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { normalizeResource } from '@/lib/resources';
import { Resource } from '@/data/resources';
import { degrees, categorizedDegrees } from '@/data/resources';

type Tab = 'overview' | 'users' | 'resources' | 'universities' | 'contacts' | 'careers' | 'chats_bids' | 'blogs';

type AdminUser = { id: string; email?: string; name?: string; role?: string; university?: string; };
type UniDoc = { id: string; name: string; shortName: string; city: string; type: string; programs?: number; description?: string; logoUrl?: string; coverUrl?: string; websiteUrl?: string; deadline?: string; admissionCriteria?: string; degrees?: string[]; };
type RequestDoc = { id: string; title: string; subject: string; budget: number; status: string; studentName?: string; createdAt?: any; bidsCount?: number; };
type ContactDoc = { id: string; name: string; email: string; subject: string; message: string; createdAt?: any; };
type CareerDoc = { id: string; name: string; email: string; phone: string; university: string; whyApply: string; createdAt?: any; };
type ChatDoc = { id: string; requestId: string; requestTitle: string; studentId: string; tutorId: string; studentName: string; tutorName: string; lastMessage: string; lastMessageAt?: any; status: string; };
type BidDoc = { id: string; requestId: string; tutorId: string; tutor: { name: string; university: string; }; amount: number; message: string; status: string; postedAt?: string; };
type BlogDoc = { id: string; title: string; slug: string; excerpt: string; content: string; category: string; authorName: string; date: string; readTime: string; };

const TABS: { id: Tab; label: string; icon: typeof TrendingUp }[] = [
  { id: 'overview',     label: 'Overview',                icon: TrendingUp   },
  { id: 'users',        label: 'Users',                   icon: Users        },
  { id: 'resources',    label: 'Resources',               icon: BookOpen     },
  { id: 'universities', label: 'Universities',            icon: Building     },
  { id: 'contacts',     label: 'Contacts',                icon: Mail         },
  { id: 'careers',      label: 'Careers',                 icon: Briefcase    },
  { id: 'chats_bids',   label: 'Requests, Chats & Bids',  icon: MessageSquare},
  { id: 'blogs',        label: 'Blogs',                   icon: FileText     },
];


const RTYPES: Resource['type'][] = ['notes','past-paper','assignment','timetable','slide','book'];

const emptyRes = { title:'', university:'NUST', degree: degrees[0]??'', course:'', instructor:'', description:'', fileUrl:'', fileType:'PDF', type:'notes' as Resource['type'] };
const emptyUni = { name:'', shortName:'', city:'', type:'public', programs: 0, description:'', logoUrl:'', coverUrl:'', websiteUrl:'', deadline:'', admissionCriteria:'', degrees: [] as string[] };

export default function AdminPage() {
  const { loading, profile } = useProtectedRoute({ requiredRole:'admin', redirectOnRoleMismatch:false });
  const { refetchProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [resources, setResources] = useState<(Resource & { fileUrl?:string })[]>([]);
  const [universities, setUniversities] = useState<UniDoc[]>([]);
  const [requests, setRequests] = useState<RequestDoc[]>([]);
  const [contacts, setContacts] = useState<ContactDoc[]>([]);
  const [careers, setCareers] = useState<CareerDoc[]>([]);
  const [chats, setChats] = useState<ChatDoc[]>([]);
  const [bids, setBids] = useState<BidDoc[]>([]);
  const [blogs, setBlogs] = useState<BlogDoc[]>([]);
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [ok, setOk] = useState<string|null>(null);
  const [err, setErr] = useState<string|null>(null);
  const [resForm, setResForm] = useState(emptyRes);
  const [uniForm, setUniForm] = useState(emptyUni);
  const [showResForm, setShowResForm] = useState(false);
  const [showUniForm, setShowUniForm] = useState(false);
  const [editingResId, setEditingResId] = useState<string|null>(null);
  const [editingUniId, setEditingUniId] = useState<string|null>(null);

  async function load() {
    setBusy(true); setErr(null);
    try {
      const [u,r,un,rq,co,ca,ch,bi,bl] = await Promise.all([
        getDocs(collection(db,'users')),
        getDocs(collection(db,'resources')),
        getDocs(collection(db,'universities')),
        getDocs(collection(db,'marketplace')),
        getDocs(collection(db,'contactSubmissions')),
        getDocs(collection(db,'careerApplications')),
        getDocs(collection(db,'chats')),
        getDocs(collection(db,'bids')),
        getDocs(collection(db,'blogs')),
      ]);
      setUsers(u.docs.map(d=>({id:d.id,...d.data() as any})));
      setResources(r.docs.map(d=>normalizeResource(d.id,d.data())));
      setUniversities(un.docs.map(d=>({id:d.id,...d.data() as any})));
      setRequests(rq.docs.map(d=>({id:d.id,...d.data() as any})));
      setContacts(co.docs.map(d=>({id:d.id,...d.data() as any})));
      setCareers(ca.docs.map(d=>({id:d.id,...d.data() as any})));
      setChats(ch.docs.map(d=>({id:d.id,...d.data() as any})));
      setBids(bi.docs.map(d=>({id:d.id,...d.data() as any})));
      setBlogs(bl.docs.map(d=>({id:d.id,...d.data() as any})));
    } catch(e: any){ setErr(e.message || 'Failed to load data. Check Firestore rules.'); }
    finally{ setBusy(false); }
  }

  useEffect(()=>{ if(profile?.role==='admin') load(); },[profile?.role]);

  async function handleSeed() {
    setSeeding(true); setOk(null); setErr(null);
    try { await seedDatabase(); setOk('Database seeded!'); await load(); }
    catch(e: any){ setErr(e.message || 'Seed failed.'); }
    finally{ setSeeding(false); }
  }

  async function cycleRole(uid:string, cur?:string) {
    const next: Record<string,string> = { student:'tutor', tutor:'admin', admin:'student' };
    try { await updateDoc(doc(db,'users',uid),{role: next[cur||'student']}); await load(); }
    catch(e: any){ setErr(e.message || 'Role update failed.'); }
  }

  async function deleteResource(id:string) {
    if(!confirm('Delete resource?')) return;
    try { await deleteDoc(doc(db,'resources',id)); setOk('Deleted.'); await load(); }
    catch(e: any){ setErr(e.message || 'Delete failed.'); }
  }

  async function saveResource() {
    if(!resForm.title||!resForm.fileUrl){ setErr('Title and File URL required.'); return; }
    setBusy(true); setErr(null);
    try {
      if (editingResId) {
        await updateDoc(doc(db, 'resources', editingResId), {
          ...resForm,
          updatedAt: serverTimestamp()
        });
        setOk('Resource updated!');
      } else {
        await addDoc(collection(db,'resources'),{
          ...resForm, downloads:0, views:0, rating:0,
          uploadedBy: profile?.name||'Admin',
          uploadedByUid: profile?.uid || '',
          createdAt: serverTimestamp(),
        });
        setOk('Resource added!');
      }
      setResForm(emptyRes); setShowResForm(false); setEditingResId(null); await load();
    } catch(e: any){ setErr(e.message || 'Save failed.'); }
    finally{ setBusy(false); }
  }

  async function saveUniversity() {
    if(!uniForm.name||!uniForm.shortName){ setErr('Name and Short Name required.'); return; }
    setBusy(true); setErr(null);
    try {
      const docId = editingUniId || uniForm.shortName.toUpperCase().trim();
      await setDoc(doc(db, 'universities', docId), {
        ...uniForm,
        id: docId,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setOk(editingUniId ? 'University updated!' : 'University added!');
      setUniForm(emptyUni); setShowUniForm(false); setEditingUniId(null); await load();
    } catch(e: any){ setErr(e.message || 'Save failed.'); }
    finally{ setBusy(false); }
  }

  async function deleteUniversity(id:string) {
    if(!confirm('Delete university?')) return;
    try { await deleteDoc(doc(db,'universities',id)); setOk('Deleted.'); await load(); }
    catch(e: any){ setErr(e.message || 'Delete failed.'); }
  }

  async function updateRequestStatus(id:string, status:string) {
    try { await updateDoc(doc(db,'marketplace',id),{status}); setOk(`Status → ${status}`); await load(); }
    catch(e: any){ setErr(e.message || 'Update failed.'); }
  }

  async function deleteContact(id: string) {
    if(!confirm('Delete contact submission?')) return;
    try { await deleteDoc(doc(db,'contactSubmissions',id)); setOk('Submission deleted.'); await load(); }
    catch(e: any){ setErr(e.message || 'Delete failed.'); }
  }

  async function deleteCareer(id: string) {
    if(!confirm('Delete career application?')) return;
    try { await deleteDoc(doc(db,'careerApplications',id)); setOk('Application deleted.'); await load(); }
    catch(e: any){ setErr(e.message || 'Delete failed.'); }
  }

  async function deleteBlog(id: string) {
    if(!confirm('Delete blog post?')) return;
    try { await deleteDoc(doc(db,'blogs',id)); setOk('Blog deleted.'); await load(); }
    catch(e: any){ setErr(e.message || 'Delete failed.'); }
  }

  async function deleteChat(id: string) {
    if(!confirm('Delete chat?')) return;
    try { await deleteDoc(doc(db,'chats',id)); setOk('Chat deleted.'); await load(); }
    catch(e: any){ setErr(e.message || 'Delete failed.'); }
  }

  async function deleteBid(id: string) {
    if(!confirm('Delete bid?')) return;
    try { await deleteDoc(doc(db,'bids',id)); setOk('Bid deleted.'); await load(); }
    catch(e: any){ setErr(e.message || 'Delete failed.'); }
  }

  if(loading) return (
    <div className="flex min-h-screen items-center justify-center pt-28">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-funky-cyan/20 border-t-funky-cyan glow-cyan" />
    </div>
  );

  if(profile?.role!=='admin') return (
    <div className="flex min-h-screen items-center justify-center p-6 pt-28 bg-[#FDFBF7]">
      <div className="glass-card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5C7A]/15">
          <Shield size={30} className="text-[#FF5C7A]" />
        </div>
        <h1 className="mb-3 font-display text-3xl text-[#0B071E] font-black">Access Denied</h1>
        <p className="mb-6 text-[#0B071E]/60 font-semibold">Your role is <span className="font-bold text-[#8B5CF6]">{profile?.role||'(loading…)'}</span>. Admin access required.</p>
        <div className="mb-6 rounded-2xl border border-black/10 bg-black/5 p-4 text-left text-sm text-[#0B071E]/70 font-semibold">
          <p className="mb-1 font-bold text-[#15803D]">Admin Role Activation:</p>
          <p className="text-xs leading-relaxed">Please set <code className="text-[#B45309]">role = &quot;admin&quot;</code> (string) in Firebase Console → Firestore → users → your UID.</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={async () => { setRefreshing(true); await refetchProfile(); setRefreshing(false); }}
            disabled={refreshing}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''}/>
            {refreshing ? 'Checking role…' : 'Refresh Role'}
          </button>
          <Link href="/" className="btn-ghost w-full py-2">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  const stats = [
    { label:'Users', val:users.length, icon:<Users size={22}/>, color:'text-[#06b6d4]', border:'border-[#06b6d4]/20 bg-[#06b6d4]/5' },
    { label:'Resources', val:resources.length, icon:<BookOpen size={22}/>, color:'text-[#10b981]', border:'border-[#10b981]/20 bg-[#10b981]/5' },
    { label:'Universities', val:universities.length, icon:<Building size={22}/>, color:'text-[#f59e0b]', border:'border-[#f59e0b]/20 bg-[#f59e0b]/5' },
    { label:'Requests', val:requests.length, icon:<GraduationCap size={22}/>, color:'text-[#8B5CF6]', border:'border-[#8B5CF6]/20 bg-[#8B5CF6]/5' },
    { label:'Contacts', val:contacts.length, icon:<Mail size={22}/>, color:'text-[#FF5C7A]', border:'border-[#FF5C7A]/20 bg-[#FF5C7A]/5' },
    { label:'Careers', val:careers.length, icon:<Briefcase size={22}/>, color:'text-[#EC4899]', border:'border-[#EC4899]/20 bg-[#EC4899]/5' },
    { label:'Chats/Bids', val:`${chats.length}/${bids.length}`, icon:<MessageSquare size={22}/>, color:'text-[#0ea5e9]', border:'border-[#0ea5e9]/20 bg-[#0ea5e9]/5' },
    { label:'Blogs', val:blogs.length, icon:<FileText size={22}/>, color:'text-[#14b8a6]', border:'border-[#14b8a6]/20 bg-[#14b8a6]/5' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] text-[#0B071E] pt-20">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-black/10 bg-white/40 px-4 pt-8 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="mb-8 px-3">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B5CF6]">Tute</div>
          <div className="font-display text-2xl font-black">Admin Portal</div>
        </div>
        <div className="space-y-1 flex-1 overflow-y-auto pr-1">
          {TABS.map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`sidebar-item w-full ${tab===id?'active':''}`}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
        <div className="pb-8 space-y-2">
          <button onClick={handleSeed} disabled={seeding}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8B5CF6] py-3 text-sm font-black text-white hover:bg-[#7c3aed] transition-all disabled:opacity-60">
            <Database size={15}/> {seeding?'Seeding…':'Seed Firebase'}
          </button>
          <button onClick={load} disabled={busy}
            className="btn-ghost w-full py-2.5 text-xs font-bold border-black/10 text-[#0B071E]">
            <RefreshCw size={13} className={busy?'animate-spin':''}/> Refresh
          </button>
          <Link href="/" className="btn-ghost w-full py-2.5 text-xs text-center block border-black/10 text-[#0B071E]">← Back to Site</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-5 lg:p-8">
        {/* Mobile tabs */}
        <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
          {TABS.map(({id,label})=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${tab===id?'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30':'btn-ghost'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl capitalize font-black">{TABS.find(t=>t.id===tab)?.label}</h1>
          <div className="text-xs text-[#0B071E]/60 font-semibold">Logged in as <span className="text-[#8B5CF6] font-bold">{profile?.email}</span></div>
        </div>

        {ok && <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-semibold"><CheckCircle size={14}/>{ok}<button onClick={()=>setOk(null)} className="ml-auto"><X size={12}/></button></div>}
        {err && <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold"><AlertCircle size={14}/>{err}<button onClick={()=>setErr(null)} className="ml-auto"><X size={12}/></button></div>}

        {/* ── OVERVIEW ── */}
        {tab==='overview' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              {stats.map(s=>(
                <div key={s.label} className={`stat-card border ${s.border}`}>
                  <div className={`mx-auto mb-3 ${s.color}`}>{s.icon}</div>
                  <div className="font-display text-4xl mb-1 font-black text-[#0B071E]">{s.val}</div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-[#0B071E]/40">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <h2 className="font-display text-xl mb-4 font-black text-[#0B071E]">Admin Credentials</h2>
              <div className="space-y-2 text-sm font-mono bg-black/5 rounded-xl p-4 text-[#0B071E]">
                <p><span className="text-[#0B071E]/50 font-semibold">Email:</span> <span className="text-[#8B5CF6] font-bold">admin@tute.pk</span></p>
                <p><span className="text-[#0B071E]/50 font-semibold">Password:</span> <span className="text-[#15803D] font-bold">Tute@2025</span></p>
                <p><span className="text-[#0B071E]/50 font-semibold">Role field:</span> <span className="text-[#B45309] font-bold">role = &quot;admin&quot;</span> in Firestore users collection</p>
              </div>
              <p className="mt-3 text-xs text-[#0B071E]/50 font-semibold">Create this account via Firebase Auth, then set role to admin in Firestore.</p>
            </div>
          </motion.div>
        )}

        {/* ── USERS ── */}
        {tab==='users' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table w-full text-left text-[#0B071E]">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>University</th><th className="text-right">Action</th></tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td className="font-semibold">{u.name||'—'}</td>
                      <td className="text-[#0B071E]/70 font-semibold">{u.email||'—'}</td>
                      <td><span className={u.role==='admin'?'tag-lime':u.role==='tutor'?'tag-orange':'tag-cyan'}>{u.role||'student'}</span></td>
                      <td className="text-[#0B071E]/60 font-semibold">{u.university||'—'}</td>
                      <td className="text-right">
                        <button onClick={()=>cycleRole(u.id,u.role)} className="btn-ghost px-3 py-1.5 text-xs text-[#0B071E] border-black/10">Cycle Role</button>
                      </td>
                    </tr>
                  ))}
                  {users.length===0 && <tr><td colSpan={5} className="py-10 text-center text-[#0B071E]/40 font-semibold">No users. Run Seed Firebase.</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── RESOURCES ── */}
        {tab==='resources' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-5">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingResId(null);
                  setResForm(emptyRes);
                  setShowResForm(!showResForm);
                }} 
                className="btn-primary px-5 py-2.5 text-sm"
              >
                <Plus size={15}/> Add Resource
              </button>
            </div>

            {showResForm && (
              <div className="glass-card p-6">
                <h2 className="font-display text-xl mb-5 font-black text-[#0B071E]">{editingResId ? 'Edit Resource' : 'New Resource'}</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    {label:'Title',    key:'title',      ph:'e.g. DSA Notes'},
                    {label:'Course',   key:'course',     ph:'e.g. Data Structures'},
                    {label:'Instructor',key:'instructor',ph:'e.g. Dr. Ahmed'},
                    {label:'File URL', key:'fileUrl',    ph:'https://...'},
                    {label:'File Type',key:'fileType',   ph:'PDF / LINK'},
                  ].map(({label,key,ph})=>(
                    <div key={key}>
                      <label className="form-label">{label}</label>
                      <input value={(resForm as any)[key]} onChange={e=>setResForm(p=>({...p,[key]:e.target.value}))} placeholder={ph} className="input-field"/>
                    </div>
                  ))}
                  <div>
                    <label className="form-label">Type</label>
                    <select value={resForm.type} onChange={e=>setResForm(p=>({...p,type:e.target.value as Resource['type']}))} className="input-field">
                      {RTYPES.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">University</label>
                    <input value={resForm.university} onChange={e=>setResForm(p=>({...p,university:e.target.value}))} placeholder="NUST" className="input-field"/>
                  </div>
                  <div>
                    <label className="form-label">Degree</label>
                    <select value={resForm.degree} onChange={e=>setResForm(p=>({...p,degree:e.target.value}))} className="input-field">
                      {degrees.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2 xl:col-span-3">
                    <label className="form-label">Description</label>
                    <textarea value={resForm.description} onChange={e=>setResForm(p=>({...p,description:e.target.value}))} rows={3} className="input-field resize-none"/>
                  </div>
                </div>
                <div className="mt-5 flex gap-3 justify-end">
                  <button 
                    onClick={() => {
                      setShowResForm(false);
                      setEditingResId(null);
                      setResForm(emptyRes);
                    }} 
                    className="btn-ghost px-5 py-2.5 text-sm border-black/10 text-[#0B071E]"
                  >
                    Cancel
                  </button>
                  <button onClick={saveResource} disabled={busy} className="btn-primary px-5 py-2.5 text-sm">
                    {editingResId ? 'Update Resource' : 'Save Resource'}
                  </button>
                </div>
              </div>
            )}

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table w-full text-left text-[#0B071E]">
                  <thead><tr><th>Title</th><th>Course</th><th>University</th><th>Type</th><th>URL</th><th className="text-right">Action</th></tr></thead>
                  <tbody>
                    {resources.map(r=>(
                      <tr key={r.id}>
                        <td className="font-semibold max-w-[180px] truncate">{r.title}</td>
                        <td className="text-[#0B071E]/70 font-semibold">{r.course}</td>
                        <td><span className="tag-purple">{r.university}</span></td>
                        <td><span className="tag-cyan">{r.type}</span></td>
                        <td>{r.fileUrl?<a href={r.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#7c3aed] text-xs font-bold">Open<ExternalLink size={11}/></a>:<span className="text-[#0B071E]/30 text-xs">—</span>}</td>
                        <td className="text-right">
                          <button
                            onClick={() => {
                              setResForm({
                                title: r.title,
                                university: r.university,
                                degree: r.degree,
                                course: r.course,
                                instructor: r.instructor || '',
                                description: r.description || '',
                                fileUrl: r.fileUrl || '',
                                fileType: r.fileType || 'PDF',
                                type: r.type
                              });
                              setEditingResId(r.id);
                              setShowResForm(true);
                            }}
                            className="btn-ghost px-3 py-1.5 text-xs mr-2 text-[#8B5CF6] border-black/10 hover:bg-[#8B5CF6]/10"
                          >
                            <Edit2 size={13} className="inline mr-1" />Edit
                          </button>
                          <button onClick={()=>deleteResource(r.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {resources.length===0 && <tr><td colSpan={6} className="py-10 text-center text-[#0B071E]/40 font-semibold">No resources. Add one above or Seed Firebase.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── UNIVERSITIES ── */}
        {tab==='universities' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-5">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingUniId(null);
                  setUniForm(emptyUni);
                  setShowUniForm(!showUniForm);
                }} 
                className="btn-primary px-5 py-2.5 text-sm"
              >
                <Plus size={15}/> Add University
              </button>
            </div>

            {showUniForm && (
              <div className="glass-card p-6">
                <h2 className="font-display text-xl mb-5 font-black text-[#0B071E]">{editingUniId ? 'Edit University' : 'New University'}</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    {label:'Full Name',    key:'name',              ph:'National University of Sciences and Technology'},
                    {label:'Short Name',   key:'shortName',         ph:'NUST'},
                    {label:'City',         key:'city',              ph:'Islamabad'},
                    {label:'Logo URL',     key:'logoUrl',           ph:'https://example.com/logo.png'},
                    {label:'Cover Image URL', key:'coverUrl',       ph:'https://example.com/cover.jpg'},
                    {label:'Website URL',  key:'websiteUrl',        ph:'https://nust.edu.pk'},
                    {label:'App Deadline', key:'deadline',          ph:'2025-08-31'},
                  ].map(({label,key,ph})=>(
                    <div key={key}>
                      <label className="form-label">{label}</label>
                      <input value={(uniForm as any)[key]} onChange={e=>setUniForm(p=>({...p,[key]:e.target.value}))} placeholder={ph} className="input-field"/>
                    </div>
                  ))}
                  <div>
                    <label className="form-label">Type</label>
                    <select value={uniForm.type} onChange={e=>setUniForm(p=>({...p,type:e.target.value}))} className="input-field">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Programs</label>
                    <input type="number" value={uniForm.programs} onChange={e=>setUniForm(p=>({...p,programs:+e.target.value}))} className="input-field"/>
                  </div>
                  <div className="md:col-span-2 xl:col-span-3">
                    <label className="form-label">Description</label>
                    <textarea value={uniForm.description} onChange={e=>setUniForm(p=>({...p,description:e.target.value}))} rows={2} placeholder="Brief description of the university..." className="input-field resize-none"/>
                  </div>
                  <div className="md:col-span-2 xl:col-span-3">
                    <label className="form-label">Admission Criteria</label>
                    <textarea value={uniForm.admissionCriteria} onChange={e=>setUniForm(p=>({...p,admissionCriteria:e.target.value}))} rows={2} placeholder="Minimum marks, entry test details..." className="input-field resize-none"/>
                  </div>
                  
                  <div className="md:col-span-2 xl:col-span-3 border-t border-black/10 pt-5 mt-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-display text-base font-black text-[#0B071E]">Offered Degrees Checklist</h3>
                        <p className="text-xs text-[#0B071E]/50 font-semibold">Select the degree programs offered by this university.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setUniForm(p => ({ ...p, degrees: Object.values(categorizedDegrees).flat() }))}
                          className="px-3 py-1.5 rounded-xl border border-black/10 text-[11px] font-bold hover:bg-black/5 hover:border-black/20 transition-all text-[#0b071e]"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => setUniForm(p => ({ ...p, degrees: [] }))}
                          className="px-3 py-1.5 rounded-xl border border-black/10 text-[11px] font-bold hover:bg-black/5 hover:border-black/20 transition-all text-[#0b071e]"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar border border-black/5 bg-black/[0.01] rounded-2xl p-4">
                      {Object.entries(categorizedDegrees).map(([category, catDegrees]) => {
                        const currentDegrees = uniForm.degrees || [];
                        const checkedCount = catDegrees.filter(d => currentDegrees.includes(d)).length;

                        return (
                          <div key={category} className="rounded-xl border border-black/5 bg-white/50 p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-[#8B5CF6]">{category}</span>
                                {checkedCount > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] font-bold">
                                    {checkedCount} selected
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2 text-[10px] font-bold">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUniForm(p => {
                                      const current = p.degrees || [];
                                      const next = [...new Set([...current, ...catDegrees])];
                                      return { ...p, degrees: next };
                                    });
                                  }}
                                  className="text-[#8B5CF6] hover:underline"
                                >
                                  Select Category
                                </button>
                                <span className="text-black/25">|</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUniForm(p => {
                                      const current = p.degrees || [];
                                      const next = current.filter(d => !catDegrees.includes(d));
                                      return { ...p, degrees: next };
                                    });
                                  }}
                                  className="text-red-500 hover:underline"
                                >
                                  Clear Category
                                </button>
                              </div>
                            </div>
                            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                              {catDegrees.map(deg => {
                                const checked = currentDegrees.includes(deg);
                                return (
                                  <label
                                    key={deg}
                                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer transition-all duration-200 select-none ${
                                      checked
                                        ? 'border-[#8B5CF6]/30 bg-[#8B5CF6]/5 text-[#8B5CF6] font-bold shadow-sm'
                                        : 'border-black/5 bg-white/40 text-[#0B071E]/70 font-semibold hover:border-black/10 hover:bg-white/70'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={e => {
                                        const isChecked = e.target.checked;
                                        setUniForm(p => {
                                          const current = p.degrees || [];
                                          const next = isChecked
                                            ? [...current, deg]
                                            : current.filter(d => d !== deg);
                                          return { ...p, degrees: next };
                                        });
                                      }}
                                      className="mt-0.5 rounded border-black/20 text-[#8B5CF6] focus:ring-[#8B5CF6]/30 cursor-pointer"
                                    />
                                    <span className="text-xs leading-tight">{deg}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex gap-3 justify-end">
                  <button 
                    onClick={() => {
                      setShowUniForm(false);
                      setEditingUniId(null);
                      setUniForm(emptyUni);
                    }} 
                    className="btn-ghost px-5 py-2.5 text-sm border-black/10 text-[#0B071E]"
                  >
                    Cancel
                  </button>
                  <button onClick={saveUniversity} disabled={busy} className="btn-primary px-5 py-2.5 text-sm">
                    {editingUniId ? 'Update University' : 'Save University'}
                  </button>
                </div>
              </div>
            )}

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table w-full text-left text-[#0B071E]">
                  <thead><tr><th>Name</th><th>Short</th><th>City</th><th>Type</th><th>Programs</th><th className="text-right">Action</th></tr></thead>
                  <tbody>
                    {universities.map(u=>(
                      <tr key={u.id}>
                        <td className="font-semibold">{u.name}</td>
                        <td><span className="tag-cyan">{u.shortName}</span></td>
                        <td className="text-[#0B071E]/70 font-semibold">{u.city}</td>
                        <td><span className={u.type==='public'?'tag-lime':'tag-purple'}>{u.type}</span></td>
                        <td className="text-[#0B071E]/70 font-semibold">{u.programs||'—'}</td>
                        <td className="text-right">
                          <button
                            onClick={() => {
                              setUniForm({
                                name: u.name,
                                shortName: u.shortName,
                                city: u.city,
                                type: u.type,
                                programs: u.programs || 0,
                                description: u.description || '',
                                logoUrl: u.logoUrl || '',
                                coverUrl: u.coverUrl || '',
                                websiteUrl: u.websiteUrl || '',
                                deadline: u.deadline || '',
                                admissionCriteria: u.admissionCriteria || '',
                                degrees: u.degrees || []
                              });
                              setEditingUniId(u.id);
                              setShowUniForm(true);
                            }}
                            className="btn-ghost px-3 py-1.5 text-xs mr-2 text-[#8B5CF6] border-black/10 hover:bg-[#8B5CF6]/10"
                          >
                            <Edit2 size={13} className="inline mr-1" />Edit
                          </button>
                          <button onClick={()=>deleteUniversity(u.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {universities.length===0 && <tr><td colSpan={6} className="py-10 text-center text-[#0B071E]/40 font-semibold">No universities. Add one above or Seed Firebase.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}


        {/* ── CONTACT SUBMISSIONS ── */}
        {tab==='contacts' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table w-full text-left text-[#0B071E]">
                <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th className="text-right">Action</th></tr></thead>
                <tbody>
                  {contacts.map(c=>(
                    <tr key={c.id}>
                      <td className="font-semibold">{c.name}</td>
                      <td className="text-[#0B071E]/70 font-semibold">{c.email}</td>
                      <td><span className="tag-purple">{c.subject}</span></td>
                      <td className="max-w-xs truncate text-[#0B071E]/80 font-semibold text-xs" title={c.message}>{c.message}</td>
                      <td className="text-[#0B071E]/60 text-xs font-bold">
                        {c.createdAt?.seconds 
                          ? new Date(c.createdAt.seconds * 1000).toLocaleString('en-PK') 
                          : c.createdAt 
                          ? new Date(c.createdAt).toLocaleString('en-PK')
                          : '—'}
                      </td>
                      <td className="text-right">
                        <button onClick={()=>deleteContact(c.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {contacts.length===0 && <tr><td colSpan={6} className="py-10 text-center text-[#0B071E]/40 font-semibold">No contact submissions found.</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── CAREER APPLICATIONS ── */}
        {tab==='careers' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table w-full text-left text-[#0B071E]">
                <thead><tr><th>Name</th><th>Email / Phone</th><th>University</th><th>Why Apply</th><th>Date</th><th className="text-right">Action</th></tr></thead>
                <tbody>
                  {careers.map(c=>(
                    <tr key={c.id}>
                      <td className="font-semibold">{c.name}</td>
                      <td className="text-[#0B071E]/80 font-semibold text-xs">
                        <div>{c.email}</div>
                        <div className="text-[#0B071E]/50 mt-0.5">{c.phone}</div>
                      </td>
                      <td><span className="tag-cyan">{c.university}</span></td>
                      <td className="max-w-xs truncate text-[#0B071E]/80 font-semibold text-xs" title={c.whyApply}>{c.whyApply}</td>
                      <td className="text-[#0B071E]/60 text-xs font-bold">
                        {c.createdAt?.seconds 
                          ? new Date(c.createdAt.seconds * 1000).toLocaleString('en-PK') 
                          : c.createdAt 
                          ? new Date(c.createdAt).toLocaleString('en-PK')
                          : '—'}
                      </td>
                      <td className="text-right">
                        <button onClick={()=>deleteCareer(c.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {careers.length===0 && <tr><td colSpan={6} className="py-10 text-center text-[#0B071E]/40 font-semibold">No career applications found.</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── CHATS & BIDS ── */}
        {tab==='chats_bids' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-8">
            <div className="glass-card p-6">
              <h2 className="font-display text-xl mb-4 font-black text-[#0B071E] flex items-center gap-2">
                <GraduationCap className="text-[#8B5CF6]" size={20}/>
                Tutor Requests ({requests.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="data-table w-full text-left text-[#0B071E]">
                  <thead><tr><th>Title</th><th>Subject</th><th>Budget</th><th>Student</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
                  <tbody>
                    {requests.map(r=>(
                      <tr key={r.id}>
                        <td className="font-semibold max-w-[160px] truncate">{r.title}</td>
                        <td className="text-[#0B071E]/70 font-semibold">{r.subject}</td>
                        <td className="text-[#15803D] font-bold">PKR {r.budget?.toLocaleString()}</td>
                        <td className="text-[#0B071E]/70 font-semibold">{r.studentName||'—'}</td>
                        <td>
                          <span className={
                            r.status==='open'?'tag-lime':
                            r.status==='in-progress'?'tag-orange':
                            'tag-coral'
                          }>{r.status||'open'}</span>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {r.status!=='open'       && <button onClick={()=>updateRequestStatus(r.id,'open')}        className="btn-ghost px-2.5 py-1.5 text-xs text-[#0B071E] border-black/10">Open</button>}
                            {r.status!=='in-progress'&& <button onClick={()=>updateRequestStatus(r.id,'in-progress')} className="btn-ghost px-2.5 py-1.5 text-xs text-[#0B071E] border-black/10">Progress</button>}
                            {r.status!=='closed'     && <button onClick={()=>updateRequestStatus(r.id,'closed')}      className="btn-danger px-2.5 py-1.5 text-xs">Close</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {requests.length===0 && <tr><td colSpan={6} className="py-10 text-center text-[#0B071E]/40 font-semibold">No marketplace requests. Seed Firebase to add sample data.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl mb-4 font-black text-[#0B071E] flex items-center gap-2">
                <MessageSquare className="text-funky-purple" size={20}/>
                Active Chats ({chats.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="data-table w-full text-left text-[#0B071E]">
                  <thead><tr><th>Request Title</th><th>Student</th><th>Tutor</th><th>Last Message</th><th>Last Msg Time</th><th className="text-right">Action</th></tr></thead>
                  <tbody>
                    {chats.map(c=>(
                      <tr key={c.id}>
                        <td className="font-semibold max-w-[150px] truncate">{c.requestTitle}</td>
                        <td className="text-[#0B071E]/70 font-semibold">{c.studentName}</td>
                        <td className="text-[#0B071E]/70 font-semibold">{c.tutorName}</td>
                        <td className="text-[#0B071E]/60 text-xs italic font-semibold max-w-[150px] truncate">{c.lastMessage}</td>
                        <td className="text-[#0B071E]/60 text-xs font-bold">
                          {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString('en-PK') : '—'}
                        </td>
                        <td className="text-right">
                          <button onClick={()=>deleteChat(c.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {chats.length===0 && <tr><td colSpan={6} className="py-8 text-center text-[#0B071E]/40 font-semibold">No active negotiations/chats.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl mb-4 font-black text-[#0B071E] flex items-center gap-2">
                <TrendingUp className="text-[#0EA5E9]" size={20}/>
                Marketplace Bids ({bids.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="data-table w-full text-left text-[#0B071E]">
                  <thead><tr><th>Tutor</th><th>University</th><th>Amount</th><th>Status</th><th>Message</th><th className="text-right">Action</th></tr></thead>
                  <tbody>
                    {bids.map(b=>(
                      <tr key={b.id}>
                        <td className="font-semibold">{b.tutor?.name || '—'}</td>
                        <td className="text-[#0B071E]/70 font-semibold">{b.tutor?.university || '—'}</td>
                        <td className="text-[#15803D] font-bold">PKR {b.amount?.toLocaleString()}</td>
                        <td>
                          <span className={
                            b.status==='accepted' ? 'tag-lime' :
                            b.status==='rejected' ? 'tag-coral' :
                            'tag-cyan'
                          }>{b.status}</span>
                        </td>
                        <td className="max-w-xs truncate text-[#0B071E]/70 font-semibold text-xs" title={b.message}>{b.message}</td>
                        <td className="text-right">
                          <button onClick={()=>deleteBid(b.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {bids.length===0 && <tr><td colSpan={6} className="py-8 text-center text-[#0B071E]/40 font-semibold">No tutor bids placed yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── BLOGS ── */}
        {tab==='blogs' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-5">
            <div className="flex justify-end">
              <Link href="/blog/write" className="btn-primary px-5 py-2.5 text-sm">
                <Plus size={15}/> Write Blog Post
              </Link>
            </div>
            
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table w-full text-left text-[#0B071E]">
                  <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Read Time</th><th className="text-right">Actions</th></tr></thead>
                  <tbody>
                    {blogs.map(b=>(
                      <tr key={b.id}>
                        <td className="font-semibold max-w-[200px] truncate">{b.title}</td>
                        <td><span className="tag-cyan">{b.category}</span></td>
                        <td className="text-[#0B071E]/70 font-semibold">{b.authorName}</td>
                        <td className="text-[#0B071E]/70 font-semibold">{b.date}</td>
                        <td className="text-[#0B071E]/60 text-xs font-bold">{b.readTime}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a href={`/blog/${b.slug}`} target="_blank" rel="noreferrer" className="btn-ghost px-3 py-1.5 text-xs text-[#8B5CF6] border-black/10 hover:bg-[#8B5CF6]/10 flex items-center gap-1">
                              View <ExternalLink size={12}/>
                            </a>
                            <button onClick={()=>deleteBlog(b.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {blogs.length===0 && <tr><td colSpan={6} className="py-10 text-center text-[#0B071E]/40 font-semibold">No blog posts found. Write one using the button above.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
