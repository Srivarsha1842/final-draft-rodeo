import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginForm.email || !loginForm.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupForm.firstName || !signupForm.lastName || !signupForm.email || !signupForm.phone || !signupForm.password) {
      setError('Please fill in all required fields.'); return;
    }
    if (signupForm.password !== signupForm.confirm) { setError('Passwords do not match.'); return; }
    if (signupForm.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Account created! Welcome to Triprodeo.');
      setTimeout(() => navigate('/dashboard'), 1500);
    }, 1200);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!forgotEmail) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Reset link sent! Check your inbox.');
    }, 900);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=stunning%20luxury%20cliff%20villa%20with%20infinity%20pool%20overlooking%20indian%20ocean%20at%20golden%20hour%20sunset%20dramatic%20sky%20tropical%20lush%20landscape%20cinematic%20wide%20angle&width=800&height=1000&seq=loginbg01&orientation=portrait"
          alt="Triprodeo"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://static.readdy.ai/image/df75ddbe126af1b251cb2de8db121689/6808d36637866ce15d1ddd41b6de1515.png"
              alt="Triprodeo"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <div>
            <blockquote className="text-white text-2xl font-bold leading-snug mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              "Every trip is a story waiting to be told — we help you find the perfect setting."
            </blockquote>
            <div className="flex items-center gap-3">
              <img
                src="https://readdy.ai/api/search-image?query=young%20indian%20woman%20smiling%20portrait%20warm%20candid%20outdoor%20travel&width=48&height=48&seq=testimonial1&orientation=squarish"
                alt=""
                className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
              />
              <div>
                <p className="text-white text-sm font-semibold">Priya S.</p>
                <p className="text-white/60 text-xs">Booked 12 trips on Triprodeo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden mb-8">
          <img
            src="https://static.readdy.ai/image/df75ddbe126af1b251cb2de8db121689/6808d36637866ce15d1ddd41b6de1515.png"
            alt="Triprodeo"
            className="h-8 w-auto object-contain"
          />
        </Link>

        <div className="w-full max-w-md">
          {/* Mode tabs */}
          {mode !== 'forgot' && (
            <div className="flex bg-stone-100 p-1 rounded-full mb-8 gap-1">
              {(['login', 'signup'] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap capitalize ${
                    mode === m ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          )}

          {/* Heading */}
          <div className="mb-6">
            {mode === 'login' && (
              <>
                <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome back</h1>
                <p className="text-stone-500 text-sm mt-1">Sign in to access your trips and bookings</p>
              </>
            )}
            {mode === 'signup' && (
              <>
                <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Join Triprodeo</h1>
                <p className="text-stone-500 text-sm mt-1">Create your free account and start exploring</p>
              </>
            )}
            {mode === 'forgot' && (
              <>
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="flex items-center gap-1 text-stone-500 text-sm mb-4 hover:text-stone-900 cursor-pointer">
                  <i className="ri-arrow-left-line" /> Back to Sign In
                </button>
                <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Reset Password</h1>
                <p className="text-stone-500 text-sm mt-1">Enter your email and we'll send a reset link</p>
              </>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <i className="ri-error-warning-line shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
              <i className="ri-checkbox-circle-line shrink-0" /> {success}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-stone-700">Password</label>
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer">
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? <><i className="ri-loader-4-line animate-spin" /> Signing In...</> : 'Sign In'}
              </button>

              <div className="relative flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-stone-400 text-xs">or continue with</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'ri-google-fill', label: 'Google' },
                  { icon: 'ri-facebook-fill', label: 'Facebook' },
                ].map(({ icon, label }) => (
                  <button key={label} type="button" className="flex items-center justify-center gap-2 py-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap">
                    <i className={`${icon} text-base`} />
                    {label}
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    placeholder="John"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-3 border border-stone-200 rounded-xl bg-stone-50 shrink-0">
                    <img src="https://flagcdn.com/w40/in.png" alt="IN" className="w-5 h-3.5 object-cover rounded-sm" />
                    <span className="text-sm text-stone-600">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 pr-11 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer">
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </button>
                </div>
                {signupForm.password && (
                  <div className="flex gap-1 mt-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          signupForm.password.length >= (i + 1) * 2
                            ? signupForm.password.length < 6 ? 'bg-red-400' : signupForm.password.length < 10 ? 'bg-amber-400' : 'bg-emerald-400'
                            : 'bg-stone-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-stone-400 ml-1 whitespace-nowrap">
                      {signupForm.password.length < 6 ? 'Weak' : signupForm.password.length < 10 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={signupForm.confirm}
                  onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>
              <div className="flex items-start gap-3 pt-1">
                <input type="checkbox" required id="tac" className="mt-0.5 w-4 h-4 rounded border-stone-300 accent-stone-900" />
                <label htmlFor="tac" className="text-sm text-stone-600">
                  I agree to the{' '}
                  <a href="#" className="underline hover:text-stone-900">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="underline hover:text-stone-900">Privacy Policy</a>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? <><i className="ri-loader-4-line animate-spin" /> Creating Account...</> : 'Create Free Account'}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? <><i className="ri-loader-4-line animate-spin" /> Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-stone-100">
            {[
              { icon: 'ri-shield-check-line', text: '256-bit SSL' },
              { icon: 'ri-lock-2-line', text: 'Secure & Private' },
              { icon: 'ri-verified-badge-line', text: 'Verified Platform' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-stone-400 text-xs">
                <i className={`${icon} text-sm`} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
