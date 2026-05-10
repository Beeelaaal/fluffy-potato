'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, Users, Award, MapPin, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/context/AuthContext';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-white/10 text-white/10'} />
      ))}
      <span className="ml-1.5 text-sm font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const snap = await getDoc(doc(db, 'users', params.id));
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-dark-900">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-400 rounded-full animate-spin shadow-glow-brand" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center flex-col gap-4 bg-dark-900">
        <h1 className="text-3xl font-display font-bold">Profile not found</h1>
        <p className="text-white/50 text-lg">This user may not exist or the link is broken.</p>
      </div>
    );
  }

  // Fallback defaults for missing fields since we haven't built the profile editor yet
  const displayAvatar = profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}&backgroundColor=050e0d`;
  const bio = "I am a dedicated member of TutorTap. I'm passionate about learning and exploring new concepts.";
  const degree = profile.role === 'tutor' ? 'Expert Tutor' : 'University Student';
  
  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 left-1/4 w-[400px] h-[300px] bg-neon-purple/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="space-y-6">
            {/* Profile card */}
            <motion.div
              className="glass-card p-8 text-center neon-border"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-3xl bg-neon-cyan/20 blur-xl"></div>
                <img src={displayAvatar} alt={profile.name} className="relative w-full h-full rounded-3xl border-2 border-neon-cyan/50 object-cover bg-dark-800 shadow-[0_0_30px_rgba(0,240,255,0.2)]" />
                {profile.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-neon-cyan rounded-full flex items-center justify-center border-4 border-dark-900 shadow-neon">
                    <CheckCircle size={20} className="text-dark-900" strokeWidth={3} />
                  </div>
                )}
              </div>

              <h1 className="font-display font-black text-3xl mb-1.5 tracking-tight">{profile.name}</h1>
              <p className="text-white/60 text-sm mb-3 font-bold uppercase tracking-wider">{degree}</p>
              {profile.university && (
                 <p className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6 font-medium">
                   <MapPin size={16} className="text-neon-cyan" /> {profile.university}
                 </p>
              )}

              {profile.role === 'tutor' && <StarRating rating={5.0} />}

              {/* Role badge */}
              <div className="mt-6">
                <span className={`inline-flex items-center gap-1.5 text-xs px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest ${
                  profile.role === 'tutor'
                    ? 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20'
                    : profile.role === 'admin'
                    ? 'bg-neon-lime/10 text-neon-lime border border-neon-lime/20'
                    : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                }`}>
                  {profile.role === 'tutor' ? '👨‍🏫 Verified Tutor' : profile.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
                </span>
              </div>

              <button className="btn-primary w-full mt-8 py-3.5 text-sm font-bold bg-white text-dark-900 shadow-neon border-none hover:bg-neon-cyan">
                <MessageSquare size={16} /> Message {profile.name.split(' ')[0]}
              </button>
            </motion.div>

            {profile.role === 'tutor' && (
              <motion.div className="glass-card p-8 space-y-5"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="font-display font-black text-xl mb-3 tracking-tight">Tutor Stats</h3>
                {[
                  { icon: Users, label: 'Sessions Completed', value: '0', color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
                  { icon: BookOpen, label: 'Resources Uploaded', value: '0', color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
                  { icon: Clock, label: 'Avg. Response Time', value: '< 1 hr', color: 'text-neon-lime', bg: 'bg-neon-lime/10' },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 last:pb-0 group">
                    <span className="flex items-center gap-4 text-white/60 text-sm font-bold">
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <Icon size={16} className={color} />
                      </div>
                      {label}
                    </span>
                    <span className="font-black text-base text-white">{value}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div className="glass-card p-8"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <Award size={16} className="text-brand-400" />
                </span>
                About {profile.name.split(' ')[0]}
              </h2>
              <p className="text-white/60 leading-relaxed text-base">{bio}</p>
            </motion.div>
            
            {/* Can add more sections here later like 'Recent Reviews' or 'Subjects Taught' */}
          </div>
        </div>
      </div>
    </div>
  );
}
