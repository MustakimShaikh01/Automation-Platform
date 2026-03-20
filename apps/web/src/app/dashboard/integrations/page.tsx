'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationApi } from '@/lib/api';
import {
  Mail, MessageSquare, CreditCard, Bot, BarChart3, Phone,
  Globe, CheckCircle, Plus, Loader2, Trash2, Zap, ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

// Static integration catalog — data from API tells us connection status
const INTEGRATION_CATALOG = [
  {
    provider: 'gmail',
    name: 'Gmail',
    description: 'Send emails, watch inbox, trigger on new messages.',
    icon: <Mail size={20} />,
    color: '#EA4335',
    category: 'Communication',
  },
  {
    provider: 'slack',
    name: 'Slack',
    description: 'Post messages, create channels, react to events.',
    icon: <MessageSquare size={20} />,
    color: '#4A154B',
    category: 'Communication',
  },
  {
    provider: 'stripe',
    name: 'Stripe',
    description: 'Handle payments, subscriptions, and webhook events.',
    icon: <CreditCard size={20} />,
    color: '#635BFF',
    category: 'Payments',
  },
  {
    provider: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o completions, embeddings, and image generation.',
    icon: <Bot size={20} />,
    color: '#10a37f',
    category: 'AI',
  },
  {
    provider: 'sheets',
    name: 'Google Sheets',
    description: 'Read rows, write data, and trigger on sheet updates.',
    icon: <BarChart3 size={20} />,
    color: '#0F9D58',
    category: 'Productivity',
  },
  {
    provider: 'twilio',
    name: 'Twilio',
    description: 'Send SMS, WhatsApp messages, and voice calls.',
    icon: <Phone size={20} />,
    color: '#F22F46',
    category: 'Communication',
  },
  {
    provider: 'http',
    name: 'HTTP / REST',
    description: 'Make custom HTTP requests to any external API.',
    icon: <Globe size={20} />,
    color: '#6366f1',
    category: 'Developer',
  },
  {
    provider: 'webhook',
    name: 'Webhook',
    description: 'Send POST payloads to any URL when workflows execute.',
    icon: <Zap size={20} />,
    color: '#f59e0b',
    category: 'Developer',
  },
];

const CATEGORIES = ['All', 'Communication', 'AI', 'Payments', 'Productivity', 'Developer'];

export default function IntegrationsPage() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: integrationApi.list,
  });

  const connectMutation = useMutation({
    mutationFn: ({ provider, creds }: { provider: string; creds: any }) =>
      integrationApi.connect(provider, creds),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success(`${vars.provider} connected successfully!`);
    },
    onError: () => toast.error('Failed to connect. Check your credentials.'),
  });

  const disconnectMutation = useMutation({
    mutationFn: integrationApi.disconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success('Integration disconnected');
    },
    onError: () => toast.error('Failed to disconnect'),
  });

  // Build a Map of connected integrations from API
  const connectedMap = new Map<string, any>(
    (integrations || []).map((i: any) => [i.provider, i])
  );

  const handleConnect = (provider: string, name: string) => {
    const key = prompt(`Enter your ${name} API Key or Token to connect:`);
    if (key && key.trim()) {
      connectMutation.mutate({ provider, creds: { apiKey: key.trim() } });
    }
  };

  const filtered = activeCategory === 'All'
    ? INTEGRATION_CATALOG
    : INTEGRATION_CATALOG.filter((i) => i.category === activeCategory);

  const connectedCount = INTEGRATION_CATALOG.filter((i) => connectedMap.has(i.provider) && connectedMap.get(i.provider)?.isConnected).length;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Integrations</h1>
          <p className="text-slate-400 text-sm">
            Connect your apps. Credentials encrypted with AES-256. {connectedCount > 0 && (
              <span className="text-indigo-400 font-medium">{connectedCount} connected</span>
            )}
          </p>
        </div>
        <a
          href="https://docs.autoify.ai/integrations"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-sm border border-white/8"
        >
          <ExternalLink size={14} /> View Docs
        </a>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-500 hover:text-white border border-white/7 hover:border-white/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((integration) => {
          const connected = connectedMap.get(integration.provider);
          const isConnected = connected?.isConnected;

          return (
            <div
              key={integration.provider}
              className="glass-card p-5 relative flex flex-col group"
              style={isConnected ? {
                borderColor: `${integration.color}40`,
                boxShadow: `0 0 20px ${integration.color}10`,
              } : {}}
            >
              {/* Connected badge */}
              {isConnected && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <CheckCircle size={9} /> Connected
                </div>
              )}

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{
                  background: `${integration.color}18`,
                  border: `1px solid ${integration.color}35`,
                  color: integration.color,
                }}
              >
                {integration.icon}
              </div>

              <div className="mb-1">
                <span className="text-[9px] text-slate-600 font-semibold uppercase tracking-widest">{integration.category}</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{integration.name}</h3>
              <p className="text-xs text-slate-500 mb-4 flex-1 leading-relaxed">{integration.description}</p>

              {isConnected ? (
                <div className="mt-auto border-t border-white/5 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600">
                    {connected.connectedAt
                      ? `Since ${new Date(connected.connectedAt).toLocaleDateString()}`
                      : 'Connected'}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Disconnect ${integration.name}?`)) {
                        disconnectMutation.mutate(integration.provider);
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                    disabled={disconnectMutation.isPending}
                  >
                    <Trash2 size={11} /> Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(integration.provider, integration.name)}
                  disabled={connectMutation.isPending}
                  className="mt-auto btn-secondary w-full justify-center text-xs"
                >
                  {connectMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  Connect Account
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
