import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pure-black flex items-center justify-center p-4 relative overflow-hidden">
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
              <UserPlus className="text-black transform -rotate-45" size={24} />
            </div>
          </div>

          <h2 className="text-2xl font-medium text-center mb-2 tracking-tight">Create Account</h2>
          <p className="mono-label text-center mb-8 text-neutral">Individual User Registration</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                <User size={18} />
              </div>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border border-grid-line py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white transition-all placeholder:text-neutral/50"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border border-grid-line py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white transition-all placeholder:text-neutral/50"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
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

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                <CheckCircle2 size={18} />
              </div>
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-transparent border border-grid-line py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white transition-all placeholder:text-neutral/50"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 border border-red-400/20 mt-2 overflow-hidden"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-grid-line text-center">
            <p className="text-neutral text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
