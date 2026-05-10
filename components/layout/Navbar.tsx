'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, GraduationCap, Users, LayoutDashboard, Menu, X, Zap, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
  { href:'/universities', label:'Universities', icon:GraduationCap },
  { href:'/resources',    label:'Resources',    icon:BookOpen      },
  { href:'/marketplace',  label:'Marketplace',  icon:Users         },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [open,     setOpen]         = useState(false);
  const pathname                    = usePathname();
  const { user, profile, loading }  = useAuth();

  useEffect(()=>{
    const h = () => setScrolled(window.scrollY>20);
    window.addEventListener('scroll',h);
    return ()=>window.removeEventListener('scroll',h);
  },[]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? 'py-3 border-b border-glass backdrop-blur-xl' : 'py-5 bg-transparent'
      }`} style={scrolled?{background:'rgba(10,5,20,0.88)'}:{}}>
        <div className="section-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#2EF2FF,#00BBDD)'}}>
              <Zap size={17} className="text-dark-900" strokeWidth={2.5}/>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Tutor<span className="gradient-text">Tap</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({href,label,icon:Icon})=>{
              const active = pathname===href||pathname.startsWith(href+'/');
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active ? 'text-funky-cyan border border-funky-cyan/20' : 'text-white/55 hover:text-white hover:bg-white/5'
                  }`}
                  style={active?{background:'rgba(46,242,255,0.07)'}:{}}>
                  <Icon size={14}/>{label}
                </Link>
              );
            })}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {loading ? <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"/> : user ? (
              <div className="flex items-center gap-2">
                {profile?.role==='admin' && (
                  <Link href="/admin"
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                    style={{background:'rgba(216,255,62,0.10)',border:'1px solid rgba(216,255,62,0.25)',color:'#D8FF3E'}}>
                    <LayoutDashboard size={12}/> Admin
                  </Link>
                )}
                <Link href={`/profile/${user.uid}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)'}}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                    style={{background:'linear-gradient(135deg,#2EF2FF,#00BBDD)'}}>
                    {profile?.photoURL
                      ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover"/>
                      : <UserIcon size={11} className="text-dark-900"/>}
                  </div>
                  <span className="text-sm font-semibold text-white/90">{profile?.name?.split(' ')[0]||'User'}</span>
                </Link>
                <button onClick={logoutUser}
                  className="p-2 rounded-xl text-white/35 hover:text-funky-coral hover:bg-funky-coral/10 transition-colors"
                  title="Logout"><LogOut size={15}/></button>
              </div>
            ) : (
              <>
                <Link href="/login"  className="btn-ghost text-sm py-2 px-4">Sign In</Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-xl text-white/55 hover:text-white hover:bg-white/5 transition-all"
            onClick={()=>setOpen(!open)} aria-label="Menu">
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 md:hidden"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=>setOpen(false)}/>
            <motion.div
              className="absolute top-0 right-0 w-72 h-full flex flex-col p-6 pt-20"
              style={{background:'#0A0514',borderLeft:'1px solid rgba(255,255,255,0.07)'}}
              initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
              transition={{type:'spring',damping:30,stiffness:300}}>
              <div className="space-y-1 mb-6">
                {NAV.map(({href,label,icon:Icon})=>(
                  <Link key={href} href={href} onClick={()=>setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/65 hover:text-white hover:bg-white/5 font-semibold transition-all"
                    style={pathname===href?{color:'#2EF2FF',background:'rgba(46,242,255,0.07)'}:{}}>
                    <Icon size={17}/> {label}
                  </Link>
                ))}
              </div>
              <div className="pt-4 flex flex-col gap-2.5" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                {loading ? <div className="h-10 rounded-xl animate-pulse bg-white/5"/> : user ? (
                  <>
                    {profile?.role==='admin' && (
                      <Link href="/admin" onClick={()=>setOpen(false)}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
                        style={{background:'rgba(216,255,62,0.10)',color:'#D8FF3E',border:'1px solid rgba(216,255,62,0.22)'}}>
                        <LayoutDashboard size={15}/> Admin Dashboard
                      </Link>
                    )}
                    <Link href={`/profile/${user.uid}`} onClick={()=>setOpen(false)} className="btn-ghost text-center">
                      <UserIcon size={15}/> My Profile
                    </Link>
                    <button onClick={()=>{logoutUser();setOpen(false);}}
                      className="py-3 rounded-xl font-semibold"
                      style={{border:'1px solid rgba(255,80,80,0.22)',color:'#FF7A7A'}}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login"  onClick={()=>setOpen(false)} className="btn-ghost text-center">Sign In</Link>
                    <Link href="/signup" onClick={()=>setOpen(false)} className="btn-primary text-center">Get Started</Link>
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
