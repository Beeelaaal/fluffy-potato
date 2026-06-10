'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, BookOpen, Users, Award, MapPin, Clock, CheckCircle, MessageSquare, Edit3, DollarSign, X, Download, FileText } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, useAuth } from '@/context/AuthContext';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-black/10 dark:fill-white/10 text-black/10 dark:text-white/10'} />
      ))}
      <span className="ml-1.5 text-sm font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user, refetchProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    university: '',
    bio: '',
    preferences: '',
    hourlyRate: '',
    budgetPreference: '',
  });

  const isOwner = user && user.uid === params.id;

  const fetchProfile = async () => {
    try {
      const snap = await getDoc(doc(db, 'users', params.id));
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data);
        setEditForm({
          name: data.name || '',
          university: data.university || '',
          bio: data.bio || '',
          preferences: data.preferences || '',
          hourlyRate: data.hourlyRate ? String(data.hourlyRate) : '',
          budgetPreference: data.budgetPreference || '',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData: any = {
        name: editForm.name.trim(),
        university: editForm.university.trim(),
        bio: editForm.bio.trim(),
        preferences: editForm.preferences.trim(),
      };
      if (profile?.role === 'tutor') {
        updateData.hourlyRate = Number(editForm.hourlyRate) || 0;
      } else if (profile?.role === 'student') {
        updateData.budgetPreference = editForm.budgetPreference.trim();
      }
      await updateDoc(userRef, updateData);
      
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      setShowEditModal(false);
      await refetchProfile();
    } catch (err) {
      console.error("Error saving profile changes:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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

  const displayAvatar = profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}&backgroundColor=050e0d`;
  const degree = profile.role === 'tutor' ? 'Expert Tutor' : 'University Student';
  
  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 left-1/4 w-[400px] h-[300px] bg-funky-blue/5 blur-[100px] rounded-full pointer-events-none" />

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

              <h1 className="font-display font-black text-3xl mb-1.5 tracking-tight text-[#0B071E]">{profile.name}</h1>
              <p className="text-white/60 text-sm mb-3 font-bold uppercase tracking-wider">{degree}</p>
              {profile.university && (
                 <p className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6 font-medium">
                   <MapPin size={16} className="text-neon-cyan" /> {profile.university}
                 </p>
              )}

              {/* Rating */}
              {profile.rating !== undefined ? (
                <StarRating rating={profile.rating} />
              ) : (
                profile.role === 'tutor' && <StarRating rating={5.0} />
              )}

              {/* Role badge */}
              <div className="mt-6">
                <span className={`inline-flex items-center gap-1.5 text-xs px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest ${
                  profile.role === 'tutor'
                    ? 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20'
                    : profile.role === 'admin'
                    ? 'bg-neon-lime/10 text-neon-lime border border-neon-lime/20'
                    : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                }`}>
                  {profile.role === 'tutor' ? 'Verified Tutor' : profile.role === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>

              {isOwner ? (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="btn-primary w-full mt-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              ) : (
                <button className="btn-primary w-full mt-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2">
                  <MessageSquare size={16} /> Message {profile.name.split(' ')[0]}
                </button>
              )}
            </motion.div>

            {/* Profile Stats */}
            <motion.div className="glass-card p-8 space-y-5"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="font-display font-black text-xl mb-3 tracking-tight text-[#0B071E]">Profile Details</h3>
              {[
                ...(profile.role === 'tutor' ? [
                  { icon: Clock, label: 'Hourly Rate', value: profile.hourlyRate ? `PKR ${profile.hourlyRate.toLocaleString()}/hr` : 'Not specified', color: 'text-neon-lime', bg: 'bg-neon-lime/10' },
                  { icon: Users, label: 'Sessions Completed', value: String(profile.completedSessions || profile.sessions || 0), color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
                ] : [
                  { icon: Clock, label: 'Preferred Budget', value: profile.budgetPreference ? `PKR ${profile.budgetPreference}` : 'Not specified', color: 'text-neon-lime', bg: 'bg-neon-lime/10' },
                ]),
                { icon: BookOpen, label: 'Resources Shared', value: String(profile.resourcesSharedCount || 0), color: 'text-funky-blue', bg: 'bg-funky-blue/10' },
                { icon: Download, label: 'Resources Downloaded', value: String(profile.downloadedResourcesCount || 0), color: 'text-pink-500', bg: 'bg-pink-500/10' },
                { icon: FileText, label: 'Blogs Read', value: String(profile.readBlogsCount || 0), color: 'text-orange-500', bg: 'bg-orange-500/10' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 last:pb-0 group">
                  <span className="flex items-center gap-4 text-white/60 text-sm font-bold">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon size={16} className={color} />
                    </div>
                    {label}
                  </span>
                  <span className="font-black text-base text-[#0B071E]">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div className="glass-card p-8"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2 text-[#0B071E]">
                <span className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <Award size={16} className="text-brand-400" />
                </span>
                About {profile.name.split(' ')[0]}
              </h2>
              <p className="text-white/60 leading-relaxed text-base">
                {profile.bio || "No bio description added yet. Edit your profile to introduce yourself to the community!"}
              </p>
            </motion.div>

            {/* Preferences & Interests */}
            <motion.div className="glass-card p-8"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2 text-[#0B071E]">
                <span className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                  <Star size={16} className="text-neon-cyan" />
                </span>
                Preferences & Interests
              </h2>
              {profile.preferences ? (
                <div className="flex flex-wrap gap-2">
                  {profile.preferences.split(',').map((pref, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-xl font-bold border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-[#0B071E] dark:text-white/80">
                      {pref.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm font-semibold">
                  No preferences or target courses added yet. Tutors/Students will see this when looking at help requests.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative w-full max-w-lg glass-card p-8 bg-white/95 dark:bg-[#110A20]/95 shadow-2xl overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            >
              <button 
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0B071E]/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>

              <h2 className="font-display font-black text-2xl mb-6 text-[#0B071E]">Edit Profile & Preferences</h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input 
                    value={editForm.name} 
                    onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} 
                    required 
                    placeholder="Ahmed Raza" 
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="form-label">University</label>
                  <input 
                    value={editForm.university} 
                    onChange={e => setEditForm(p => ({ ...p, university: e.target.value }))} 
                    required 
                    placeholder="NUST, FAST, LUMS..." 
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="form-label">Preferences (e.g. Courses, Topics, Study styles)</label>
                  <input 
                    value={editForm.preferences} 
                    onChange={e => setEditForm(p => ({ ...p, preferences: e.target.value }))} 
                    placeholder="Data Structures, Java, Online sessions" 
                    className="input-field"
                  />
                  <span className="text-[10px] text-white/40 mt-1 block">Separate multiple preferences with commas</span>
                </div>

                {profile?.role === 'tutor' ? (
                  <div>
                    <label className="form-label">Hourly Rate (PKR / hr)</label>
                    <input 
                      type="number" 
                      value={editForm.hourlyRate} 
                      onChange={e => setEditForm(p => ({ ...p, hourlyRate: e.target.value }))} 
                      placeholder="e.g. 2500" 
                      className="input-field"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="form-label">Preferred Session Budget</label>
                    <input 
                      value={editForm.budgetPreference} 
                      onChange={e => setEditForm(p => ({ ...p, budgetPreference: e.target.value }))} 
                      placeholder="e.g. Under 3000 / negotiable" 
                      className="input-field"
                    />
                  </div>
                )}

                <div>
                  <label className="form-label">About Me (Bio)</label>
                  <textarea 
                    value={editForm.bio} 
                    onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} 
                    rows={4} 
                    placeholder="Introduce yourself to the community. Share your interests, experience, or study goals..." 
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)} 
                    className="btn-ghost flex-1 py-3 text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="btn-primary flex-1 py-3 text-sm font-bold disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
