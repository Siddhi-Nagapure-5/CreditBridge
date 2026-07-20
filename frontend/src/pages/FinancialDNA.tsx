import { useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { animate } from 'animejs';
import { Fingerprint, TrendingUp, Wallet, Shield, Share2, Download, Zap, Target } from 'lucide-react';

const FinancialDNA = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animating trait bars - v4: animate(target, config)
    animate('.dna-bar-fill', {
      width: (_el: any) => _el.getAttribute('data-width') + '%',
      easing: 'easeOutExpo',
      duration: 1500,
      delay: (i: number) => 500 + (i * 200)
    });

    // Floating animation for DNA icon
    animate('.dna-hero-icon', {
      translateY: [-10, 10],
      duration: 3000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad'
    });
  }, []);

  const traits = [
    { label: 'Risk Appetite', value: 40, color: '#EF4444', desc: 'Cautious' },
    { label: 'Savings Discipline', value: 82, color: '#10B981', desc: 'High' },
    { label: 'Spending Control', value: 65, color: '#2563EB', desc: 'Moderate' },
    { label: 'Investment Mindset', value: 35, color: '#F59E0B', desc: 'Developing' },
  ];

  const projectionData = [
    { age: 30, current: 0, withPlan: 0 },
    { age: 35, current: 50000, withPlan: 120000 },
    { age: 40, current: 120000, withPlan: 450000 },
    { age: 45, current: 210000, withPlan: 980000 },
    { age: 50, current: 320000, withPlan: 2240000 },
    { age: 55, current: 450000, withPlan: 4800000 },
    { age: 60, current: 600000, withPlan: 8500000 },
  ];

  return (
    <div className="flex bg-navy-900 min-h-screen">
      <Sidebar />
      <div ref={contentRef} className="flex-1 ml-64 p-10 space-y-12">
        
        {/* Hero Section: Personality Type */}
        <div className="card-premium p-10 relative overflow-hidden flex flex-col items-center text-center space-y-6">
          <div className="absolute top-0 right-0 p-8 opacity-5 dna-hero-icon">
            <Fingerprint size={200} />
          </div>
          
          <div className="w-24 h-24 bg-electric/10 rounded-full flex items-center justify-center border border-electric/20 relative z-10">
            <Shield className="text-electric w-12 h-12" />
          </div>
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-sm font-bold text-electric uppercase tracking-widest">Your Financial Personality</h2>
            <h1 className="text-5xl font-bold">THE GUARDIAN 🛡️</h1>
            <p className="text-neutral max-w-2xl mx-auto text-lg leading-relaxed">
              You prioritize stability over risky growth. You're consistent, cautious, and highly reliable with money. 
              Small tweaks in your savings strategy could unlock massive results over the next 20 years.
            </p>
          </div>

          <div className="flex gap-4 relative z-10 pt-4">
            <button className="btn-primary flex items-center gap-2">
              <Download size={18} /> Download Full Report
            </button>
            <button className="btn-outline flex items-center gap-2">
              <Share2 size={18} /> Share Result
            </button>
          </div>
        </div>

        {/* DNA Traits Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Traits */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">DNA Traits</h3>
            <div className="space-y-6">
              {traits.map((trait) => (
                <div key={trait.label} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-warm">{trait.label}</span>
                    <span className="text-xs font-bold text-neutral" style={{ color: trait.color }}>{trait.desc} ({trait.value}%)</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="dna-bar-fill h-full rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                      style={{ backgroundColor: trait.color, width: '0%' }}
                      data-width={trait.value}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="card-premium p-6 bg-electric/5 border-electric/10 space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="text-electric w-5 h-5" />
                <h4 className="font-bold">Optimization Tip</h4>
              </div>
              <p className="text-xs text-neutral leading-relaxed">
                As a 'Guardian', your savings discipline is superior. By moving just 15% of your stagnant bank surplus to a low-cost index fund, you can achieve your 'Investable' status 6 years earlier.
              </p>
            </div>
          </div>

          {/* Right: Insights */}
          <div className="grid grid-cols-1 gap-6">
            <div className="card-premium p-6 flex gap-6 items-start">
              <div className="w-12 h-12 bg-red-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wallet className="text-red-400 w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-red-100">Biggest Money Leak</h4>
                <p className="text-sm text-neutral">You spend ₹3,200/month on food delivery. Reducing by 50% saves ₹19,200/year.</p>
              </div>
            </div>

            <div className="card-premium p-6 flex gap-6 items-start">
              <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-emerald w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-emerald">One Habit Change</h4>
                <p className="text-sm text-neutral">Starting a ₹1,000/month SIP today results in ₹8.7 Lakh in 20 years at 12% returns.</p>
              </div>
            </div>

            <div className="card-premium p-6 flex gap-6 items-start">
              <div className="w-12 h-12 bg-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="text-electric w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-electric">Score Potential</h4>
                <p className="text-sm text-neutral">Your gap to a 'Perfect' 850 score is 108 points. This is achievable in 12 months with your current roadmap.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wealth Projection Chart */}
        <div className="card-premium p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">Wealth Projection</h3>
              <p className="text-sm text-neutral">Projected growth till age 60: With vs Without CreditBridge Plan</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald" />
                <span className="text-xs text-neutral">With Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-navy-700" />
                <span className="text-xs text-neutral">Current Path</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorWithPlan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis dataKey="age" stroke="#64748B" fontSize={12} label={{ value: 'Age', position: 'insideBottomRight', offset: -10 }} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  formatter={(value: any) => [`₹${(value / 100000).toFixed(1)}L`, '']}
                />
                <Area type="monotone" dataKey="withPlan" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorWithPlan)" />
                <Area type="monotone" dataKey="current" stroke="#1E293B" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinancialDNA;
