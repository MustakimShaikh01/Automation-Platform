'use client';

import { useQuery } from '@tanstack/react-query';
import { executionApi, workflowApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Zap, Activity, CheckCircle, XCircle, Clock, Plus, ArrowRight, Puzzle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { user } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['executions', 'stats'],
    queryFn: executionApi.stats,
  });

  const { data: workflows, isLoading: wfLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: workflowApi.list,
  });

  const { data: recentExecutions } = useQuery({
    queryKey: ['executions', 'recent'],
    queryFn: () => executionApi.list(undefined, 6),
  });

  return (
    <div className="space-y-12 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            Overview <span className="text-white/10">/</span> <span className="text-[var(--text-secondary)]">{user?.name?.split(' ')[0]}'s Workspace</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage your automation pipelines and execution health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
             <Puzzle size={14} /> View Integrations
          </button>
          <Link href="/dashboard/workflows" className="btn-primary">
            <Plus size={14} /> Create Workflow
          </Link>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Executions"
          value={stats?.total || 0}
          icon={<Activity size={16} />}
          loading={statsLoading}
          trend="+4.2%"
        />
        <StatCard
          title="Success Rate"
          value={`${stats?.successRate || 0}%`}
          icon={<CheckCircle size={16} />}
          loading={statsLoading}
        />
        <StatCard
          title="Avg. Duration"
          value="142ms"
          icon={<Clock size={16} />}
          loading={statsLoading}
        />
        <StatCard
          title="Active Flows"
          value={workflows?.filter((w: any) => w.isActive).length || 0}
          icon={<Zap size={16} />}
          loading={wfLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── EXECUTION LOG ── */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" /> Live Executions
            </h2>
            <Link href="/dashboard/executions" className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1 group">
              Audit Log <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="glass-card divide-y divide-white/[0.04] bg-[#0c0c0e]">
            {!recentExecutions?.length ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-600 space-y-3">
                <Activity size={32} strokeWidth={1} />
                <p className="text-xs font-medium">Listening for workflow triggers...</p>
              </div>
            ) : (
              recentExecutions.map((exec: any) => (
                <div key={exec.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      exec.status === 'SUCCESS' ? 'bg-green-500/5 text-green-500 border-green-500/10' :
                      exec.status === 'FAILED' ? 'bg-red-500/5 text-red-500 border-red-500/10' :
                      'bg-indigo-500/5 text-[#5e6ad2] border-indigo-500/10'
                    }`}>
                      {exec.status === 'SUCCESS' ? <CheckCircle size={14} /> :
                       exec.status === 'FAILED' ? <XCircle size={14} /> :
                       <Clock size={14} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-0.5">{exec.workflow?.name || 'Trigger'}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                         <span className="bg-white/5 px-1.5 py-0.5 rounded text-slate-400">ID: {exec.id.slice(-8)}</span>
                         <span>•</span>
                         <span>{new Date(exec.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                       <p className="text-[10px] text-slate-600 font-mono">{exec.duration || '0'}ms</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 text-slate-500 hover:text-white">
                         <MoreHorizontal size={14} />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── SIDEBAR CARDS ── */}
        <div className="lg:col-span-4 space-y-8">
           <div className="space-y-4">
              <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">Active Workflows</h2>
              <div className="space-y-2">
                {workflows?.slice(0, 3).map((wf: any) => (
                  <Link key={wf.id} href={`/dashboard/workflows/${wf.id}`} className="glass-card p-3 flex items-center gap-3 hover:bg-white/[0.04] transition-all no-underline group">
                    <div className={`w-2 h-2 rounded-full ${wf.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-700'}`} />
                    <span className="text-xs font-medium text-white flex-1 truncate">{wf.name}</span>
                    <ArrowRight size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
                {(!workflows || workflows.length === 0) && (
                   <p className="text-[10px] text-slate-600 italic px-1">No workflows found.</p>
                )}
              </div>
           </div>

           <div className="glass-card p-5 bg-gradient-to-br from-[#5e6ad2]/5 to-transparent border-[#5e6ad2]/10 relative group">
              <Zap size={24} className="text-[#5e6ad2] mb-3 opacity-50" />
              <h3 className="text-sm font-semibold text-white mb-2">Automate with AI</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Connect GPT-4o to your pipelines to analyze and transform data in real-time.</p>
              <button className="text-xs font-bold text-[#5e6ad2] hover:text-[#737de0] transition-colors flex items-center gap-1 group">
                Try AI Samples <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, loading, trend }: { title: string, value: string | number, icon: React.ReactNode, loading?: boolean, trend?: string }) {
  return (
    <div className="glass-card p-5 bg-[#0f0f10] group hover:border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-slate-500 group-hover:text-[#5e6ad2] transition-colors">
          {icon}
        </div>
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2">
        {loading ? (
          <div className="h-8 w-16 bg-white/[0.04] animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-semibold tracking-tight text-white">{value}</div>
        )}
        {trend && <span className="text-[10px] font-bold text-green-500">{trend}</span>}
      </div>
    </div>
  );
}
