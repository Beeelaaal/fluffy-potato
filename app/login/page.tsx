'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { signInWithGoogle, signInWithGitHub, signInWithEmail } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [provider, setProvider] = useState<string|null>(null);
  const [err,      setErr]      = useState('');
  const [form, setForm] = useState({ email:'', password:'' });

  const set = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p=>({...p,[e.target.name]:e.target.value}));

  async function emailSignIn() {
    setErr('');
    if(!form.email.trim()){ setErr('Enter your email'); return; }
    if(!form.password)    { setErr('Enter your password'); return; }
    try {
      setLoading(true);
      await signInWithEmail(form.email, form.password);
      router.push('/');
    } catch(e:any) {
      const c = e?.code||'';
      if(c.includes('invalid-credential')||c.includes('wrong-password')||c.includes('user-not-found'))
        setErr('Incorrect email or password.');
      else if(c.includes('too-many-requests')) setErr('Too many attempts. Try later.');
      else setErr(e?.message||'Sign in failed.');
    } finally { setLoading(false); }
  }

  async function socialSignIn(p:'google'|'github') {
    setErr(''); setProvider(p);
    try {
      if(p==='google') await signInWithGoogle(); else await signInWithGitHub();
      router.push('/');
    } catch(e:any) {
      if(!e?.code?.includes('popup-closed')) setErr(e?.message||`${p} sign-in failed.`);
    } finally { setProvider(null); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-28 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full bg-funky-cyan/10 blur-[120px] pointer-events-none"/>

      <motion.div className="w-full max-w-md relative z-10"
        initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#2EF2FF,#00BBDD)'}}>
            <Zap size={17} className="text-dark-900" strokeWidth={2.5}/>
          </div>
          <span className="font-display font-bold text-xl">Tutor<span className="gradient-text">Tap</span></span>
        </Link>

        <h1 className="font-display text-4xl mb-2">Welcome back</h1>
        <p className="text-white/45 mb-8 text-sm">
          No account?{' '}
          <Link href="/signup" className="text-funky-cyan hover:text-funky-lime transition-colors font-semibold">Sign up free</Link>
        </p>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(['google','github'] as const).map(p=>(
            <button key={p} onClick={()=>socialSignIn(p)}
              disabled={loading||provider!==null}
              className="btn-ghost py-3 text-sm disabled:opacity-60 flex items-center justify-center gap-2">
              {provider===p
                ? <span className="w-4 h-4 border-2 border-white/25 border-t-funky-cyan rounded-full animate-spin"/>
                : p==='google'
                  ? <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
                      <path fill="#EA4335" d="M24 9.5c3.2 0 6 1.1 8.2 2.9l6.1-6.1C34.5 3.1 29.6 1 24 1 14.6 1 6.7 6.5 3.2 14.4l7.1 5.5C12 14.2 17.5 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-17z"/>
                      <path fill="#FBBC05" d="M10.3 28.1A14.6 14.6 0 0 1 9.5 24c0-1.4.2-2.8.6-4.1L3 14.4A23 23 0 0 0 1 24c0 3.7.9 7.2 2.5 10.3l7.8-6.2z"/>
                      <path fill="#34A853" d="M24 47c5.7 0 10.5-1.9 14-5.1l-7.4-5.7c-1.9 1.3-4.4 2-6.6 2-6.5 0-12-4.7-13.8-11l-7.7 6C7.5 41.1 15.4 47 24 47z"/>
                    </svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                      <path d="M9 18c-4.51 2-5-2-7-2"/>
                    </svg>}
              {p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8"/></div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 text-white/30" style={{background:'var(--dark-bg)'}}>or email</span>
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={set}
              placeholder="you@example.com" className="input-field"
              onKeyDown={e=>e.key==='Enter'&&emailSignIn()}/>
          </div>
          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <input name="password" type={showPass?'text':'password'} value={form.password} onChange={set}
                placeholder="••••••••" className="input-field pr-10"
                onKeyDown={e=>e.key==='Enter'&&emailSignIn()}/>
              <button type="button" onClick={()=>setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
              </button>
            </div>
          </div>
        </div>

        {err && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 bg-red-500/10 border border-red-500/20">{err}</div>}

        <button onClick={emailSignIn} disabled={loading||provider!==null}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-60">
          {loading
            ? <><span className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/>Signing in…</>
            : 'Sign In'}
        </button>

        <p className="mt-6 text-center text-xs text-white/30">
          <a href="#" className="text-funky-cyan hover:text-funky-lime transition-colors">Forgot password?</a>
        </p>
      </motion.div>
    </div>
  );
}
