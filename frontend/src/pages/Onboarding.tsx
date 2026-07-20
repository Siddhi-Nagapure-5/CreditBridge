import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate } from 'animejs';
import { ChevronRight, ChevronLeft, Upload, CheckCircle2, User, Wallet, Target, Cpu } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    state: '',
    occupation: '',
    income: '',
    expenses: '',
    familySize: 1,
    ownsHouse: false,
    goals: [] as string[],
  });
  const [loadingText, setLoadingText] = useState('Analyzing income patterns...');
  
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const totalSteps = 6;

  useEffect(() => {
    // Progress bar animation - v4: animate(target, config)
    if (progressRef.current) {
      animate(progressRef.current, {
        width: `${(step / totalSteps) * 100}%`,
        easing: 'easeOutExpo',
        duration: 800,
      });
    }

    // Slide transition
    if (formRef.current) {
      animate(formRef.current, {
        translateX: [40, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800,
      });
    }

    // Loading screen text cycle
    if (step === 6) {
      const texts = [
        "Analyzing income patterns...",
        "Checking government scheme eligibility...",
        "Calculating your CreditBridge Score...",
        "Matching investment profile...",
        "Building your 90-day plan...",
        "Finalizing your Financial DNA..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 1500);

      // Final redirect after delay
      const timeout = setTimeout(() => {
        navigate('/dashboard');
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step, navigate]);

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal) 
        : [...prev.goals, goal]
    }));
  };

  const occupations = [
    { id: 'salaried', label: 'Salaried', icon: '🧑💼' },
    { id: 'self_employed', label: 'Self Employed', icon: '🏪' },
    { id: 'farmer', label: 'Farmer', icon: '🚜' },
    { id: 'gig', label: 'Gig Worker', icon: '🛺' },
    { id: 'daily_wage', label: 'Daily Wage', icon: '🏗️' },
    { id: 'freelancer', label: 'Freelancer', icon: '👩💻' },
  ];

  const goals = [
    { id: 'home', label: 'Own a Home', icon: '🏠' },
    { id: 'health', label: 'Healthcare Security', icon: '🏥' },
    { id: 'invest', label: 'Grow Investments', icon: '📈' },
    { id: 'loan', label: 'Get a Loan', icon: '💳' },
    { id: 'edu', label: 'Children\'s Education', icon: '🎓' },
    { id: 'biz', label: 'Business Capital', icon: '🌾' },
    { id: 'credit', label: 'Improve Credit Score', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col pt-20">
      {/* Progress Bar */}
      <div className="fixed top-20 left-0 w-full h-1 bg-white/5 z-40">
        <div ref={progressRef} className="h-full bg-electric shadow-[0_0_10px_rgba(37,99,235,0.8)]" style={{ width: '0%' }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          
          <div ref={formRef}>
            {/* Step 1: Welcome */}
            {step === 1 && (
              <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-electric/10 rounded-full flex items-center justify-center mx-auto border border-electric/20">
                  <User className="text-electric w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold">Let's build your Financial Profile</h1>
                  <p className="text-xl text-neutral">We'll ask you 6 simple questions. Takes less than 2 minutes. 100% private.</p>
                </div>
                <button onClick={nextStep} className="btn-primary w-full md:w-auto px-12 text-lg">
                  Let's Begin <ChevronRight className="inline-block ml-1" />
                </button>
              </div>
            )}

            {/* Step 2: Basic Info */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center">
                    <User className="text-electric w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Tell us about yourself</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-4 focus:border-electric outline-none transition-colors"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral flex justify-between">
                      <span>Age</span>
                      <span className="text-electric font-bold">{formData.age} yrs</span>
                    </label>
                    <input 
                      type="range" 
                      min="18" 
                      max="65" 
                      className="w-full accent-electric bg-navy-800 h-2 rounded-lg cursor-pointer"
                      value={formData.age}
                      onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral">Occupation Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {occupations.map((occ) => (
                        <button
                          key={occ.id}
                          onClick={() => updateFormData('occupation', occ.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            formData.occupation === occ.id 
                            ? 'bg-electric/10 border-electric shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                            : 'bg-navy-800 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{occ.icon}</span>
                          <span className="text-xs font-bold block">{occ.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="btn-outline px-8"><ChevronLeft className="inline-block mr-1" /> Back</button>
                  <button onClick={nextStep} disabled={!formData.name || !formData.occupation} className="btn-primary px-8 disabled:opacity-50">Next <ChevronRight className="inline-block ml-1" /></button>
                </div>
              </div>
            )}

            {/* Step 3: Income & Expenses */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                    <Wallet className="text-emerald w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Your Monthly Finances</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-neutral">Monthly Income (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold focus:border-emerald outline-none transition-colors"
                      placeholder="0"
                      value={formData.income}
                      onChange={(e) => updateFormData('income', e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-neutral">Monthly Expenses (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-4 text-2xl font-bold focus:border-red-400 outline-none transition-colors"
                      placeholder="0"
                      value={formData.expenses}
                      onChange={(e) => updateFormData('expenses', e.target.value)}
                    />
                  </div>

                  <div className="p-6 rounded-2xl bg-emerald/5 border border-emerald/10">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral font-medium">Estimated Monthly Surplus</span>
                      <span className="text-3xl font-bold text-emerald">
                        ₹{(parseInt(formData.income || '0') - parseInt(formData.expenses || '0')).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="btn-outline px-8">Back</button>
                  <button onClick={nextStep} disabled={!formData.income || !formData.expenses} className="btn-primary px-8 disabled:opacity-50 bg-emerald hover:bg-emerald/90 shadow-emerald/20">Next</button>
                </div>
              </div>
            )}

            {/* Step 4: Bank Data */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center">
                    <Upload className="text-electric w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Connect Your Bank Data</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card-premium p-6 cursor-pointer group hover:border-electric">
                    <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="text-electric w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Upload Statement</h3>
                    <p className="text-xs text-neutral">Upload PDF/CSV of last 3 months</p>
                  </div>
                  <div className="card-premium p-6 cursor-pointer group hover:border-emerald">
                    <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="text-emerald w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Enter Manually</h3>
                    <p className="text-xs text-neutral">Add transactions one by one</p>
                  </div>
                </div>

                <div className="p-4 bg-navy-800 rounded-xl border border-white/5 flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <p className="text-xs text-neutral">Your data is encrypted and never stored after analysis. All processing is localized to build your score profile.</p>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="btn-outline px-8">Back</button>
                  <button onClick={nextStep} className="btn-primary px-8">Continue to Analysis</button>
                </div>
              </div>
            )}

            {/* Step 5: Goals */}
            {step === 5 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center">
                    <Target className="text-electric w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">What matters most to you?</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-6 rounded-2xl border text-center transition-all ${
                        formData.goals.includes(goal.id)
                        ? 'bg-electric/10 border-electric shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                        : 'bg-navy-800 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className="text-3xl mb-3 block">{goal.icon}</span>
                      <span className="text-xs font-bold block leading-tight">{goal.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="btn-outline px-8">Back</button>
                  <button onClick={nextStep} disabled={formData.goals.length === 0} className="btn-primary px-12 disabled:opacity-50">Generate Report</button>
                </div>
              </div>
            )}

            {/* Step 6: Loading Screen */}
            {step === 6 && (
              <div className="text-center space-y-12">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-electric/10 border-t-electric animate-spin shadow-[0_0_20px_rgba(37,99,235,0.3)]" />
                  <div className="absolute inset-4 rounded-full border-4 border-emerald/10 border-b-emerald animate-[spin_2s_linear_infinite]" />
                  <div className="absolute inset-8 rounded-full border-4 border-white/5 border-l-warm animate-[spin_3s_linear_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="text-warm w-12 h-12 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Generating Your Financial Profile</h2>
                  <p className="text-xl text-neutral h-8 transition-all duration-500">{loadingText}</p>
                </div>

                <div className="max-w-md mx-auto h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div className="h-full bg-electric animate-[progress_8s_ease-in-out_forwards]" />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
