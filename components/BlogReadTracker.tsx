'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BlogReadTrackerProps {
  slug: string;
}

export default function BlogReadTracker({ slug }: BlogReadTrackerProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (!slug) return;

    // Track read blogs in localStorage to prevent duplicate increments on refresh
    const readBlogs = JSON.parse(localStorage.getItem('read_blogs') || '[]');
    const isAlreadyRead = readBlogs.includes(slug);

    if (!isAlreadyRead) {
      // Add to localStorage
      readBlogs.push(slug);
      localStorage.setItem('read_blogs', JSON.stringify(readBlogs));

      // If user is logged in, increment readBlogsCount in Firestore
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        updateDoc(userRef, {
          readBlogsCount: increment(1)
        }).catch(err => {
          console.error('[BlogReadTracker] Error updating read blogs count:', err);
        });
      }
    }
  }, [slug, user]);

  return null;
}
