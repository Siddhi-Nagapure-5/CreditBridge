import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Activity, Users, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import ApplicantScorer from '../../components/ApplicantScorer';
import LoanApplications from '../../components/LoanApplications';

const AdminDashboard = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll('.dash-card'),
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.8, 
          ease: 'power3.out',
          delay: 0.2
        }
      );
    }
  }, [location.pathname]); // Re-run animation when tab changes


  return (
    <div className="flex bg-pure-black min-h-screen">
      <AdminSidebar />
      <div ref={contentRef} className="flex-1 ml-64 p-10 space-y-8">
        
        {location.pathname === '/admin/dashboard' && (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-medium tracking-tight mb-2">Branch Operations</h1>
                <p className="text-neutral text-sm">Alternative Credit Generation & "Credit Invisible" Assessment</p>
              </div>
              <div className="px-4 py-2 bg-electric/10 border border-electric/20 rounded-none">
                <span className="text-xs font-bold text-electric tracking-widest uppercase">Live Branch View</span>
              </div>
            </div>

            {/* TOP ROW: Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="dash-card card-premium p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-neutral text-xs font-medium uppercase tracking-wider">Total Branch Users</p>
                  <Users className="text-blue-400 w-5 h-5" />
                </div>
                <h2 className="text-3xl font-bold">1,204</h2>
                <p className="text-[10px] text-emerald mt-2">↑ 12% vs last month</p>
              </div>

              <div className="dash-card card-premium p-6 border-emerald/30">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-neutral text-xs font-medium uppercase tracking-wider">Credit Invisibles Scored</p>
                  <Cpu className="text-emerald w-5 h-5" />
                </div>
                <h2 className="text-3xl font-bold text-emerald">845</h2>
                <p className="text-[10px] text-neutral mt-2">Successfully generated alt-scores</p>
              </div>

              <div className="dash-card card-premium p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-neutral text-xs font-medium uppercase tracking-wider">Active Micro-Loans</p>
                  <Activity className="text-warm w-5 h-5" />
                </div>
                <h2 className="text-3xl font-bold">312</h2>
                <p className="text-[10px] text-emerald mt-2">Zero NPA in last 90 days</p>
              </div>

              <div className="dash-card card-premium p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-neutral text-xs font-medium uppercase tracking-wider">Risk Alerts</p>
                  <ShieldAlert className="text-red-400 w-5 h-5" />
                </div>
                <h2 className="text-3xl font-bold text-red-400">3</h2>
                <p className="text-[10px] text-neutral mt-2">Requires manual review</p>
              </div>
            </div>
          </>
        )}

        {/* CONDITIONAL ROUTES FOR TABS */}
        {location.pathname === '/admin/scoring' && <ApplicantScorer />}
        {location.pathname === '/admin/applications' && <LoanApplications />}

      </div>
    </div>
  );
};

export default AdminDashboard;
