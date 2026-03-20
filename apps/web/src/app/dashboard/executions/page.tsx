'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { executionApi } from '@/lib/api';
import { Activity, CheckCircle, XCircle, Search, RefreshCw, Layers, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ExecutionsPage() {
  const [filter, setFilter] = useState('ALL');

  const { data: executions, isLoading, refetch } = useQuery({
    queryKey: ['executions'],
    queryFn: () => executionApi.list(),
  });

  const filtered = executions?.filter((e: any) => filter === 'ALL' || e.status === filter) || [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Execution History</h1>
          <p className="text-slate-400 text-sm">Monitor run logs, debug errors, and track performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field py-2 w-36"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="RUNNING">Running</option>
          </select>
          <button onClick={() => refetch()} className="btn-secondary h-10 w-10 p-0 justify-center">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="glass-card shadow-lg bg-[#111118]/80 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="animate-spin text-indigo-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mx-auto mb-4 border border-slate-700/50">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No executions found</h3>
            <p className="text-slate-400 text-sm">Run your active workflows to see logs appear here.</p>
          </div>
        ) : (
          <div className="divide-y border-t border-[rgba(99,102,241,0.05)] border-l-0 border-r-0 border-b-0 divide-[rgba(99,102,241,0.05)]">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#1a1a2e]/50 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-md">
              <div className="col-span-1">Status</div>
              <div className="col-span-4">Workflow</div>
              <div className="col-span-3">Executed At</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {filtered.map((exec: any) => (
              <div key={exec.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors">
                <div className="col-span-1">
                  <div className={`badge ${
                    exec.status === 'SUCCESS' ? 'badge-success' :
                    exec.status === 'FAILED' ? 'badge-error' :
                    exec.status === 'RUNNING' ? 'badge-info' : 'badge-pending'
                  }`}>
                    {exec.status === 'SUCCESS' ? <CheckCircle size={14} className="mr-1" /> :
                     exec.status === 'FAILED' ? <XCircle size={14} className="mr-1" /> :
                     exec.status === 'RUNNING' ? <RefreshCw size={14} className="mr-1 animate-spin" /> :
                     <Activity size={14} className="mr-1" />}
                  </div>
                </div>

                <div className="col-span-4 font-medium text-white flex items-center gap-2">
                  <span className="truncate">{exec.workflow?.name || 'Deleted'}</span>
                </div>

                <div className="col-span-3 text-sm text-slate-400 flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(exec.createdAt).toLocaleString(undefined, { 
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
                  })}
                </div>

                <div className="col-span-2 text-sm text-slate-400 flex items-center gap-1.5">
                  <Clock size={14} />
                  {exec.duration ? `${exec.duration}ms` : '-'}
                </div>

                <div className="col-span-2 text-right">
                  <Link href={`/dashboard/executions/${exec.id}`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium inline-flex items-center gap-1 p-2 rounded hover:bg-indigo-500/10 transition-colors">
                    View Logs <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
