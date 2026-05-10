import { Timestamp } from 'firebase/firestore';
import { Resource } from '@/data/resources';

type UnknownRecord = Record<string, unknown>;

const DEFAULT_RESOURCE_TYPE: Resource['type'] = 'notes';

const typeAliases: Record<string, Resource['type']> = {
  notes: 'notes',
  note: 'notes',
  'past-paper': 'past-paper',
  pastpaper: 'past-paper',
  past_paper: 'past-paper',
  pastpapers: 'past-paper',
  past_papers: 'past-paper',
  assignment: 'assignment',
  assignments: 'assignment',
  timetable: 'timetable',
  slide: 'slide',
  slides: 'slide',
  book: 'book',
  books: 'book',
};

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizeType(value: unknown): Resource['type'] {
  if (typeof value !== 'string') return DEFAULT_RESOURCE_TYPE;
  return typeAliases[value.toLowerCase()] ?? DEFAULT_RESOURCE_TYPE;
}

function toIsoDate(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

export function normalizeResource(id: string, input: UnknownRecord): Resource & { fileUrl?: string; previewUrl?: string } {
  const university = asString(input.university, 'General');
  const degree = asString(input.degree, 'General');
  const course = asString(input.course, 'General');
  const instructor = asString(input.instructor, 'Staff');
  const title = asString(input.title, 'Untitled resource');

  return {
    id,
    title,
    type: normalizeType(input.type),
    university,
    universityId: asString(input.universityId, slugify(university || 'general')),
    degree,
    course,
    instructor,
    semester: asNumber(input.semester, 1),
    year: asNumber(input.year, new Date().getFullYear()),
    fileSize: asString(input.fileSize, 'Unknown'),
    fileType: asString(input.fileType, 'FILE'),
    downloads: asNumber(input.downloads, 0),
    views: asNumber(input.views, 0),
    rating: asNumber(input.rating, 0),
    uploadedBy: asString(input.uploadedBy, asString(input.uploadedByName, 'Unknown')),
    uploadedAt: toIsoDate(input.uploadedAt ?? input.createdAt),
    tags: Array.isArray(input.tags) ? input.tags.filter((tag): tag is string => typeof tag === 'string') : [],
    description: asString(input.description, 'No description added yet.'),
    fileUrl: asString(input.fileUrl, asString(input.url)),
    previewUrl: asString(input.previewUrl),
  };
}

export function buildResourcePayload(input: {
  title: string;
  type: Resource['type'];
  university: string;
  degree: string;
  course: string;
  instructor: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
}) {
  const university = input.university.trim();

  return {
    title: input.title.trim(),
    type: input.type,
    university,
    universityId: slugify(university),
    degree: input.degree.trim(),
    course: input.course.trim(),
    instructor: input.instructor.trim(),
    semester: 1,
    year: new Date().getFullYear(),
    fileSize: input.fileSize.trim() || 'Unknown',
    fileType: input.fileType.trim() || 'LINK',
    downloads: 0,
    views: 0,
    rating: 0,
    uploadedBy: input.uploadedBy.trim(),
    uploadedAt: new Date().toISOString(),
    description: input.description.trim(),
    tags: [],
    fileUrl: input.fileUrl.trim(),
  };
}
