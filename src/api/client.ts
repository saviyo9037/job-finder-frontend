const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  getStats: () => request<import('../types').DashboardStats>('/api/jobs/stats'),

  getFetchLogs: (limit = 20) =>
    request<{ logs: import('../types').FetchLog[] }>(`/api/jobs/fetch-logs?limit=${limit}`),

  getJobs: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ jobs: import('../types').Job[]; total: number }>(
      `/api/jobs${qs ? `?${qs}` : ''}`
    );
  },

  fetchNow: () =>
    request<{ inserted: number; skipped: number; fetchedAt: string }>('/api/jobs/fetch-now', {
      method: 'POST',
    }),

  addManualJob: (jobData: Record<string, string>) =>
    request<import('../types').Job>('/api/jobs/manual', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),

  updateStatus: (id: string, status: string) =>
    request<import('../types').Job>(`/api/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  toggleSave: (id: string, saved: boolean) =>
    request<import('../types').Job>(`/api/jobs/${id}/save`, {
      method: 'PATCH',
      body: JSON.stringify({ saved }),
    }),

  deleteJob: (id: string) =>
    request<{ message: string }>(`/api/jobs/${id}`, { method: 'DELETE' }),

  previewEmail: (jobId: string) =>
    request<import('../types').EmailPreview>('/api/email/preview', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    }),

  sendEmail: (data: { jobId: string; to: string; subject: string; body: string }) =>
    request<{ message: string }>('/api/email/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: () =>
    request<{ user: import('../types').User; settings: import('../types').ProfileSettings }>(
      '/api/settings/profile'
    ),

  updateCoverLetter: (coverLetter: string) =>
    request('/api/settings/cover-letter', {
      method: 'PUT',
      body: JSON.stringify({ coverLetter }),
    }),

  uploadResume: (file: File) => {
    const form = new FormData();
    form.append('resume', file);
    return request<{ message: string; resumeFilename: string }>('/api/settings/resume', {
      method: 'POST',
      body: form,
    });
  },
};
