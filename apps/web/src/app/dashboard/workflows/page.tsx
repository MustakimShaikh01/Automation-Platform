'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GitBranch, Plus, Play, Clock, Edit2, Trash2,
  Webhook, Loader2, Activity, X, Zap, MoreVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';

function CreateWorkflowModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onCreate(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl p-8 glass shadow-[0_0_100px_-20px_rgba(99,102,241,0.3)] animate-scale-in"
        style={{ border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand-400 shadow-inner">
              <Zap size={20} className="fill-brand-400/20" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">New Automation</h2>
              <p className="text-xs text-slate-500 font-medium">Design your next powerful flow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-all rounded-xl hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="section-label">Flow Identifier</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stripe → Discord Sync"
              className="input-field h-12 text-base font-bold"
              maxLength={80}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['Lead Router', 'Email Sync', 'Uptime Monitor'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setName(suggestion)}
                className="text-[11px] font-black text-slate-500 hover:text-brand-400 px-3 py-1.5 rounded-full border border-white/5 hover:border-brand-500/30 transition-all uppercase tracking-widest"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary h-12 flex-1 justify-center text-xs font-bold">
              Dismiss
            </button>
            <button type="submit" disabled={!name.trim()} className="btn-primary h-12 flex-1 justify-center text-xs font-black uppercase tracking-widest">
              <Plus size={16} className="mr-2" /> Initialize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: workflowApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => workflowApi.create({ name, description: 'New automation flow started today.' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow initialized!');
      setShowCreateModal(false);
      router.push(`/dashboard/workflows/${data.id}`);
    },
    onError: () => toast.error('Creation failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: workflowApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Resource decommissioned');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: workflowApi.toggle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success(data.isActive ? 'Flow now active' : 'Flow paused');
    },
  });

  const triggerMutation = useMutation({
    mutationFn: (id: string) => workflowApi.trigger(id, { source: 'dashboard', timestamp: new Date().toISOString() }),
    onSuccess: () => toast.success('Simulation triggered successfully'),
    onError: () => toast.error('Activation required before simulation'),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 animate-pulse">
        <div className="w-16 h-16 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
        <div className="text-center">
          <p className="text-white font-bold tracking-widest uppercase text-xs">Synchronizing</p>
          <p className="text-slate-500 text-[10px] mt-1">Fetching your automation ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showCreateModal && (
        <CreateWorkflowModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(name) => createMutation.mutate(name)}
        />
      )}

      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-subtle">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_10px_var(--brand-500)]" />
              <h1 className="text-3xl font-black text-white tracking-tighter">My Workflows</h1>
            </div>
            <p className="text-slate-500 text-sm font-medium tracking-tight max-w-xl">
              Construct high-performance automations with visual logic. 
              Currently managing <span className="text-brand-400 font-bold">{workflows?.length || 0} production engines</span>.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={createMutation.isPending}
            className="btn-primary h-12 px-8 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]"
          >
            {createMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            <span className="font-black uppercase tracking-widest text-xs hidden sm:inline ml-2">New Core</span>
          </button>
        </div>

        {/* Workflow Ecosystem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {!workflows?.length ? (
            <div className="col-span-full py-24 text-center rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
              <div className="w-20 h-20 rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand-400 mx-auto mb-6 shadow-2xl">
                <Activity size={32} />
              </div>
              <h3 className="text-xl font-black text-white mb-2 tracking-tight">Empty Workspace</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto font-medium leading-relaxed">
                Connect your first pair of applications. Every great process starts with a single trigger.
              </p>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary h-12 px-10">
                <Plus size={18} className="mr-2" /> Start Designing
              </button>
            </div>
          ) : (
            <>
              {/* Ghost Creation Card */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="h-[240px] rounded-[2rem] border-2 border-dashed border-brand/20 hover:border-brand-500/50 bg-brand/5 hover:bg-brand/10 p-8 flex flex-col items-center justify-center gap-4 text-center group transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 shadow-xl">
                  <Plus size={28} />
                </div>
                <div>
                  <p className="text-base font-black text-white tracking-tight">Initialize Flow</p>
                  <p className="text-[11px] text-brand-400 font-bold uppercase tracking-widest mt-1 opacity-70">Add New Module</p>
                </div>
              </button>

              {workflows.map((wf: any) => (
                <WorkflowCard
                  key={wf.id}
                  wf={wf}
                  onToggle={() => toggleMutation.mutate(wf.id)}
                  onTrigger={() => triggerMutation.mutate(wf.id)}
                  onDelete={() => {
                    if (confirm(`Decommission workflow "${wf.name}"? This action is permanent.`)) {
                      deleteMutation.mutate(wf.id);
                    }
                  }}
                  isTriggering={triggerMutation.isPending}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function WorkflowCard({
  wf, onToggle, onTrigger, onDelete, isTriggering
}: {
  wf: any;
  onToggle: () => void;
  onTrigger: () => void;
  onDelete: () => void;
  isTriggering: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const triggerIcon = wf.triggerType === 'WEBHOOK'
    ? <Webhook size={20} />
    : wf.triggerType === 'SCHEDULE'
    ? <Clock size={20} />
    : <Play size={20} />;

  return (
    <div className={`group relative h-[240px] rounded-[2rem] flex flex-col p-8 glass-card border-white/5 hover:border-brand/40 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden ${wf.isActive ? '' : 'grayscale-[0.4] opacity-70'}`}>
      
      {/* Dynamic Background Gradient */}
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] -mr-10 -mt-10 transition-colors duration-700 ${wf.isActive ? 'bg-brand/10 group-hover:bg-brand/20' : 'bg-slate-500/5'}`} />

      {/* Header Area */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110 shadow-xl ${
            wf.isActive
              ? 'bg-brand/10 border-brand/20 text-brand-400'
              : 'bg-slate-800/80 border-slate-700/50 text-slate-500'
          }`}>
            {triggerIcon}
          </div>
          <div className="min-w-0 pr-2">
            <h3 className="text-lg font-black text-white leading-tight truncate group-hover:text-brand-400 transition-colors">{wf.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-1.5 w-1.5 rounded-full ${wf.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{wf.triggerType} GATE</span>
            </div>
          </div>
        </div>

        {/* Global Context Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-600 hover:text-white transition-all rounded-xl hover:bg-white/5 active:scale-90"
          >
            <MoreVertical size={18} />
          </button>
          
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-10 w-48 z-40 rounded-2xl overflow-hidden glass shadow-2xl p-1.5 border border-white/10 animate-fade-in">
                <Link
                  href={`/dashboard/workflows/${wf.id}`}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-slate-300 hover:bg-brand-500 hover:text-white rounded-xl transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit2 size={16} /> Engineering
                </Link>
                <div className="h-[1px] bg-white/5 my-1" />
                <button
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-left"
                >
                  <Trash2 size={16} /> Decommission
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Visual Workspace Stats */}
      <div className="flex-1 mb-8 relative z-10">
        <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 italic opacity-80 group-hover:opacity-100 transition-opacity">
          "{wf.description || 'System automation module with no defined manifest.'}"
        </p>
      </div>

      {/* Interactive Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
        {/* Toggle Power */}
        <div className="flex items-center gap-3 group/toggle cursor-pointer" onClick={onToggle}>
          <div className={`relative w-10 h-6 rounded-full transition-all duration-300 ${wf.isActive ? 'bg-brand' : 'bg-slate-700/50'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ${wf.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${wf.isActive ? 'text-brand-400' : 'text-slate-600'}`}>
            {wf.isActive ? 'Online' : 'Off'}
          </span>
        </div>

        {/* Action Clusters */}
        <div className="flex items-center gap-4">
          {wf.isActive && (
            <button
              onClick={(e) => { e.stopPropagation(); onTrigger(); }}
              disabled={isTriggering}
              className="flex items-center justify-center w-9 h-9 text-brand-400 hover:text-white bg-brand/10 hover:bg-brand rounded-xl border border-brand/20 transition-all duration-300 active:scale-90"
              title="Manual Override"
            >
              {isTriggering ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="fill-current" />}
            </button>
          )}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-white/5 h-9 px-4 rounded-xl border border-white/5 font-black group/stats">
            <Activity size={14} className="text-brand-500 group-hover/stats:animate-pulse" />
            <span>{wf._count?.executions || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
