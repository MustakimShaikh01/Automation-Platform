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
      className="rounded-2xl overflow-hidden flex"
      style={{
        height: 'calc(100vh - 140px)',
        border: '1px solid rgba(99,102,241,0.2)',
        background: '#0a0a0f',
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
          minZoom={0.3}
          maxZoom={2}
          deleteKeyCode="Delete"
          style={{ background: '#0a0a0f' }}
        >
          <Background
            color="rgba(99,102,241,0.12)"
            gap={28}
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <Controls showInteractive={false} />
          <MiniMap
            maskColor="rgba(8,8,15,0.85)"
            nodeColor={(n) => {
              if (n.type === 'trigger') return '#10b981';
              if (n.type === 'ai') return '#a855f7';
              if (n.type === 'condition') return '#f59e0b';
              return '#6366f1';
            }}
          />

          {/* ── Top-Left: Workflow Name + Status ── */}
          <Panel position="top-left" className="m-3">
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{
                background: 'rgba(15,15,26,0.95)',
                border: '1px solid rgba(99,102,241,0.2)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Zap size={13} className="text-indigo-400" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">{workflow.name}</span>
                <div className="mt-0.5">
                  <span className={`badge ${workflow.isActive ? 'badge-success' : 'badge-pending'}`}>
                    {workflow.isActive ? '● Active' : '○ Draft'}
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          {/* ── Top-Right: Action Buttons ── */}
          <Panel position="top-right" className="m-3 flex gap-2">
            <button
              onClick={handleTestRun}
              disabled={isTestRunning}
              className="btn-ghost border border-white/10 text-sm"
              style={{ backdropFilter: 'blur(12px)', background: 'rgba(15,15,26,0.9)' }}
            >
              {isTestRunning ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
              Test Run
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="btn-primary text-sm"
            >
              {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save
            </button>
          </Panel>

          {/* ── Bottom hint ── */}
          <Panel position="bottom-center" className="mb-3">
            <div className="text-[11px] text-slate-600 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(15,15,26,0.7)' }}>
              Drag nodes • Connect handles • Press Delete to remove selected
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="w-72 flex flex-col overflow-y-auto"
        style={{
          background: 'rgba(12,12,20,0.97)',
          borderLeft: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        {selectedNode ? (
          /* ── Node Properties ── */
          <div className="p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white">Node Settings</h2>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-slate-500 hover:text-white transition-colors rounded"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {/* Label */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Label</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  value={selectedNode.data.label || ''}
                  onChange={(e) => updateSelectedNodeData('label', e.target.value)}
                  placeholder="Node label..."
                />
              </div>

              {/* Webhook URL for trigger nodes */}
              {selectedNode.type === 'trigger' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Webhook URL</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      readOnly
                      value={workflow.webhookUrl || 'Not yet generated'}
                      className="input-field rounded-r-none text-xs font-mono text-slate-400 flex-1"
                    />
                    <button
                      onClick={copyWebhook}
                      className="btn-secondary rounded-l-none px-3 flex-shrink-0 border-l-0"
                    >
                      <Copy size={13} className="text-indigo-400" />
                    </button>
                  </div>
                  {workflow.webhookUrl && (
                    <p className="text-[10px] text-slate-600 mt-1.5 font-mono">POST to this URL to trigger the workflow</p>
                  )}
                </div>
              )}

              {/* Trigger type selector */}
              {selectedNode.type === 'trigger' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Trigger Type</label>
                  <select
                    className="input-field text-sm"
                    value={selectedNode.data.type || 'webhook'}
                    onChange={(e) => updateSelectedNodeData('type', e.target.value)}
                  >
                    <option value="webhook">Webhook</option>
                    <option value="schedule">Cron Schedule</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              )}

              {/* AI Node settings */}
              {selectedNode.type === 'ai' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">AI Action</label>
                    <select
                      className="input-field text-sm"
                      value={selectedNode.data.action || 'summarize'}
                      onChange={(e) => updateSelectedNodeData('action', e.target.value)}
                    >
                      <option value="summarize">Summarize Text</option>
                      <option value="extract">Extract Data (JSON)</option>
                      <option value="classify">Classify Intent</option>
                      <option value="generate">Generate Content</option>
                      <option value="decision">AI Decision (Route)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">System Prompt</label>
                    <textarea
                      className="input-field h-28 text-sm resize-none"
                      placeholder="You are an expert assistant. Analyze the input and..."
                      value={selectedNode.data.prompt || ''}
                      onChange={(e) => updateSelectedNodeData('prompt', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Condition Node settings */}
              {selectedNode.type === 'condition' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Field</label>
                    <input
                      type="text"
                      className="input-field text-sm font-mono"
                      placeholder="e.g. data.status"
                      value={selectedNode.data.field || ''}
                      onChange={(e) => updateSelectedNodeData('field', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Operator</label>
                    <select
                      className="input-field text-sm"
                      value={selectedNode.data.operator || '=='}
                      onChange={(e) => updateSelectedNodeData('operator', e.target.value)}
                    >
                      <option value="==">== equals</option>
                      <option value="!=">!= not equals</option>
                      <option value=">">{">"} greater than</option>
                      <option value="<">{"<"} less than</option>
                      <option value="contains">contains</option>
                      <option value="exists">exists</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Value</label>
                    <input
                      type="text"
                      className="input-field text-sm font-mono"
                      placeholder="e.g. success"
                      value={selectedNode.data.value || ''}
                      onChange={(e) => updateSelectedNodeData('value', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Delete Node */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <button
                onClick={deleteSelectedNode}
                className="btn-danger w-full justify-center text-sm"
              >
                Remove Node
              </button>
            </div>
          </div>
        ) : (
          /* ── Add Nodes Panel ── */
          <div className="p-5">
            <h2 className="text-sm font-bold text-white mb-5">Add Nodes</h2>

            {/* Triggers */}
            <div className="mb-5">
              <p className="section-title">Triggers</p>
              <div className="space-y-2">
                <button
                  onClick={() => addNode('trigger', 'webhook')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                    <Webhook size={14} />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white">Webhook</div>
                    <div className="text-[10px] text-slate-500">Trigger on HTTP POST</div>
                  </div>
                  <ChevronRight size={13} className="ml-auto text-slate-600" />
                </button>
              </div>
            </div>

            {/* Logic */}
            <div className="mb-5">
              <p className="section-title">Logic</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addNode('condition')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(245,158,11,0.2)' }}
                >
                  <span className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <GitBranch size={14} />
                  </span>
                  <span className="text-xs font-medium text-slate-300">If / Else</span>
                </button>
                <button
                  onClick={() => addNode('ai')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:bg-purple-500/5"
                  style={{ border: '1px solid rgba(168,85,247,0.2)' }}
                >
                  <span className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
                    <Brain size={14} />
                  </span>
                  <span className="text-xs font-medium text-slate-300">AI Node</span>
                </button>
              </div>
            </div>

            {/* Apps */}
            <div>
              <p className="section-title">Apps</p>
              <div className="space-y-2">
                {[
                  { provider: 'slack', name: 'Slack', icon: <Slack size={14} />, color: '#4A154B' },
                  { provider: 'gmail', name: 'Gmail', icon: <Mail size={14} />, color: '#EA4335' },
                  { provider: 'stripe', name: 'Stripe', icon: <CreditCard size={14} />, color: '#635BFF' },
                ].map((app) => (
                  <button
                    key={app.provider}
                    onClick={() => addNode('action', app.provider)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/5"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white"
                      style={{ background: `${app.color}22`, border: `1px solid ${app.color}44` }}>
                      {app.icon}
                    </span>
                    <span className="text-xs font-medium text-slate-300">{app.name} Action</span>
                    <Plus size={13} className="ml-auto text-slate-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <p className="text-[10px] text-indigo-400 font-semibold mb-1">💡 Pro Tips</p>
              <ul className="text-[10px] text-slate-500 space-y-1">
                <li>• Drag nodes freely on the canvas</li>
                <li>• Connect handles to chain steps</li>
                <li>• Click nodes to configure</li>
                <li>• Press Save to persist changes</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
