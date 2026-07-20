import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-grid-line bg-pure-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto divide-y divide-grid-line">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 border-grid-line">
          {/* Brand Column */}
          <div className="lg:col-span-2 p-12 lg:p-16 border-b md:border-b-0 md:border-r border-grid-line flex flex-col justify-between">
            <div className="space-y-8">
              <Link to="/" className="flex items-center gap-4">
                <div className="w-6 h-6 border border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white" />
                </div>
                <span className="font-medium text-xl tracking-tighter uppercase whitespace-nowrap">
                  Credit<span className="text-neutral">Bridge</span>
                </span>
              </Link>
              <p className="text-xs font-mono text-warm leading-relaxed max-w-xs opacity-60">
                Institutional-grade credit layer for Bharat. 
                Leveraging non-custodial digital signals to bridge the financial divide.
              </p>
            </div>
            
            <div className="pt-12 flex gap-6">
              {[
                { name: 'X', path: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.78 1.89 3.55-.7 0-1.35-.2-1.94-.53v.05c0 2.06 1.47 3.78 3.42 4.17-.36.1-.73.15-1.11.15-.27 0-.54-.03-.8-.08.54 1.69 2.11 2.92 3.97 2.96-1.46 1.14-3.3 1.82-5.3 1.82-.34 0-.68-.02-1.02-.06 1.89 1.21 4.13 1.92 6.54 1.92 7.84 0 12.13-6.5 12.13-12.13 0-.18 0-.37-.01-.55.83-.61 1.56-1.37 2.13-2.23z" },
                { name: 'IN', path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" },
                { name: 'GH', path: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" }
              ].map((icon, i) => (
                <a key={i} href="#" className="mono-label !text-neutral hover:!text-white transition-all underline underline-offset-4 decoration-grid-line hover:decoration-white">
                  {icon.name}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="p-12 border-b md:border-b-0 md:border-r border-grid-line">
            <span className="mono-label !text-white/40 mb-12 block">Product</span>
            <ul className="space-y-6 text-xs font-mono text-warm">
              <li><Link to="/loan-detector" className="hover:text-white transition-colors">Loan Detector</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Scheme Optimization</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Digital Identity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Neural SDK</a></li>
            </ul>
          </div>

          <div className="p-12 border-b md:border-b-0 md:border-r border-grid-line">
            <span className="mono-label !text-white/40 mb-12 block">Network</span>
            <ul className="space-y-6 text-xs font-mono text-warm">
              <li><a href="#" className="hover:text-white transition-colors">Nodes Active</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Brief</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Transparency</a></li>
              <li><a href="#" className="hover:text-white transition-colors">System Ops</a></li>
            </ul>
          </div>

          <div className="p-12 border-b md:border-b-0 md:border-r border-grid-line">
            <span className="mono-label !text-white/40 mb-12 block">Legal</span>
            <ul className="space-y-6 text-xs font-mono text-warm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Ops</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RBI Consent</a></li>
            </ul>
          </div>

          <div className="p-12">
            <span className="mono-label !text-white/40 mb-12 block">Regulatory</span>
            <ul className="space-y-6 text-xs font-mono text-warm">
              <li><a href="#" className="hover:text-white transition-colors">ISO 27001</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DPDP 2023</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AES-256</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="p-12 lg:p-16 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/[0.01]">
          <span className="text-[9px] font-mono text-neutral uppercase tracking-[0.2em] italic">
            © 2025 CreditBridge Hub. Institutional Protocol v4.2
          </span>
          <div className="flex gap-12">
             <span className="text-[9px] font-mono text-neutral uppercase tracking-[0.2em]">Secure Node</span>
             <span className="text-[9px] font-mono text-neutral uppercase tracking-[0.2em]">Global Bharat</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

