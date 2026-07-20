import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="border-b border-grid-line bg-pure-black relative overflow-hidden">
      {/* Structural Wireframe background */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-20">
        <div className="border-r border-grid-line" />
        <div className="border-r border-grid-line" />
        <div className="border-r border-grid-line" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="p-12 lg:p-24 flex flex-col items-center text-center"
        >
          <div className="w-full max-w-4xl space-y-12">
            <div className="space-y-4">
              <span className="mono-label">Protocol 99 // Finalize</span>
              <h2 className="text-6xl md:text-9xl font-medium tracking-tighter leading-none italic">
                Initialize <br />
                <span className="text-neutral">your future.</span>
              </h2>
            </div>
            
            <p className="text-warm text-sm md:text-lg font-mono leading-relaxed opacity-60 max-w-xl mx-auto italic">
              Join the institutional-grade credit layer for Bharat. 
              The system is open for initialization. Latency &lt; 85ms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="btn-primary !px-16 !py-6 !text-lg !tracking-tighter">
                Deploy Account
              </button>
              <button className="btn-outline !px-16 !py-6 !text-lg !tracking-tighter">
                View Protocol
              </button>
            </div>
            
            <div className="pt-16">
               <span className="text-[10px] font-mono text-neutral uppercase tracking-[0.3em]">
                 Status: Operational // 51,024 Node initializations
               </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

