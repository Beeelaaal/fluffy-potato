'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Database, 
  Users, 
  Zap, 
  Search, 
  Download, 
  Check, 
  MessageSquare, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  DollarSign,
  MapPin,
  ChevronRight,
  FileText,
  Clock,
  UserCheck
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  badge: string;
  gradient: string;
}

const steps: Step[] = [
  {
    id: 0,
    title: 'Discover University Hub',
    subtitle: '120+ Pakistani Universities',
    description: 'Explore verified university profiles. Get instant access to official fee structures, degree programs, deadlines, and guide paths for admissions.',
    icon: GraduationCap,
    color: '#0066FF', // Blue
    badge: 'Step 1: Explore',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  {
    id: 1,
    title: 'Acquire Smart Resources',
    subtitle: 'Peer-to-Peer Academic Hub',
    description: 'Access notes, solved mid/final past papers, timetables, and assignments uploaded directly by students in your exact course and section.',
    icon: Database,
    color: '#FF4B72', // Coral
    badge: 'Step 2: Prepare',
    gradient: 'from-coral-500/20 to-coral-600/5',
  },
  {
    id: 2,
    title: 'Hire Expert Peer Tutors',
    subtitle: 'On-Demand Tutor Marketplace',
    description: 'Post a study request, receive competitive bids from verified tutors who aced your exact course under the same instructor, and pick your match.',
    icon: Users,
    color: '#06b6d4', // Cyan
    badge: 'Step 3: Connect',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
  },
  {
    id: 3,
    title: 'Excel & Earn Money',
    subtitle: 'Peer Validation & Earnings',
    description: 'Score high in exams, download files, or upload your own notes and tutor others to build your profile, earn cash, and gain recognition.',
    icon: Zap,
    color: '#FFD214', // Yellow
    badge: 'Step 4: Conquer',
    gradient: 'from-yellow-500/20 to-yellow-600/5',
  },
];

export default function FeaturesSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedUni, setSelectedUni] = useState<'FAST' | 'NUST' | 'LUMS' | 'GIKI'>('FAST');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);
  const [acceptedBid, setAcceptedBid] = useState<string | null>(null);
  const [earningsCycle, setEarningsCycle] = useState(0);

  // Auto-cycles minor animation effects in Excel tab
  useEffect(() => {
    const timer = setInterval(() => {
      setEarningsCycle((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle mock file download animation
  const startMockDownload = (fileName: string) => {
    if (downloading) return;
    setDownloading(true);
    setDownloadProgress(0);
    setDownloadedFile(null);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadedFile(fileName);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Reset demo states when step changes
  useEffect(() => {
    setDownloading(false);
    setDownloadProgress(0);
    setDownloadedFile(null);
    setAcceptedBid(null);
  }, [activeStep]);

  const activeStepData = steps[activeStep];

  return (
    <section className="py-28 relative overflow-hidden" id="features">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[600px] h-[600px] bg-brand-500/5 blur-[150px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-funky-cyan/5 blur-[120px] rounded-full" />
      </div>

      <div className="section-container relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="section-badge mb-5 mx-auto w-fit">⚡ How Tute Works</div>
          <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight mb-6">
            Everything you need, <span className="gradient-text">made simple.</span>
          </h2>
          <p className="text-[#0B071E]/70 text-lg max-w-2xl mx-auto font-semibold">
            Navigate through university applications, download key course resources, or hire expert peer tutors.
          </p>
        </div>

        {/* Infographic Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT: Infographic Steps Pipeline (Column Span: 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  onMouseEnter={() => setActiveStep(step.id)}
                  className={`glass-card p-6 cursor-pointer relative transition-all duration-300 ${
                    isActive 
                      ? 'border-[#0B071E] dark:border-white scale-[1.02] shadow-[8px_8px_0px_#0B071E] dark:shadow-[8px_8px_0px_#ffffff]' 
                      : 'border-dark/8 dark:border-white/10 opacity-75 hover:opacity-100 hover:scale-[1.01] hover:border-dark/30 dark:hover:border-white/30'
                  } ${
                    isActive 
                      ? 'bg-white dark:bg-dark-800' 
                      : 'bg-white/65 dark:bg-dark-800/65'
                  }`}
                >
                  {/* Active background tint */}
                  {isActive && (
                    <div 
                      className={`absolute inset-0 rounded-[22px] bg-gradient-to-br ${step.gradient} opacity-40 pointer-events-none`} 
                    />
                  )}

                  <div className="flex gap-4 items-start relative z-10">
                    {/* Number Node with Connective Ring */}
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-base border-2 transition-all duration-300 ${
                          isActive 
                            ? 'border-dark dark:border-white text-dark shadow-[2px_2px_0px_#0B071E] dark:shadow-[2px_2px_0px_#ffffff]' 
                            : 'bg-white dark:bg-dark-700 border-dark/10 dark:border-white/10 text-[#8E8A9E]'
                        }`}
                        style={{
                          backgroundColor: isActive ? step.color : undefined,
                        }}
                      >
                        {step.id + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-funky-blue font-semibold">
                          {step.badge}
                        </span>
                        {isActive && (
                          <motion.div 
                            layoutId="activeDot"
                            className="live-badge py-0 px-2 text-[8px]"
                          >
                            active
                          </motion.div>
                        )}
                      </div>
                      <h3 className="font-display font-black text-xl text-dark dark:text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-dark/80 dark:text-white/60 text-xs font-black mb-2 opacity-80">
                        {step.subtitle}
                      </p>
                      
                      {/* Expanded description on active */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="text-text-secondary dark:text-white/70 text-sm font-medium leading-relaxed mt-2"
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Left edge colored stripe */}
                  <div 
                    className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-transform duration-300"
                    style={{ backgroundColor: step.color, transform: isActive ? 'scaleY(1)' : 'scaleY(0.4)' }}
                  />
                </div>
              );
            })}
          </div>

          {/* RIGHT: Interactive Glassmorphic Live Dashboard Preview (Column Span: 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="glass-card p-6 flex-1 flex flex-col bg-white dark:bg-dark-800 border-[#0B071E] dark:border-white shadow-[8px_8px_0px_#0B071E] dark:shadow-[8px_8px_0px_#ffffff] relative overflow-hidden min-h-[460px] justify-between">
              
              {/* Top Bar of "Device Viewport" */}
              <div className="flex items-center justify-between border-b-2 border-dark/8 dark:border-white/10 pb-4 mb-4 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-coral border border-dark/20 dark:border-white/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow border border-dark/20 dark:border-white/20" />
                  <div className="w-3 h-3 rounded-full bg-funky-cyan border border-dark/20 dark:border-white/20" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted dark:text-white/40 ml-2">
                    tmy_tute🤞
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-dark/5 dark:bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-black text-[#0B071E]/80 dark:text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Online</span>
                </div>
              </div>

              {/* Dynamic Sandbox Display */}
              <div className="flex-1 flex flex-col justify-center relative z-10 py-2">
                <AnimatePresence mode="wait">
                                 {/* STEP 0: Discover Sandbox */}
                   {activeStep === 0 && (
                    <motion.div
                      key="discover-sandbox"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-5 h-full justify-between"
                    >
                      {/* Interactive Selection Tabs */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(['FAST', 'NUST', 'LUMS', 'GIKI'] as const).map((uniName) => (
                          <button
                            key={uniName}
                            onClick={() => setSelectedUni(uniName)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
                              selectedUni === uniName
                                ? 'bg-funky-blue border-dark dark:border-white text-white shadow-[2px_2px_0px_#0B071E] dark:shadow-[2px_2px_0px_#ffffff] -translate-y-0.5'
                                : 'bg-[#FDFBF7] dark:bg-dark-700 border-dark/10 dark:border-white/10 text-text-secondary dark:text-white/70 hover:border-dark/30 dark:hover:border-white/30'
                            }`}
                          >
                            🏫 {uniName}
                          </button>
                        ))}
                      </div>

                      {/* University Preview Card */}
                      <div className="glass-card p-5 border-2 border-dark/12 dark:border-white/10 bg-white/95 dark:bg-dark-800/95 relative overflow-hidden shadow-sm">
                        
                        {/* Dynamic University Cover Strip */}
                        <div className={`h-16 rounded-xl mb-4 bg-gradient-to-r flex items-center px-4 justify-between border-2 border-dark/8 dark:border-white/10 ${
                          selectedUni === 'FAST' ? 'from-blue-600/30 to-indigo-600/20' :
                          selectedUni === 'NUST' ? 'from-cyan-600/30 to-blue-600/20' :
                          selectedUni === 'LUMS' ? 'from-orange-600/30 to-red-600/20' :
                          'from-emerald-600/30 to-teal-600/20'
                        }`}>
                          <div>
                            <h4 className="font-display font-black text-lg text-dark dark:text-white">
                              {selectedUni === 'FAST' ? 'FAST-NUCES' :
                               selectedUni === 'NUST' ? 'NUST Islamabad' :
                               selectedUni === 'LUMS' ? 'LUMS Lahore' :
                               'GIKI Swabi'}
                            </h4>
                            <span className="text-[9px] font-black uppercase text-dark/70 dark:text-white/70 flex items-center gap-1">
                              <MapPin size={10} />
                              {selectedUni === 'FAST' ? 'Lahore, Karachi, Isb, Pesh, Chiniot' :
                               selectedUni === 'NUST' ? 'H-12 Sector, Islamabad' :
                               selectedUni === 'LUMS' ? 'DHA Phase 5, Lahore' :
                               'Topi, Khyber Pakhtunkhwa'}
                            </span>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-dark/15 dark:border-white/10 ${
                            selectedUni === 'FAST' || selectedUni === 'GIKI' 
                              ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400' 
                              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400'
                          }`}>
                            {selectedUni === 'FAST' || selectedUni === 'GIKI' ? 'Closed' : 'Open'}
                          </span>
                        </div>

                        {/* Uni Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-dark/4 dark:bg-white/5 p-2.5 rounded-xl border border-dark/5 dark:border-white/10">
                            <span className="block text-[8px] font-black uppercase text-text-muted dark:text-white/40">Degree Programs</span>
                            <span className="text-[11px] font-black text-dark dark:text-white">
                              {selectedUni === 'FAST' ? 'BS CS, BS SE, BS AI, BS DS' :
                               selectedUni === 'NUST' ? 'BS SE, BS EE, BS ME, BBA' :
                               selectedUni === 'LUMS' ? 'BSc CS, BSc Econ, Law, MBA' :
                               'BS ME, BS EE, BS CS, BS DS'}
                            </span>
                          </div>
                          <div className="bg-dark/4 dark:bg-white/5 p-2.5 rounded-xl border border-dark/5 dark:border-white/10">
                            <span className="block text-[8px] font-black uppercase text-text-muted dark:text-white/40">Estimated Semester Fee</span>
                            <span className="text-[11px] font-black text-dark dark:text-white">
                              {selectedUni === 'FAST' ? 'Rs. 162,000' :
                               selectedUni === 'NUST' ? 'Rs. 185,000' :
                               selectedUni === 'LUMS' ? 'Rs. 480,000' :
                               'Rs. 320,000'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="tag-cyan py-0.5 px-2 text-[9px]">Entry Test Prep</span>
                          <span className="tag-blue py-0.5 px-2 text-[9px]">Fee Calculator</span>
                          <span className="tag-orange py-0.5 px-2 text-[9px]">GPA Guide</span>
                        </div>

                        <div className="mt-4 border-t border-dark/8 dark:border-white/10 pt-3 flex items-center justify-between">
                          <span className="text-[10px] text-text-secondary dark:text-white/60 font-semibold">
                            ★ 4.8 Rating • 1.2k applicants guided
                          </span>
                          <button className="flex items-center gap-1.5 text-xs font-black text-funky-blue hover:underline">
                            Explore Profile <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}                     {/* STEP 1: Prepare Sandbox */}
                   {activeStep === 1 && (
                    <motion.div
                      key="prepare-sandbox"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-text-muted dark:text-white/40">Current Search</span>
                          <h4 className="font-display font-black text-base text-dark dark:text-white flex items-center gap-1.5">
                            <BookOpen size={16} className="text-coral" /> CS-201 Object Oriented Programming
                          </h4>
                        </div>
                        <span className="tag-blue text-[9px] py-0.5">FAST Lahore</span>
                      </div>

                      {/* Mock File List */}
                      <div className="flex flex-col gap-2">
                        {[
                          { name: 'CS201_OOP_Midterm_Sol_2025.pdf', size: '1.4 MB', type: 'PDF' },
                          { name: 'OOP_Polymorphism_LectureNotes.docx', size: '2.1 MB', type: 'DOCX' },
                          { name: 'Lab_Assignment_4_AbstractClasses.zip', size: '4.8 MB', type: 'ZIP' },
                        ].map((file) => {
                          const isThisDownloaded = downloadedFile === file.name;
                          return (
                            <div 
                              key={file.name}
                              className="flex items-center justify-between p-3 rounded-xl border-2 border-dark/8 dark:border-white/10 bg-white dark:bg-dark-800 transition-all hover:border-dark/15 dark:hover:border-white/20"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center text-coral flex-shrink-0">
                                  <FileText size={16} />
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-xs font-black text-dark dark:text-white truncate">
                                    {file.name}
                                  </span>
                                  <span className="text-[9px] font-extrabold text-text-muted dark:text-white/40 uppercase">
                                    {file.type} • {file.size}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => startMockDownload(file.name)}
                                disabled={downloading && !isThisDownloaded}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black border-2 transition-all flex items-center gap-1.5 ${
                                  isThisDownloaded
                                    ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-400'
                                    : 'bg-[#FDFBF7] dark:bg-dark-700 border-dark dark:border-white text-dark dark:text-white shadow-[1.5px_1.5px_0px_#0B071E] dark:shadow-[1.5px_1.5px_0px_#FFFFFF] active:translate-y-0.5'
                                }`}
                              >
                                {isThisDownloaded ? (
                                  <>
                                    <Check size={10} /> Saved
                                  </>
                                ) : downloading && downloadingFileProgress(file.name) ? (
                                  <>
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-coral border-t-transparent animate-spin" />
                                    {downloadProgress}%
                                  </>
                                ) : (
                                  <>
                                    <Download size={10} /> Get File
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Download Status Notification */}
                      {downloadedFile && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 p-2.5 rounded-xl text-center text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center justify-center gap-2"
                        >
                          <Check size={14} className="bg-emerald-500 text-white rounded-full p-0.5" />
                          <span>Saved <strong>{downloadedFile}</strong> to your device. 1 credit consumed.</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}                     {/* STEP 2: Connect Sandbox */}
                   {activeStep === 2 && (
                    <motion.div
                      key="connect-sandbox"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Active Help Request Card */}
                      <div className="bg-dark/5 dark:bg-white/5 p-4 rounded-xl border border-dark/8 dark:border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="live-badge text-[8px] py-0 px-2">Bidding Live</span>
                          <span className="text-[9px] font-black text-text-muted dark:text-white/40 flex items-center gap-1">
                            <Clock size={10} /> 5 bids received
                          </span>
                        </div>
                        <p className="text-xs font-bold text-dark dark:text-white leading-relaxed">
                          "I have my Object Oriented Programming midterm this Friday at FAST. I don't understand polymorphism, pointers, or abstract interfaces. Need a 2-hour crash prep session!"
                        </p>
                      </div>

                      {/* Bids List */}
                      <div className="flex flex-col gap-2.5">
                        {[
                          { id: '1', name: 'Zainab Raza', gpa: '3.94 GPA', rate: 'Rs. 1,500/hr', match: '98%', uni: 'FAST Lahore' },
                          { id: '2', name: 'Hamza Shah', gpa: '3.81 GPA', rate: 'Rs. 1,200/hr', match: '92%', uni: 'FAST Islamabad' },
                        ].map((bid) => {
                          const isHired = acceptedBid === bid.id;
                          const isSomeoneElseHired = acceptedBid !== null && acceptedBid !== bid.id;

                          if (isSomeoneElseHired) return null;

                          return (
                            <motion.div 
                              layout
                              key={bid.id}
                              className={`p-3.5 rounded-xl border-2 transition-all flex flex-col md:flex-row justify-between md:items-center gap-3 ${
                                isHired 
                                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-[4px_4px_0px_#10B981]'
                                  : 'border-dark/8 dark:border-white/10 bg-white dark:bg-dark-800 hover:border-dark/15 dark:hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-display font-black text-sm flex-shrink-0">
                                  {bid.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black text-dark dark:text-white">{bid.name}</span>
                                    <span className="px-1.5 py-0.5 rounded bg-dark/6 dark:bg-white/10 text-[8px] font-black uppercase text-funky-blue">
                                      {bid.gpa}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-bold text-text-secondary dark:text-white/60">
                                    🎓 Aced OOP under Dr. Asim last sem • {bid.uni}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-dark/6 dark:border-white/10 pt-2 md:pt-0">
                                <div>
                                  <span className="block text-[8px] font-black uppercase text-text-muted dark:text-white/40 text-left md:text-right">Price Bid</span>
                                  <span className="text-sm font-black text-dark dark:text-white">{bid.rate}</span>
                                </div>
                                <button
                                  onClick={() => setAcceptedBid(bid.id)}
                                  className={`px-3 py-2 rounded-lg text-xs font-black border-2 transition-all ${
                                    isHired
                                      ? 'bg-emerald-500 text-white border-emerald-600 pointer-events-none'
                                      : 'bg-funky-cyan border-dark dark:border-white text-dark shadow-[2px_2px_0px_#0B071E] dark:shadow-[2px_2px_0px_#ffffff] active:translate-y-0.5 hover:bg-cyan-300'
                                  }`}
                                >
                                  {isHired ? '✓ Hired' : 'Hire Tutor'}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Match Confirmed Overlay */}
                      {acceptedBid && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-dark dark:bg-dark-900 text-white p-4 rounded-xl flex items-center justify-between border-2 border-dark dark:border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white animate-bounce">
                              <MessageSquare size={14} />
                            </div>
                            <div>
                              <span className="block text-xs font-black">🎉 Match Secured!</span>
                              <span className="text-[10px] text-white/70">Connecting with Zainab Raza...</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-funky-cyan flex items-center gap-1 animate-pulse">
                            Chat Open <ChevronRight size={10} />
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 3: Excel Sandbox */}
                  {activeStep === 3 && (
                    <motion.div
                      key="excel-sandbox"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Tutor Scorecard */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-dark-800 p-3 rounded-xl border-2 border-dark/8 dark:border-white/10 text-center shadow-sm">
                          <span className="block text-[8px] font-black text-text-muted dark:text-white/40 uppercase">My Rating</span>
                          <span className="text-lg font-black text-dark dark:text-white flex items-center justify-center gap-0.5 mt-0.5">
                            4.95 <Star size={14} className="fill-yellow text-yellow" />
                          </span>
                        </div>
                        <div className="bg-white dark:bg-dark-800 p-3 rounded-xl border-2 border-dark/8 dark:border-white/10 text-center shadow-sm">
                          <span className="block text-[8px] font-black text-text-muted dark:text-white/40 uppercase">Prep Credits</span>
                          <span className="text-lg font-black text-dark dark:text-white flex items-center justify-center gap-0.5 mt-0.5">
                            84 <Sparkles size={14} className="text-funky-blue animate-pulse" />
                          </span>
                        </div>
                        <div className="bg-white dark:bg-dark-800 p-3 rounded-xl border-2 border-dark/8 dark:border-white/10 text-center shadow-sm">
                          <span className="block text-[8px] font-black text-text-muted dark:text-white/40 uppercase">Withdrawable</span>
                          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
                            Rs. 18.5k <DollarSign size={14} />
                          </span>
                        </div>
                      </div>

                      {/* Mock Earnings Progress Infographic (Interactive SVG Chart) */}
                      <div className="bg-white dark:bg-dark-800 p-4 rounded-xl border-2 border-dark/8 dark:border-white/10 relative shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black uppercase text-text-muted dark:text-white/40">Weekly Tutor Income Growth</span>
                          <span className="tag-blue text-[8px] font-black">Average: Rs. 6,400/wk</span>
                        </div>

                        {/* Dynamic SVG chart */}
                        <div className="h-24 w-full relative">
                          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0066FF" stopOpacity="0.4"/>
                                <stop offset="100%" stopColor="#0066FF" stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            
                            {/* Grid Lines */}
                            <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(11,7,30,0.05)" strokeWidth="0.5" />
                            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(11,7,30,0.05)" strokeWidth="0.5" />

                            {/* Chart Area Fill */}
                            <path
                              d="M 0 30 Q 15 22 30 25 T 60 12 T 90 5 T 100 8 L 100 30 Z"
                              fill="url(#chartGrad)"
                            />

                            {/* Chart Line */}
                            <path
                              d="M 0 30 Q 15 22 30 25 T 60 12 T 90 5 T 100 8"
                              fill="none"
                              stroke="#0066FF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />

                            {/* Animated nodes along line */}
                            <circle cx="30" cy="25" r="1.5" fill="#FF4B72" stroke="currentColor" className="text-dark dark:text-white" strokeWidth="0.5" />
                            <circle cx="60" cy="12" r="1.5" fill="#2EF2FF" stroke="currentColor" className="text-dark dark:text-white" strokeWidth="0.5" />
                            <circle cx="90" cy="5" r="2" fill="#FFD214" stroke="currentColor" className="text-dark dark:text-white animate-pulse" strokeWidth="0.5" />
                          </svg>

                          {/* Float overlays for checkpoints */}
                          <div className="absolute top-2 left-[25%] bg-[#0B071E] text-white text-[7px] font-bold px-1.5 py-0.5 rounded border border-white/20">
                            Wk 1: Rs. 4.2k
                          </div>
                          <div className="absolute top-[35%] left-[55%] bg-[#0B071E] text-white text-[7px] font-bold px-1.5 py-0.5 rounded border border-white/20">
                            Wk 2: Rs. 12k
                          </div>
                          <div className="absolute top-1 right-[5%] bg-[#0B071E] text-white text-[7px] font-bold px-1.5 py-0.5 rounded border border-white/20">
                            Wk 3: Rs. 24.5k
                          </div>
                        </div>
                      </div>

                      {/* Mini peer testimonial loop */}
                      <div className="bg-dark/5 dark:bg-white/5 p-3 rounded-xl border border-dark/6 dark:border-white/10">
                        <span className="block text-[8px] font-black uppercase text-text-muted dark:text-white/40 mb-1">Student Review on my profile</span>
                        <p className="text-[11px] font-bold text-dark dark:text-white italic leading-relaxed">
                          {earningsCycle === 0 && '“Sana was extremely patient while debugging my C++ pointer array. Got a perfect GPA score this semester! Thank you Tute!” — Ali R.'}
                          {earningsCycle === 1 && '“Excellent explanation on dynamic arrays and polymorphism. Highly recommend for fast midterm prep.” — Bilal K.'}
                          {earningsCycle === 2 && '“Fast response and clear slides. Saved my semester final exams. A++ peer matching!” — Fatima Z.'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom Sandbox Guide Info */}
              <div className="border-t-2 border-dark/8 dark:border-white/10 pt-3 mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-text-muted dark:text-white/40">
                <span> {activeStepData.title.split(' ')[0]}</span>
                <span className="text-[#0B071E] dark:text-white">Tute Live</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );

  // Simple progression helper inside step 2 download simulation
  function downloadingFileProgress(fileName: string) {
    return downloading;
  }
}
