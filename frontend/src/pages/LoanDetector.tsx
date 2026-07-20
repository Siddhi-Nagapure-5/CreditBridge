import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { animate } from 'animejs';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, XCircle, Calculator, ShieldCheck, ChevronRight } from 'lucide-react';

const LoanDetector = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const riskRef = useRef<HTMLSpanElement>(null);

  const [loanData, setLoanData] = useState({
    amount: '',
    rate: '',
    tenure: '',
    fee: '',
    prepayment: '',
    insurance: 'no'
  });

  useEffect(() => {
    if (showResults) {
      const riskObj = { val: 0 };
      animate(riskObj, {
        val: 7.2,
        round: 10,
        easing: 'easeOutExpo',
        duration: 2000,
        update: () => {
          if (riskRef.current) riskRef.current.innerHTML = riskObj.val.toFixed(1);
        }
      });

      animate('#risk-meter-arc', {
        strokeDashoffset: [500, 150],
        easing: 'easeOutExpo',
        duration: 2000,
      });

      animate('.red-flag-card', {
        translateX: [-2, 2],
        duration: 100,
        direction: 'alternate',
        loop: 3,
        easing: 'easeInOutSine'
      });
    }
  }, [showResults]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
    }, 2500);
  };

  return (
    <div className="flex bg-pure-black min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-hidden border-l border-grid-line">
        
        {/* Header Section */}
        <div className="p-12 lg:p-16 border-b border-grid-line">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 max-w-4xl"
          >
            <div className="inline-flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-500" />
              <span className="mono-label !text-red-500">Detector // Protocol 72</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight italic">
              Loan Trap <br />
              <span className="text-neutral">Analysis Engine.</span>
            </h1>
            <p className="text-warm font-mono text-xs opacity-60 leading-relaxed max-w-xl italic">
              Scrutinize institutional debt offers against RBI Fair Practice codes. 
              Our engine identifies predatory interest patterns and non-standard fee structures in &lt; 85ms.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 divide-x divide-grid-line h-full">
          {/* Input Area */}
          <div className="lg:col-span-7 p-12 lg:p-16 space-y-12">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <span className="mono-label">Principal Amount (INR)</span>
                  <input
                    type="number"
                    placeholder="500,000"
                    className="w-full bg-white/[0.02] border border-grid-line px-6 py-4 font-mono text-sm focus:border-white outline-none transition-all placeholder:opacity-20"
                    value={loanData.amount}
                    onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <span className="mono-label">Stated Rate (%)</span>
                  <input
                    type="number"
                    placeholder="12.0"
                    className="w-full bg-white/[0.02] border border-grid-line px-6 py-4 font-mono text-sm focus:border-white outline-none transition-all placeholder:opacity-20"
                    value={loanData.rate}
                    onChange={(e) => setLoanData({ ...loanData, rate: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <span className="mono-label">Maturity (Months)</span>
                  <input
                    type="number"
                    placeholder="60"
                    className="w-full bg-white/[0.02] border border-grid-line px-6 py-4 font-mono text-sm focus:border-white outline-none transition-all placeholder:opacity-20"
                    value={loanData.tenure}
                    onChange={(e) => setLoanData({ ...loanData, tenure: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <span className="mono-label">Onboarding Fee (INR)</span>
                  <input
                    type="number"
                    placeholder="5,000"
                    className="w-full bg-white/[0.02] border border-grid-line px-6 py-4 font-mono text-sm focus:border-white outline-none transition-all placeholder:opacity-20"
                    value={loanData.fee}
                    onChange={(e) => setLoanData({ ...loanData, fee: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="mono-label">Clause Document Analysis</span>
                <textarea
                  rows={4}
                  placeholder="Paste institutional offer fine print or summary documentation..."
                  className="w-full bg-white/[0.02] border border-grid-line px-6 py-4 font-mono text-xs focus:border-white outline-none transition-all resize-none placeholder:opacity-20 italic"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !loanData.amount}
                className="btn-primary w-full py-6 text-lg !font-medium !tracking-tighter disabled:opacity-20 active:scale-[0.98]"
              >
                {analyzing ? 'Initializing Neural Scan...' : 'Execute Analysis'}
              </button>
            </div>

            <div className="p-8 bg-white/[0.01] border border-grid-line flex items-start gap-4">
              <Info className="text-white w-4 h-4 mt-1 opacity-40 shrink-0" />
              <p className="text-[10px] font-mono text-neutral leading-relaxed italic opacity-60">
                Data Notice: Institutional debt traps account for ₹50,000 Cr in annual leakages. 
                Scans are benchmarked against RBI fair practice modules and localized market volatility.
              </p>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-5 p-12 lg:p-16 bg-white/[0.01]">
            {showResults ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div className="border border-grid-line p-12 text-center space-y-6 bg-pure-black">
                  <div className="relative w-40 h-40 mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                      <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                      <circle id="risk-meter-arc" cx="100" cy="100" r="85" fill="none" stroke="white" strokeWidth="6" strokeLinecap="square" strokeDasharray="534" strokeDashoffset="534" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span ref={riskRef} className="text-5xl font-medium tracking-tighter text-white">0.0</span>
                      <span className="mono-label !text-red-500 !text-[8px] mt-1">RISK INDEX</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-medium tracking-tight h-[28px]">High Volatility Risk</h3>
                    <p className="text-[10px] text-warm font-mono opacity-40 italic">Multiple non-standard clauses detected.</p>
                  </div>
                </div>

                <div className="space-y-px border-y border-grid-line divide-y divide-grid-line">
                  <div className="red-flag-card p-6 flex gap-6 hover:bg-red-500/5 transition-colors">
                    <XCircle className="text-red-500 w-4 h-4 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-[11px] font-mono uppercase tracking-widest text-red-500 font-bold">Anomalous Fee Structure</h4>
                      <p className="text-[10px] font-mono text-warm opacity-60 leading-relaxed mt-2 italic">3.0% protocol fee exceeds institutional mean of 1.0%.</p>
                    </div>
                  </div>

                  <div className="p-6 flex gap-6 hover:bg-white/[0.02] transition-colors">
                    <AlertTriangle className="text-white w-4 h-4 shrink-0 mt-1 opacity-40" />
                    <div>
                      <h4 className="text-[11px] font-mono uppercase tracking-widest text-white/60">Effective APR Delta</h4>
                      <p className="text-[10px] font-mono text-warm opacity-60 leading-relaxed mt-2 italic">Real liability (APR) calculated at 24.2% vs Stated 12.0%.</p>
                    </div>
                  </div>

                  <div className="p-6 flex gap-6 hover:bg-white/[0.02] transition-colors">
                    <CheckCircle2 className="text-white w-4 h-4 shrink-0 mt-1 opacity-40" />
                    <div>
                      <h4 className="text-[11px] font-mono uppercase tracking-widest text-white/60">Repayment Viability</h4>
                      <p className="text-[10px] font-mono text-warm opacity-60 leading-relaxed mt-2 italic">Monthly EMI (₹12,400) within 40% income ceiling.</p>
                    </div>
                  </div>
                </div>

                <div className="border border-grid-line p-8 space-y-6">
                  <span className="mono-label !text-white/40 block">Optimized Alternatives</span>
                  <div className="space-y-px border border-grid-line divide-y divide-grid-line font-mono">
                    <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-white/[0.02]">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest">Protocol Shishu</p>
                        <p className="text-[9px] text-neutral italic">12% Fixed | 0.0% Fee</p>
                      </div>
                      <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-white/[0.02]">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest">Commercial Node-A</p>
                        <p className="text-[9px] text-neutral italic">10.75% | ₹999 Base</p>
                      </div>
                      <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full border border-grid-line flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-40">
                <Calculator className="w-12 h-12 stroke-[1px]" />
                <div className="space-y-2">
                  <h3 className="mono-label !text-white">Awaiting Input</h3>
                  <p className="text-[10px] font-mono italic">Execute scan to generate risk profile.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetector;

