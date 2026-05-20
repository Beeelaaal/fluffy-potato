'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, Users, BookOpen, Calendar, Globe, Phone, Mail,
  ArrowLeft, CheckCircle, Clock, DollarSign, Award, ChevronRight,
  Building2
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { universities as staticUniversities } from '@/data/universities';

export default function UniversityDetailPage({ params }: { params: { id: string } }) {
  const [uni, setUni] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Try Firestore first using the lowercased ID or regular ID
        const snap = await getDoc(doc(db, 'universities', params.id));
        if (snap.exists()) {
          const data = snap.data();
          const staticUni = staticUniversities.find(
            u => u.id.toLowerCase() === params.id.toLowerCase() || 
                 u.shortName.toLowerCase() === (data.shortName || '').toLowerCase()
          );

          setUni({
            id: snap.id,
            name: data.name,
            shortName: data.shortName,
            city: data.city,
            province: data.province || staticUni?.province || 'Pakistan',
            type: data.type || 'public',
            ranking: data.ranking || staticUni?.ranking || 99,
            established: data.established || staticUni?.established || 2000,
            students: data.students || staticUni?.students || 5000,
            programs: data.programs || staticUni?.programs || 10,
            logo: data.logoUrl || staticUni?.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${data.shortName}&backgroundColor=1a1a35&textColor=5b63f5`,
            image: staticUni?.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60',
            description: data.description || staticUni?.description || 'No description available.',
            website: data.websiteUrl || staticUni?.website || 'https://google.com',
            fee: staticUni?.fee || { min: 100000, max: 300000 },
            tags: data.tags || staticUni?.tags || ['Higher Education', data.city, data.type],
            admissionOpen: data.deadline ? new Date(data.deadline) > new Date() : true,
            deadline: data.deadline || staticUni?.deadline || 'Open',
            programs_list: staticUni?.programs_list || [
              { name: 'General BS Programs', degree: 'BS', duration: '4 years', seats: 100, fee: 150000, merit: 70 },
              { name: 'Business Administration', degree: 'BBA', duration: '4 years', seats: 60, fee: 180000, merit: 65 }
            ],
            requirements: data.admissionCriteria 
              ? data.admissionCriteria.split('\n').filter(Boolean)
              : (staticUni?.requirements || ['FSc/A-Levels or equivalent qualification', 'Valid entry test score', 'CNIC/B-Form']),
            howToApply: staticUni?.howToApply || [
              'Visit the official website of the university.',
              'Fill out the online registration form.',
              'Pay the application fee and submit your academic details.'
            ],
            contacts: staticUni?.contacts || {
              phone: data.phone || '+92-51-111-222-333',
              email: data.email || `admissions@${(data.shortName || 'univ').toLowerCase()}.edu.pk`,
              address: data.address || `${data.city}, Pakistan`
            }
          });
        } else {
          // If not in Firestore, check if we have it in static data
          const staticUni = staticUniversities.find(u => u.id.toLowerCase() === params.id.toLowerCase());
          if (staticUni) {
            setUni(staticUni);
          } else {
            setUni(null);
          }
        }
      } catch (err) {
        console.error('Error fetching university details:', err);
        const staticUni = staticUniversities.find(u => u.id.toLowerCase() === params.id.toLowerCase());
        setUni(staticUni || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-funky-cyan/20 border-t-funky-cyan" />
      </div>
    );
  }

  if (!uni) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container">
        {/* Back link */}
        <Link href="/universities"
          className="inline-flex items-center gap-2 text-[#0B071E]/60 hover:text-[#8B5CF6] text-sm mb-8 transition-colors font-bold">
          <ArrowLeft size={15} /> Back to Universities
        </Link>

        {/* Hero image */}
        <motion.div
          className="relative h-64 sm:h-80 rounded-3xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Badges inside image */}
          <div className="absolute bottom-6 left-6 flex items-end gap-4 z-10">
            <img src={uni.logo} alt={uni.shortName}
              className="w-16 h-16 rounded-2xl border-2 border-white/20 bg-white object-cover shadow-lg" />
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight drop-shadow-md">{uni.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-white/90 text-sm font-bold">
                <span className="flex items-center gap-1 drop-shadow-sm"><MapPin size={13} /> {uni.city}</span>
                <span className="drop-shadow-sm">Est. {uni.established}</span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <span className={`text-xs px-3 py-1.5 rounded-full font-bold backdrop-blur-md shadow-md ${
              uni.type === 'public'
                ? 'bg-emerald-500/80 text-white border border-emerald-400/20'
                : 'bg-purple-500/80 text-white border border-purple-400/20'
            }`}>
              {uni.type.charAt(0).toUpperCase() + uni.type.slice(1)} University
            </span>
            {uni.admissionOpen && (
              <span className="text-xs px-3 py-1.5 rounded-full font-bold backdrop-blur-md bg-funky-cyan/95 text-white border border-funky-cyan/20 shadow-md animate-pulse">
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
              <h2 className="font-display font-black text-xl mb-3 text-[#0B071E]">About</h2>
              <p className="text-[#0B071E]/80 leading-relaxed text-sm font-semibold">{uni.description}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {uni.tags?.map((tag: string) => <span key={tag} className="tag-pill text-xs font-bold bg-white/80 border border-black/10 text-[#0B071E]">{tag}</span>)}
              </div>
            </motion.div>

            {/* Programs */}
            <motion.div
              className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <h2 className="font-display font-black text-xl mb-5 flex items-center gap-2 text-[#0B071E]">
                <BookOpen size={18} className="text-[#8B5CF6]" /> Programs Offered
              </h2>
              <div className="space-y-3">
                {uni.programs_list?.map((prog: any) => (
                  <div key={prog.name} className="flex items-center justify-between p-4 rounded-xl bg-white/60 border border-black/5">
                    <div>
                      <div className="font-bold text-sm text-[#0B071E]">{prog.name}</div>
                      <div className="text-[#0B071E]/60 text-xs font-semibold mt-0.5">
                        {prog.degree} · {prog.duration} · {prog.seats} seats
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#8B5CF6]">
                        PKR {(prog.fee / 1000).toFixed(0)}K/yr
                      </div>
                      <div className="text-[#0B071E]/60 text-xs font-bold mt-0.5">Merit: {prog.merit}%+</div>
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
              <h2 className="font-display font-black text-xl mb-5 flex items-center gap-2 text-[#0B071E]">
                <CheckCircle size={18} className="text-emerald-500" /> Admission Requirements
              </h2>
              <ul className="space-y-3">
                {uni.requirements?.map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#0B071E]/80 font-semibold">
                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
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
              <h2 className="font-display font-black text-xl mb-5 flex items-center gap-2 text-[#0B071E]">
                <Clock size={18} className="text-[#8B5CF6]" /> How to Apply
              </h2>
              <div className="space-y-4">
                {uni.howToApply?.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6]">
                      {i + 1}
                    </div>
                    <p className="text-[#0B071E]/80 text-sm leading-relaxed font-semibold">{step}</p>
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
              <h3 className="font-display font-black text-sm text-[#0B071E] uppercase tracking-wider">Quick Info</h3>
              {[
                { icon: Users, label: 'Students', value: uni.students?.toLocaleString() },
                { icon: BookOpen, label: 'Programs', value: uni.programs + '+' },
                { icon: Award, label: 'Ranking', value: `#${uni.ranking} in Pakistan` },
                { icon: DollarSign, label: 'Fee Range', value: `PKR ${(uni.fee?.min / 1000).toFixed(0)}K–${(uni.fee?.max / 1000).toFixed(0)}K` },
                { icon: Calendar, label: 'Deadline', value: uni.admissionOpen ? new Date(uni.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Closed' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-black/5 last:border-0">
                  <span className="flex items-center gap-2 text-[#0B071E]/60 text-sm font-bold">
                    <Icon size={14} className="text-[#8B5CF6]" /> {label}
                  </span>
                  <span className="text-[#0B071E]/90 text-sm font-extrabold">{value}</span>
                </div>
              ))}
            </motion.div>

            {/* Contact */}
            <motion.div
              className="glass-card p-6 space-y-3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            >
              <h3 className="font-display font-black text-sm text-[#0B071E] uppercase tracking-wider mb-4">Contact</h3>
              <a href={`tel:${uni.contacts?.phone}`}
                className="flex items-center gap-3 text-sm text-[#0B071E]/80 hover:text-[#8B5CF6] transition-colors font-semibold">
                <Phone size={14} className="text-funky-cyan" /> {uni.contacts?.phone}
              </a>
              <a href={`mailto:${uni.contacts?.email}`}
                className="flex items-center gap-3 text-sm text-[#0B071E]/80 hover:text-[#8B5CF6] transition-colors font-semibold">
                <Mail size={14} className="text-funky-cyan" /> {uni.contacts?.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-[#0B071E]/80 font-semibold">
                <MapPin size={14} className="text-funky-cyan mt-0.5 flex-shrink-0" /> {uni.contacts?.address}
              </div>
              <a href={uni.website} target="_blank" rel="noopener noreferrer"
                className="btn-ghost w-full text-sm py-2.5 mt-2 flex items-center justify-center gap-2 font-bold border border-black/10">
                <Globe size={14} /> Official Website
                <ChevronRight size={13} />
              </a>
            </motion.div>

            {/* Find Tutor CTA */}
            <motion.div
              className="p-6 rounded-2xl text-center bg-gradient-to-br from-[#8B5CF6]/10 to-teal-500/5 border border-[#8B5CF6]/20"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            >
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-3">
                <Users size={16} className="text-[#8B5CF6]" />
              </div>
              <h3 className="font-display font-black text-sm mb-2 text-[#0B071E]">Need a tutor from {uni.shortName}?</h3>
              <p className="text-[#0B071E]/60 text-xs mb-4 font-semibold">Find verified tutors who&apos;ve been through the same courses</p>
              <Link href="/marketplace" className="btn-primary w-full text-sm py-2.5 font-bold">
                Find Tutors
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
