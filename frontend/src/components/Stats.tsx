import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { motion } from 'framer-motion';

const StatItem = ({ label, value, prefix = '', suffix = '', delay }: any) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = { val: 0 };
    animate(obj, {
      val: value,
      round: 1,
      easing: 'easeOutExpo',
      duration: 3000,
      delay: delay * 1000 + 500,
      update: () => {
        if (elRef.current) {
          elRef.current.innerHTML = prefix + obj.val + suffix;
        }
      }
    });
  }, [value, prefix, suffix, delay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="p-12 border-b border-grid-line md:border-b-0 md:border-r last:border-r-0 flex flex-col items-center justify-center space-y-4"
    >
      <div ref={elRef} className="text-5xl md:text-7xl font-medium tracking-tighter text-white">0</div>
      <span className="mono-label !text-white/40">{label}</span>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <section className="border-b border-grid-line bg-pure-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4">
        <StatItem label="Invisible Indians" value={750} suffix="M+" delay={0.1} />
        <StatItem label="Onboarding Cost" value={0} prefix="₹" delay={0.2} />
        <StatItem label="Scoring Speed" value={2} suffix=" Min" delay={0.3} />
        <StatItem label="Govt. Schemes" value={50} suffix="+" delay={0.4} />
      </div>
    </section>
  );
};

export default Stats;

