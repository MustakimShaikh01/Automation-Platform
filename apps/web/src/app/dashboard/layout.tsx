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
    <>
      {/* Brand */}
      <div style={{
        height: '58px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        flexShrink: 0,
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
            boxShadow: '0 0 20px rgba(99,102,241,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={14} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#f0f0ff', letterSpacing: '-0.01em' }}>Autoify</span>
        </Link>
        <span style={{
          fontSize: '10px', fontFamily: 'monospace', padding: '2px 7px', borderRadius: '6px',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc',
        }}>v2</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 8px' }}>
        <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2d3450', padding: '0 8px', marginBottom: '10px' }}>
          Platform
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '9px', marginBottom: '2px',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.15s ease',
                color: isActive ? '#a5b4fc' : '#4b5570',
                background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(99,102,241,0.2)' : 'transparent'}`,
              }}
            >
              <span style={{ color: isActive ? '#818cf8' : '#2d3450', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 8px #6366f1', flexShrink: 0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.055)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
          borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s ease',
          background: 'rgba(255,255,255,0.02)',
        }}
          className="group"
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: '#a5b4fc',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#f0f0ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontSize: '10px', color: '#2d3450', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5570', borderRadius: '6px', flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f43f5e')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4b5570')}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#07070f' }}>

      {/* ── MOBILE OVERLAY ── */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(7,7,15,0.75)', backdropFilter: 'blur(8px)',
          }}
          className="lg:hidden"
        />
      )}

      {/* ── SIDEBAR (Desktop — part of flex flow) ── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: '220px', minWidth: '220px', flexShrink: 0,
          flexDirection: 'column', height: '100vh',
          background: 'rgba(7,7,15,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.055)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── SIDEBAR (Mobile — fixed overlay) ── */}
      <aside
        className="lg:hidden"
        style={{
          position: 'fixed', left: 0, top: 0, height: '100vh', width: '220px',
          display: 'flex', flexDirection: 'column', zIndex: 50,
          background: 'rgba(7,7,15,0.99)',
          borderRight: '1px solid rgba(255,255,255,0.055)',
          transform: isMobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.2s ease',
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Top Header */}
        <header style={{
          height: '58px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px',
          background: 'rgba(7,7,15,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          zIndex: 30,
        }}>

          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="lg:hidden"
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5570', borderRadius: '8px' }}
            >
              {isMobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: '#2d3450' }}>Workspace</span>
              <ChevronRight size={12} color="#2d3450" />
              <span style={{ fontWeight: 600, color: '#c4c9e8' }}>{breadcrumb}</span>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px', borderRadius: '9px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.055)',
              width: '176px',
            }}>
              <Search size={12} color="#2d3450" style={{ flexShrink: 0 }} />
              <input
                placeholder="Search..."
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '12px', color: '#94a3b8', width: '100%', fontFamily: 'inherit' }}
              />
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#2d3450', flexShrink: 0 }}>⌘K</span>
            </div>

            <button style={{
              position: 'relative', padding: '8px', border: 'none', background: 'transparent',
              cursor: 'pointer', color: '#4b5570', borderRadius: '8px', transition: 'all 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f0ff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4b5570')}
            >
              <Bell size={15} />
              <span style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#6366f1', boxShadow: '0 0 6px rgba(99,102,241,0.6)',
              }} />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', animation: 'fadeIn 0.35s ease' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
