import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Tooltip, CartesianGrid } from 'recharts';

const SCORING_DATA = [
  { name: 'Income Stability', value: 30, color: '#FFFFFF' },
  { name: 'Payment Behavior', value: 25, color: '#A3A3A3' },
  { name: 'Digital Footprint', value: 25, color: '#525252' },
  { name: 'Social Capital', value: 20, color: '#262626' },
];

const ProductDemo = () => {
  return (
    <section className="border-b border-grid-line bg-pure-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto divide-y divide-grid-line">
        {/* Section 01: Scoring Intelligence */}
        <div className="grid lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-12 lg:p-24 space-y-8 border-b lg:border-b-0 lg:border-r border-grid-line"
          >
            <span className="mono-label">Analytic Layer // 01</span>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-tight">
              Beyond the <br/> <span className="text-neutral italic">Traditional Archive.</span>
            </h2>
            <p className="text-warm text-sm leading-relaxed font-mono opacity-60 max-w-md">
              Our neural engine processes 500+ non-custodial digital signals in &lt; 85ms. 
              Proprietary CB-Alpha models generate a sovereign score based on real-time velocity.
            </p>
            <div className="flex gap-16 pt-8">
              <div className="space-y-1">
                <span className="mono-label !text-white">0.8s</span>
                <p className="text-[10px] text-neutral uppercase tracking-widest font-mono">Process Latency</p>
              </div>
              <div className="space-y-1">
                <span className="mono-label !text-white">94%</span>
                <p className="text-[10px] text-neutral uppercase tracking-widest font-mono">Model Accuracy</p>
              </div>
            </div>
          </motion.div>

          <div className="p-12 lg:p-24 flex flex-col items-center justify-center relative min-h-[500px]">
            <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
            <div className="w-full h-full max-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SCORING_DATA}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {SCORING_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: '#09090b', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '0px',
                      fontSize: '10px',
                      fontFamily: 'JetBrains Mono',
                      padding: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-8 w-full max-w-sm">
              {SCORING_DATA.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5" style={{ backgroundColor: d.color }} />
                  <span className="mono-label !text-[8px]">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 02: Wealth Roadmaps */}
        <div className="grid lg:grid-cols-2">
          <div className="p-12 lg:p-24 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-grid-line min-h-[500px] order-2 lg:order-1">
             <div className="w-full h-full max-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { x: 0, y: 10 }, { x: 1, y: 25 }, { x: 2, y: 18 }, { x: 3, y: 45 }, { x: 4, y: 38 }, { x: 5, y: 80 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <Tooltip 
                       contentStyle={{ 
                        background: '#09090b', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '0px',
                        fontFamily: 'JetBrains Mono'
                      }}
                    />
                    <Line 
                      type="stepAfter" 
                      dataKey="y" 
                      stroke="#FFFFFF" 
                      strokeWidth={2} 
                      dot={{ r: 0 }} 
                      activeDot={{ r: 4, fill: '#FFFFFF', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-8">
                <span className="btn-outline !text-[9px] !px-4 !py-1">Projected Trajectory</span>
             </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-12 lg:p-24 space-y-8 order-1 lg:order-2"
          >
            <span className="mono-label">Analytic Layer // 02</span>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-tight">
              Wealth Roadmap. <br/> <span className="text-neutral italic">Not just Liquidity.</span>
            </h2>
            <p className="text-warm text-sm leading-relaxed font-mono opacity-60 max-w-md">
              We operate beyond simple debt clearance. Our SEBI-compliant roadmap modules utilize 
              compounding signals to target ₹1 Crore benchmarks within institutional time horizons.
            </p>
            <button className="btn-primary flex items-center gap-3">
              Initialize Navigator <span>→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemo;

