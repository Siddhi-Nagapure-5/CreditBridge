import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import gsap from 'gsap';
import { Search, Landmark, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';

const SchemeMatcher = () => {
  const [filter, setFilter] = useState('All');
  const cardsRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Healthcare', 'Housing', 'Business & Credit', 'Agriculture', 'Pension & Insurance', 'Education'];

  const schemes = [
    { id: 1, name: 'Ayushman Bharat PMJAY', ministry: 'Ministry of Health', benefit: '₹5 Lakh per year', category: 'Healthcare', match: '98%', reasons: ['Income < ₹2.5L', 'Informal sector worker', 'No health insurance'] },
    { id: 2, name: 'PM Awas Yojana', ministry: 'Ministry of Housing', benefit: '₹2.67 Lakh Subsidy', category: 'Housing', match: '92%', reasons: ['First-time home buyer', 'EWS category income'] },
    { id: 3, name: 'Mudra Yojana (Shishu)', ministry: 'Ministry of Finance', benefit: '₹50,000 Micro-loan', category: 'Business & Credit', match: '95%', reasons: ['Small business owner', 'No collateral required'] },
    { id: 4, name: 'Atal Pension Yojana', ministry: 'Ministry of Finance', benefit: '₹5,000 / month Pension', category: 'Pension & Insurance', match: '88%', reasons: ['Age within 18-40', 'Unorganized sector'] },
    { id: 5, name: 'PM Kisan Samman Nidhi', ministry: 'Ministry of Agriculture', benefit: '₹6,000 / year', category: 'Agriculture', match: '96%', reasons: ['Verified land holding', 'Direct Benefit Transfer'] },
    { id: 6, name: 'Sukanya Samriddhi Yojana', ministry: 'Ministry of Finance', benefit: 'High Interest Savings', category: 'Education', match: '90%', reasons: ['Girl child below 10 years'] },
    { id: 7, name: 'PM SVANidhi', ministry: 'Ministry of Housing', benefit: '₹10k - ₹50k Loan', category: 'Business & Credit', match: '99%', reasons: ['Registered street vendor', 'Interest subsidy eligible'] },
  ];

  const filteredSchemes = filter === 'All' ? schemes : schemes.filter(s => s.category === filter);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        '.scheme-item-card',
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [filter]);

  return (
    <div className="flex bg-navy-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-10 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Government Scheme Matcher</h1>
          <p className="text-neutral">Based on your Financial DNA, you qualify for 7 schemes worth up to ₹12.5 Lakh in benefits.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral" size={18} />
            <input 
              type="text" 
              placeholder="Search schemes, benefits or ministries..." 
              className="w-full bg-navy-800 border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:border-electric outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filter === c 
                  ? 'bg-emerald text-navy-900' 
                  : 'bg-navy-800 text-neutral border border-white/5 hover:border-emerald/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6">
          {filteredSchemes.map((s) => (
            <div key={s.id} className="scheme-item-card card-premium p-8 relative overflow-hidden group">
              {parseInt(s.match) > 95 && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-emerald text-navy-900 text-[10px] font-bold rounded-bl-xl">
                  BEST MATCH
                </div>
              )}
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold group-hover:text-emerald transition-colors">{s.name}</h3>
                    <p className="text-xs text-neutral font-medium">{s.ministry}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-center">
                    <Landmark size={20} className="text-electric" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald">{s.benefit}</span>
                  <span className="text-[10px] text-neutral/60 font-bold uppercase tracking-widest">Total Benefit</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral">
                    <span>Why you qualify</span>
                    <span className="text-emerald">{s.match} Match</span>
                  </div>
                  <div className="space-y-2">
                    {s.reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-warm/80">
                        <CheckCircle2 size={12} className="text-emerald" /> {r}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 py-3 bg-electric text-white text-xs font-bold rounded-xl hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
                    How to Apply <ChevronRight size={14} className="inline ml-1" />
                  </button>
                  <button className="px-4 py-3 bg-navy-900 border border-white/10 rounded-xl text-neutral hover:text-warm transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SchemeMatcher;
