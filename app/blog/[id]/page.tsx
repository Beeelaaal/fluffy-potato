import Link from 'next/link';
import { ArrowLeft, User, Calendar, Clock } from 'lucide-react';

const STATIC_POSTS = [
  {
    slug: 'how-to-ace-your-university-entry-tests',
    title: 'How to Ace Your University Entry Tests (NET, FAST, & LCAT)',
    excerpt: 'Cracking admission entry tests requires strategy. Here are the top tips from NUST & FAST alumni on how to manage your time and score 140+.',
    authorName: 'Ali Murtaza',
    date: 'May 18, 2026',
    readTime: '6 min read',
    category: 'Admissions',
    color: '#06b6d4',
  },
  {
    slug: 'the-ultimate-guide-to-surviving-data-structures-algorithms',
    title: 'The Ultimate Guide to Surviving Data Structures & Algorithms',
    excerpt: 'DSA is notoriously tough for CS juniors. We break down the key topics like graphs, trees, and dynamic programming with top resource links.',
    authorName: 'Zainab Fatima',
    date: 'May 12, 2026',
    readTime: '8 min read',
    category: 'Academics',
    color: '#0052CC',
  },
  {
    slug: '5-side-hustles-for-pakistani-university-students-in-2026',
    title: '5 Side Hustles for Pakistani University Students in 2026',
    excerpt: 'Balancing studies and earning pocket money is possible. Learn how to tutor on Tute, write code, or design graphics to fund your semester expenses.',
    authorName: 'Hamza Khan',
    date: 'May 05, 2026',
    readTime: '5 min read',
    category: 'Student Life',
    color: '#ec4899',
  },
];

async function getBlogPost(id: string) {
  // 1. Try fetching from Firestore REST API
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/tutor-tap/databases/(default)/documents/blogs/${id}`,
      { next: { revalidate: 30 } } // Cache for 30 seconds
    );
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields;
      return {
        slug: id,
        title: fields.title?.stringValue || 'Untitled',
        content: fields.content?.stringValue || '',
        excerpt: fields.excerpt?.stringValue || '',
        authorName: fields.authorName?.stringValue || 'Anonymous Author',
        category: fields.category?.stringValue || 'General',
        date: fields.date?.stringValue || '',
        readTime: fields.readTime?.stringValue || '5 min read',
        color: fields.color?.stringValue || '#0066FF',
        createdAt: fields.createdAt?.stringValue || '',
      };
    }
  } catch (err) {
    console.error("Firestore REST fetch error:", err);
  }

  // 2. Fallback to static mock posts
  const staticPost = STATIC_POSTS.find(p => p.slug === id);
  if (staticPost) {
    const mockContent = staticPost.slug === 'how-to-ace-your-university-entry-tests'
      ? `## Introduction
Entry tests are a gateway to top engineering and computing universities in Pakistan. Cracking them is not just about intelligence, but about consistent, strategic effort. Here are the top guidelines from NUST & FAST alumni on how to manage your time and score 140+ in your entry tests.

## 1. Concept Clarity Over Rote Learning
Entry tests like NET (NUST Entry Test) assess your concept depths. Don't memorize steps; understand the 'Why' behind equations. Memorize standard math identities and physics formulas, but practice their applications thoroughly.

## 2. Speed and Time Management
You get 200 questions to solve in 3 hours. That is less than a minute per question.
- Do NOT get stuck on a single difficult math query.
- Solve English, Intelligence, and Chemistry sections first (they take less than 30 seconds per question).
- Allocate the saved time to Math and Physics calculations.

## 3. Practice Past Papers
Reviewing past papers is single-handedly the most important aspect of prep. It helps you get accustomed to the exact paper pattern and recurring concepts.`
      : staticPost.slug === 'the-ultimate-guide-to-surviving-data-structures-algorithms'
      ? `## Introduction
Data Structures & Algorithms (DSA) is notoriously tough for CS juniors. It is the core theoretical baseline of software development, which makes it crucial for academic grades and top-tier interviews. Let's break down the key topics and surviving guidelines.

## Master the Core Topics
Struggling with graphs, trees, and recursion? Take things slowly.
- **Arrays & Linked Lists**: The linear foundations. Know the insertion and deletion time complexities.
- **Trees & Graphs**: Master Binary Search Trees (BST), Breadth-First Search (BFS), and Depth-First Search (DFS).
- **Dynamic Programming (DP)**: Solve the knapsack problem, Fibonacci series, and coin change.

## Practice Coding
Do not just read algorithms. Write the code manually in C++, Java, or Python. Implement the data structures from scratch to understand pointers, memory layouts, and stack states.`
      : `## Introduction
Balancing university studies and earning pocket money is completely possible. In 2026, Pakistani students have access to various digital tools and freelance marketplaces to support themselves. Here are 5 side hustles that are easy to start.

## 1. Academic Peer Tutoring
Tute.pk lets you monetize your course excellence. If you scored A+ in a course, teach juniors at your own or other universities. You can easily charge between PKR 1,000 to PKR 3,000 per hour.

## 2. Freelance Content Writing & Blogging
Many startups need search-engine-friendly blog articles. If you have good command of English or tech niches, you can earn competitive rates.

## 3. Graphic Design & Presentation Creation
University professors love clean presentations, and businesses need social media posters. Mastering Figma or Canva can yield decent side income.`;
    return {
      ...staticPost,
      content: mockContent,
    };
  }

  return null;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);
  if (!post) {
    return {
      title: 'Blog Post Not Found | Tute',
      description: 'The requested blog post was not found on Tute.',
    };
  }

  return {
    title: `${post.title} | Tute Blog`,
    description: post.excerpt,
    keywords: [post.category, 'Tute', 'Tutoring', 'Pakistan', 'University', 'Education'],
    authors: [{ name: post.authorName }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt || post.date,
      authors: [post.authorName],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-24 text-center">
        <h1 className="font-display font-black text-3xl mb-4 text-[#0B071E]">Blog Post Not Found</h1>
        <p className="text-[#0B071E]/60 mb-6 font-semibold">The article you are looking for does not exist or has been deleted.</p>
        <Link href="/blog" className="btn-primary inline-flex">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const parseTextWithLinks = (text: string) => {
    const regex = /\[(cta:)?([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      const isCta = !!match[1];
      const label = match[2];
      const url = match[3];
      const isExternal = url.startsWith('http') || url.startsWith('//');

      if (isCta) {
        if (isExternal) {
          parts.push(
            <a
              key={matchIndex}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 my-2 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 rounded-xl shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              {label}
            </a>
          );
        } else {
          parts.push(
            <Link
              key={matchIndex}
              href={url}
              className="inline-flex items-center justify-center px-5 py-2.5 my-2 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-600 rounded-xl shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              {label}
            </Link>
          );
        }
      } else {
        if (isExternal) {
          parts.push(
            <a
              key={matchIndex}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0066FF] hover:underline font-bold"
            >
              {label}
            </a>
          );
        } else {
          parts.push(
            <Link
              key={matchIndex}
              href={url}
              className="text-[#0066FF] hover:underline font-bold"
            >
              {label}
            </Link>
          );
        }
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="font-display font-black text-3xl mt-6 mb-3 text-[#0B071E]">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="font-display font-bold text-2xl mt-5 mb-3 text-[#0B071E]">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="font-display font-bold text-xl mt-4 mb-2 text-[#0B071E]">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((item, i) => (
          <li key={i} className="list-disc ml-5 mb-1.5 font-semibold text-[#0B071E]/80 text-sm">
            {parseTextWithLinks(item.replace('- ', ''))}
          </li>
        ));
        return <ul key={idx} className="my-3 space-y-1">{items}</ul>;
      }
      return <p key={idx} className="text-[#0B071E]/80 text-base leading-relaxed mb-4 font-semibold">{parseTextWithLinks(trimmed)}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container max-w-3xl relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#0B071E]/60 hover:text-[#0066FF] text-sm mb-8 transition-colors font-bold">
          <ArrowLeft size={15} /> Back to Blog
        </Link>

        <article className="glass-card p-8 sm:p-12 bg-white/95 shadow-xl">
          <header className="mb-8 border-b border-black/5 pb-8">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 inline-block"
              style={{
                background: `${post.color || '#0066FF'}15`,
                border: `1px solid ${post.color || '#0066FF'}25`,
                color: post.color || '#0066FF',
              }}
            >
              {post.category}
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl leading-tight text-[#0B071E] mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-[#0B071E]/60 font-bold items-center">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-[#0066FF]" />
                {post.authorName}
              </span>
              <span className="text-[#0B071E]/20">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#0066FF]" />
                {post.date}
              </span>
              <span className="text-[#0B071E]/20">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#0066FF]" />
                {post.readTime}
              </span>
            </div>
          </header>

          <div className="prose prose-blue max-w-none">
            {renderContent(post.content)}
          </div>
        </article>
      </div>
    </div>
  );
}
