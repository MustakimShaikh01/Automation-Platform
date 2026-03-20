'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
  Zap, Bot, GitBranch, BarChart3, Shield, Globe,
  Play, ChevronRight, Check, ArrowRight, Layers,
  Webhook, Brain, Timer, Mail, Slack, CreditCard,
} from 'lucide-react';

const FEATURES = [
  { icon: <GitBranch size={22} />, title: 'Visual Workflow Builder', desc: 'Drag-and-drop nodes to build complex automations without writing a single line of code.' },
  { icon: <Brain size={22} />, title: 'AI-Powered Nodes', desc: 'Embed GPT-4 directly in your workflows. Summarize, classify, generate, and make AI decisions.' },
  { icon: <Zap size={22} />, title: 'Instant Execution Engine', desc: 'BullMQ-powered queue processes thousands of automations per minute with retry logic.' },
  { icon: <Webhook size={22} />, title: 'Webhook Triggers', desc: 'Every workflow gets a unique webhook URL. Trigger automations from any external service.' },
  { icon: <Globe size={22} />, title: 'White-Label Ready', desc: 'Brand the platform as your own. Custom domains, logos, and colors for every client.' },
  { icon: <Shield size={22} />, title: 'Enterprise Security', desc: 'AES-256 credential encryption, JWT auth, HMAC webhook validation, and rate limiting.' },
];

const INTEGRATIONS = [
  { icon: <Mail size={18} />, name: 'Gmail', color: '#EA4335' },
  { icon: <Slack size={18} />, name: 'Slack', color: '#4A154B' },
  { icon: <CreditCard size={18} />, name: 'Stripe', color: '#635BFF' },
  { icon: <Bot size={18} />, name: 'OpenAI', color: '#10a37f' },
  { icon: <BarChart3 size={18} />, name: 'Sheets', color: '#0F9D58' },
  { icon: <Timer size={18} />, name: 'Twilio', color: '#F22F46' },
];

const PLANS = [
  {
    name: 'Starter', price: '$29', period: '/mo',
    features: ['5 active workflows', '1,000 executions/mo', '3 integrations', 'Webhook triggers', 'Email support'],
    cta: 'Get Started', highlight: false,
  },
  {
    name: 'Pro', price: '$99', period: '/mo',
    features: ['Unlimited workflows', '50,000 executions/mo', 'All integrations', 'AI nodes', 'Priority support', 'Custom domain'],
    cta: 'Start Free Trial', highlight: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    features: ['Unlimited everything', 'White-label SaaS', 'Voice automation', 'SLA guarantee', 'Dedicated support', 'On-premise option'],
    cta: 'Contact Sales', highlight: false,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user || token) {
      router.replace('/dashboard');
    }
  }, [user, token, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Dynamic cursor glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.06), transparent 80%)`,
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(99,102,241,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Autoify</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors underline-offset-4 hover:underline">Features</a>
            <a href="#integrations" className="hover:text-white transition-colors underline-offset-4 hover:underline">Integrations</a>
            <a href="#pricing" className="hover:text-white transition-colors underline-offset-4 hover:underline">Pricing</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/login" className="hidden sm:inline-flex btn-ghost text-sm">Sign In</Link>
            <Link href="/auth/register" className="btn-primary text-sm px-4 sm:px-5">
              Get Started <ChevronRight size={14} className="hidden sm:inline" />
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <Check size={24} /> : <Layers size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[rgba(99,102,241,0.1)] bg-[#0a0a0f] py-6 px-6 space-y-4 animate-fade-in">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-slate-400 font-medium">Features</a>
            <a href="#integrations" onClick={() => setIsMenuOpen(false)} className="block text-slate-400 font-medium">Integrations</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block text-slate-400 font-medium">Pricing</a>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <Link href="/auth/login" className="btn-secondary w-full justify-center">Sign In</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 grid-bg">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/20 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Zapier-level SaaS — Built for Agencies & Enterprises
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Automate Everything{' '}
            <span className="gradient-text">with AI</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Build powerful multi-step automations with a visual canvas. Connect any API, embed AI nodes, and deploy white-label automation for your clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-base px-8 py-4">
              <Play size={18} />
              Start Building Free
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-8 py-4">
              <Layers size={18} />
              View Dashboard
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Check size={14} className="text-indigo-400" /> No credit card required</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-indigo-400" /> 14-day free trial</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-indigo-400" /> Cancel anytime</span>
          </div>
        </div>

        {/* Hero visual — fake workflow canvas */}
        <div className="max-w-5xl mx-auto mt-12 sm:mt-20 glass-card p-1">
          <div className="rounded-2xl bg-[#0d0d1a] overflow-hidden min-h-[300px] sm:h-80 relative grid-bg flex flex-col sm:flex-row items-center justify-center gap-8 p-8">
            {/* Responsive Nodes */}
            <div className="relative sm:absolute sm:top-8 sm:left-16 glass-card px-4 py-3 rounded-xl text-sm font-medium text-indigo-300 border border-indigo-500/30 flex items-center gap-2">
              <Webhook size={14} /> Webhook Trigger
            </div>
            
            <div className="hidden sm:block absolute top-[56px] left-[220px]">
              <svg width="120" height="40">
                <path d="M 0 20 C 60 20 60 20 120 20" stroke="#6366f1" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="relative sm:absolute sm:top-8 sm:left-64 glass-card px-4 py-3 rounded-xl text-sm font-medium text-purple-300 border border-purple-500/30 flex items-center gap-2">
              <Brain size={14} /> AI Analysis
            </div>

            <div className="hidden sm:block absolute top-[56px] left-[430px]">
              <svg width="120" height="40">
                <path d="M 0 20 C 60 20 60 20 120 20" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="relative sm:absolute sm:top-8 sm:right-16 glass-card px-4 py-3 rounded-xl text-sm font-medium text-emerald-300 border border-emerald-500/30 flex items-center gap-2">
              <Mail size={14} /> Send Email
            </div>

            <div className="relative sm:absolute sm:bottom-10 sm:left-1/2 sm:-translate-x-1/2 flex flex-wrap justify-center items-center gap-3">
              {['RUNNING', 'AI Processing', 'Complete'].map((s, i) => (
                <div key={i} className={`badge ${i === 0 ? 'badge-info' : i === 1 ? 'badge-warning' : 'badge-success'}`}>
                  {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to <span className="gradient-text">automate at scale</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete automation infrastructure comparable to Zapier, Make.com, and n8n.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card p-6" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" className="py-24 px-6 bg-[#080810]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Integrations</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Connect with <span className="gradient-text">your favorite tools</span>
          </h2>
          <p className="text-slate-400 mb-12">Gmail, Slack, Stripe, OpenAI, Google Sheets, Twilio and more.</p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {INTEGRATIONS.map((int, i) => (
              <div key={i} className="glass-card p-4 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${int.color}20`, color: int.color, border: `1px solid ${int.color}40` }}>
                  {int.icon}
                </div>
                <span className="text-xs text-slate-400">{int.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan, i) => (
              <div key={i} className={`glass-card p-8 relative ${plan.highlight ? 'border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.15)]' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-indigo-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={plan.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                >
                  {plan.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-[rgba(99,102,241,0.1)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-bold gradient-text">Autoify</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Autoify. AI-powered automation for modern teams.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
