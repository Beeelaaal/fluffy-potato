'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInWithGitHub, signUpWithEmail } from '@/lib/auth';
import { TuteLogo } from '@/components/brand/TuteLogo';

export default function SignupPage() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleEmailSignup = async () => {
    try {
      setLoading(true);
      setErr('');

      if (!form.name.trim()) {
        setErr('Please enter your full name');
        return;
      }

      if (!form.email.trim()) {
        setErr('Please enter your email');
        return;
      }

      if (!form.university.trim()) {
        setErr('Please enter your university');
        return;
      }

      if (form.password.length < 6) {
        setErr('Password must be at least 6 characters');
        return;
      }

      await signUpWithEmail(form.email, form.password, {
        name: form.name,
        role,
        university: form.university,
      });
      router.push('/');
    } catch (error: any) {
      console.error('Email signup error:', error);
      setErr(error?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleProviderSignup = async (provider: 'google' | 'github') => {
    setErr('');
    setLoadingProvider(provider);
    try {
      if (provider === 'google') await signInWithGoogle();
      else await signInWithGitHub();
      router.push('/');
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        setErr('Popup was closed. Please try again.');
      } else if (code === 'auth/account-exists-with-different-credential') {
        setErr('An account already exists with a different sign-in method.');
      } else {
        setErr(error?.message || `${provider} sign-up failed.`);
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 pt-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-funky-orange/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        className="w-full max-w-md relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-block mb-8">
          <TuteLogo size={34} />
        </div>

        <h1 className="font-display font-bold text-3xl mb-2">Create an Account</h1>
        <p className="text-white/45 mb-8">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-funky-orange hover:text-funky-orange2 transition-colors"
          >
            Sign in
          </Link>
        </p>

        <div className="flex gap-3 mb-6">
          {[
            { value: 'student' as const, label: 'I&apos;m a Student' },
            { value: 'tutor' as const, label: 'I&apos;m a Tutor' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all border ${role === value
                ? 'border-funky-orange/50 bg-funky-orange/15 text-funky-orange'
                : 'border-white/8 bg-white/3 text-white/50 hover:text-white/70'
                }`}
              dangerouslySetInnerHTML={{ __html: label }}
            />
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ahmed Raza"
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1.5 block">University</label>
            <input
              name="university"
              value={form.university}
              onChange={handleChange}
              placeholder="e.g. NUST, LUMS, FAST..."
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {err ? <p className="text-red-400 text-sm mb-4">{err}</p> : null}

        <p className="text-white/30 text-xs mb-5">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-funky-orange">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-funky-orange">
            Privacy Policy
          </a>
          .
        </p>

        <button
          type="button"
          onClick={handleEmailSignup}
          disabled={loading}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/8" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-dark-900 px-3 text-white/30">or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleProviderSignup('google')}
            disabled={loading || loadingProvider !== null}
            className="btn-ghost py-3 text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loadingProvider === 'google' ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-funky-orange rounded-full animate-spin" />
            ) : (
              <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
                <path fill="#EA4335" d="M24 9.5c3.2 0 6 1.1 8.2 2.9l6.1-6.1C34.5 3.1 29.6 1 24 1 14.6 1 6.7 6.5 3.2 14.4l7.1 5.5C12 14.2 17.5 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-17z" />
                <path fill="#FBBC05" d="M10.3 28.1A14.6 14.6 0 0 1 9.5 24c0-1.4.2-2.8.6-4.1L3 14.4A23 23 0 0 0 1 24c0 3.7.9 7.2 2.5 10.3l7.8-6.2z"/>
                <path fill="#34A853" d="M24 47c5.7 0 10.5-1.9 14-5.1l-7.4-5.7c-1.9 1.3-4.4 2-6.6 2-6.5 0-12-4.7-13.8-11l-7.7 6c3.5 7.9 11.4 13.8 21.5 13.8z"/>
              </svg>
            )}
            Google
          </button>

          <button
            type="button"
            onClick={() => handleProviderSignup('github')}
            disabled={loading || loadingProvider !== null}
            className="btn-ghost py-3 text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loadingProvider === 'github' ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-funky-orange rounded-full animate-spin" />
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            )}
            GitHub
          </button>
        </div>
      </motion.div>
    </div>
  );
}