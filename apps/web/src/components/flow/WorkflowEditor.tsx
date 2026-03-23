'use client';

import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './CustomNodes';
import {
  Save, Play, Webhook, Brain, Plus, Loader2, Copy, GitBranch,
  Mail, CreditCard, Slack, Settings2, Zap, X, ChevronRight,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '@/lib/api';
import toast from 'react-hot-toast';

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    data: { label: 'Webhook Trigger', type: 'webhook' },
    position: { x: 80, y: 200 },
  },
];

interface WorkflowEditorProps {
  workflow: any;
}

export default function WorkflowEditor({ workflow }: WorkflowEditorProps) {
  const queryClient = useQueryClient();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow?.graph?.nodes?.length ? workflow.graph.nodes : initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow?.graph?.edges?.length ? workflow.graph.edges : []
  );

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
            style: { stroke: '#6366f1', strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateMutation = useMutation({
    mutationFn: (data: any) => workflowApi.update(workflow.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', workflow.id] });
      toast.success('Workflow saved successfully!');
    },
    onError: () => toast.error('Failed to save workflow'),
  });

  const handleSave = () => {
    updateMutation.mutate({
      name: workflow.name,
      description: workflow.description,
      triggerType: workflow.triggerType,
      isActive: workflow.isActive,
      graph: { nodes, edges },
    });
  };

  const handleTestRun = async () => {
    setIsTestRunning(true);
    try {
      await workflowApi.trigger(workflow.id, { source: 'test', timestamp: new Date().toISOString() });
      toast.success('Test execution triggered! Check Executions tab.');
    } catch {
      toast.error('Failed to trigger. Activate the workflow first.');
    } finally {
      setIsTestRunning(false);
    }
  };

  const addNode = (type: string, provider?: string) => {
    const labels: Record<string, string> = {
      ai: 'AI Analysis',
      condition: 'If / Else',
      slack: 'Slack Action',
      gmail: 'Send Email',
      stripe: 'Stripe Action',
      http: 'HTTP Request',
    };
    const newNode = {
      id: `node_${Date.now()}`,
      type: type === 'slack' || type === 'gmail' || type === 'stripe' || type === 'http' ? 'action' : type,
      position: { x: Math.random() * 300 + 200, y: Math.random() * 200 + 100 },
      data: {
        label: labels[provider || type] || 'New Step',
        type: provider || type,
        provider: provider,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    toast.success(`Added ${labels[provider || type] || 'node'}`);
  };

  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
    toast('Node removed', { icon: '🗑️' });
  };

  const copyWebhook = () => {
    if (!workflow.webhookUrl) {
      toast.error('No webhook URL available');
      return;
    }
    navigator.clipboard.writeText(workflow.webhookUrl);
    toast.success('Webhook URL copied!');
  };

  const updateSelectedNodeData = (key: string, value: string) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, [key]: value } } : n
      )
    );
    setSelectedNode((prev: any) => ({ ...prev, data: { ...prev.data, [key]: value } }));
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex animate-fade-in"
      style={{
        height: 'calc(100vh - 150px)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-base)',
        boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── CANVAS ── */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.2}
          maxZoom={1.5}
          deleteKeyCode="Delete"
          style={{ background: 'var(--bg-base)' }}
        >
          <Background
            color="var(--brand-500)"
            gap={32}
            size={1}
            variant={BackgroundVariant.Dots}
            style={{ opacity: 0.15 }}
          />
          <Controls 
            showInteractive={false} 
            className="!bg-background !border-subtle !rounded-xl !overflow-hidden !shadow-2xl"
          />
          <MiniMap
            maskColor="rgba(7,7,15,0.8)"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
            nodeColor={(n) => {
              if (n.type === 'trigger') return '#10b981';
              if (n.type === 'ai') return '#a855f7';
              if (n.type === 'condition') return '#f59e0b';
              return 'var(--brand-500)';
            }}
          />

          {/* ── Top-Left: Status ── */}
          <Panel position="top-left" className="m-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-card border-brand/20 shadow-2xl">
              <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand-400">
                <GitBranch size={14} />
              </div>
              <div>
                <span className="font-bold text-white text-sm tracking-tight">{workflow.status === 'PUBLISHED' ? 'Live Production' : 'Staging Draft'}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${workflow.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {workflow.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          {/* ── Top-Right: Actions ── */}
          <Panel position="top-right" className="m-4 flex gap-2">
            <button
              onClick={handleTestRun}
              disabled={isTestRunning}
              className="btn-secondary h-10 px-4 text-xs font-bold"
              style={{ background: 'var(--bg-surface)', backdropFilter: 'blur(12px)' }}
            >
              {isTestRunning ? <Loader2 size={14} className="animate-spin mr-2" /> : <Play size={14} className="mr-2" />}
              Simulation
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="btn-primary h-10 px-6 text-xs font-black uppercase tracking-widest"
            >
              {updateMutation.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
              Deploy
            </button>
          </Panel>

          {/* ── Bottom hint ── */}
          <Panel position="bottom-center" className="mb-6">
            <div className="text-[10px] font-bold text-slate-600 px-4 py-2 rounded-full glass-card border-none tracking-wide">
              DRAG NODES <span className="mx-2 opacity-30">•</span> CONNECT HANDLES <span className="mx-2 opacity-30">•</span> PRESS [DEL] TO REMOVE
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* ── RIGHT UTILITY PANEL ── */}
      <aside
        className="w-80 flex flex-col glass border-l border-subtle relative z-20"
        style={{ background: 'var(--bg-surface)' }}
      >
        {selectedNode ? (
          /* ── NODE CONFIG ── */
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-6 border-b border-subtle flex items-center justify-between bg-white/[0.02]">
              <div>
                <h2 className="text-xs font-black text-white uppercase tracking-widest mb-1">Node Properties</h2>
                <p className="text-[10px] text-slate-500 font-medium">Configure step logic and data</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Common Label */}
              <div className="space-y-2">
                <label className="section-label">Display Name</label>
                <input
                  type="text"
                  className="input-field !bg-base"
                  value={selectedNode.data.label || ''}
                  onChange={(e) => updateSelectedNodeData('label', e.target.value)}
                  placeholder="Step description..."
                />
              </div>

              <div className="divider" />

              {/* Webhook Logic */}
              {selectedNode.type === 'trigger' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="section-label">Endpoint URL</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/40 rounded-lg px-3 py-2 border border-white/5 font-mono text-[10px] text-brand-300 truncate">
                        {workflow.webhookUrl || 'not-assigned'}
                      </div>
                      <button
                        onClick={copyWebhook}
                        className="p-2 rounded-lg bg-brand/10 border border-brand/20 text-brand-400 hover:bg-brand/20 transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-[10px] text-emerald-400/80 leading-relaxed italic">
                      "Send JSON payloads to this endpoint to trigger 
                      this workflow in real-time."
                    </p>
                  </div>
                </div>
              )}

              {/* AI Config */}
              {selectedNode.type === 'ai' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="section-label">Intelligence Mode</label>
                    <select
                      className="input-field !bg-base"
                      value={selectedNode.data.action || 'summarize'}
                      onChange={(e) => updateSelectedNodeData('action', e.target.value)}
                    >
                      <option value="summarize">Summarization Engine</option>
                      <option value="extract">Structured Data Extraction</option>
                      <option value="classify">Sentiment & Intent Analysis</option>
                      <option value="generate">Content Generation</option>
                      <option value="decision">Logic Gate (AI Powered)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="section-label">Agent Instructions</label>
                    <textarea
                      className="input-field !bg-base h-40 resize-none text-[13px] leading-relaxed"
                      placeholder="Define the behavior of the AI for this specific step..."
                      value={selectedNode.data.prompt || ''}
                      onChange={(e) => updateSelectedNodeData('prompt', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Condition Logic */}
              {selectedNode.type === 'condition' && (
                <div className="space-y-4">
                  <div className="space-y-2 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 font-bold">
                      IF STATEMENT
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="section-label">Key to Validate</label>
                    <input
                      type="text"
                      className="input-field !bg-base font-mono"
                      placeholder="e.g. payload.user.id"
                      value={selectedNode.data.field || ''}
                      onChange={(e) => updateSelectedNodeData('field', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="section-label">Logic Operator</label>
                    <select
                      className="input-field !bg-base"
                      value={selectedNode.data.operator || '=='}
                      onChange={(e) => updateSelectedNodeData('operator', e.target.value)}
                    >
                      <option value="==">Strict Equality (==)</option>
                      <option value="!=">Inequality (!=)</option>
                      <option value=">">Greater Than (&gt;)</option>
                      <option value="<">Less Than (&lt;)</option>
                      <option value="contains">Collection Contains</option>
                      <option value="exists">Key Exists</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="section-label">Expected Value</label>
                    <input
                      type="text"
                      className="input-field !bg-base font-mono"
                      placeholder="Match value..."
                      value={selectedNode.data.value || ''}
                      onChange={(e) => updateSelectedNodeData('value', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/[0.01] border-t border-subtle">
              <button
                onClick={deleteSelectedNode}
                className="btn-danger w-full justify-center h-11 text-xs font-black uppercase tracking-tighter"
              >
                Delete Step
              </button>
            </div>
          </div>
        ) : (
          /* ── NODE LIBRARY ── */
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-6 border-b border-subtle bg-white/[0.02]">
              <h2 className="text-xs font-black text-white uppercase tracking-widest mb-1">Component Library</h2>
              <p className="text-[10px] text-slate-500 font-medium">Add building blocks to your flow</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Trigger Group */}
              <div className="space-y-3">
                <label className="section-label">Event Triggers</label>
                <button
                  onClick={() => addNode('trigger', 'webhook')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group border-emerald-500/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <Webhook size={18} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-xs font-bold text-white mb-0.5">Webhook</div>
                    <div className="text-[10px] text-slate-500 leading-tight">External HTTP trigger</div>
                  </div>
                  <Plus size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </button>
              </div>

              {/* Intelligence Group */}
              <div className="space-y-3">
                <label className="section-label">AI & Logic</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => addNode('condition')}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl glass-card hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group border-amber-500/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:rotate-12 transition-transform">
                      <GitBranch size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">Condition</span>
                  </button>
                  <button
                    onClick={() => addNode('ai')}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl glass-card hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group border-purple-500/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                      <Brain size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">AI Step</span>
                  </button>
                </div>
              </div>

              {/* Integrations Group */}
              <div className="space-y-3">
                <label className="section-label">Third-party Apps</label>
                <div className="space-y-2">
                  {[
                    { provider: 'slack', name: 'Slack', icon: <Slack size={16} />, color: '#4A154B' },
                    { provider: 'gmail', name: 'Gmail', icon: <Mail size={16} />, color: '#EA4335' },
                    { provider: 'stripe', name: 'Stripe', icon: <CreditCard size={16} />, color: '#635BFF' },
                  ].map((app) => (
                    <button
                      key={app.provider}
                      onClick={() => addNode('action', app.provider)}
                      className="w-full flex items-center gap-4 p-3.5 rounded-xl glass-card hover:bg-white/5 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                           style={{ background: `${app.color}15`, border: `1px solid ${app.color}30`, color: app.color }}>
                        {app.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-[12px] font-bold text-white">{app.name}</div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">Post Data</div>
                      </div>
                      <Plus size={14} className="text-slate-700 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-brand/5 border-t border-brand/10">
              <div className="flex items-start gap-3">
                <Zap size={14} className="text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] text-brand-300 font-bold uppercase tracking-tight mb-1">Fast Prototyping</p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Drag connections from circle handles to define the execution path.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
