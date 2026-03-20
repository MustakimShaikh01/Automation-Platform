'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '@/lib/api';
import WorkflowEditor from '@/components/flow/WorkflowEditor';
import { Loader2, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';

export default function WorkflowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => workflowApi.get(id),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-400" size={28} />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold mb-1">Loading Workflow Engine</p>
          <p className="text-slate-500 text-sm">Fetching your workflow data...</p>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Zap size={24} className="text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold mb-1">Workflow Not Found</p>
          <p className="text-slate-500 text-sm mb-4">This workflow may have been deleted or you don't have access.</p>
          <Link href="/dashboard/workflows" className="btn-secondary">
            <ArrowLeft size={16} /> Back to Workflows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 flex items-center gap-3">
        <Link
          href="/dashboard/workflows"
          className="text-slate-500 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} /> Workflows
        </Link>
        <span className="text-white/10">/</span>
        <span className="text-slate-300 text-sm font-medium">{workflow.name}</span>
      </div>

      <WorkflowEditor workflow={workflow} />
    </div>
  );
}
