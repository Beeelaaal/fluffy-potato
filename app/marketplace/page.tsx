'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Search, Clock, DollarSign, Users, Tag,
  MessageSquare, ChevronRight, Wifi, MapPin, MonitorSmartphone, Filter, X
} from 'lucide-react';
import { marketplaceRequests } from '@/data/marketplace';

const sessionIcons = { online: Wifi, 'in-person': MapPin, both: MonitorSmartphone };
const statusColors = {
  open: { bg: 'bg-funky-lime/10', text: 'text-funky-lime', border: 'border-funky-lime/20' },
  'in-progress': { bg: 'bg-funky-orange/10', text: 'text-funky-orange', border: 'border-funky-orange/20' },
  closed: { bg: 'bg-funky-coral/10', text: 'text-funky-coral', border: 'border-funky-coral/20' },
};

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress'>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', subject: '', budget: '', deadline: '', sessionType: 'online', duration: '',
  });

  const filtered = marketplaceRequests.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-funky-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="section-badge mb-4">Tutor Marketplace</div>
            <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tighter">
              Find Your <span className="gradient-text">Perfect Tutor</span>
            </h1>
            <p className="text-[#0B071E]/80 text-lg sm:text-xl mt-4 max-w-xl font-semibold">Post a request, receive competitive bids, and choose the best match for your academic needs.</p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="btn-primary whitespace-nowrap px-8 py-4 flex-shrink-0 text-lg font-bold"
          >
            <Plus size={20} strokeWidth={3} /> Post Request
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Active Requests', value: marketplaceRequests.filter(r => r.status === 'open').length, color: '#16A34A', shadow: 'shadow-[0_0_20px_rgba(22,163,74,0.08)]' },
            { label: 'Total Tutors', value: '3,200+', color: '#0891B2', shadow: 'shadow-[0_0_20px_rgba(8,145,178,0.08)]' },
            { label: 'Avg Bid Time', value: '< 2 hrs', color: '#EA580C', shadow: 'shadow-[0_0_20px_rgba(234,88,12,0.08)]' },
          ].map(s => (
            <div key={s.label} className={`glass-card p-8 flex items-center justify-center flex-col ${s.shadow} border-black/5 transition-transform hover:scale-105 duration-300`}>
              <div className="font-display font-black text-4xl sm:text-5xl mb-2 tracking-tight" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[#0B071E]/60 text-sm font-bold uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Search + filter */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B071E]/40" />
            <input type="text" placeholder="Search by subject, topic, or tags..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-12 py-3.5" />
          </div>
          <div className="flex gap-2">
            {(['all', 'open', 'in-progress'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-6 py-3.5 rounded-xl text-sm font-black transition-all capitalize whitespace-nowrap border-2 ${
                  statusFilter === s
                    ? 'bg-funky-cyan/15 text-funky-cyan border-funky-cyan/50 shadow-cyan'
                    : 'bg-white/80 text-[#0B071E]/60 border-[#0B071E]/10 hover:text-[#0B071E] hover:bg-white hover:border-[#0B071E]/20'
                }`}>
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <p className="text-[#0B071E]/60 text-sm mb-6 font-bold">
          <span className="text-[#8B5CF6] font-extrabold">{filtered.length}</span> request{filtered.length !== 1 ? 's' : ''} found
        </p>

        <div className="space-y-5">
          <AnimatePresence>
            {filtered.map((req, i) => {
              const sc = statusColors[req.status];
              const SessionIcon = sessionIcons[req.sessionType];

              return (
                <motion.div
                  key={req.id}
                  className="glass-card p-6 md:p-8 group hover:border-funky-cyan/40 transition-all duration-300 hover:shadow-cyan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left: content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`text-xs px-3 py-1.5 rounded-md font-bold uppercase tracking-wider border capitalize flex items-center ${sc.bg} ${sc.text} ${sc.border}`}>
                          {req.status === 'open' && <span className="inline-block w-2 h-2 rounded-full bg-funky-lime animate-pulse mr-2 shadow-[0_0_10px_rgba(173,255,47,0.8)]" />}
                          {req.status.replace('-', ' ')}
                        </span>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-funky-purple/10 text-funky-purple border border-funky-purple/20 uppercase tracking-wider">{req.subject}</span>
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B071E]/70 bg-white/60 px-3 py-1.5 rounded-md border border-[#0B071E]/10">
                          <SessionIcon size={14} /> {req.sessionType}
                        </span>
                      </div>

                      <Link href={`/marketplace/${req.id}`}>
                        <h2 className="font-display font-black text-2xl leading-snug mb-3 text-[#0B071E] group-hover:text-funky-cyan transition-colors">
                          {req.title}
                        </h2>
                      </Link>

                      <p className="text-[#0B071E]/75 text-sm leading-relaxed mb-5 line-clamp-2 pr-4 font-semibold">{req.description}</p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-5 text-xs text-[#0B071E]/60 font-bold">
                        <span className="flex items-center gap-2">
                          <img src={req.student.avatar} alt={req.student.name} className="w-5 h-5 rounded-full border border-black/10" />
                          {req.student.name} <span className="text-[#0B071E]/20">·</span> {req.student.university}
                        </span>
                        <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#8B5CF6]/70" /> {req.duration}</span>
                        <span className="flex items-center gap-1.5">
                          <Tag size={13} className="text-amber-500/70" />
                          Due: {new Date(req.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* Right: budget + bids */}
                    <div className="flex flex-row lg:flex-col items-center justify-between lg:items-end gap-4 lg:gap-5 flex-shrink-0 pl-0 lg:pl-8 border-t lg:border-t-0 lg:border-l border-black/5 pt-5 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <div className="text-[#0B071E]/50 text-xs font-bold mb-1 uppercase tracking-widest">Budget</div>
                        <div className="font-display font-black text-3xl text-[#0B071E]">
                          <span className="text-sm text-funky-purple mr-1 font-bold">PKR</span>
                          {req.budget.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center lg:justify-end gap-3 w-full lg:w-auto mt-2">
                        <div className="flex items-center gap-2 text-sm bg-white/70 px-4 py-2.5 rounded-xl border border-black/10 shadow-inner">
                          <MessageSquare size={16} className="text-funky-cyan" />
                          <span className="font-black text-[#0B071E]">{req.bids.length}</span>
                          <span className="text-[#0B071E]/50 font-bold uppercase text-[10px] tracking-wider mt-0.5">bids</span>
                        </div>

                        <Link href={`/marketplace/${req.id}`}
                          className="btn-primary text-sm py-3 px-6 whitespace-nowrap font-bold">
                          Bid <ChevronRight size={16} strokeWidth={3} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center mt-8">
            <div className="w-20 h-20 bg-funky-cyan/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-funky-cyan/20">
              <Search size={32} className="text-funky-cyan" />
            </div>
            <h3 className="font-display font-black text-2xl mb-2 text-[#0B071E]">No requests found</h3>
            <p className="text-[#0B071E]/60 mb-6 max-w-md mx-auto font-semibold">Try adjusting your search criteria or be the first to post a new request.</p>
            <button onClick={() => setShowPostModal(true)} className="btn-primary">
              <Plus size={16} /> Post Request
            </button>
          </div>
        )}
      </div>

      {/* Post Request Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg glass-card p-10 overflow-y-auto max-h-[90vh] bg-white/95 shadow-2xl relative"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            >
              <button 
                onClick={() => setShowPostModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0B071E]/40 hover:text-[#0B071E] hover:bg-black/5 transition-all"
              >
                <X size={15} />
              </button>

              <h2 className="font-display font-black text-3xl mb-8 tracking-tight">Post a Help Request</h2>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-[#0B071E]/60 mb-2 block uppercase tracking-wider">Title *</label>
                  <input name="title" value={form.title} onChange={handleFormChange}
                    placeholder="e.g. Need help with DSA - Graph Algorithms"
                    className="input-field py-3" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0B071E]/60 mb-2 block uppercase tracking-wider">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange}
                    placeholder="Describe what you need help with in detail..."
                    rows={4} className="input-field py-3 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#0B071E]/60 mb-2 block uppercase tracking-wider">Subject *</label>
                    <input name="subject" value={form.subject} onChange={handleFormChange}
                      placeholder="e.g. Data Structures" className="input-field py-3" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#0B071E]/60 mb-2 block uppercase tracking-wider">Budget (PKR) *</label>
                    <input name="budget" type="number" value={form.budget} onChange={handleFormChange}
                      placeholder="e.g. 2000" className="input-field py-3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#0B071E]/60 mb-2 block uppercase tracking-wider">Deadline</label>
                    <input name="deadline" type="date" value={form.deadline} onChange={handleFormChange}
                      className="input-field py-3" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#0B071E]/60 mb-2 block uppercase tracking-wider">Session Type</label>
                    <select name="sessionType" value={form.sessionType} onChange={handleFormChange}
                      className="input-field py-3 cursor-pointer">
                      <option value="online">Online</option>
                      <option value="in-person">In-Person</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0B071E]/60 mb-2 block uppercase tracking-wider">Duration</label>
                  <input name="duration" value={form.duration} onChange={handleFormChange}
                    placeholder="e.g. 2 sessions (2 hrs each)" className="input-field py-3" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowPostModal(false)} className="btn-ghost flex-1 py-3 font-bold">Cancel</button>
                <button 
                  onClick={() => {
                    alert('Help request posted successfully! Tutors will bid on your request shortly. 🎓');
                    setShowPostModal(false);
                  }}
                  className="btn-primary flex-1 py-3 font-bold"
                >
                  Post Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
