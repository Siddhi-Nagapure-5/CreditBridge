import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Activity, AlertCircle, CheckCircle, Cpu, FileCheck, ShieldAlert, Plus, HelpCircle } from 'lucide-react';
import axios from 'axios';

interface TopFactor {
  feature: string;
  impact: number;
}

interface ScoringResult {
  score: number;
  category: string;
  description: string;
  probability_of_default: number;
  max_loan_recommended: number;
  explainability_summary: string;
  top_factors: TopFactor[];
}

// Simulated Internal Bank Database Mappings for prototype demonstration
const AADHAR_DATABASE: Record<string, number> = {
  "1111-2222-3333": 180000,   // Low-income gig worker profile
  "4444-5555-6666": 450000,   // Middle-income salary profile
  "7777-8888-9999": 900000,   // High-income business profile
  "0000-0000-0000": 0         // True credit invisible (no internal history)
};

const ApplicantScorer = () => {
  const location = useLocation();

  // Step States
  const [internalFetchState, setInternalFetchState] = useState<'idle' | 'fetching' | 'complete'>('idle');
  const [aadharNumber, setAadharNumber] = useState(location.state?.aadharNumber || "1111-2222-3333");
  const [internalInflows, setInternalInflows] = useState(0);

  // File Upload States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [externalUploadState, setExternalUploadState] = useState<'idle' | 'uploading'>('idle');
  const [externalFiles, setExternalFiles] = useState<{name: string, inflows: number}[]>([]);
  
  // Data States
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [error, setError] = useState('');

  // Primary ML Features (Stated by Applicant)
  const [formData, setFormData] = useState({
    person_age: 28,
    person_income: 450000, // Stated Income
    person_emp_length: 3,
    loan_amnt: 50000,
    loan_intent: 'PERSONAL',
    person_home_ownership: 'RENT',
  });

  // Derived Metrics
  const externalInflows = externalFiles.reduce((acc, file) => acc + file.inflows, 0);
  const verifiedIncome = internalInflows + externalInflows;
  const incomeDeviation = formData.person_income > 0 ? (verifiedIncome / formData.person_income) : 0;

  // UI Checks
  const verificationStatus = 
    incomeDeviation >= 0.85 ? 'valid' : 
    incomeDeviation >= 0.60 ? 'warning' : 'danger';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['loan_intent', 'person_home_ownership'].includes(name) ? value : Number(value)
    }));
  };

  const handleAadharFetch = () => {
    setInternalFetchState('fetching');
    setTimeout(() => {
      // Look up Aadhar in the mock DB. If exactly matching, return DB value. If not, return 0.
      const foundInflows = AADHAR_DATABASE[aadharNumber] !== undefined ? AADHAR_DATABASE[aadharNumber] : 0;
      setInternalInflows(foundInflows);
      setInternalFetchState('complete');
    }, 1500);
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the actual OS file picker
    }
  };

  const processExternalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setExternalUploadState('uploading');

    // Simulate OCR Processing time of the real PDF file
    setTimeout(() => {
      // In a real app, we would send 'file' via FormData to a Python OCR API here.
      // For MVP, we assign a randomized but significant cash flow extraction pseudo-value based on file size.
      const simulatedExtraction = Math.abs((file.size % 400000) + 120000); 

      setExternalFiles(prev => [...prev, {
        name: file.name,
        inflows: simulatedExtraction
      }]);
      setExternalUploadState('idle');
      
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 2000);
  };

  const calculateScore = async () => {
    if (internalFetchState !== 'complete') {
      setError("Please fetch internal Branch Aadhar/Account data first.");
      return;
    }
    
    setError('');
    setIsScoring(true);
    
    try {
      // PASSING VERIFIED INCOME TO ML INSTEAD OF STATED (Perfect Fairness Check)
      const processedData = {
        ...formData,
        person_income: verifiedIncome > 0 ? verifiedIncome : formData.person_income, 
        loan_percent_income: formData.loan_amnt / (verifiedIncome > 0 ? verifiedIncome : formData.person_income)
      };
      
      const response = await axios.post('http://127.0.0.1:8000/api/score', processedData);
      
      // Simulate real-time processing delay for visual effect
      setTimeout(() => {
        setResult(response.data);
        setIsScoring(false);
      }, 1500);
      
    } catch (err) {
      setError("Failed to connect to ML Engine. Is the Python FastAPI server running on port 8000?");
      setIsScoring(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
      
      {/* LEFT COLUMN: Multi-Bank Ingestion & Verification Form */}
      <div className="dash-card card-premium p-8 relative overflow-hidden flex flex-col h-full border-electric/30">
        <h3 className="text-xl font-bold tracking-tight mb-2 border-b border-grid-line pb-4 flex items-center gap-2">
          <FileText className="text-electric w-5 h-5" /> 
          Applicant Data Verification
        </h3>
        
        {/* Step 1: Internal Bank Fetch */}
        <div className="mt-4 mb-4 p-4 bg-white/5 border border-grid-line relative">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-[11px] font-medium text-neutral uppercase tracking-wider flex items-center gap-2">
              Step 1: Internal Branch Assessment <span className="bg-white/10 px-1 py-0.5 rounded text-[9px]">Aadhar/PAN</span>
            </h4>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-neutral cursor-help" />
              <div className="absolute right-0 w-64 p-3 bg-zinc-900 border border-grid-line text-xs text-neutral hidden group-hover:block z-50 shadow-2xl">
                <strong>Test Accounts for MVP:</strong><br/>
                <code className="text-electric">1111-2222-3333</code> (Lower DB Income)<br/>
                <code className="text-electric">4444-5555-6666</code> (Mid DB Income)<br/>
                <code className="text-electric">7777-8888-9999</code> (High DB Income)<br/>
                <code className="text-electric">0000-0000-0000</code> (No DB History)
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <input 
                type="text" 
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                placeholder="Enter Aadhar Number..."
                className="w-full bg-pure-black border border-grid-line p-2 text-sm text-white focus:border-electric outline-none placeholder:text-neutral/50"
              />
            </div>
            <button 
              onClick={handleAadharFetch}
              disabled={internalFetchState === 'fetching' || !aadharNumber}
              className={`px-4 py-2 border text-sm flex items-center gap-2 transition-colors ${
                internalFetchState === 'complete' ? 'bg-emerald/10 border-emerald/50 text-emerald' : 
                'bg-electric hover:bg-electric/90 text-black border-electric'
              }`}
            >
              {internalFetchState === 'fetching' ? <Activity className="animate-spin w-4 h-4" /> : 
               internalFetchState === 'complete' ? <CheckCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
              {internalFetchState === 'fetching' ? 'Querying DB...' : 
               internalFetchState === 'complete' ? 'Database Merged' : 'Search Database'}
            </button>
          </div>
          {internalFetchState === 'complete' && (
            <div className="mt-4 p-3 bg-zinc-900 border border-grid-line text-xs flex justify-between items-center">
              <span className="text-neutral">Total Branch Flows Identified:</span>
              <span className={`font-bold ${internalInflows > 0 ? 'text-emerald' : 'text-warm'}`}>
                {internalInflows > 0 ? formatCurrency(internalInflows) : 'No Records Found (True Invisible)'}
              </span>
            </div>
          )}
        </div>

        {/* Step 2: Multi-Bank External Aggregation */}
        <div className={`mb-6 p-4 bg-white/5 border border-grid-line relative transition-opacity duration-500 ${internalFetchState === 'complete' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="flex justify-between items-center mb-3">
             <h4 className="text-[11px] font-medium text-neutral uppercase tracking-wider flex items-center gap-2">
               Step 2: External OS Statement Upload
             </h4>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={processExternalFile} 
               className="hidden" 
               accept=".pdf,.csv,.xlsx" 
             />
             <button 
               onClick={handleFileUploadClick}
               disabled={externalUploadState === 'uploading'}
               className="text-[10px] px-3 py-1.5 border border-electric/40 uppercase font-bold tracking-widest text-electric flex items-center gap-1 hover:bg-electric hover:text-black transition-colors"
             >
               {externalUploadState === 'uploading' ? <Activity className="w-3 h-3 animate-spin"/> : <Plus className="w-3 h-3"/>}
               {externalUploadState === 'uploading' ? 'Processing...' : 'Provide File'}
             </button>
          </div>
          
          <div className="space-y-2">
            {externalFiles.length === 0 ? (
              <div className="p-4 border border-dashed border-grid-line flex flex-col items-center justify-center text-center">
                <Upload className="text-neutral/40 w-6 h-6 mb-2" />
                <p className="text-xs text-neutral italic">Click "Provide File" to select a PDF statement from your computer.</p>
              </div>
            ) : (
              externalFiles.map((file, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-pure-black border border-grid-line text-xs">
                  <span className="font-mono text-neutral flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                    <FileText className="w-3 h-3 shrink-0"/> {file.name}
                  </span>
                  <span className="text-blue-400 font-bold shrink-0">+ {formatCurrency(file.inflows)}</span>
                </div>
              ))
            )}
            
            {externalFiles.length > 0 && (
               <div className="flex justify-between items-center pt-3 mt-3 border-t border-grid-line text-xs font-bold bg-white/5 p-2 rounded">
                 <span>Total Scraped External Inflows</span>
                 <span className="text-blue-400">{formatCurrency(externalInflows)}</span>
               </div>
            )}
          </div>
        </div>

        {/* Step 3: Application Data & Cross Verification */}
        <div className={`transition-opacity duration-500 flex-1 flex flex-col ${internalFetchState === 'complete' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <h4 className="text-[11px] font-medium text-neutral mb-4 uppercase tracking-wider">Step 3: Stated Requirements & Features</h4>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div>
              <label className="block text-[10px] text-neutral mb-1">Stated Annual Income (₹)</label>
              <input type="number" name="person_income" value={formData.person_income} onChange={handleInputChange} className="w-full bg-pure-black border border-grid-line p-2 text-sm text-electric focus:border-electric outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-neutral mb-1">Requested Loan Amt (₹)</label>
              <input type="number" name="loan_amnt" value={formData.loan_amnt} onChange={handleInputChange} className="w-full bg-pure-black border border-grid-line p-2 text-sm text-warm border-warm/30 focus:border-warm outline-none" />
            </div>
            <div>
              <label className="block text-[10px] text-neutral mb-1">Age</label>
              <input type="number" name="person_age" value={formData.person_age} onChange={handleInputChange} className="w-full bg-pure-black border border-grid-line p-2 text-sm" />
            </div>
            <div>
              <label className="block text-[10px] text-neutral mb-1">Employment Length (Yrs)</label>
              <input type="number" name="person_emp_length" value={formData.person_emp_length} onChange={handleInputChange} className="w-full bg-pure-black border border-grid-line p-2 text-sm" />
            </div>
            <div>
              <label className="block text-[10px] text-neutral mb-1">Loan Purpose</label>
              <select name="loan_intent" value={formData.loan_intent} onChange={handleInputChange} className="w-full bg-pure-black border border-grid-line p-2 text-sm">
                <option value="PERSONAL">Personal</option>
                <option value="EDUCATION">Education</option>
                <option value="MEDICAL">Medical</option>
                <option value="VENTURE">Venture / Business</option>
                <option value="HOME">Home Improvement</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-neutral mb-1">Housing Status</label>
              <select name="person_home_ownership" value={formData.person_home_ownership} onChange={handleInputChange} className="w-full bg-pure-black border border-grid-line p-2 text-sm">
                <option value="RENT">Rent</option>
                <option value="OWN">Own</option>
                <option value="MORTGAGE">Mortgage</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* CROSS VERIFICATION ENGINE REPORT */}
          {internalFetchState === 'complete' && (
            <div className={`mt-6 p-4 border flex items-start gap-4 ${
              verificationStatus === 'valid' ? 'bg-emerald/5 border-emerald/30' : 
              verificationStatus === 'warning' ? 'bg-warm/5 border-warm/30' : 
              'bg-red-500/5 border-red-500/30'
            }`}>
              {verificationStatus === 'valid' ? <CheckCircle className="text-emerald shrink-0 mt-0.5" /> : 
               verificationStatus === 'warning' ? <AlertCircle className="text-warm shrink-0 mt-0.5" /> : 
               <ShieldAlert className="text-red-500 shrink-0 mt-0.5" />}
              
              <div>
                <h5 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  verificationStatus === 'valid' ? 'text-emerald' : 
                  verificationStatus === 'warning' ? 'text-warm' : 'text-red-500'
                }`}>
                  Cross-Verification Engine
                </h5>
                <p className="text-[11px] text-neutral mb-2">
                  Stated Income: {formatCurrency(formData.person_income)} <br/>
                  Verified Aggregation: {formatCurrency(verifiedIncome)} <br/>
                  <span className="font-mono text-white/60">Match: {(incomeDeviation * 100).toFixed(1)}%</span>
                </p>
                <p className={`text-[10px] ${verificationStatus === 'danger' ? 'text-red-400' : 'text-white'}`}>
                  {verificationStatus === 'valid' ? "Data validated. AI models will use Stated Income equivalent." : 
                   verificationStatus === 'warning' ? "Warning: Minor discrepancy. AI will score based strictly on Verified Aggregation." : 
                   "HIGH RISK: Massive income discrepancy detected. AI will forcefully overwrite with Verified Aggregation."}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <button 
            onClick={calculateScore}
            disabled={isScoring}
            className="w-full mt-6 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-neutral transition-colors flex flex-col items-center justify-center gap-1"
          >
            <div className="flex items-center gap-2">
              {isScoring ? 'Processing AI...' : 'Generate Fair Credit Score'}
              {isScoring && <Cpu className="animate-pulse w-4 h-4" />}
            </div>
            {!isScoring && <span className="text-[9px] font-mono text-black/60">Calculations based on verified cash-flow</span>}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Output & Explainability */}
      <div className="dash-card card-premium p-8 flex flex-col relative h-full">
        {/* Placeholder overlay before scoring */}
        {!result && !isScoring && (
           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-pure-black/60 backdrop-blur-sm border border-grid-line">
             <Cpu className="w-12 h-12 text-white/20 mb-4" />
             <p className="text-white/40 text-sm font-mono tracking-widest uppercase">Awaiting Applicant Data</p>
           </div>
        )}

        {isScoring && (
           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-pure-black/80 backdrop-blur-md border border-electric/30">
              <div className="w-16 h-16 border-t-2 border-electric border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-electric text-sm font-mono tracking-widest uppercase animate-pulse">Computing Fair Aggregation Score...</p>
           </div>
        )}

        {result && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">Assessment Generated</h3>
                  <p className="text-neutral text-xs">Proprietary Alternate Credit Model execution complete.</p>
                </div>
                <div className="p-2 border border-grid-line bg-white/5">
                  <FileCheck className="w-5 h-5 text-emerald" />
                </div>
              </div>

              {/* The Score Dial */}
              <div className="flex flex-col items-center justify-center py-6 border-y border-grid-line mb-8">
                <div className="relative flex items-center justify-center w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                    <motion.circle 
                      initial={{ strokeDasharray: "440", strokeDashoffset: "440" }}
                      animate={{ strokeDashoffset: 440 - (440 * ((result.score - 300) / 600)) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="80" cy="80" r="70" fill="transparent" 
                      stroke={result.score >= 700 ? '#10b981' : result.score >= 600 ? '#facc15' : '#ef4444'} 
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                      className="text-4xl font-bold"
                    >
                      {result.score}
                    </motion.span>
                    <span className="text-[10px] text-neutral tracking-widest">/ 900</span>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border rounded-full ${
                    result.score >= 700 ? 'bg-emerald/10 text-emerald border-emerald/20' : 
                    result.score >= 600 ? 'bg-warm/10 text-warm border-warm/20' : 
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {result.category}
                  </span>
                  <p className="text-xs text-neutral mt-3">{result.description}</p>
                </div>
              </div>

              {/* Explainability Section - The "Why" */}
              <div className="flex-1">
                <h4 className="text-sm font-bold border-b border-grid-line pb-2 mb-4 flex items-center justify-between">
                  <span>Decision Rationale (Explainability AI)</span>
                  <span className="text-[10px] text-electric uppercase font-mono px-2 bg-electric/10">SHAP Analysis</span>
                </h4>
                <p className="text-sm text-neutral leading-relaxed italic mb-6">
                  "{result.explainability_summary}"
                </p>

                <div className="space-y-3">
                  {result.top_factors.map((factor, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5">
                      <span className="text-xs font-mono">{factor.feature}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-black/50 rounded-full overflow-hidden">
                           <div 
                             className={`h-full ${factor.impact > 0 ? 'bg-red-500/80' : 'bg-emerald/80'}`} 
                             style={{ width: `${Math.min(Math.abs(factor.impact) * 100, 100)}%` }}
                           />
                        </div>
                        <span className={`text-[10px] font-bold w-12 text-right ${factor.impact > 0 ? 'text-red-400' : 'text-emerald'}`}>
                          {factor.impact > 0 ? '+Risk' : '-Risk'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Output */}
              <div className="mt-6 pt-4 border-t border-grid-line flex justify-between items-end">
                <div>
                  <p className="text-xs text-neutral mb-1">Max Recommended Line</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(result.max_loan_recommended)}</p>
                </div>
                <button className="px-6 py-3 bg-electric text-black font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors">
                  Approve Issuance
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ApplicantScorer;
