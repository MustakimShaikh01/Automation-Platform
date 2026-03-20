'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Webhook, Mail, Brain, Settings2, Play, GitBranch, Slack, CreditCard, Zap, Timer, Globe } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  webhook: <Webhook size={15} />,
  trigger: <Play size={15} />,
  manual: <Zap size={15} />,
  schedule: <Timer size={15} />,
  email: <Mail size={15} />,
  gmail: <Mail size={15} />,
  slack: <Slack size={15} />,
  stripe: <CreditCard size={15} />,
  http: <Globe size={15} />,
  ai: <Brain size={15} />,
  condition: <GitBranch size={15} />,
  delay: <Timer size={15} />,
};

interface NodeData {
  label: string;
  type: string;
  provider?: string;
  action?: string;
  field?: string;
  operator?: string;
  value?: string;
  [key: string]: any;
}

const HandleDot = ({ type, position, id, color = '#6366f1' }: any) => (
  <Handle
    type={type}
    position={position}
    id={id}
    style={{
      background: color,
      border: '2px solid rgba(10,10,20,0.9)',
      width: 12,
      height: 12,
    }}
  />
);

// ─── Trigger Node ─────────────────────────────────────
export const TriggerNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div className="relative w-64 rounded-xl border border-emerald-500/40 shadow-xl overflow-visible"
      style={{ background: 'rgba(16, 185, 129, 0.08)' }}>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl" style={{
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.12)',
        pointerEvents: 'none',
      }} />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            {iconMap[data.type] || <Zap size={15} />}
          </div>
          <div>
            <div className="font-semibold text-sm text-white truncate max-w-[140px]">{data.label || 'Trigger'}</div>
            <div className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Trigger</div>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
        </div>
        <div className="text-xs text-slate-400 bg-black/20 rounded-lg px-2.5 py-1.5 font-mono">
          {data.type === 'webhook' ? 'Awaits POST request' :
           data.type === 'schedule' ? 'Runs on cron schedule' :
           'Manual / Form start'}
        </div>
      </div>

      <HandleDot type="source" position={Position.Right} color="#10b981" />
    </div>
  );
});
TriggerNode.displayName = 'TriggerNode';

// ─── Action Node ─────────────────────────────────────
export const ActionNode = memo(({ data }: { data: NodeData }) => {
  const providerColors: Record<string, string> = {
    slack: '#4A154B',
    gmail: '#EA4335',
    stripe: '#635BFF',
    http: '#6366f1',
  };
  const color = providerColors[data.provider || ''] || '#6366f1';

  return (
    <div className="relative w-64 rounded-xl border shadow-xl overflow-visible transition-all"
      style={{
        background: 'rgba(15, 15, 26, 0.9)',
        borderColor: `${color}33`,
      }}>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white"
            style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
            {iconMap[data.provider || data.type] || <Settings2 size={15} />}
          </div>
          <div>
            <div className="font-semibold text-sm text-white truncate max-w-[140px]">{data.label || 'Action'}</div>
            <div className="text-[10px] text-slate-500 capitalize">{data.provider || 'generic'} action</div>
          </div>
        </div>
        <div className="text-xs text-slate-500 bg-black/20 rounded-lg px-2.5 py-1.5 font-mono">
          provider: <span className="text-slate-300">{data.provider || 'generic'}</span>
        </div>
      </div>

      <HandleDot type="target" position={Position.Left} color={color} />
      <HandleDot type="source" position={Position.Right} color={color} />
    </div>
  );
});
ActionNode.displayName = 'ActionNode';

// ─── AI Node ─────────────────────────────────────────
export const AiNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div className="relative w-64 rounded-xl border border-purple-500/40 shadow-xl overflow-visible"
      style={{
        background: 'rgba(168, 85, 247, 0.07)',
        boxShadow: '0 0 25px rgba(168, 85, 247, 0.12)',
      }}>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Brain size={15} />
          </div>
          <div>
            <div className="font-semibold text-sm text-white truncate max-w-[140px]">{data.label || 'AI Node'}</div>
            <div className="flex items-center gap-1 text-[10px] text-purple-400 font-medium uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              GPT-4o
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-black/20 rounded-lg px-2.5 py-1.5 font-mono">
          action: <span className="text-purple-300">{data.action || 'summarize'}</span>
        </div>
      </div>

      <HandleDot type="target" position={Position.Left} color="#a855f7" />
      <HandleDot type="source" position={Position.Right} color="#a855f7" />
    </div>
  );
});
AiNode.displayName = 'AiNode';

// ─── Condition Node ───────────────────────────────────
export const ConditionNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div className="relative w-64 rounded-xl border border-amber-500/40 shadow-xl overflow-visible"
      style={{ background: 'rgba(245, 158, 11, 0.07)' }}>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <GitBranch size={15} />
          </div>
          <div>
            <div className="font-semibold text-sm text-white truncate max-w-[140px]">{data.label || 'Condition'}</div>
            <div className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">If / Else Branch</div>
          </div>
        </div>
        <div className="text-xs font-mono bg-black/30 rounded-lg px-2.5 py-1.5 text-amber-200">
          {data.field || 'input'} <span className="text-slate-400">{data.operator || '=='}</span> {data.value || 'true'}
        </div>
      </div>

      {/* Branch labels */}
      <div className="absolute -top-5 right-0 text-[9px] text-emerald-400 font-bold uppercase tracking-wider pr-1">TRUE</div>
      <div className="absolute -bottom-5 right-0 text-[9px] text-red-400 font-bold uppercase tracking-wider pr-1">FALSE</div>

      <HandleDot type="target" position={Position.Left} color="#f59e0b" />
      <HandleDot type="source" position={Position.Top} id="true" color="#10b981" />
      <HandleDot type="source" position={Position.Bottom} id="false" color="#ef4444" />
    </div>
  );
});
ConditionNode.displayName = 'ConditionNode';

export const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  ai: AiNode,
  condition: ConditionNode,
};
