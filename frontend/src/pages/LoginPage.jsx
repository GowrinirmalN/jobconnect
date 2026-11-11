import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Briefcase, Lock, Mail, AlertCircle, Sparkles, Shield, UserCheck, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.firstName}!`, 'success');

      // Smart redirection based on role if no specific return path
      if (from === '/') {
        if (user.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
        else if (user.role === 'ROLE_RECRUITER') navigate('/recruiter/dashboard');
        else navigate('/seeker/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Card Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to JobConnect
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access your recruitment pipeline, jobs, or applications
          </p>
        </div>

        {/* Demo Account Quick-Fill Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-primary-50/60 p-4 rounded-2xl border border-indigo-100/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Developer Portfolio Demo Quick-Login</span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3">
            Click any demo role to auto-populate credentials:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('seeker@gmail.com', 'seeker123')}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-900 text-xs font-semibold shadow-sm transition-all text-center"
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('recruiter@techcorp.com', 'recruiter123')}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-900 text-xs font-semibold shadow-sm transition-all text-center"
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@jobconnect.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-900 text-xs font-semibold shadow-sm transition-all text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

