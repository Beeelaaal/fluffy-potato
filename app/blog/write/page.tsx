'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { BookOpen, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WriteBlogPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Admission Guides');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-xl font-bold font-display animate-pulse">Loading author access...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Create a SEO-friendly URL slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const blogDoc = {
      title,
      slug,
      excerpt,
      content,
      category,
      readTime,
      authorName: profile?.name || user.displayName || 'Anonymous Author',
      authorId: user.uid,
      authorAvatar: profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}&backgroundColor=0f0f1a`,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: category === 'Admission Guides' ? '#0066FF' : category === 'Deadlines' ? '#FF5C7A' : category === 'Scholarships' ? '#FF7A18' : category === 'Do\'s & Don\'ts' ? '#2EF2FF' : '#D8FF3E',
    };

    try {
      await setDoc(doc(db, 'blogs', slug), blogDoc);
      alert('Insider guide published successfully! 🚀');
      router.push('/blog');
    } catch (err: any) {
      console.error('Error publishing blog:', err);
      setError(err?.message || 'Failed to publish blog post. Check your security rules.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container max-w-3xl relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#0B071E]/60 hover:text-[#0066FF] text-sm mb-8 transition-colors font-bold">
          <ArrowLeft size={15} /> Back to YOUR INSIDER
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-funky-blue/10 border border-funky-blue/20 flex items-center justify-center">
              <BookOpen size={20} className="text-funky-blue" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#0B071E]">
                Write an Insider Guide
              </h1>
              <p className="text-[#0B071E]/60 text-xs font-bold uppercase tracking-wider">Share admission guides, deadlines, scholarships, or exam session info</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label">Article Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 5 Study Hacks for FAST-NU Exams"
                className="input-field py-3.5"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="input-field py-3.5 cursor-pointer"
                >
                  <option value="Admission Guides">Admission Guides</option>
                  <option value="Deadlines">Deadlines</option>
                  <option value="Scholarships">Scholarships</option>
                  <option value="Do's & Don'ts">Do&apos;s &amp; Don&apos;ts</option>
                  <option value="Exam Sessions">Exam Sessions</option>
                </select>
              </div>
              <div>
                <label className="form-label">Estimated Read Time</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={e => setReadTime(e.target.value)}
                  placeholder="e.g. 5 min read"
                  className="input-field py-3.5"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Short Excerpt *</label>
              <input
                type="text"
                required
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Write a brief, catchy summary of the article (appears on listings)..."
                className="input-field py-3.5"
              />
            </div>

            <div>
              <label className="form-label">Body Content (Markdown format supported) *</label>
              <textarea
                required
                rows={12}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your article body here. You can use markdown for bold, lists, headers, etc..."
                className="input-field p-4 resize-y font-mono text-sm leading-relaxed"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base font-bold disabled:opacity-60"
            >
              {submitting ? 'Publishing...' : 'Publish Post'} <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
