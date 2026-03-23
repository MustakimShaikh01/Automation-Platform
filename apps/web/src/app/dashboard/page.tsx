'use client';

import { useQuery } from '@tanstack/react-query';
import { executionApi, workflowApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Zap, Activity, CheckCircle, XCircle, Clock, Plus, ArrowRight, Puzzle, MoreHorizontal, Brain } from 'lucide-react';
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
    queryFn: () => executionApi.list(undefined, 8),
  });

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-brand-400 bg-brand/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-brand/20">
              Control Center
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Workspace <span className="text-white/20 font-light">/</span> <span className="text-brand-400">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">System status and automation throughput analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary h-11 px-5 text-xs font-bold">
             <Puzzle size={16} className="mr-2" /> Integrations
          </button>
          <Link href="/dashboard/workflows" className="btn-primary h-11 px-6 text-xs font-black uppercase tracking-widest">
            <Plus size={16} className="mr-2" /> New Logic
          </Link>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Throughput"
          value={stats?.total || 0}
          icon={<Activity size={18} />}
          loading={statsLoading}
          trend="+8.4%"
        />
        <StatCard
          title="Reliability"
          value={`${stats?.successRate || 0}%`}
          icon={<CheckCircle size={18} />}
          loading={statsLoading}
        />
        <StatCard
          title="Latency"
          value="142ms"
          icon={<Clock size={18} />}
          loading={statsLoading}
        />
        <StatCard
          title="Engines"
          value={workflows?.filter((w: any) => w.isActive).length || 0}
          icon={<Zap size={18} />}
          loading={wfLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── EXECUTION LOG ── */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_var(--brand-500)] animate-pulse" />
              <h2 className="text-xs font-black text-white uppercase tracking-widest leading-none">
                Real-time Feedback
              </h2>
            </div>
            <Link href="/dashboard/executions" className="text-[10px] font-bold text-slate-500 hover:text-brand-400 transition-colors flex items-center gap-1.5 uppercase tracking-widest">
              Full Audit <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="glass-card overflow-hidden bg-white/[0.01]">
            {!recentExecutions?.length ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-700">
                  <Activity size={32} strokeWidth={1} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest italic">Listening for activity...</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {recentExecutions.map((exec: any) => (
                  <div key={exec.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all group-hover:scale-105 ${
                        exec.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        exec.status === 'FAILED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                        'bg-brand/10 text-brand-400 border-brand/20'
                      }`}>
                        {exec.status === 'SUCCESS' ? <CheckCircle size={16} /> :
                         exec.status === 'FAILED' ? <XCircle size={16} /> :
                         <Clock size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white mb-0.5 group-hover:text-brand-400 transition-colors uppercase tracking-tight">{exec.workflow?.name || 'Manual Trigger'}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                           <span className="text-slate-600">{exec.id.slice(-8)}</span>
                           <span className="opacity-20">•</span>
                           <span>{new Date(exec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right flex flex-col items-end">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{exec.duration || '0'}ms</p>
                         <div className={`h-1 w-12 rounded-full mt-1 bg-white/5 overflow-hidden`}>
                            <div className={`h-full bg-brand-500 opacity-40`} style={{ width: '60%' }} />
                         </div>
                      </div>
                      <button className="p-2 text-slate-700 hover:text-white transition-all bg-white/[0.02] rounded-lg border border-white/5 opacity-0 group-hover:opacity-100">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SIDEBAR CARDS ── */}
        <div className="lg:col-span-4 space-y-8">
           <div className="space-y-5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Cores</h2>
                <div className="text-[10px] font-black text-brand-400">{workflows?.filter((w:any)=>w.isActive).length || 0} ACTIVE</div>
              </div>
              <div className="space-y-3">
                {workflows?.slice(0, 4).map((wf: any) => (
                  <Link key={wf.id} href={`/dashboard/workflows/${wf.id}`} className="glass-card p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-all no-underline group border-white/5 hover:border-brand/30">
                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 group-hover:scale-125 ${wf.isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                    <span className="text-xs font-black text-white flex-1 truncate uppercase tracking-tighter group-hover:text-brand-400 transition-colors">{wf.name}</span>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.02] flex items-center justify-center text-slate-700 group-hover:text-brand-400 group-hover:bg-brand/10 transition-all opacity-0 group-hover:opacity-100">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                ))}
                {(!workflows || workflows.length === 0) && (
                   <div className="p-6 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/5">
                     <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No active modules</p>
                   </div>
                )}
              </div>
           </div>

           <div className="glass-card p-6 bg-gradient-to-br from-brand/10 to-transparent border-brand/20 relative group overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand/10 rounded-full blur-3xl group-hover:bg-brand/20 transition-all" />
              <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand-400 mb-4 shadow-xl">
                <Brain size={24} className="fill-brand-400/10" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 tracking-tight">Intelligence Pack</h3>
              <p className="text-xs text-slate-500 mb-5 font-medium leading-relaxed">
                Connect large language models to your pipelines for automated decision making.
              </p>
              <button className="w-full btn-primary h-10 text-[10px] font-black uppercase tracking-widest shadow-lg">
                Activate Cognitive Units
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, loading, trend }: { title: string, value: string | number, icon: React.ReactNode, loading?: boolean, trend?: string }) {
  return (
    <div className="glass-card p-6 bg-white/[0.01] group hover:border-brand/40 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-brand/10 transition-all" />
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-400 group-hover:border-brand/20 transition-all">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Activity size={10} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-400 transition-colors">{title}</h3>
        {loading ? (
          <div className="h-9 w-24 bg-white/[0.04] animate-pulse rounded-lg" />
        ) : (
          <div className="text-3xl font-black tracking-tight text-white group-hover:text-brand-400 transition-colors">{value}</div>
        )}
      </div>
    </div>
  );
}
