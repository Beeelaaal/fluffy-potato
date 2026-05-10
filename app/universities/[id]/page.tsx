'use client';

import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, Users, BookOpen, Calendar, Globe, Phone, Mail,
  ArrowLeft, CheckCircle, Clock, DollarSign, Award, ChevronRight
} from 'lucide-react';
import { universities } from '@/data/universities';

export default function UniversityDetailPage({ params }: { params: { id: string } }) {
  const uni = universities.find(u => u.id === params.id);
  if (!uni) notFound();

  const tabSections = [
    { icon: BookOpen, label: 'Programs', color: '#5b63f5' },
    { icon: CheckCircle, label: 'Requirements', color: '#7c3aed' },
    { icon: Clock, label: 'How to Apply', color: '#06b6d4' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="section-container">
        {/* Back link */}
        <Link href="/universities"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to Universities
        </Link>

        {/* Hero image */}
        <motion.div
          className="relative h-64 sm:h-80 rounded-3xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />

          {/* Badges inside image */}
          <div className="absolute bottom-6 left-6 flex items-end gap-4">
            <img src={uni.logo} alt={uni.shortName}
              className="w-16 h-16 rounded-2xl border-2 border-white/15" />
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white leading-tight">{uni.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-white/60 text-sm">
                <span className="flex items-center gap-1"><MapPin size={13} /> {uni.city}, {uni.province}</span>
                <span>Est. {uni.established}</span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm ${
              uni.type === 'public'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                : 'bg-purple-500/30 text-purple-200 border border-purple-500/40'
            }`}>
              {uni.type.charAt(0).toUpperCase() + uni.type.slice(1)} University
            </span>
            {uni.admissionOpen && (
              <span className="text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm bg-brand-500/30 text-brand-200 border border-brand-500/40">
                🟢 Admissions Open
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              <h2 className="font-display font-semibold text-lg mb-3">About</h2>
              <p className="text-white/60 leading-relaxed">{uni.description}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {uni.tags.map(tag => <span key={tag} className="tag-pill">{tag}</span>)}
              </div>
            </motion.div>

            {/* Programs */}
            <motion.div
              className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
                <BookOpen size={18} className="text-brand-400" /> Programs Offered
              </h2>
              <div className="space-y-3">
                {uni.programs_list.map(prog => (
                  <div key={prog.name} className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div className="font-medium text-sm">{prog.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">
                        {prog.degree} · {prog.duration} · {prog.seats} seats
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-brand-400">
                        PKR {(prog.fee / 1000).toFixed(0)}K/yr
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">Merit: {prog.merit}%+</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div
              className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
                <CheckCircle size={18} className="text-purple-400" /> Admission Requirements
              </h2>
              <ul className="space-y-3">
                {uni.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/65">
                    <CheckCircle size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* How to Apply */}
            <motion.div
              className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
              <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2">
                <Clock size={18} className="text-cyan-400" /> How to Apply
              </h2>
              <div className="space-y-4">
                {uni.howToApply.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(91,99,245,0.15)', border: '1px solid rgba(91,99,245,0.3)', color: '#818cf8' }}>
                      {i + 1}
                    </div>
                    <p className="text-white/65 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick stats */}
            <motion.div
              className="glass-card p-6 space-y-4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-sm text-white/70">Quick Info</h3>
              {[
                { icon: Users, label: 'Students', value: uni.students.toLocaleString() },
                { icon: BookOpen, label: 'Programs', value: uni.programs + '+' },
                { icon: Award, label: 'Ranking', value: `#${uni.ranking} in Pakistan` },
                { icon: DollarSign, label: 'Fee Range', value: `PKR ${(uni.fee.min / 1000).toFixed(0)}K–${(uni.fee.max / 1000).toFixed(0)}K` },
                { icon: Calendar, label: 'Deadline', value: uni.admissionOpen ? new Date(uni.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Closed' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <span className="flex items-center gap-2 text-white/50 text-sm">
                    <Icon size={14} /> {label}
                  </span>
                  <span className="text-white/85 text-sm font-medium">{value}</span>
                </div>
              ))}
            </motion.div>

            {/* Contact */}
            <motion.div
              className="glass-card p-6 space-y-3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-sm text-white/70 mb-4">Contact</h3>
              <a href={`tel:${uni.contacts.phone}`}
                className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                <Phone size={14} className="text-brand-400" /> {uni.contacts.phone}
              </a>
              <a href={`mailto:${uni.contacts.email}`}
                className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                <Mail size={14} className="text-brand-400" /> {uni.contacts.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={14} className="text-brand-400 mt-0.5 flex-shrink-0" /> {uni.contacts.address}
              </div>
              <a href={uni.website} target="_blank" rel="noopener noreferrer"
                className="btn-ghost w-full text-sm py-2.5 mt-2 flex items-center justify-center gap-2">
                <Globe size={14} /> Official Website
                <ChevronRight size={13} />
              </a>
            </motion.div>

            {/* Find Tutor CTA */}
            <motion.div
              className="p-6 rounded-2xl text-center"
              style={{ background: 'linear-gradient(135deg, rgba(91,99,245,0.15), rgba(124,58,237,0.1))', border: '1px solid rgba(91,99,245,0.2)' }}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            >
              <div className="text-3xl mb-3">👨‍🏫</div>
              <h3 className="font-semibold text-sm mb-2">Need a tutor from {uni.shortName}?</h3>
              <p className="text-white/45 text-xs mb-4">Find verified tutors who&apos;ve been through the same courses</p>
              <Link href="/marketplace" className="btn-primary w-full text-sm py-2.5">
                Find Tutors
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
