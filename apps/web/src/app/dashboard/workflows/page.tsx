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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: '#0f0f1a', border: '1px solid rgba(99,102,241,0.3)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <Zap size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">New Workflow</h2>
              <p className="text-xs text-slate-500">Give it a descriptive name</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Workflow Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Lead Notification, Weekly Report..."
              className="input-field"
              maxLength={80}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['New Lead Alert', 'Weekly Digest', 'Support Ticket'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setName(suggestion)}
                className="text-[11px] text-slate-500 hover:text-indigo-400 px-2 py-1.5 rounded-lg border border-white/5 hover:border-indigo-500/25 transition-all text-center"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim()} className="btn-primary flex-1 justify-center">
              <Plus size={15} /> Create
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
    mutationFn: (name: string) => workflowApi.create({ name, description: 'New automation flow' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow created!');
      setShowCreateModal(false);
      router.push(`/dashboard/workflows/${data.id}`);
    },
    onError: () => toast.error('Failed to create workflow'),
  });

  const deleteMutation = useMutation({
    mutationFn: workflowApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow deleted');
    },
    onError: () => toast.error('Failed to delete'),
  });

  const toggleMutation = useMutation({
    mutationFn: workflowApi.toggle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success(data.isActive ? 'Workflow activated' : 'Workflow paused');
    },
  });

  const triggerMutation = useMutation({
    mutationFn: (id: string) => workflowApi.trigger(id, { source: 'manual', timestamp: new Date().toISOString() }),
    onSuccess: () => toast.success('Execution triggered! Check Executions tab.'),
    onError: () => toast.error('Failed to trigger. Activate the workflow first.'),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <p className="text-slate-500 text-sm">Loading workflows...</p>
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

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Workflows</h1>
            <p className="text-slate-400 text-sm">Design, run, and manage your automations. {workflows?.length > 0 && <span className="text-indigo-400">{workflows.length} total</span>}</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={createMutation.isPending}
            className="btn-primary"
          >
            {createMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            New Workflow
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {!workflows?.length ? (
            <div className="col-span-full py-20 text-center glass-card"
              style={{ borderStyle: 'dashed', borderColor: 'rgba(99,102,241,0.2)' }}>
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                <GitBranch size={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">No workflows yet</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                Build your first automation by connecting apps, adding logic, and setting triggers.
              </p>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                <Plus size={15} /> Create Your First Workflow
              </button>
            </div>
          ) : (
            <>
              {/* Create new card */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="glass-card p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[200px] group transition-all duration-200 hover:border-indigo-500/30"
                style={{ borderStyle: 'dashed' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Plus size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">Create Workflow</p>
                  <p className="text-xs text-slate-500">Start from scratch</p>
                </div>
              </button>

              {workflows.map((wf: any) => (
                <WorkflowCard
                  key={wf.id}
                  wf={wf}
                  onToggle={() => toggleMutation.mutate(wf.id)}
                  onTrigger={() => triggerMutation.mutate(wf.id)}
                  onDelete={() => {
                    if (confirm(`Delete "${wf.name}"? This cannot be undone.`)) {
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
    ? <Webhook size={18} />
    : wf.triggerType === 'SCHEDULE'
    ? <Clock size={18} />
    : <Play size={18} />;

  return (
    <div className={`glass-card p-5 flex flex-col relative group transition-all duration-200 ${wf.isActive ? '' : 'opacity-60 hover:opacity-80'}`}
      style={wf.isActive ? { borderColor: 'rgba(99,102,241,0.25)' } : {}}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            wf.isActive
              ? 'bg-indigo-500/15 border border-indigo-500/25 text-indigo-400'
              : 'bg-slate-800/80 border border-slate-700/50 text-slate-500'
          }`}>
            {triggerIcon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{wf.name}</h3>
            <p className="text-[10px] text-slate-500 capitalize">{wf.triggerType} Trigger</p>
          </div>
        </div>

        {/* More menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 w-36 z-20 rounded-xl overflow-hidden shadow-2xl"
                style={{ background: '#14141f', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Link
                  href={`/dashboard/workflows/${wf.id}`}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit2 size={13} /> Edit Flow
                </Link>
                <button
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 mb-5 flex-1 line-clamp-2">
        {wf.description || 'No description provided.'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        {/* Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggle}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${wf.isActive ? 'bg-indigo-500' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${wf.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-semibold ${wf.isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
            {wf.isActive ? 'Active' : 'Draft'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {wf.isActive && (
            <button
              onClick={onTrigger}
              disabled={isTriggering}
              className="btn-ghost text-[11px] py-1 px-2.5 border border-white/8 hover:border-indigo-500/40 hover:text-indigo-400"
            >
              {isTriggering ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} />}
              Run
            </button>
          )}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded-lg">
            <Activity size={11} />
            <span>{wf._count?.executions || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
