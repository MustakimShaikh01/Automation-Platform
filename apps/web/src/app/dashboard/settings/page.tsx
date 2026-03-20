'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { User, Lock, Bell, Shield, Key, Copy, Plus, Trash2, LogOut, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'profile', label: 'Profile', icon: <User size={15} /> },
  { id: 'security', label: 'Security', icon: <Lock size={15} /> },
  { id: 'api-keys', label: 'API Keys', icon: <Key size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
];

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    setSaved(true);
    toast.success('Profile updated!');
    setTimeout(() => setSaved(false), 2000);
  };

  const mockApiKey = 'ak_live_' + Array(32).fill(0).map(() => Math.random().toString(36)[2]).join('');

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account and workspace preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar tabs */}
        <aside className="md:w-52 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full sidebar-item text-left ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className={activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-white/5">
              <button onClick={logout} className="w-full sidebar-item text-red-400 hover:text-red-300 hover:bg-red-500/5">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1">

          {activeTab === 'profile' && (
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-base font-bold text-white border-b border-white/5 pb-4">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-2xl font-bold text-indigo-300">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1">Change avatar</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role</label>
                <div className="input-field text-slate-400 cursor-not-allowed bg-white/2 flex items-center gap-2">
                  <Shield size={14} className="text-indigo-400" />
                  {user?.role || 'MEMBER'}
                </div>
              </div>

              <div className="pt-2">
                <button onClick={handleSaveProfile} className="btn-primary">
                  {saved ? <Check size={15} /> : null}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-base font-bold text-white border-b border-white/5 pb-4">Security</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">New Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
              </div>

              <button onClick={() => toast.success('Password updated!')} className="btn-primary">
                Update Password
              </button>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">Delete Account</p>
                    <p className="text-xs text-slate-500">Permanently delete your account and all data.</p>
                  </div>
                  <button onClick={() => toast.error('Account deletion requires support contact')} className="btn-danger text-xs">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api-keys' && (
            <div className="glass-card p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-base font-bold text-white">API Keys</h2>
                <button onClick={() => toast.success('API Key created! (demo)')} className="btn-primary text-sm">
                  <Plus size={14} /> Create Key
                </button>
              </div>

              <p className="text-sm text-slate-400">
                API keys allow programmatic access to your workflows. Treat them like passwords.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/7"
                  style={{ background: 'rgba(15,15,26,0.6)' }}>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">Production Key</p>
                    <p className="text-xs font-mono text-slate-500">{mockApiKey.slice(0, 20)}•••••••••••••</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Created just now • Never used</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { navigator.clipboard.writeText(mockApiKey); toast.success('Copied!'); }}
                      className="btn-ghost p-2"
                    >
                      <Copy size={13} />
                    </button>
                    <button onClick={() => toast('Key revoked (demo)')} className="btn-ghost p-2 text-red-400 hover:text-red-300">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card p-6 space-y-5">
              <h2 className="text-base font-bold text-white border-b border-white/5 pb-4">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { label: 'Workflow Failures', desc: 'Get notified when a workflow execution fails', default: true },
                  { label: 'Successful Executions', desc: 'Get notified on every successful run', default: false },
                  { label: 'Weekly Digest', desc: 'Weekly summary of your automation activity', default: true },
                  { label: 'Security Alerts', desc: 'New login or suspicious activity notices', default: true },
                ].map((notif, i) => (
                  <NotifToggle key={i} label={notif.label} desc={notif.desc} defaultOn={notif.default} />
                ))}
              </div>

              <button onClick={() => toast.success('Preferences saved!')} className="btn-primary">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotifToggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${on ? 'bg-indigo-500' : 'bg-slate-700'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
