import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('autoify_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('autoify_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  },
);

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

// ── Workflows ─────────────────────────────────────────
export const workflowApi = {
  list: () => api.get('/workflows').then((r) => r.data),
  get: (id: string) => api.get(`/workflows/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/workflows', data).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/workflows/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/workflows/${id}`).then((r) => r.data),
  toggle: (id: string) => api.patch(`/workflows/${id}/toggle`).then((r) => r.data),
  templates: () => api.get('/workflows/templates').then((r) => r.data),
  trigger: (id: string, payload?: any) =>
    api.post(`/webhooks/manual/${id}`, payload).then((r) => r.data),
};

// ── Executions ────────────────────────────────────────
export const executionApi = {
  list: (workflowId?: string, limit?: number) =>
    api.get('/executions', { params: { workflowId, limit } }).then((r) => r.data),
  get: (id: string) => api.get(`/executions/${id}`).then((r) => r.data),
  stats: () => api.get('/executions/stats').then((r) => r.data),
};

// ── Integrations ──────────────────────────────────────
export const integrationApi = {
  list: () => api.get('/integrations').then((r) => r.data),
  connect: (provider: string, credentials: Record<string, string>) =>
    api.post(`/integrations/${provider}/connect`, { credentials }).then((r) => r.data),
  disconnect: (provider: string) =>
    api.delete(`/integrations/${provider}/disconnect`).then((r) => r.data),
};

// ── Tenant ────────────────────────────────────────────
export const tenantApi = {
  get: () => api.get('/tenants/me').then((r) => r.data),
  usage: () => api.get('/tenants/me/usage').then((r) => r.data),
  update: (data: any) => api.put('/tenants/me', data).then((r) => r.data),
};

// ── AI ────────────────────────────────────────────────
export const aiApi = {
  summarize: (text: string) => api.post('/ai/summarize', { text }).then((r) => r.data),
  classify: (text: string, categories: string[]) =>
    api.post('/ai/classify', { text, categories }).then((r) => r.data),
  generate: (prompt: string, context?: any) =>
    api.post('/ai/generate', { prompt, context }).then((r) => r.data),
};
