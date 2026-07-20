import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, role, quote, avatar, delay }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="p-12 border-b border-grid-line md:border-b-0 md:border-r last:border-r-0 group hover:bg-white/[0.02] transition-colors flex flex-col justify-between h-full"
  >
    <div className="space-y-6">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-white text-white" />)}
      </div>
      <p className="text-xl font-medium leading-relaxed tracking-tight">"{quote}"</p>
    </div>
    <div className="flex items-center gap-4 mt-12">
      <div className="w-10 h-10 border border-grid-line grayscale group-hover:grayscale-0 transition-all">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="text-sm font-medium">{name}</h4>
        <span className="mono-label !text-[8px]">{role}</span>
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ravi Kumar",
      role: "Logistics Hub, Jaipur",
      quote: "System identified a protocol match for Mudra Level 2 within 48 hours. Deployment was instantaneous.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi",
      delay: 0.1
    },
    {
      name: "Priya Sharma",
      role: "Strategic Creator",
      quote: "The Scheme Matcher modules accessed ₹500k in non-dilutive benefits. The roadmap interface is highly logical.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      delay: 0.2
    },
    {
      name: "Mohammed Rafiq",
      role: "Fleet Operations",
      quote: "Credit profile stabilization achieved in 90 days. Leveraged for institutional vehicle financing.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq",
      delay: 0.3
    }
  ];

  return (
    <section className="border-b border-grid-line bg-pure-black">
      <div className="max-w-7xl mx-auto">
        <div className="p-12 lg:p-24 border-b border-grid-line">
           <span className="mono-label mb-6 block">Proof // 04</span>
           <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight italic">
             Real Impact. <br />
             <span className="text-neutral">Real Bharat.</span>
           </h2>
        </div>
        <div className="grid md:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

