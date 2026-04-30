// Shared API client for talking to the backend.
// VITE_API_URL can override this (e.g. for local dev pointing at a remote backend).
// Default: in the browser, use same-origin "/api" in production (any non-localhost host),
// and the local backend on :5000 during `vite dev`.

const defaultBase =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? '/api'
    : 'http://localhost:5000/api';

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || defaultBase;

export const ADMIN_TOKEN_KEY = 'triprodeo_admin_token';

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null): void {
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function authHeader(): Record<string, string> {
  const t = getAdminToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

type ApiEnvelope<T> = { success?: boolean; data?: T; message?: string } | T;

export async function apiFetch<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((opts.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const raw = (await res.json().catch(() => ({}))) as ApiEnvelope<T>;
  const envelope = raw as { success?: boolean; data?: T; message?: string };
  if (!res.ok || envelope.success === false) {
    throw new Error(envelope.message || `Request failed: ${res.status}`);
  }
  // If backend returned the sendSuccess envelope, unwrap; otherwise return raw.
  return (envelope.data !== undefined ? envelope.data : (raw as T));
}
