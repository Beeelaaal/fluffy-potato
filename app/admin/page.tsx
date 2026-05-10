'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Building, Database, ExternalLink, GraduationCap, Plus, RefreshCw, Shield, Trash2, TrendingUp, Users, X, Edit2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { seedDatabase } from '@/lib/seed';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { normalizeResource } from '@/lib/resources';
import { Resource } from '@/data/resources';
import { degrees } from '@/data/resources';

type Tab = 'overview' | 'users' | 'resources' | 'universities' | 'requests';

type AdminUser = { id: string; email?: string; name?: string; role?: string; university?: string; };
type UniDoc = { id: string; name: string; shortName: string; city: string; type: string; programs?: number; };
type RequestDoc = { id: string; title: string; subject: string; budget: number; status: string; studentName?: string; createdAt?: any; bidsCount?: number; };

const TABS: { id: Tab; label: string; icon: typeof TrendingUp }[] = [
  { id: 'overview',     label: 'Overview',      icon: TrendingUp   },
  { id: 'users',        label: 'Users',          icon: Users        },
  { id: 'resources',    label: 'Resources',      icon: BookOpen     },
  { id: 'universities', label: 'Universities',   icon: Building     },
  { id: 'requests',     label: 'Tutor Requests', icon: GraduationCap},
];

const RTYPES: Resource['type'][] = ['notes','past-paper','assignment','timetable','slide','book'];

const emptyRes = { title:'', university:'NUST', degree: degrees[0]??'', course:'', instructor:'', description:'', fileUrl:'', fileType:'PDF', type:'notes' as Resource['type'] };
const emptyUni = { name:'', shortName:'', city:'', type:'public', programs: 0 };

export default function AdminPage() {
  const { loading, profile } = useProtectedRoute({ requiredRole:'admin', redirectOnRoleMismatch:false });
  const { refetchProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [resources, setResources] = useState<(Resource & { fileUrl?:string })[]>([]);
  const [universities, setUniversities] = useState<UniDoc[]>([]);
  const [requests, setRequests] = useState<RequestDoc[]>([]);
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [ok, setOk] = useState<string|null>(null);
  const [err, setErr] = useState<string|null>(null);
  const [resForm, setResForm] = useState(emptyRes);
  const [uniForm, setUniForm] = useState(emptyUni);
  const [showResForm, setShowResForm] = useState(false);
  const [showUniForm, setShowUniForm] = useState(false);

  async function load() {
    setBusy(true); setErr(null);
    try {
      const [u,r,un,rq] = await Promise.all([
        getDocs(collection(db,'users')),
        getDocs(collection(db,'resources')),
        getDocs(collection(db,'universities')),
        getDocs(collection(db,'marketplace')),
      ]);
      setUsers(u.docs.map(d=>({id:d.id,...d.data() as any})));
      setResources(r.docs.map(d=>normalizeResource(d.id,d.data())));
      setUniversities(un.docs.map(d=>({id:d.id,...d.data() as any})));
      setRequests(rq.docs.map(d=>({id:d.id,...d.data() as any})));
    } catch(e){ setErr('Failed to load data. Check Firestore rules.'); }
    finally{ setBusy(false); }
  }

  useEffect(()=>{ if(profile?.role==='admin') load(); },[profile?.role]);

  async function handleSeed() {
    setSeeding(true); setOk(null); setErr(null);
    try { await seedDatabase(); setOk('Database seeded!'); await load(); }
    catch(e){ setErr('Seed failed.'); }
    finally{ setSeeding(false); }
  }

  async function cycleRole(uid:string, cur?:string) {
    const next: Record<string,string> = { student:'tutor', tutor:'admin', admin:'student' };
    try { await updateDoc(doc(db,'users',uid),{role: next[cur||'student']}); await load(); }
    catch(e){ setErr('Role update failed.'); }
  }

  async function deleteResource(id:string) {
    if(!confirm('Delete resource?')) return;
    try { await deleteDoc(doc(db,'resources',id)); setOk('Deleted.'); await load(); }
    catch(e){ setErr('Delete failed.'); }
  }

  async function createResource() {
    if(!resForm.title||!resForm.fileUrl){ setErr('Title and File URL required.'); return; }
    setBusy(true); setErr(null);
    try {
      await addDoc(collection(db,'resources'),{
        ...resForm, downloads:0, views:0, rating:0,
        uploadedBy: profile?.name||'Admin',
        createdAt: serverTimestamp(),
      });
      setResForm(emptyRes); setShowResForm(false); setOk('Resource added!'); await load();
    } catch(e){ setErr('Create failed.'); }
    finally{ setBusy(false); }
  }

  async function createUniversity() {
    if(!uniForm.name||!uniForm.shortName){ setErr('Name and Short Name required.'); return; }
    setBusy(true); setErr(null);
    try {
      await addDoc(collection(db,'universities'),{ ...uniForm, createdAt: serverTimestamp() });
      setUniForm(emptyUni); setShowUniForm(false); setOk('University added!'); await load();
    } catch(e){ setErr('Create failed.'); }
    finally{ setBusy(false); }
  }

  async function deleteUniversity(id:string) {
    if(!confirm('Delete university?')) return;
    try { await deleteDoc(doc(db,'universities',id)); setOk('Deleted.'); await load(); }
    catch(e){ setErr('Delete failed.'); }
  }

  async function updateRequestStatus(id:string, status:string) {
    try { await updateDoc(doc(db,'marketplace',id),{status}); setOk(`Status → ${status}`); await load(); }
    catch(e){ setErr('Update failed.'); }
  }

  if(loading) return (
    <div className="flex min-h-screen items-center justify-center pt-28">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-funky-cyan/20 border-t-funky-cyan glow-cyan" />
    </div>
  );

  if(profile?.role!=='admin') return (
    <div className="flex min-h-screen items-center justify-center p-6 pt-28">
      <div className="glass-card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-funky-coral/10 glow-orange">
          <Shield size={30} className="text-funky-coral" />
        </div>
        <h1 className="mb-3 font-display text-3xl">Access Denied</h1>
        <p className="mb-6 text-white/55">Your role is <span className="font-bold text-funky-cyan">{profile?.role||'(loading…)'}</span>. Admin access required.</p>
        <div className="mb-6 rounded-2xl border border-white/10 bg-dark-700/60 p-4 text-left text-sm text-white/50">
          <p className="mb-1 font-bold text-funky-lime">Quick fix steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Visit <a href="/debug" className="text-funky-cyan underline">/debug</a> (while signed in)</li>
            <li>Click <strong className="text-funky-lime">⚡ Force Set role = admin</strong></li>
            <li>Come back here and click <strong className="text-funky-cyan">Refresh Role</strong> below</li>
          </ol>
          <p className="mt-3 text-funky-orange/80 text-xs">OR manually set <code className="text-funky-orange">role = &quot;admin&quot;</code> in Firebase Console → Firestore → users → your UID</p>
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
          <Link href="/debug" className="btn-ghost w-full py-3">Open Debug Page →</Link>
          <Link href="/" className="btn-ghost w-full py-2">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  const stats = [
    { label:'Users', val:users.length, icon:<Users size={22}/>, color:'text-funky-cyan', border:'border-funky-cyan/20' },
    { label:'Resources', val:resources.length, icon:<BookOpen size={22}/>, color:'text-funky-lime', border:'border-funky-lime/20' },
    { label:'Universities', val:universities.length, icon:<Building size={22}/>, color:'text-funky-orange', border:'border-funky-orange/20' },
    { label:'Requests', val:requests.length, icon:<GraduationCap size={22}/>, color:'text-funky-purple', border:'border-funky-purple/20' },
  ];

  return (
    <div className="flex min-h-screen bg-dark-900 pt-20">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-glass-border bg-dark-800/60 px-4 pt-8 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="mb-8 px-3">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-funky-cyan">TutorTap</div>
          <div className="font-display text-2xl">Admin Portal</div>
        </div>
        <div className="space-y-1 flex-1">
          {TABS.map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`sidebar-item w-full ${tab===id?'active':''}`}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
        <div className="pb-8 space-y-2">
          <button onClick={handleSeed} disabled={seeding}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-funky-lime py-3 text-sm font-black text-dark-900 transition-opacity hover:opacity-90 disabled:opacity-60">
            <Database size={15}/> {seeding?'Seeding…':'Seed Firebase'}
          </button>
          <button onClick={load} disabled={busy}
            className="btn-ghost w-full py-2.5 text-xs font-bold">
            <RefreshCw size={13} className={busy?'animate-spin':''}/> Refresh
          </button>
          <Link href="/" className="btn-ghost w-full py-2.5 text-xs text-center block">← Back to Site</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-5 lg:p-8">
        {/* Mobile tabs */}
        <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
          {TABS.map(({id,label})=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${tab===id?'bg-funky-cyan/15 text-funky-cyan border border-funky-cyan/40':'btn-ghost'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl capitalize">{TABS.find(t=>t.id===tab)?.label}</h1>
          <div className="text-xs text-white/40">Logged in as <span className="text-funky-cyan font-bold">{profile?.email}</span></div>
        </div>

        {ok && <div className="mb-4 flex items-center gap-2 rounded-2xl border border-funky-lime/20 bg-funky-lime/8 px-4 py-3 text-sm text-funky-lime"><CheckCircle size={14}/>{ok}<button onClick={()=>setOk(null)} className="ml-auto"><X size={12}/></button></div>}
        {err && <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300"><AlertCircle size={14}/>{err}<button onClick={()=>setErr(null)} className="ml-auto"><X size={12}/></button></div>}

        {/* ── OVERVIEW ── */}
        {tab==='overview' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              {stats.map(s=>(
                <div key={s.label} className={`stat-card border ${s.border}`}>
                  <div className={`mx-auto mb-3 ${s.color}`}>{s.icon}</div>
                  <div className="font-display text-4xl mb-1">{s.val}</div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-white/45">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <h2 className="font-display text-xl mb-4">Admin Credentials</h2>
              <div className="space-y-2 text-sm font-mono bg-dark-700/60 rounded-xl p-4">
                <p><span className="text-white/45">Email:</span> <span className="text-funky-cyan">admin@tutortap.pk</span></p>
                <p><span className="text-white/45">Password:</span> <span className="text-funky-lime">TutorTap@2025</span></p>
                <p><span className="text-white/45">Role field:</span> <span className="text-funky-orange">role = "admin"</span> in Firestore users collection</p>
              </div>
              <p className="mt-3 text-xs text-white/40">Create this account via Firebase Auth, then run Seed Firebase to create the Firestore user document with admin role.</p>
            </div>
          </motion.div>
        )}

        {/* ── USERS ── */}
        {tab==='users' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table w-full text-left">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>University</th><th className="text-right">Action</th></tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td className="font-semibold">{u.name||'—'}</td>
                      <td className="text-white/55">{u.email||'—'}</td>
                      <td><span className={u.role==='admin'?'tag-lime':u.role==='tutor'?'tag-orange':'tag-cyan'}>{u.role||'student'}</span></td>
                      <td className="text-white/45">{u.university||'—'}</td>
                      <td className="text-right">
                        <button onClick={()=>cycleRole(u.id,u.role)} className="btn-ghost px-3 py-1.5 text-xs">Cycle Role</button>
                      </td>
                    </tr>
                  ))}
                  {users.length===0 && <tr><td colSpan={5} className="py-10 text-center text-white/35">No users. Run Seed Firebase.</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── RESOURCES ── */}
        {tab==='resources' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-5">
            <div className="flex justify-end">
              <button onClick={()=>setShowResForm(!showResForm)} className="btn-primary px-5 py-2.5 text-sm">
                <Plus size={15}/> Add Resource
              </button>
            </div>

            {showResForm && (
              <div className="glass-card p-6">
                <h2 className="font-display text-xl mb-5">New Resource</h2>
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
                  <button onClick={()=>setShowResForm(false)} className="btn-ghost px-5 py-2.5 text-sm">Cancel</button>
                  <button onClick={createResource} disabled={busy} className="btn-primary px-5 py-2.5 text-sm">Save Resource</button>
                </div>
              </div>
            )}

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table w-full text-left">
                  <thead><tr><th>Title</th><th>Course</th><th>University</th><th>Type</th><th>URL</th><th className="text-right">Action</th></tr></thead>
                  <tbody>
                    {resources.map(r=>(
                      <tr key={r.id}>
                        <td className="font-semibold max-w-[180px] truncate">{r.title}</td>
                        <td className="text-white/55">{r.course}</td>
                        <td><span className="tag-purple">{r.university}</span></td>
                        <td><span className="tag-cyan">{r.type}</span></td>
                        <td>{r.fileUrl?<a href={r.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-funky-cyan hover:text-white text-xs">Open<ExternalLink size={11}/></a>:<span className="text-white/25 text-xs">—</span>}</td>
                        <td className="text-right">
                          <button onClick={()=>deleteResource(r.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {resources.length===0 && <tr><td colSpan={6} className="py-10 text-center text-white/35">No resources. Add one above or Seed Firebase.</td></tr>}
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
              <button onClick={()=>setShowUniForm(!showUniForm)} className="btn-primary px-5 py-2.5 text-sm">
                <Plus size={15}/> Add University
              </button>
            </div>

            {showUniForm && (
              <div className="glass-card p-6">
                <h2 className="font-display text-xl mb-5">New University</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    {label:'Full Name', key:'name',      ph:'National University of Sciences'},
                    {label:'Short Name',key:'shortName', ph:'NUST'},
                    {label:'City',      key:'city',      ph:'Islamabad'},
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
                </div>
                <div className="mt-5 flex gap-3 justify-end">
                  <button onClick={()=>setShowUniForm(false)} className="btn-ghost px-5 py-2.5 text-sm">Cancel</button>
                  <button onClick={createUniversity} disabled={busy} className="btn-primary px-5 py-2.5 text-sm">Save University</button>
                </div>
              </div>
            )}

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table w-full text-left">
                  <thead><tr><th>Name</th><th>Short</th><th>City</th><th>Type</th><th>Programs</th><th className="text-right">Action</th></tr></thead>
                  <tbody>
                    {universities.map(u=>(
                      <tr key={u.id}>
                        <td className="font-semibold">{u.name}</td>
                        <td><span className="tag-cyan">{u.shortName}</span></td>
                        <td className="text-white/55">{u.city}</td>
                        <td><span className={u.type==='public'?'tag-lime':'tag-purple'}>{u.type}</span></td>
                        <td className="text-white/55">{u.programs||'—'}</td>
                        <td className="text-right">
                          <button onClick={()=>deleteUniversity(u.id)} className="btn-danger px-3 py-1.5 text-xs"><Trash2 size={13}/>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {universities.length===0 && <tr><td colSpan={6} className="py-10 text-center text-white/35">No universities. Add one above or Seed Firebase.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── REQUESTS (Marketplace) ── */}
        {tab==='requests' && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table w-full text-left">
                <thead><tr><th>Title</th><th>Subject</th><th>Budget</th><th>Student</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
                <tbody>
                  {requests.map(r=>(
                    <tr key={r.id}>
                      <td className="font-semibold max-w-[160px] truncate">{r.title}</td>
                      <td className="text-white/55">{r.subject}</td>
                      <td className="text-funky-lime font-bold">PKR {r.budget?.toLocaleString()}</td>
                      <td className="text-white/55">{r.studentName||'—'}</td>
                      <td>
                        <span className={
                          r.status==='open'?'tag-lime':
                          r.status==='in-progress'?'tag-orange':
                          'tag-coral'
                        }>{r.status||'open'}</span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status!=='open'       && <button onClick={()=>updateRequestStatus(r.id,'open')}        className="btn-ghost px-2.5 py-1.5 text-xs">Open</button>}
                          {r.status!=='in-progress'&& <button onClick={()=>updateRequestStatus(r.id,'in-progress')} className="btn-ghost px-2.5 py-1.5 text-xs">Progress</button>}
                          {r.status!=='closed'     && <button onClick={()=>updateRequestStatus(r.id,'closed')}      className="btn-danger px-2.5 py-1.5 text-xs">Close</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {requests.length===0 && <tr><td colSpan={6} className="py-10 text-center text-white/35">No marketplace requests. Seed Firebase to add sample data.</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
