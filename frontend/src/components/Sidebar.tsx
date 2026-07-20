import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Landmark, 
  TrendingUp, 
  Fingerprint, 
  Calendar, 
  AlertTriangle, 
  User, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { id: 'score', label: 'Identity Score', icon: <Target size={18} />, path: '/dashboard' },
    { id: 'schemes', label: 'Scheme Modules', icon: <Landmark size={18} />, path: '/schemes' },
    { id: 'investments', label: 'Wealth Protocol', icon: <TrendingUp size={18} />, path: '/dashboard' },
    { id: 'dna', label: 'Sovereign DNA', icon: <Fingerprint size={18} />, path: '/dna' },
    { id: 'plan', label: '90-Day Logic', icon: <Calendar size={18} />, path: '/dashboard' },
    { id: 'loan', label: 'Risk Detector', icon: <AlertTriangle size={18} />, path: '/loan-detector' },
  ];

  return (
    <div className="w-64 h-screen bg-pure-black border-r border-grid-line fixed left-0 top-0 flex flex-col py-10 z-50 overflow-hidden">
      <Link to="/" className="flex items-center gap-4 px-8 mb-16 group">
        <div className="w-6 h-6 border border-white flex items-center justify-center group-hover:bg-white transition-colors">
          <div className="w-2 h-2 bg-white group-hover:bg-black transition-colors" />
        </div>
        <span className="font-medium text-xl tracking-tighter uppercase whitespace-nowrap">
          Credit<span className="text-neutral">Bridge</span>
        </span>
      </Link>

      <div className="flex-1 w-full px-4 space-y-1">
        <span className="mono-label !text-[8px] !text-white/20 px-4 mb-4 block tracking-[0.3em]">Access // Level 01</span>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`w-full flex items-center gap-4 px-4 py-3 border border-transparent transition-all ${
              location.pathname === item.path
              ? 'bg-white/5 border-grid-line text-white font-mono'
              : 'text-neutral hover:bg-white/[0.02] hover:text-white font-mono'
            }`}
          >
            <div className="opacity-40">{item.icon}</div>
            <span className="text-[10px] uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="w-full px-4 pt-8 border-t border-grid-line divide-y divide-grid-line/20">
        <button className="w-full flex items-center gap-4 px-4 py-4 text-neutral hover:text-white transition-all">
          <User size={18} className="opacity-40" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Protocol Stats</span>
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-4 text-neutral hover:text-white transition-all">
          <LogOut size={18} className="opacity-40" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

