import { motion } from 'framer-motion';
import { Shield, TrendingUp, Calendar, AlertTriangle, Fingerprint, Target } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="p-12 border-b border-grid-line lg:even:border-x group hover:bg-white/[0.02] transition-colors"
  >
    <div className="flex flex-col gap-6">
      <span className="mono-label !text-white/40">Feature // {title.split(' ')[0]}</span>
      <div className="w-8 h-8 flex items-center justify-center border border-white/20 group-hover:border-white transition-colors">
        <Icon className="text-white w-4 h-4" />
      </div>
      <h3 className="text-2xl font-medium tracking-tighter">{title}</h3>
      <p className="text-warm text-sm leading-relaxed font-mono opacity-60 group-hover:opacity-100 transition-opacity">{desc}</p>
    </div>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: Fingerprint,
      title: "Digital DNA Scoring",
      desc: "Algorithmic transformation of UPI and behavioral data into sovereign credit profiles.",
      delay: 0.1
    },
    {
      icon: Target,
      title: "Scheme Optimization",
      desc: "Real-time matching with institutional and government benefits based on dynamic data.",
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: "Wealth Navigation",
      desc: "SEBI-aligned intelligence layers for automated investment roadmap generation.",
      delay: 0.3
    },
    {
      icon: Calendar,
      title: "Phased Roadmap",
      desc: "Predictive 90-day execution plans for rapid credit score stabilization.",
      delay: 0.4
    },
    {
      icon: AlertTriangle,
      title: "Risk Modulation",
      desc: "Advanced threat detection to prevent exposure to predatory lending protocols.",
      delay: 0.5
    },
    {
      icon: Shield,
      title: "Vault Architecture",
      desc: "Bank-grade e2e encryption ensuring full data sovereignty and privacy.",
      delay: 0.6
    }
  ];

  return (
    <section id="features" className="border-b border-grid-line bg-pure-black relative overflow-hidden">
      {/* Decorative Technical Grid */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-20">
        <div className="border-r border-grid-line" />
        <div className="border-r border-grid-line" />
        <div className="border-r border-grid-line" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="p-12 lg:p-24 border-b border-grid-line">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="mono-label mb-6 block">Capabilities // 02</span>
            <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight">
              Intelligence for <br />
              <span className="text-neutral italic">the Next Billion.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>

        <div className="p-12 lg:p-24 flex flex-col md:flex-row justify-between items-center gap-12">
           <p className="text-sm font-mono text-neutral max-w-md italic">
             Our models are non-custodial and operate exclusively on consented digital footprints.
           </p>
           <button className="btn-outline">View Technical Docs</button>
        </div>
      </div>
    </section>
  );
};

export default Features;

