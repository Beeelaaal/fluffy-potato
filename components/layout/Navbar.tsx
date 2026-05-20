'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, GraduationCap, Users, LayoutDashboard, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { TuteLogo } from '@/components/brand/TuteLogo';

const NAV = [
  { href: '/universities', label: 'Universities', icon: GraduationCap },
  { href: '/resources',    label: 'Resources',    icon: BookOpen },
  { href: '/marketplace',  label: 'Marketplace',  icon: Users },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const pathname                = usePathname();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 py-3 border-b border-white/5 bg-[#0B071E]/95 backdrop-blur-md transition-all duration-300"
      >
        <div className="section-container flex items-center justify-between">
          <Link href="/">
            <TuteLogo size={34} />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'text-[#2EF2FF] bg-[#2EF2FF]/10 border border-[#2EF2FF]/20'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all border border-[#2EF2FF]/20 bg-[#2EF2FF]/5 text-[#2EF2FF]"
                  >
                    <LayoutDashboard size={12} /> Admin
                  </Link>
                )}
                <Link
                  href={`/profile/${user.uid}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FF4B72, #8B5CF6)' }}
                  >
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={11} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white/90">
                    {profile?.name?.split(' ')[0] || 'User'}
                  </span>
                </Link>
                <button
                  onClick={logoutUser}
                  className="p-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login"  className="text-white/80 hover:text-white text-sm font-bold py-2 px-4 transition-all">Sign In</Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute top-0 right-0 w-72 h-full flex flex-col p-6 pt-20 bg-[#0B071E] border-l border-white/5"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="space-y-1 mb-6">
                {NAV.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      pathname === href
                        ? 'text-[#2EF2FF] bg-[#2EF2FF]/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={17} /> {label}
                  </Link>
                ))}
              </div>
              <div className="pt-4 flex flex-col gap-2.5 border-t border-white/5">
                {loading ? (
                  <div className="h-10 rounded-xl animate-pulse bg-white/5" />
                ) : user ? (
                  <>
                    {profile?.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-[#8B5CF6]/20 text-[#c084fc] border border-[#8B5CF6]/30"
                      >
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href={`/profile/${user.uid}`}
                      onClick={() => setOpen(false)}
                      className="text-center py-3 rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2"
                    >
                      <UserIcon size={15} /> My Profile
                    </Link>
                    <button
                      onClick={() => { logoutUser(); setOpen(false); }}
                      className="py-3 rounded-xl font-semibold border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login"  onClick={() => setOpen(false)} className="text-center py-3 rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/5">Sign In</Link>
                    <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary text-center">Get Started</Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
