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

const HandleDot = ({ type, position, id, color = 'var(--brand-500)' }: any) => (
  <Handle
    type={type}
    position={position}
    id={id}
    style={{
      background: color,
      border: '3px solid var(--bg-base)',
      width: 14,
      height: 14,
      boxShadow: `0 0 8px ${color}`,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 10,
    }}
  />
);

const NodeWrapper = memo(({ children, borderColor, glowColor, isActive = true }: any) => (
  <div
    className={`relative min-w-[260px] rounded-xl border glass-card transition-all duration-300 group ${isActive ? '' : 'opacity-60 grayscale'}`}
    style={{
      borderColor: borderColor || 'var(--border-subtle)',
      boxShadow: `0 8px 32px -8px rgba(0,0,0,0.5), 0 0 20px -5px ${glowColor || 'transparent'}`,
    }}
  >
    {/* Animated Active Border */}
    {isActive && (
      <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-[-100%] animate-spin [animation-duration:8s]"
             style={{ background: `conic-gradient(from 0deg, transparent 0deg 340deg, ${glowColor || '#6366f1'} 360deg)` }} />
        <div className="absolute inset-[1px] rounded-xl" style={{ background: 'var(--bg-surface)' }} />
      </div>
    )}
    <div className="relative z-10">{children}</div>
  </div>
));
NodeWrapper.displayName = 'NodeWrapper';

// ─── Trigger Node ─────────────────────────────────────
export const TriggerNode = memo(({ data }: { data: NodeData }) => {
  const color = '#10b981';
  return (
    <NodeWrapper borderColor="rgba(16,185,129,0.3)" glowColor="rgba(16,185,129,0.15)">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            {iconMap[data.type] || <Zap size={16} />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white truncate leading-tight">{data.label || 'Trigger'}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest">Entry Point</span>
            </div>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 bg-black/30 rounded-lg px-3 py-2 border border-white/5 font-medium leading-relaxed">
          {data.type === 'webhook' ? 'Listening for external POST events' :
           data.type === 'schedule' ? 'Executes on time interval' :
           'Manual invocation required'}
        </div>
      </div>
      <HandleDot type="source" position={Position.Right} color={color} />
    </NodeWrapper>
  );
});
TriggerNode.displayName = 'TriggerNode';

// ─── Action Node ─────────────────────────────────────
export const ActionNode = memo(({ data }: { data: NodeData }) => {
  const providerColors: Record<string, string> = {
    slack: '#4A154B',
    gmail: '#EA4335',
    stripe: '#635BFF',
    http: 'var(--brand-500)',
  };
  const color = providerColors[data.provider || ''] || 'var(--brand-500)';

  return (
    <NodeWrapper borderColor={`${color}44`} glowColor={`${color}22`}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-105"
            style={{ background: `${color}15`, borderColor: `${color}30`, color: color }}>
            {iconMap[data.provider || data.type] || <Settings2 size={16} />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white truncate leading-tight">{data.label || 'Action Step'}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{data.provider || 'system'} integration</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-black/20 rounded-lg px-3 py-1.5 font-mono border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          target: <span className="text-slate-200">{data.provider || 'internal'}</span>
        </div>
      </div>
      <HandleDot type="target" position={Position.Left} color="var(--text-muted)" />
      <HandleDot type="source" position={Position.Right} color={color} />
    </NodeWrapper>
  );
});
ActionNode.displayName = 'ActionNode';

// ─── AI Node ─────────────────────────────────────────
export const AiNode = memo(({ data }: { data: NodeData }) => {
  const color = '#a855f7';
  return (
    <NodeWrapper borderColor="rgba(168,85,247,0.3)" glowColor="rgba(168,85,247,0.15)">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <Brain size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white truncate leading-tight">{data.label || 'Intelligence'}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex -space-x-1">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400/50 border border-blue-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400/50 border border-purple-400/80" />
              </div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Cognitive API</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-2.5 rounded-lg border border-purple-500/10 mb-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Task</span>
            <span className="text-[10px] text-purple-300 font-mono font-bold capitalize px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              {data.action || 'summarize'}
            </span>
          </div>
        </div>
      </div>
      <HandleDot type="target" position={Position.Left} color="var(--text-muted)" />
      <HandleDot type="source" position={Position.Right} color={color} />
    </NodeWrapper>
  );
});
AiNode.displayName = 'AiNode';

// ─── Condition Node ───────────────────────────────────
export const ConditionNode = memo(({ data }: { data: NodeData }) => {
  return (
    <NodeWrapper borderColor="rgba(245,158,11,0.3)" glowColor="rgba(245,158,11,0.15)">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <GitBranch size={16} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white truncate leading-tight">{data.label || 'Decision'}</h3>
            <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest mt-0.5">Control Flow</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono bg-black/30 rounded-lg px-3 py-2 border border-white/5">
          <span className="text-slate-400">{data.field || 'key'}</span>
          <span className="text-amber-500 font-bold">{data.operator || '=='}</span>
          <span className="text-emerald-400">{data.value || 'true'}</span>
        </div>
      </div>

      {/* Logical Exit Points */}
      <div className="absolute -top-[2px] right-8 translate-y-[-100%] flex flex-col items-center gap-1">
        <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">True</span>
        <HandleDot type="source" position={Position.Top} id="true" color="#10b981" />
      </div>

      <div className="absolute -bottom-[2px] right-8 translate-y-[100%] flex flex-col-reverse items-center gap-1">
        <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 uppercase">False</span>
        <HandleDot type="source" position={Position.Bottom} id="false" color="#ef4444" />
      </div>

      <HandleDot type="target" position={Position.Left} color="var(--text-muted)" />
    </NodeWrapper>
  );
});
ConditionNode.displayName = 'ConditionNode';

export const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  ai: AiNode,
  condition: ConditionNode,
};
