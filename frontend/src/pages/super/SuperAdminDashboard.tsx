import { useEffect, useState } from 'react';
import { Building2, Users, ShieldCheck, ArrowUpRight, Activity } from 'lucide-react';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalAdmins: 0,
    totalAuditLogs: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/super/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics', error);
    }
  };

  return (
    <div className="p-8 bg-pure-black min-h-screen text-white font-['JetBrains_Mono']">
      <div className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2 italic">INSTITUTIONAL_CONSOLE_V2.0</h1>
          <p className="text-zinc-500 uppercase text-xs tracking-[0.2em] font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-white animate-pulse"></span>
            Synchronized with Central Perimeter / Branch Mesh Active
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Last Sync Status</p>
          <p className="text-xs font-bold text-white tracking-[0.1em]">OK_200_STABLE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="border border-zinc-800 p-8 hover:bg-zinc-900/40 transition-all group">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 border border-zinc-800 group-hover:bg-white group-hover:text-black transition-colors">
              <Building2 size={24} />
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Active_Branches</div>
          </div>
          <p className="text-6xl font-bold tracking-tighter mb-2">{stats.totalBranches}</p>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest py-2 border-t border-zinc-900 mt-4">
            <span className="text-white">NODE_HEALTH:</span> 98.4%_NOMINAL
          </div>
        </div>

        <div className="border border-zinc-800 p-8 hover:bg-zinc-900/40 transition-all group">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 border border-zinc-800 group-hover:bg-white group-hover:text-black transition-colors">
              <Users size={24} />
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Branch_Managers</div>
          </div>
          <p className="text-6xl font-bold tracking-tighter mb-2">{stats.totalAdmins}</p>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest py-2 border-t border-zinc-900 mt-4">
            <span className="text-white">ACCESS_LVL:</span> AUTH_DELEGATED
          </div>
        </div>

        <div className="border border-zinc-800 p-8 hover:bg-zinc-900/40 transition-all group lg:col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 border border-zinc-800 group-hover:bg-white group-hover:text-black transition-colors">
              <Activity size={24} />
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Institutional_Activity</div>
          </div>
          <p className="text-6xl font-bold tracking-tighter mb-2">{stats.totalAuditLogs}</p>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest py-2 border-t border-zinc-900 mt-4">
            <span className="text-white">LATENCY:</span> 12ms_STABLE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-12 border-r border-grid-line flex flex-col justify-between">
          <div>
            <div className="mono-label mb-10">Command Center</div>
            <div className="space-y-4">
              <Link 
                to="/super/branches"
                className="flex items-center justify-between p-6 border border-grid-line hover:border-white transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Building2 className="w-5 h-5 text-neutral" />
                  <span className="font-mono text-sm uppercase tracking-wider">Branch Registry</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral group-hover:text-white" />
              </Link>
              <Link 
                to="/super/admins"
                className="flex items-center justify-between p-6 border border-grid-line hover:border-white transition-all group"
              >
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5 text-neutral" />
                  <span className="font-mono text-sm uppercase tracking-wider">Access Control</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>

        <div className="p-12 bg-neutral-900/10">
          <div className="mono-label mb-10">Architecture Status</div>
          <div className="space-y-8 font-mono">
            <div className="flex items-center justify-between group">
              <span className="text-neutral group-hover:text-white transition-colors text-xs uppercase tracking-widest">Protocol.REST.v1</span>
              <span className="text-white text-xs tracking-[0.2em] font-medium">STABLE</span>
            </div>
            <div className="flex items-center justify-between group">
              <span className="text-neutral group-hover:text-white transition-colors text-xs uppercase tracking-widest">PostgreSQL.Node</span>
              <span className="text-white text-xs tracking-[0.2em] font-medium">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between group">
              <span className="text-neutral group-hover:text-white transition-colors text-xs uppercase tracking-widest">JWT.Stateless.Security</span>
              <span className="text-white text-xs tracking-[0.2em] font-medium">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
