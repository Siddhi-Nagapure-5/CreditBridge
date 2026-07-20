import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Trust from '../components/Trust';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ProductDemo from '../components/ProductDemo';

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Scrollytelling reveals for the technical narrative section
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.3], [0, 1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.3], [100, 0, 0, -100]);

  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [100, 0, 0, -100]);

  const text3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 0.95, 1], [0, 1, 1, 1]);
  const text3Y = useTransform(scrollYProgress, [0.7, 0.8, 0.95, 1], [100, 0, 0, 0]);

  // Grid scanning line animation
  const scannerY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="bg-pure-black overflow-x-hidden">
      <Hero />
      
      {/* Immersive Technical Narrative Section (Refactored for Usability) */}
      <div className="relative border-b border-grid-line bg-pure-black z-20">
        <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
          <div className="border-r border-grid-line/50" />
          <div className="border-r border-grid-line/50" />
          <div className="border-r border-grid-line/50" />
          <div className="border-r border-grid-line/50" />
        </div>
        
        <div className="relative z-50 w-full max-w-7xl mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-3 gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col text-left"
          >
            <span className="mono-label mb-4 block">Section 01 // Input</span>
            <h2 className="text-4xl md:text-5xl font-medium mb-4 tracking-tighter">Your data is yours.</h2>
            <p className="text-neutral text-sm font-mono italic">
              Every transaction, every pattern, fully encrypted and owned by the creator.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col text-left mt-0 md:mt-32"
          >
            <span className="mono-label mb-4 block">Section 02 // Logic</span>
            <h2 className="text-4xl md:text-5xl font-medium mb-4 tracking-tighter">Bharat, Decoded.</h2>
            <p className="text-neutral text-sm font-mono italic">
              Advanced models trained specifically on Indian digital spend patterns.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col text-left mt-0 md:mt-64"
          >
            <span className="mono-label mb-4 block">Section 03 // Output</span>
            <h2 className="text-4xl md:text-5xl font-medium mb-4 tracking-tighter">Infinite Access.</h2>
            <p className="text-neutral text-sm font-mono italic">
              One identity. Unlimited potential for growth and credit.
            </p>
          </motion.div>
        </div>
      </div>

      <Stats />
      <ProductDemo />
      <Features />
      <Trust />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;

