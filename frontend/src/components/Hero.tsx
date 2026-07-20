import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const Hero = () => {
  const scoreRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const scoreObj = { value: 0 };
    animate(scoreObj, {
      value: 742,
      round: 1,
      easing: 'easeOutExpo',
      duration: 3000,
      delay: 500,
      update: () => {
        if (scoreRef.current) {
          scoreRef.current.innerHTML = scoreObj.value.toString();
        }
      }
    });

    animate('#score-arc-main', {
      strokeDashoffset: [502, 120],
      easing: 'easeOutExpo',
      duration: 3000,
      delay: 500,
    });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col border-b border-grid-line overflow-hidden bg-pure-black">
      {/* Grid Architecture */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="flex-1 border-r border-grid-line" />
        <div className="flex-1 border-r border-grid-line" />
        <div className="flex-1 border-r border-grid-line" />
        <div className="flex-1" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Column: Vision & Identity */}
        <div className="flex-1 flex flex-col justify-center p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-grid-line">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-1"
          >
            <span className="mono-label">Protocol 01 / Identity</span>
            <h1 className="text-7xl md:text-8xl font-medium tracking-tighter leading-[0.9]">
              Credit Invisible <br />
              <span className="text-neutral italic font-light">No More.</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-12 max-w-md"
          >
            <p className="text-sm text-warm leading-relaxed font-mono">
              Leveraging digital intelligence to bridge the gap for Bharat’s credit-invisible millions. 
              Institutional grade scoring, built for the next billion.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="btn-primary">Initialize Access</button>
              <button className="btn-outline">Read Paper</button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Technical Engine */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 lg:p-24 relative overflow-hidden">
          {/* Moving technical lines background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             {[...Array(20)].map((_, i) => (
               <div 
                 key={i} 
                 className="h-px w-full bg-grid-line my-8" 
                 style={{ transform: `translateY(${i * 10}px)` }}
               />
             ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="w-80 h-80 border border-grid-line rounded-full flex items-center justify-center relative">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90 absolute inset-0">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <motion.circle
                  id="score-arc-main"
                  cx="100" cy="100" r="90"
                  fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="square"
                  strokeDasharray="565" strokeDashoffset="565"
                />
              </svg>
              <div className="text-center z-10">
                <span ref={scoreRef} className="text-8xl font-medium tracking-tighter">0</span>
                <div className="flex flex-col mt-2">
                  <span className="mono-label !text-white/40">Real-time Score</span>
                  <span className="text-[8px] font-mono text-neutral mt-1">ENGINE: CB-ALPHA v4.2</span>
                </div>
              </div>

              {/* Decorative technical markers */}
              <div className="absolute -top-1 left-1.2 w-2 h-2 bg-white" />
              <div className="absolute -bottom-1 right-1/2 w-2 h-2 border border-white" />
            </div>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 gap-8 w-full max-w-xs">
            <div className="space-y-1">
              <span className="mono-label">Accuracy</span>
              <p className="text-xl font-medium">99.8%</p>
            </div>
            <div className="space-y-1">
              <span className="mono-label">Latency</span>
              <p className="text-xl font-medium">&lt; 85ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="h-16 flex items-center px-12 lg:px-24 border-t border-grid-line text-[10px] uppercase tracking-widest text-neutral font-mono">
        <span className="mr-8">System Status: Active</span>
        <span className="mr-8 border-l border-grid-line pl-8 uppercase">RBI AA Framework 2.0</span>
        <span className="ml-auto">Secure Environment // SHA-256</span>
      </div>
    </section>
  );
};

export default Hero;

