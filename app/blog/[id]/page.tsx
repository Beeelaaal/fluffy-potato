import Link from 'next/link';
import { ArrowLeft, User, Calendar, Clock, Eye } from 'lucide-react';
import { mapCategory, getCategoryColor, getBlogCoverImage } from '@/lib/blog';
import BlogReadTracker from '@/components/BlogReadTracker';

const STATIC_POSTS = [
  {
    slug: 'nust-admission-guide-net-prep-eligibility',
    title: 'The Ultimate NUST Admission Guide: NET Prep & Eligibility',
    excerpt: 'Detailed walkthrough on acing the NUST Entry Test, aggregate calculations, and admission requirements.',
    authorName: 'Ali Murtaza',
    date: 'May 28, 2026',
    readTime: '6 min read',
    category: 'Admission Guides',
    color: '#0066FF',
  },
  {
    slug: 'fast-nu-surviving-guide-dos-donts-freshmen',
    title: "FAST-NU Surviving Guide: Do's and Don'ts for Freshmen",
    excerpt: 'How to survive the strict academic environment, maintain a high GPA, and navigate university life at FAST.',
    authorName: 'Zainab Fatima',
    date: 'May 24, 2026',
    readTime: '8 min read',
    category: "Do's & Don'ts",
    color: '#2EF2FF',
  },
  {
    slug: 'higher-education-scholarships-pakistan-hec-need-based',
    title: 'Higher Education Scholarships in Pakistan: HEC & Need-Based Guides',
    excerpt: 'Learn how to apply for fully funded HEC, USAID, and need-based scholarships at top universities.',
    authorName: 'Hamza Khan',
    date: 'May 19, 2026',
    readTime: '5 min read',
    category: 'Scholarships',
    color: '#FF7A18',
  },
  {
    slug: 'university-application-deadlines-cheat-sheet-fall-2026',
    title: 'University Application Deadlines Cheat Sheet (Fall 2026)',
    excerpt: 'Track key registration timelines, entry test dates, and deadline details for LUMS, FAST, NUST, IBA, and AKU.',
    authorName: 'Dr. Bilal Ahmed',
    date: 'Jun 02, 2026',
    readTime: '4 min read',
    category: 'Deadlines',
    color: '#FF5C7A',
  },
  {
    slug: 'mastering-exam-prep-midterms-finals',
    title: 'Mastering Exam Prep: How to Ace University Midterms & Finals',
    excerpt: 'Proven study methods, note-taking strategies, and past paper prep tips for exam sessions.',
    authorName: 'Ayesha Raza',
    date: 'Jun 05, 2026',
    readTime: '7 min read',
    category: 'Exam Sessions',
    color: '#D8FF3E',
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
      const title = fields.title?.stringValue || 'Untitled';
      const dbCategory = fields.category?.stringValue || 'General';
      const mappedCategory = mapCategory(dbCategory, title, id);
      
      return {
        slug: id,
        title,
        content: fields.content?.stringValue || '',
        excerpt: fields.excerpt?.stringValue || '',
        authorName: fields.authorName?.stringValue || 'Anonymous Author',
        category: mappedCategory,
        date: fields.date?.stringValue || '',
        readTime: fields.readTime?.stringValue || '5 min read',
        color: getCategoryColor(mappedCategory),
        createdAt: fields.createdAt?.stringValue || '',
        views: fields.views?.stringValue || fields.views?.integerValue || '1.2k',
        coverImage: getBlogCoverImage(mappedCategory, title, id),
      };
    }
  } catch (err) {
    console.error("Firestore REST fetch error:", err);
  }

  // 2. Fallback to static mock posts
  const staticPost = STATIC_POSTS.find(p => p.slug === id);
  if (staticPost) {
    const mappedCategory = mapCategory(staticPost.category, staticPost.title, staticPost.slug);
    let mockContent = '';
    if (staticPost.slug === 'nust-admission-guide-net-prep-eligibility') {
      mockContent = `## Introduction
The NUST Entry Test (NET) is one of the most competitive entrance exams in Pakistan, determining admissions for thousands of applicants in engineering, computing, and business degrees. Preparing for it requires a solid strategy, conceptual clarity, and rigorous time management.

![NUST Islamabad Campus - Preparing for NET](https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop)

## Understanding the Test Pattern
NET is conducted in two formats: Computer-based at the Islamabad campus, and Paper-based in Karachi and Quetta.
- **For Engineering/CS**: Mathematics (40%), Physics (30%), Chemistry or Computer Science (15%), English (10%), and Intelligence (5%).
- **For Business/Social Sciences**: Quantitative (40%), Verbal (40%), and Intelligence (20%).
There is no negative marking, so you must attempt all 200 questions.

## Prep Strategy & Recommended Material
1. **Textbooks First**: NUST maps its test syllabus directly to FSc / Federal Board textbooks. Thoroughly study your board mathematics and physics textbooks.
2. **Key Concepts in Physics**: Focus heavily on Electromagnetism, Waves, and Mechanics.
3. **Speed Mathematics**: Memorize shortcuts for formulas and equations. Do not waste time on long proofs.
4. **Solve English & Intelligence First**: Since English and Intelligence questions are straightforward, solve them in the first 15 minutes to secure a time buffer for lengthy calculations.

## Aggregate Calculator & Targets
NUST admission aggregate is calculated as:
- **NUST Entry Test (NET)**: 75%
- **FSc/A-Levels/Equivalent**: 15%
- **Matric/O-Levels/Equivalent**: 10%
Aim for a NET score of 135+ for Computing fields (Software Engineering, CS) and 125+ for core engineering fields.`;
    } else if (staticPost.slug === 'fast-nu-surviving-guide-dos-donts-freshmen') {
      mockContent = `## Introduction
FAST National University is widely renowned for its rigorous computing curriculum and high employability. However, its strict academic atmosphere and rapid pace can be overwhelming for freshmen. Here is a definitive guide on how to survive and maintain a strong GPA.

![FAST-NU Coding Labs & Classrooms](https://images.unsplash.com/photo-1484417894907-623942c8ea29?q=80&w=600&auto=format&fit=crop)

## The Grade Struggle: Relative vs Absolute
FAST utilizes relative grading in most core CS/SE courses, while some general courses use absolute grading.
- Maintaining a CGPA above 3.0 is highly desirable for job placements and internships.
- Continuous assessments (quizzes, assignments, and lab tasks) make up a significant portion of your grade. Never take them lightly.

## Crucial Do's
- **Start Coding Assignments Early**: FAST CS assignments are notoriously long. Starting the night before is a recipe for a 0 or negative marks.
- **Maintain 80% Attendance**: FAST strictly enforces the 80% attendance rule. If you fall below 80% even by a decimal, you get an automatic F grade. No excuses are accepted.
- **Consult Lab Engineers**: Lab engineers are your best resource for debugging code and clarifying compiler errors.

## Crucial Don'ts
- **Never Plagiarize Code**: FAST uses MOSS (Measure Of Software Similarity) to detect copied code. If caught copying code from a classmate, GitHub, or ChatGPT, you will receive negative marks (e.g., -10) and face disciplinary committees.
- **Don't Skip Classes**: Skipping classes puts you behind quickly because concepts build directly upon the previous lectures.`;
    } else if (staticPost.slug === 'higher-education-scholarships-pakistan-hec-need-based') {
      mockContent = `## Introduction
Higher education in Pakistan can be expensive, but financial constraints shouldn't prevent you from studying at top-tier institutions. There are numerous fully funded scholarships, need-based aids, and interest-free student loans available.

![Financial Aid and HEC Scholarships](https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop)

## Top Scholarship Programs
1. **HEC Need-Based Scholarships**: Higher Education Commission offers fully funded tuition fees and a monthly stipend for students coming from low-income families.
2. **Ehsaas Undergraduate Scholarship**: Covers tuition fees and provides an annual stipend. Highly beneficial for public sector university students.
3. **USAID Need-Based Scholarships**: Targeted at financially underprivileged students studying in participating Pakistani universities.
4. **PEEF Scholarships**: Punjab Education Endowment Fund provides financial assistance to students with high merit from across Pakistan.

## University-Specific Financial Aid
- **LUMS Financial Aid**: LUMS meets 100% of demonstrated financial need. Offers scholarships and interest-free loans.
- **IBA National Talent Hunt Program (NTHP)**: A fully funded program targeting high-achieving students from underprivileged districts.
- **FAST Financial Assistance**: FAST provides interest-free study loans to students based on merit and financial need, repayable after graduation.

## Application Tips & Document Checklist
Ensure you have the following documents ready:
- Salary slips or income certificate of the earning parent/guardian.
- Utility bills (electricity, gas, water) of the last 6 months.
- Rent agreement (if applicable).
- Academic transcripts and certificates.
Demonstrate complete honesty in your financial declaration forms.`;
    } else if (staticPost.slug === 'university-application-deadlines-cheat-sheet-fall-2026') {
      mockContent = `## Introduction
Staying organized and tracking deadlines is half the battle in the university admission process. Missed deadlines mean waiting a whole year for the next cycle. Here is a curated timeline cheat sheet for Fall 2026 admissions at Pakistan's top-tier universities.

![Deadlines Calendar Sheet](https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop)

## Application Deadlines (Fall 2026)

### LUMS (Lahore University of Management Sciences)
- **Application Deadline**: First week of February 2026.
- **SAT / LCAT Test Dates**: Must be taken by March 2026.
- **Financial Aid Deadline**: Mid-February 2026.

### NUST (National University of Sciences & Technology)
NUST conducts NET in four series:
- **NET Series 1**: December 2025.
- **NET Series 2**: February - March 2026.
- **NET Series 3**: May 2026.
- **NET Series 4**: June - July 2026.
- **Final Application Deadline**: Early July 2026.

### FAST-NU (National University of Computer & Emerging Sciences)
- **Registration Opens**: First week of June 2026.
- **Registration Closes**: First week of July 2026.
- **Admission Entry Tests**: Mid-July 2026.

### IBA Karachi (Institute of Business Administration)
- **Round 1 Deadline**: March 2026 (Test in mid-March).
- **Round 2 Deadline**: June 2026 (Test in late June).

### AKU (Aga Khan University)
- **Registration Deadline**: Early May 2026.
- **Entry Test Date**: Mid-June 2026.`;
    } else if (staticPost.slug === 'mastering-exam-prep-midterms-finals') {
      mockContent = `## Introduction
Midterm and final exam sessions are high-stress periods for university students. Cramming the night before rarely works and leads to burnout. To secure top grades, you must employ scientifically proven study techniques and maintain a structured routine.

![Exam Study Sessions and Techniques](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop)

## Effective Study Techniques
1. **The Feynman Technique**: Explain a complex concept to a five-year-old in simple words. If you struggle, review the textbooks until you fill the gap.
2. **Pomodoro (50/10 Split)**: Work for 50 minutes with full focus, then take a 10-minute break. This prevents cognitive exhaustion.
3. **Active Recall**: Test yourself with self-made flashcards or past questions instead of just re-reading slides.

## The 11th Hour Exam Rescue Checklist
If exams are starting next week and you are behind, follow these emergency protocols:
- **Prioritize Past Papers**: Professors often reuse exam patterns, structures, and occasionally specific questions. Practice past papers from the last 3-5 years.
- **Leverage Course Outline**: Focus on high-weightage chapters. Do not try to learn everything; aim to master the topics that carry the most marks.
- **Hire a Peer Tutor**: If you are completely stuck on a concept (like compiler construction or dynamic programming), use a [peer-to-peer tutoring service](/marketplace) to clear it in one session.
- **Get Quality Sleep**: 6 hours of sleep before an exam is crucial. A sleep-deprived brain cannot recall complex equations or debug code under exam stress.`;
    }

    return {
      ...staticPost,
      category: mappedCategory,
      color: getCategoryColor(mappedCategory),
      content: mockContent,
      views: '2.5k',
      coverImage: getBlogCoverImage(mappedCategory, staticPost.title, staticPost.slug),
    };
  }

  return null;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);
  if (!post) {
    return {
      title: 'Insider Guide Not Found | YOUR INSIDER',
      description: 'The requested insider guide was not found on Tute.',
    };
  }

  return {
    title: `${post.title} | YOUR INSIDER`,
    description: post.excerpt,
    keywords: [post.category, 'Tute', 'Tutoring', 'Pakistan', 'University', 'Education', 'Admission', 'Scholarship', 'Deadline'],
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
      <div className="min-h-screen pt-32 pb-24 text-center bg-[#FDFBF7] dark:bg-[#070310] transition-colors duration-500 flex flex-col items-center justify-center">
        <h1 className="font-display font-black text-3xl mb-4 text-[#0B071E] dark:text-white">Insider Guide Not Found</h1>
        <p className="text-[#0B071E]/60 dark:text-white/60 mb-6 font-semibold">The article you are looking for does not exist or has been deleted.</p>
        <Link href="/blog" className="btn-primary inline-flex">
          <ArrowLeft size={16} /> Back to YOUR INSIDER
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
              className="text-[#0066FF] dark:text-funky-cyan hover:underline font-bold"
            >
              {label}
            </a>
          );
        } else {
          parts.push(
            <Link
              key={matchIndex}
              href={url}
              className="text-[#0066FF] dark:text-funky-cyan hover:underline font-bold"
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
    // Normalise Windows line endings \r\n to \n
    const normalizedContent = content.replace(/\r\n/g, '\n');
    return normalizedContent.split('\n\n').map((block, idx) => {
      const trimmed = block.trim();

      // Parse markdown images
      if (trimmed.startsWith('![')) {
        const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const src = imgMatch[2];
          return (
            <div key={idx} className="my-8 overflow-hidden rounded-3xl border border-dark/10 dark:border-white/10 shadow-lg relative group">
              <img
                src={src}
                alt={alt}
                className="w-full object-cover max-h-[380px] transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {alt && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-xs font-semibold text-white/90">
                  {alt}
                </div>
              )}
            </div>
          );
        }
      }

      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="font-display font-black text-3xl mt-6 mb-3 text-[#0B071E] dark:text-white">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="font-display font-bold text-2xl mt-5 mb-3 text-[#0B071E] dark:text-white">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="font-display font-bold text-xl mt-4 mb-2 text-[#0B071E] dark:text-white">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((item, i) => (
          <li key={i} className="list-disc ml-5 mb-1.5 font-semibold text-[#0B071E]/80 dark:text-white/80 text-sm">
            {parseTextWithLinks(item.replace('- ', ''))}
          </li>
        ));
        return <ul key={idx} className="my-3 space-y-1">{items}</ul>;
      }
      return <p key={idx} className="text-[#0B071E]/80 dark:text-white/80 text-base leading-relaxed mb-4 font-semibold">{parseTextWithLinks(trimmed)}</p>;
    });
  };

  const coverImage = post.coverImage || getBlogCoverImage(post.category, post.title, post.slug);

  return (
    <div className="min-h-screen pt-32 pb-24 relative bg-[#FDFBF7] dark:bg-[#070310] transition-colors duration-500">
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-funky-blue/5 dark:bg-funky-blue/[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-funky-cyan/5 dark:bg-funky-cyan/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container max-w-3xl relative z-10 mx-auto px-4">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#0B071E]/60 dark:text-white/60 hover:text-[#0066FF] dark:hover:text-funky-cyan text-sm mb-8 transition-colors font-bold">
          <ArrowLeft size={15} /> Back to YOUR INSIDER
        </Link>

        <article className="glass-card p-8 sm:p-12 bg-white/95 dark:bg-[#110A20]/90 border border-dark/10 dark:border-white/10 shadow-xl rounded-3xl">
          {/* Article Cover Image */}
          {coverImage && (
            <div className="w-full h-[240px] sm:h-[350px] overflow-hidden rounded-2xl mb-8 relative border border-dark/10 dark:border-white/10 shadow-md">
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          <header className="mb-8 border-b border-black/5 dark:border-white/5 pb-8">
            <span
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider mb-4 inline-block border"
              style={{
                background: `${post.color}12`,
                borderColor: `${post.color}25`,
                color: post.color,
              }}
            >
              {post.category}
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl leading-tight text-[#0B071E] dark:text-white mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-[#0B071E]/60 dark:text-white/50 font-bold items-center">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-[#0066FF] dark:text-funky-cyan" />
                {post.authorName}
              </span>
              <span className="text-[#0B071E]/20 dark:text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#0066FF] dark:text-funky-cyan" />
                {post.date}
              </span>
              <span className="text-[#0B071E]/20 dark:text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#0066FF] dark:text-funky-cyan" />
                {post.readTime}
              </span>
              {post.views && (
                <>
                  <span className="text-[#0B071E]/20 dark:text-white/20">•</span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} className="text-funky-orange" />
                    {post.views} reads
                  </span>
                </>
              )}
            </div>
          </header>

          <div className="prose prose-blue dark:prose-invert max-w-none">
            {renderContent(post.content)}
          </div>
        </article>

        {/* Track blog read */}
        <BlogReadTracker slug={params.id} />
      </div>
    </div>
  );
}
