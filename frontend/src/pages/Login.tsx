import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { LogIn, Lock, Mail, Eye, EyeOff, Building, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      if (res.data.role === 'SUPER_ADMIN') {
        navigate('/super/dashboard');
      } else if (res.data.role === 'BANK_ADMIN') {
        if (!res.data.isPasswordChanged) {
          navigate('/change-password');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pure-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" 
             style={{ backgroundImage: 'linear-gradient(var(--color-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="card-premium p-8 bg-pure-black/60 backdrop-blur-xl border-grid-line shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-none transform rotate-45">
              <Building className="text-black transform -rotate-45" size={24} />
            </div>
          </div>

          <h2 className="text-2xl font-medium text-center mb-2 tracking-tight">Access Portal</h2>
          <p className="mono-label text-center mb-8 text-neutral">Secure Authentication Required</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@institution.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-grid-line py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white transition-all placeholder:text-neutral/50"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-grid-line py-3 pl-12 pr-12 text-white focus:outline-none focus:border-white transition-all placeholder:text-neutral/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-neutral hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 border border-red-400/20 mt-4 overflow-hidden"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-grid-line text-center">
            <p className="text-neutral text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-white hover:underline underline-offset-4">
                Register Personal Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-between text-[10px] font-mono text-neutral tracking-widest uppercase">
          <span>Encrypted Session</span>
          <span>v1.0.4-SC</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
