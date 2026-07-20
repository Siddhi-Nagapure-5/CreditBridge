import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dynamic border transition on scroll
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-pure-black">
      <motion.div 
        style={{ borderBottomColor: `rgba(255, 255, 255, ${borderOpacity})` }}
        className="max-w-7xl mx-auto h-20 flex items-center justify-between px-12 lg:px-24 border-b border-transparent transition-colors"
      >
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-6 h-6 border border-white flex items-center justify-center group-hover:bg-white transition-colors">
            <div className="w-2 h-2 bg-white group-hover:bg-black transition-colors" />
          </div>
          <span className="font-medium text-xl tracking-tighter uppercase whitespace-nowrap">
            Credit<span className="text-neutral">Bridge</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex items-center gap-8">
            {(!user || user?.role === 'USER') && (
              <a href="#how-it-works" className="mono-label !text-neutral hover:!text-white transition-all underline underline-offset-4 decoration-transparent hover:decoration-white">Process</a>
            )}
            {user?.role === 'USER' && (
              <Link to="/dashboard" className="mono-label !text-neutral hover:!text-white transition-all underline underline-offset-4 decoration-transparent hover:decoration-white">
                Dashboard
              </Link>
            )}
            {user?.role === 'SUPER_ADMIN' && (
              <Link to="/super/branches" className="mono-label !text-neutral hover:!text-white transition-all underline underline-offset-4 decoration-transparent hover:decoration-white">
                Branches
              </Link>
            )}
            {user?.role === 'BANK_ADMIN' && (
              <Link to="/admin/dashboard" className="mono-label !text-neutral hover:!text-white transition-all underline underline-offset-4 decoration-transparent hover:decoration-white">
                Operations
              </Link>
            )}
          </div>
          
          <div className="h-8 w-px bg-grid-line mx-4" />
          
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-neutral">
                {user.role !== 'USER' ? <Shield size={14} /> : <UserIcon size={14} />}
                <span className="mono-label !text-neutral !tracking-normal">{user.name}</span>
              </div>
              {user.role === 'SUPER_ADMIN' && (
                <Link to="/super/dashboard" className="text-gray-300 hover:text-white transition-colors">Console</Link>
              )}
              {user.role === 'USER' && (
                <Link to="/dna" className="text-gray-300 hover:text-white transition-colors">Financial DNA</Link>
              )}
              <button 
                onClick={handleLogout}
                className="text-neutral hover:text-white transition-colors p-2 border border-grid-line hover:border-white"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !text-[10px] !py-2 !px-6 !tracking-[0.2em] !uppercase">
              Access Portal
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2 border border-grid-line">
          <div className="w-5 h-5 flex flex-col justify-between items-center py-1">
            <span className={`w-full h-px bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-full h-px bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-px bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </motion.div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-pure-black border-b border-grid-line overflow-hidden"
          >
            <div className="p-12 flex flex-col gap-8">
              {user ? (
                <>
                  {user.role === 'USER' && (
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-2xl font-medium tracking-tighter">DASHBOARD</Link>
                  )}
                  {user.role === 'SUPER_ADMIN' && (
                    <Link to="/super/dashboard" onClick={() => setIsOpen(false)} className="text-2xl font-medium tracking-tighter">CONSOLE</Link>
                  )}
                  {user.role === 'BANK_ADMIN' && (
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-2xl font-medium tracking-tighter">OPERATIONS</Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-2xl font-medium tracking-tighter text-left">LOGOUT</button>
                </>
              ) : (
                <>
                  <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-2xl font-medium tracking-tighter">PROCESS</a>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary text-center uppercase tracking-widest text-xs">
                    Access Portal
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
