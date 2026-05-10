'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Presentation,
  Search,
  Star,
  X,
} from 'lucide-react';
import { collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { courses, degrees, Resource, resources as sampleResources } from '@/data/resources';
import { universities } from '@/data/universities';
import { normalizeResource } from '@/lib/resources';

const typeIcons: Record<string, typeof FileText> = {
  notes: BookOpen,
  'past-paper': FileText,
  assignment: ClipboardList,
  timetable: Clock,
  slide: Presentation,
  book: BookOpen,
};

const typeColors: Record<string, string> = {
  notes: '#FF7A18',
  'past-paper': '#FF4DB8',
  assignment: '#2EF2FF',
  timetable: '#D8FF3E',
  slide: '#FFE45C',
  book: '#8B5CF6',
};

const resourceTypes = ['all', 'notes', 'past-paper', 'assignment', 'timetable', 'slide', 'book'] as const;

type ViewResource = Resource & { fileUrl?: string; previewUrl?: string };

const fallbackResources: ViewResource[] = sampleResources.map((resource) => ({
  ...resource,
  fileUrl: '',
  previewUrl: '',
}));

export default function ResourcesPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [resources, setResources] = useState<ViewResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState<(typeof resourceTypes)[number]>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      setError(null);

      try {
        const querySnapshot = await getDocs(collection(db, 'resources'));
        const resourceList = querySnapshot.docs.map((snapshot) => normalizeResource(snapshot.id, snapshot.data()));

        if (resourceList.length > 0) {
          setResources(resourceList);
        } else {
          setResources(fallbackResources);
        }
      } catch (fetchError) {
        console.error('Error fetching resources:', fetchError);
        setResources(fallbackResources);
        setError('Live resources could not be loaded from Firebase, so sample resources are being shown instead.');
      } finally {
        setLoading(false);
      }
    }

    void fetchResources();
  }, []);

  const availableCourses = useMemo(
    () => (selectedDegree ? courses[selectedDegree] || [] : []),
    [selectedDegree]
  );

  const filteredResources = useMemo(() => (
    resources.filter((resource) => {
      const normalizedSearch = search.trim().toLowerCase();

      if (selectedUniversity && resource.university !== selectedUniversity) return false;
      if (selectedDegree && resource.degree !== selectedDegree) return false;
      if (selectedCourse && resource.course !== selectedCourse) return false;
      if (selectedType !== 'all' && resource.type !== selectedType) return false;

      if (!normalizedSearch) return true;

      return [
        resource.title,
        resource.course,
        resource.instructor,
        resource.description,
      ].some((field) => field.toLowerCase().includes(normalizedSearch));
    })
  ), [resources, search, selectedCourse, selectedDegree, selectedType, selectedUniversity]);

  function clearAll() {
    setSelectedUniversity('');
    setSelectedDegree('');
    setSelectedCourse('');
    setSelectedType('all');
    setSearch('');
  }

  async function bumpCounter(resourceId: string, field: 'views' | 'downloads') {
    const existsInFirebase = resources.some((resource) => resource.id === resourceId && (resource.fileUrl !== undefined || resource.previewUrl !== undefined));

    if (!existsInFirebase) {
      return;
    }

    try {
      await updateDoc(doc(db, 'resources', resourceId), { [field]: increment(1) });
      setResources((current) =>
        current.map((resource) =>
          resource.id === resourceId ? { ...resource, [field]: resource[field] + 1 } : resource
        )
      );
    } catch (updateError) {
      console.error(`Error updating ${field}:`, updateError);
    }
  }

  async function handleOpen(resource: ViewResource) {
    await bumpCounter(resource.id, 'views');

    const destination = resource.previewUrl || resource.fileUrl;
    if (destination) {
      window.open(destination, '_blank', 'noopener,noreferrer');
      return;
    }

    alert('This resource does not have a preview link yet. Add one from the admin panel.');
  }

  async function handleDownload(resource: ViewResource) {
    await bumpCounter(resource.id, 'downloads');

    if (resource.fileUrl) {
      window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    alert('This resource does not have a download link yet. Add one from the admin panel.');
  }

  const hasFilters = Boolean(selectedUniversity || selectedDegree || selectedCourse || selectedType !== 'all' || search);

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="absolute left-1/4 top-0 h-[400px] w-[600px] rounded-full bg-funky-orange/10 blur-[120px]" />
      <div className="absolute right-1/4 top-40 h-[300px] w-[500px] rounded-full bg-funky-coral/10 blur-[100px]" />

      <div className="section-container relative z-10">
        <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-badge mx-auto mb-5 w-fit">Resource Hub</div>
          <h1 className="mb-5 font-display text-5xl tracking-tight sm:text-6xl">
            Academic <span className="gradient-text">Resources</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-white/65 sm:text-xl">
            Notes, past papers, timetables, and assignments filtered for your course and synced with Firebase.
          </p>
        </motion.div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-funky-coral/20 bg-funky-coral/10 px-4 py-3 text-sm text-pink-100">
            {error}
          </div>
        ) : null}

        <motion.div className="mb-8 flex flex-wrap justify-center gap-3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {resourceTypes.map((type) => {
            const Icon = type !== 'all' ? typeIcons[type] : Filter;
            const color = type !== 'all' ? typeColors[type] : '#2EF2FF';

            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300"
                style={{
                  background: selectedType === type ? `${color}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedType === type ? `${color}66` : 'rgba(255,255,255,0.08)'}`,
                  color: selectedType === type ? color : 'rgba(255,255,255,0.58)',
                  boxShadow: selectedType === type ? `0 8px 24px ${color}22` : 'none',
                }}
              >
                <Icon size={14} />
                {type === 'all' ? 'All Types' : type.replace('-', ' ')}
              </button>
            );
          })}
        </motion.div>

        <motion.div className="glass-card mb-8 p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="relative mb-5">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by title, course, instructor, or description..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-field bg-dark-800/50 py-3.5 pl-12"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="relative">
              <select
                value={selectedUniversity}
                onChange={(event) => {
                  setSelectedUniversity(event.target.value);
                  setSelectedDegree('');
                  setSelectedCourse('');
                }}
                className="input-field appearance-none cursor-pointer bg-dark-800/50 pr-8"
              >
                <option value="">All Universities</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.shortName}>
                    {university.shortName}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
            </div>

            <div className="relative">
              <select
                value={selectedDegree}
                onChange={(event) => {
                  setSelectedDegree(event.target.value);
                  setSelectedCourse('');
                }}
                className="input-field appearance-none cursor-pointer bg-dark-800/50 pr-8"
              >
                <option value="">All Degrees</option>
                {degrees.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
            </div>

            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(event) => setSelectedCourse(event.target.value)}
                className="input-field appearance-none cursor-pointer bg-dark-800/50 pr-8"
                disabled={!selectedDegree}
              >
                <option value="">All Courses</option>
                {availableCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
            </div>
          </div>

          {hasFilters ? (
            <button type="button" onClick={clearAll} className="mt-4 flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-white/80">
              <X size={12} />
              Clear all filters
            </button>
          ) : null}
        </motion.div>

        {!loading ? (
          <p className="mb-6 text-sm text-white/45">
            Found <span className="font-semibold text-white/80">{filteredResources.length}</span> resources
          </p>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-funky-cyan" />
          </div>
        ) : null}

        {!loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filteredResources.map((resource, index) => {
                const Icon = typeIcons[resource.type] || FileText;
                const color = typeColors[resource.type] || '#2EF2FF';
                const hasLink = Boolean(resource.fileUrl || resource.previewUrl);

                return (
                  <motion.div
                    key={resource.id}
                    layout
                    className="glass-card funky-border group flex h-full flex-col p-6"
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: Math.min(index * 0.04, 0.25) }}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                        style={{ background: `${color}16`, border: `1px solid ${color}33` }}
                      >
                        <Icon size={20} style={{ color }} />
                      </div>
                      <span className="rounded-full px-3 py-1.5 text-xs font-bold capitalize tracking-wide" style={{ background: `${color}14`, border: `1px solid ${color}33`, color }}>
                        {resource.type.replace('-', ' ')}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 font-display text-lg leading-snug text-white transition-colors group-hover:text-funky-yellow">
                      {resource.title}
                    </h3>

                    <p className="mb-1 text-xs font-medium text-white/55">
                      {resource.university} · {resource.degree}
                    </p>
                    <p className="mb-4 text-xs text-white/40">
                      {resource.course} · {resource.instructor}
                    </p>
                    <p className="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed text-white/65">
                      {resource.description}
                    </p>

                    <div className="mb-6 flex items-center gap-4 text-xs font-medium text-white/45">
                      <span className="flex items-center gap-1.5">
                        <Download size={13} />
                        {resource.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={13} />
                        {resource.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Star size={13} className="fill-amber-300 text-amber-300" />
                        {resource.rating > 0 ? resource.rating.toFixed(1) : 'New'}
                      </span>
                      <span className="ml-auto rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wide text-white/55">
                        {resource.fileType}
                      </span>
                    </div>

                    <div className="mt-auto flex gap-3">
                      <button type="button" onClick={() => void handleDownload(resource)} className="btn-primary flex-1 py-2.5 text-sm">
                        <Download size={14} />
                        Download
                      </button>
                      <button type="button" onClick={() => void handleOpen(resource)} className="btn-ghost px-4 py-2.5 text-sm" aria-label="Preview resource">
                        {hasLink ? <ExternalLink size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : null}

        {!loading && filteredResources.length === 0 ? (
          <div className="glass-card funky-border group relative mt-10 overflow-hidden p-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-funky-cyan/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-funky-cyan/30 bg-funky-cyan/10 shadow-[0_0_30px_rgba(46,242,255,0.15)] transition-all group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(46,242,255,0.22)]">
              <BookOpen size={40} className="text-funky-cyan" />
            </div>
            <h3 className="mb-3 font-display text-3xl">No resources found</h3>
            <p className="mx-auto mb-8 max-w-md text-lg font-medium text-white/60">
              Adjust your filters, seed Firebase from the admin panel, or add a new resource document.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button type="button" onClick={clearAll} className="btn-ghost px-6 py-3.5 text-sm font-bold">
                Clear all filters
              </button>
              {isAdmin ? (
                <Link href="/admin" className="btn-primary px-6 py-3.5 text-sm font-bold">
                  Open Admin Panel
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
