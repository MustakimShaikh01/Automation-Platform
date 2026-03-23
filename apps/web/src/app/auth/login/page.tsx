'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Zap, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Access Granted! Welcome back.');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const { user, token } = useAuthStore();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (user || token) {
      setShouldRedirect(true);
      router.replace('/dashboard');
    }
  }, [user, token, router]);

  if (shouldRedirect) return null;

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-6 relative overflow-hidden selection:bg-brand/30">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[140px] opacity-20" />
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Entry Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-500">
              <Zap size={28} className="text-white fill-white" />
            </div>
            <div className="text-left">
              <span className="text-3xl font-black text-white tracking-tighter block leading-none">Autoify</span>
              <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] mt-1 block">Automation OS</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">System Access</h1>
          <p className="text-slate-500 text-sm font-medium">Initialize your secure workstation session.</p>
        </div>

        {/* Console Container */}
        <div className="glass-card p-10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-white/5 bg-white/[0.01]">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-8 animate-shake">
              <AlertCircle size={18} />
              {error.toUpperCase()}
            </div>
          )}

          <button
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/google`}
            className="w-full h-12 flex items-center justify-center gap-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg width="20" height="20" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.71v2.25h2.91c1.7-1.56 2.68-3.87 2.68-6.61z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.25c-.81.54-1.85.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.33C2.43 16.03 5.46 18 9 18z"/>
              <path fill="#FBBC05" d="M3.97 10.73c-.18-.54-.28-1.12-.28-1.73s.1-1.19.28-1.73V4.94H.95C.35 6.16 0 7.54 0 9s.35 2.84.95 4.06l3.02-2.33z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0 5.46 0 2.43 1.97.95 4.94l3.02 2.33c.71-2.12 2.69-3.7 5.03-3.7z"/>
            </svg>
            Omni Identity
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black text-slate-700">
              <span className="bg-[#0c0c14] px-4">Standard Auth</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="section-label">Operator Primary</label>
              <div className="relative group/field">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/field:text-brand-400 transition-colors" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ID@DOMAIN.SYSTEM"
                  className="input-field h-12 pl-12 text-sm font-bold placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="section-label">Credential Sequence</label>
              <div className="relative group/field">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/field:text-brand-400 transition-colors" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field h-12 pl-12 text-sm font-bold placeholder:text-slate-800"
                />
              </div>
            </div>

            <button 
              id="login-submit" 
              type="submit" 
              disabled={isLoading} 
              className="btn-primary w-full h-12 justify-center py-3 mt-4 text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(99,102,241,0.2)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.3)]"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin mr-3" /> : null}
              {isLoading ? 'Decrypting...' : 'Authorize Login'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-loose">
              New to the system?{' '}
              <Link href="/auth/register" className="text-brand-400 hover:text-white transition-colors border-b border-brand/20 hover:border-white pb-0.5 ml-2">
                Provision Workspace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
