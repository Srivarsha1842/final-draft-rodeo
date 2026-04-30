import { useState } from 'react';
import { apiFetch, setAdminToken } from '@/lib/apiClient';

interface AdminLoginProps {
  onLogin: () => void;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  admin: { id: string; email: string; name: string };
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiFetch<LoginResponse>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAdminToken(result.accessToken);
      sessionStorage.setItem('triprodeo_admin_auth', 'true');
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center bg-stone-900 rounded-2xl mx-auto mb-4">
            <i className="ri-admin-line text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin CMS
          </h1>
          <p className="text-stone-500 text-sm mt-1">Triprodeo Content Management</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-8">
          <form onSubmit={handleSubmit} data-readdy-form>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@triprodeo.com"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:border-stone-400 transition-colors"
                autoFocus
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:border-stone-400 transition-colors"
                required
              />
              {error && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <i className="ri-error-warning-line" />
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin" />
                  Verifying...
                </span>
              ) : 'Access Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
