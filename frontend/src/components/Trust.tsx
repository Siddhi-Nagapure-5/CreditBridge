import { motion } from 'framer-motion';
import { ShieldCheck, Landmark, Lock, Cpu } from 'lucide-react';

const TrustCard = ({ icon: Icon, title, points }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="p-12 border-b border-grid-line md:border-b-0 md:border-r last:border-r-0 group hover:bg-white/[0.02] transition-colors"
  >
    <div className="flex flex-col gap-6">
      <span className="mono-label !text-white/40">Trust // {title.split(' ')[0]}</span>
      <div className="w-8 h-8 flex items-center justify-center border border-white/20 group-hover:border-white transition-colors">
        <Icon className="text-white w-4 h-4" />
      </div>
      <h3 className="text-2xl font-medium tracking-tighter">{title}</h3>
      <ul className="space-y-4">
        {points.map((point: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-xs text-warm font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 bg-white mt-1.5 flex-shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const Trust = () => {
  return (
    <section id="trust" className="border-b border-grid-line bg-pure-black relative overflow-hidden">
      {/* Decorative Technical Grid */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-20">
        <div className="border-r border-grid-line" />
        <div className="border-r border-grid-line" />
        <div className="border-r border-grid-line" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="p-12 lg:p-24 border-b border-grid-line">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-right"
          >
            <span className="mono-label mb-6 block">Regulatory // 03</span>
            <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight">
              Institutional Grade. <br />
              <span className="text-neutral italic">Universal Trust.</span>
            </h2>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3">
          <TrustCard
            icon={Lock}
            title="Data Security"
            points={[
              "AES-256 encryption protocols for all non-volatile memory.",
              "Strict zero-knowledge architecture regarding financial identity.",
              "Automated data purging modules compliant with DPDP Act 2023."
            ]}
          />
          <TrustCard
            icon={Landmark}
            title="RBI Framework"
            points={[
              "End-to-end integration with the RBI Account Aggregator network.",
              "Granular consent management layers for every data byte.",
              "Fully audited compliance with Indian financial regulations."
            ]}
          />
          <TrustCard
            icon={Cpu}
            title="Privacy Engine"
            points={[
              "Decentralized processing of anonymized spending patterns.",
              "No raw financial statement persistence on edge servers.",
              "Self-sovereign cryptographic financial identity."
            ]}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-12 lg:p-24 flex flex-col md:flex-row items-center justify-between gap-12 bg-white/[0.01]"
        >
          <div className="flex items-center gap-8">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div className="max-w-xl">
              <h4 className="text-lg font-medium mb-2 tracking-tight">Zero-Visibility Infrastructure</h4>
              <p className="text-xs text-neutral font-mono leading-relaxed italic">
                Our orchestration layer is designed so that even our engineering leads cannot view raw data streams.
                We operate on insight, not on records.
              </p>
            </div>
          </div>
          <button className="btn-outline !text-[10px] !tracking-[0.3em]">
            Request Security Audit
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Trust;

