'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import {
  Zap, LayoutDashboard, GitBranch, Activity, Puzzle,
  Settings, LogOut, Bell, Search, Menu, X, ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
  { href: '/dashboard/workflows', icon: <GitBranch size={15} />, label: 'Workflows' },
  { href: '/dashboard/executions', icon: <Activity size={15} />, label: 'Executions' },
  { href: '/dashboard/integrations', icon: <Puzzle size={15} />, label: 'Integrations' },
  { href: '/dashboard/settings', icon: <Settings size={15} />, label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loadUser } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('autoify_token') : null;
    if (!token) { router.push('/auth/login'); return; }
    loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const breadcrumb = pathname === '/dashboard'
    ? 'Overview'
    : pathname.split('/').filter(Boolean).slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' › ');

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface/40 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="h-[64px] px-6 flex items-center justify-between border-b border-white/[0.03]">
        <Link href="/dashboard" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="text-base font-black text-white tracking-tighter group-hover:text-brand-400 transition-colors">Autoify</span>
        </Link>
        <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-brand/10 border border-brand/20 text-brand-400 uppercase tracking-widest">
          v2.4
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-50">
            System Core
          </p>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 group no-underline ${
                    isActive 
                      ? 'bg-brand/10 text-brand-400 border border-brand/20 shadow-[0_4px_12px_rgba(99,102,241,0.1)]' 
                      : 'text-slate-500 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <span className={`transition-colors duration-300 ${isActive ? 'text-brand-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--brand-500)] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.03]">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-50">
            Support
          </p>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all group">
            <Bell size={15} className="group-hover:rotate-12 transition-transform" />
            <span className="tracking-tight">Feedback</span>
          </button>
        </div>
      </nav>

      {/* User Session Area */}
      <div className="p-4 border-t border-white/[0.03] bg-white/[0.01]">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/10 transition-all group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-sm font-black text-brand-400 shadow-inner group-hover:scale-105 transition-transform duration-500">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate leading-tight tracking-tight uppercase">
              {user?.name || 'Authorized User'}
            </p>
            <p className="text-[10px] text-slate-500 font-bold truncate opacity-70">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            title="Terminate Session"
            className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-base selection:bg-brand/30">

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-[260px] flex-col h-full border-r border-white/[0.03] z-30">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      <aside className={`fixed inset-y-0 left-0 w-[260px] z-50 lg:hidden transition-transform duration-300 ease-in-out border-r border-white/10 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        
        {/* Persistent Topbar */}
        <header className="h-[64px] shrink-0 px-6 flex items-center justify-between border-b border-white/[0.03] bg-base/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white bg-white/[0.03] border border-white/10 rounded-xl transition-all"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-500">
              <span className="opacity-40">Workspace</span>
              <ChevronRight size={14} className="opacity-20" />
              <span className="text-brand-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]">{breadcrumb}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 h-10 rounded-xl bg-white/[0.02] border border-white/[0.03] focus-within:border-brand/40 transition-all w-[240px] group">
              <Search size={14} className="text-slate-600 group-focus-within:text-brand-400 transition-colors" />
              <input
                placeholder="Global Search..."
                className="bg-transparent border-none outline-none text-[13px] font-bold text-slate-400 placeholder:text-slate-700 w-full"
              />
              <div className="px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[9px] font-black text-slate-700">⌘K</div>
            </div>

            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/5 transition-all">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_var(--brand-500)] border-2 border-base" />
            </button>
          </div>
        </header>

        {/* Dynamic Content Scrollbox */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] opacity-40" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px] opacity-30" />
          </div>

          <div className="max-w-[1600px] mx-auto p-8 lg:p-12 animate-fade-in min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
