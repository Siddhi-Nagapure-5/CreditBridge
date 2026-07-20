import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/change-password', { oldPassword, newPassword });
      updateUser({ isPasswordChanged: true });
      
      let destination = '/dashboard';
      if (user?.role === 'SUPER_ADMIN') destination = '/super/dashboard';
      else if (user?.role === 'BANK_ADMIN') destination = '/admin/dashboard';
      
      navigate(destination, { state: { message: 'Password updated successfully' }, replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password');
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
              <ShieldCheck className="text-black transform -rotate-45" size={24} />
            </div>
          </div>

          <h2 className="text-2xl font-medium text-center mb-2 tracking-tight">Update Security</h2>
          <p className="mono-label text-center mb-8 text-neutral">First Login Verification Required</p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Temporary Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-transparent border border-grid-line py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white transition-all placeholder:text-neutral/50"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent border border-grid-line py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white transition-all placeholder:text-neutral/50"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral group-focus-within:text-white transition-colors">
                <CheckCircle2 size={18} />
              </div>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
