import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(email, password, isAdmin ? 'admin' : 'user');
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 py-16 px-4 overflow-hidden">
      
      {/* Background Blurred Ambient Circles (Orbs) */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-15"></div>

      {/* Glassmorphic Container Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 pt-16 rounded-2xl shadow-2xl relative z-10 overflow-visible mt-8">
        
        {/* Overlapping Profile Circle */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-indigo-950/40 backdrop-blur-md border border-white/20 rounded-full flex justify-center items-center shadow-2xl">
          <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white tracking-wide">Create Account</h2>
          <p className="text-xs text-indigo-200 mt-1">Join the dealership inventory system</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 text-red-200 text-xs p-3 rounded-lg border border-red-500/30 backdrop-blur-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/20 text-emerald-250 text-xs p-3 rounded-lg border border-emerald-500/30 backdrop-blur-sm">
              {success}
            </div>
          )}

          {/* Email ID Field */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full pl-12 pr-4 py-3 bg-white/95 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm font-medium border-0 transition"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full pl-12 pr-4 py-3 bg-white/95 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm font-medium border-0 transition"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full pl-12 pr-4 py-3 bg-white/95 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm font-medium border-0 transition"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Admin Registration Toggle */}
          <div className="flex items-center text-xs text-indigo-200">
            <input
              id="is-admin"
              name="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="h-4 w-4 text-indigo-650 focus:ring-indigo-500 border-white/20 rounded bg-white/10 cursor-pointer"
            />
            <label htmlFor="is-admin" className="ml-2 block cursor-pointer font-medium select-none">
              Register as Administrator
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition duration-150"
            >
              {loading ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-indigo-200 mt-6 pt-4 border-t border-white/10">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-white hover:text-indigo-200 transition">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
