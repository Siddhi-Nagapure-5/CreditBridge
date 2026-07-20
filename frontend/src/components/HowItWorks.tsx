import { motion } from 'framer-motion';
import { Upload, Cpu, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-5 h-5 text-white" />,
      title: "Module Initialization",
      desc: "Connect your financial identity via secure AA layer. No legacy credit history required."
    },
    {
      icon: <Cpu className="w-5 h-5 text-white" />,
      title: "Neural Analysis",
      desc: "Our engine processes spending velocity, consistency, and digital trust markers."
    },
    {
      icon: <Rocket className="w-5 h-5 text-white" />,
      title: "Deployment",
      desc: "Instant score generation, scheme matching, and 90-day growth roadmap deployment."
    }
  ];

  return (
    <section id="how-it-works" className="border-b border-grid-line bg-pure-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="p-12 lg:p-24 border-b border-grid-line">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="mono-label mb-6 block">Process // 05</span>
            <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight">
              From Invisible <br />
              <span className="text-neutral italic">to Investable.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="p-12 lg:p-16 border-b md:border-b-0 md:border-r last:border-r-0 border-grid-line group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                    {step.icon}
                  </div>
                  <span className="font-mono text-neutral text-xs opacity-40">STEP: 0{index + 1}</span>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight">{step.title}</h3>
                  <p className="text-warm text-sm leading-relaxed font-mono opacity-60 group-hover:opacity-100 transition-opacity italic">
                    {step.desc}
                  </p>
                </div>
                
                <div className="pt-4">
                   <div className="h-px w-8 bg-white/20 group-hover:w-full transition-all duration-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

