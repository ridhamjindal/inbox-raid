const API_BASE = (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '/api';

// In-memory session tracking for reliable cross-port cookie bypass
let currentSessionId: string | null = null;

export function setActiveSessionId(sid: string | null) {
  currentSessionId = sid;
}

export function getActiveSessionId(): string | null {
  return currentSessionId;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  isDemo: boolean;
  sessionId?: string;
  backendOffline?: boolean;
  user: {
    id?: string;
    email: string;
    name: string;
    picture?: string;
  } | null;
}

export interface FetchEmailsResponse {
  success: boolean;
  isDemo: boolean;
  emails: any[];
  nextPageToken?: string;
  totalEstimated?: number;
  error?: string;
  message?: string;
  backendOffline?: boolean;
}

export interface AuthUrlResponse {
  success: boolean;
  url?: string;
  notConfigured?: boolean;
  backendOffline?: boolean;
  error?: string;
  message?: string;
}

/**
 * Robust JSON fetch wrapper that never throws "Unexpected end of JSON input".
 * Handles empty bodies, non-JSON HTML error pages (Vite proxy/Nginx), and offline servers cleanly.
 */
async function safeRequest<T>(url: string, options: RequestInit = {}, defaultFallback: T): Promise<T> {
  try {
    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {})
    };

    if (currentSessionId) {
      headers['x-session-id'] = currentSessionId;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    // 1. Handle empty response body
    if (!text || !text.trim()) {
      if (!res.ok) {
        return {
          ...defaultFallback,
          success: false,
          error: `HTTP_${res.status}`,
          message: `Server returned HTTP ${res.status} with empty response body.`
        } as T;
      }
      return defaultFallback;
    }

    // 2. Parse JSON response if JSON header is present or string looks like JSON
    if (contentType.includes('application/json') || text.startsWith('{') || text.startsWith('[')) {
      try {
        const parsed = JSON.parse(text);
        return parsed as T;
      } catch (parseErr) {
        console.warn(`JSON parse error on ${url}:`, parseErr, text.slice(0, 100));
        return {
          ...defaultFallback,
          success: false,
          error: 'INVALID_JSON',
          message: 'Received invalid JSON from server.'
        } as T;
      }
    }

    // 3. Response is HTML or plain text (e.g. proxy 502/504 error page)
    const cleanedText = text.replace(/<[^>]*>/g, '').trim().slice(0, 120);
    return {
      ...defaultFallback,
      success: false,
      error: 'NON_JSON_RESPONSE',
      message: cleanedText || `Server returned non-JSON response (${res.status}).`
    } as T;
  } catch (err: any) {
    console.warn(`Network/fetch failure on ${url}:`, err);
    return {
      ...defaultFallback,
      success: false,
      backendOffline: true,
      error: 'SERVER_UNREACHABLE',
      message: 'INBOX RAID backend server is unreachable on http://localhost:5000. Please ensure the server is running.'
    } as T;
  }
}

export async function fetchHealth() {
  return safeRequest(`${API_BASE}/health`, {}, { status: 'offline', service: 'offline' });
}

export async function fetchAuthStatus(sid?: string): Promise<AuthStatusResponse> {
  const url = sid ? `${API_BASE}/auth/me?sid=${encodeURIComponent(sid)}` : `${API_BASE}/auth/me`;
  const res = await safeRequest<AuthStatusResponse>(
    url,
    {},
    { authenticated: false, isDemo: true, user: null, backendOffline: false }
  );

  if (res.authenticated && res.sessionId) {
    setActiveSessionId(res.sessionId);
  }

  return res;
}

export async function fetchGoogleAuthUrl(): Promise<AuthUrlResponse> {
  return safeRequest<AuthUrlResponse>(
    `${API_BASE}/auth/google/url`,
    {},
    {
      success: false,
      notConfigured: true,
      error: 'BACKEND_OFFLINE',
      message: 'Could not connect to backend server. Make sure "npm run dev" is running in the server directory.'
    }
  );
}

export async function disconnectGmail(): Promise<{ success: boolean; message: string }> {
  const res = await safeRequest(
    `${API_BASE}/auth/disconnect`,
    { method: 'POST' },
    { success: true, message: 'Local session cleared.' }
  );
  setActiveSessionId(null);
  return res;
}

export async function fetchEmails(isDemo = true, pageToken?: string, count: number = 20): Promise<FetchEmailsResponse> {
  const params = new URLSearchParams();
  params.set('demo', String(isDemo));
  if (pageToken) params.set('pageToken', pageToken);
  params.set('maxResults', String(count));

  return safeRequest<FetchEmailsResponse>(
    `${API_BASE}/emails?${params.toString()}`,
    {},
    { success: false, isDemo: true, emails: [] }
  );
}

export async function archiveEmailsBatch(ids: string[], isDemo = true): Promise<{ success: boolean; archivedCount?: number; archivedIds?: string[]; message?: string; error?: string }> {
  return safeRequest(
    `${API_BASE}/emails/archive`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, isDemo })
    },
    { success: isDemo, archivedCount: ids.length, archivedIds: ids }
  );
}

export async function unarchiveEmail(id: string, isDemo = true): Promise<{ success: boolean; messageId?: string; message?: string; error?: string }> {
  return safeRequest(
    `${API_BASE}/emails/unarchive`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isDemo })
    },
    { success: true, messageId: id }
  );
}

export async function analyzeEmail(subject: string, snippet: string, sender: string) {
  return safeRequest(
    `${API_BASE}/ai/analyze`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, snippet, sender })
    },
    { success: false }
  );
}
