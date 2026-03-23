'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Zap, Mail, Lock, User, AlertCircle, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const passwordChecks = [
    { label: '8+ Characters', pass: form.password.length >= 8 },
    { label: 'Digit Included', pass: /\d/.test(form.password) },
    { label: 'Special Character', pass: /[!@#$%^&*(),.?":{}|<>]/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      toast.success('Workspace Activated! Welcome to Autoify.');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[140px] opacity-20" />
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
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
          <h1 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Provisioning</h1>
          <p className="text-slate-500 text-sm font-medium">Initialize your dedicated automation core.</p>
        </div>

        <div className="glass-card p-10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-white/5 bg-white/[0.01]">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-8 animate-shake">
              <AlertCircle size={18} /> {error.toUpperCase()}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="section-label">Operator Name</label>
              <div className="relative group/field">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/field:text-brand-400 transition-colors" />
                <input
                  id="register-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Connor"
                  className="input-field h-12 pl-12 text-sm font-bold placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="section-label">Operational Email</label>
              <div className="relative group/field">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/field:text-brand-400 transition-colors" />
                <input
                  id="register-email"
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
              <label className="section-label">Secure Sequence</label>
              <div className="relative group/field">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/field:text-brand-400 transition-colors" />
                <input
                  id="register-password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field h-12 pl-12 text-sm font-bold placeholder:text-slate-800"
                />
              </div>
              {form.password && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {passwordChecks.map((c, i) => (
                    <div key={i} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${c.pass ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                      <Check size={12} className={c.pass ? 'text-emerald-500' : 'text-slate-700'} />
                      <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              id="register-submit" 
              type="submit" 
              disabled={isLoading} 
              className="btn-primary w-full h-12 justify-center py-3 mt-4 text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(99,102,241,0.2)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.3)]"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin mr-3" /> : null}
              {isLoading ? 'Synchronizing...' : 'Initialize Core →'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-loose">
              Already indexed?{' '}
              <Link href="/auth/login" className="text-brand-400 hover:text-white transition-colors border-b border-brand/20 hover:border-white pb-0.5 ml-2">
                Re-Authorize
              </Link>
            </p>
          </div>

          <p className="text-[9px] font-bold text-slate-700 text-center mt-8 uppercase tracking-widest leading-relaxed opacity-50">
            By initializing, you confirm adherence to our <br/>
            Security Protocols and Service Manifest.
          </p>
        </div>
      </div>
    </div>
  );
}
