import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import gsap from 'gsap';
import { 
  TrendingUp, Landmark, Target, Award, CheckCircle2, Circle, 
  Upload, FileText, Smartphone, Briefcase, AlertTriangle, 
  ShoppingCart, ShieldCheck, Clock, Download, Gift, Zap, ArrowRight, Activity, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();

  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [hasData, setHasData] = useState(false);
  const [dynData, setDynData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll('.dash-animate-header'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  useEffect(() => {
    if (hasData && dynData && contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll('.dash-animate-data'),
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 1, ease: 'back.out(1.2)', delay: 0.1 }
      );

      const scoreObj = { val: 0 };
      gsap.to(scoreObj, {
        val: dynData.score,
        duration: 2.5,
        ease: 'expo.out',
        onUpdate: () => {
          if (scoreRef.current) {
            scoreRef.current.innerHTML = Math.round(scoreObj.val).toString();
          }
        }
      });

      const mappedOffset = 502 - ((dynData.score - 300) / 550) * (502 - 150);
      gsap.to('#dash-score-arc', {
        strokeDashoffset: Math.max(150, mappedOffset),
        duration: 2.5,
        ease: 'expo.out'
      });
    } else {
      if (scoreRef.current) scoreRef.current.innerHTML = "0";
      const arc = document.getElementById('dash-score-arc');
      if (arc) arc.style.strokeDashoffset = '502';
    }
  }, [hasData, dynData]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeWithGemini = async (base64Pdf: string, fileName: string) => {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE" || API_KEY === "") {
        throw new Error("Missing Gemini API Key. Ensure VITE_GEMINI_API_KEY is placed in .env and restart your Vite server.");
    }

    const prompt = `You are an expert financial analyst AI for a system called CreditBridge. Thoroughly analyze the attached Bank Statement PDF and extract real financial insights for alternative credit scoring. 
    Calculate and return ONLY a valid, minified JSON object exactly adhering to this schema with NO markdown blocks and NO formatting outside the braces:
    {
      "score": <Number between 300 and 850 based purely on the PDF financial health>,
      "surplus": <Number representing their estimated remaining monthly surplus balance strictly in INR>,
      "rewards": <Number between 100 and 800 representing gamified points based on their good behavior>,
      "schemes": <Number 2 to 10>,
      "diff": <Number 10 to 60 representing point change>,
      "isPositiveDiff": <Boolean true if they look healthy compared to historical>,
      "status": <String ONLY 'Poor Range', 'Average Range', or 'Good Range'>,
      "statusColor": <String 'text-red-500', 'text-yellow-500', or 'text-emerald'>,
      "statusBg": <String 'bg-red-500/10', 'bg-yellow-500/10', or 'bg-emerald/10'>,
      "scoreData": [5 objects EXACTLY matching { "name": String, "value": Number between 0-100 } for 'Income Stability', 'Payment Behavior', 'Spending Discipline', 'Digital Identity', 'Savings Consistency'],
      "shoppingVal": <Number percentage between 0-100 of discretionary spending total>,
      "spendingData": [
          {"name": "Rent & Bills", "value": <Number percentage>, "color": "#2563EB"},
          {"name": "Food & Groceries", "value": <Number percentage>, "color": "#10B981"},
          {"name": "Transport", "value": <Number percentage>, "color": "#F59E0B"},
          {"name": "Shopping", "value": <Number percentage>, "color": "#EF4444"}
      ],
      "alert": {"title": <String concise alert heading>, "desc": <String deeper advisory description>, "isWarning": <Boolean based on their health>},
      "insights": [
          {"title": <String finding>, "desc": <String context>, "color": <String 'red' or 'green'>, "icon": <String 'shopping', 'shield', or 'clock'>}
      ],
      "recommendations": [
          {"title": <String actionable step>, "desc": <String exact context from PDF>, "type": <String 'save', 'reduce', or 'pay'>}
      ]
    }
    Make sure exactly 3 insights and 3 recommendations are returned. The numbers for spendingData MUST sum to 100.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: 'application/pdf', data: base64Pdf } }
                    ]
                }]
            })
        });
        
        const data = await res.json();
        
        if (data.error) {
            throw new Error(data.error.message || `2.5 Flash API Rejected the request.`);
        }
        
        const textResponse = data.candidates[0].content.parts[0].text;
        const cleanedText = textResponse.replace(/```json/gi, '').replace(/```/gi, '').trim();
        return JSON.parse(cleanedText);
    } catch (error: any) {
        console.error("Gemini 2.5 API Error:", error);
        throw new Error(error.message || "Failed to parse document with Gemini 2.5 Flash API.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      setErrorMsg(null);
      setHasData(false);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        try {
          const realData = await analyzeWithGemini(base64String, file.name);

          setDynData(realData);
          setIsUploading(false);
          setIsUploaded(true);
          setHasData(true);
        } catch (err: any) {
          setIsUploading(false);
          setIsUploaded(false);
          setErrorMsg(err.message);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderIcon = (type: string, isWarning: boolean = false) => {
    const color = isWarning ? 'text-red-400' : 'text-emerald';
    if (type === 'shopping') return <ShoppingCart className={`${color} w-5 h-5`} />;
    if (type === 'clock') return <Clock className={`${color} w-5 h-5`} />;
    if (type === 'shield') return <ShieldCheck className={`${color} w-5 h-5`} />;
    if (type === 'save') return <span className="mr-2">💰</span>;
    if (type === 'reduce') return <span className="mr-2">🚫</span>;
    if (type === 'pay') return <span className="mr-2">⏰</span>;
    return <Sparkles className={`${color} w-5 h-5`} />;
  };

  return (
    <div className="flex bg-navy-900 min-h-screen pb-20">

      <Sidebar />
      <div ref={contentRef} className="flex-1 ml-64 p-10 space-y-8">
        
        {/* TOP HEADER & ACTIONS */}
        <div className="flex justify-between items-end dash-animate-header">
          <div>
            <h1 className="text-3xl font-bold">Financial Command Center</h1>
            <p className="text-neutral mt-2">Welcome back. Connect your data to unlock your financial breakdown.</p>
          </div>
          <button className="btn-outline flex items-center gap-2 px-4 py-2 hover:bg-white hover:text-navy-900 transition-colors">
            <Download size={16} /> Monthly Report
          </button>
        </div>

        {/* ALERTS & NOTIFICATIONS (Only show if hasData) */}
        {hasData && dynData?.alert && (
          <div className={`dash-animate-data w-full border rounded-2xl p-4 flex items-center gap-4 ${dynData.alert.isWarning ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald/10 border-emerald/20'}`}>
            <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center ${dynData.alert.isWarning ? 'bg-red-500/20' : 'bg-emerald/20'}`}>
              {dynData.alert.isWarning ? <AlertTriangle className="text-red-400 w-5 h-5" /> : <TrendingUp className="text-emerald w-5 h-5" />}
            </div>
            <div>
              <h4 className={`text-sm font-bold ${dynData.alert.isWarning ? 'text-red-400' : 'text-emerald'}`}>{dynData.alert.title}</h4>
              <p className={`text-xs mt-1 ${dynData.alert.isWarning ? 'text-red-400/80' : 'text-emerald/80'}`}>{dynData.alert.desc}</p>
            </div>
          </div>
        )}

        {hasData && (
          <div onClick={() => navigate('/loan-detector')} className="dash-animate-data w-full bg-electric/10 border border-electric/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer group hover:bg-electric/20 hover:border-electric/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-electric/20 flex flex-shrink-0 items-center justify-center">
                <Zap className="text-electric w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-electric">You can get a loan up to ₹50,000</h4>
                <p className="text-xs text-electric/80 mt-1">Based on your current transaction history, you pre-qualify for micro-credit. Tap to scan institutional offers.</p>
              </div>
            </div>
            <ArrowRight className="text-electric group-hover:translate-x-2 transition-transform" />
          </div>
        )}

        {/* FILE UPLOAD SECTION */}
        <div className="dash-animate-header w-full relative z-10">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" />
          <div className={`card-premium p-8 border transition-all duration-700 ${isUploaded ? 'border-emerald/50 bg-emerald/5 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : isUploading ? 'border-electric/50 bg-electric/5' : errorMsg ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 hover:border-white/20 hover:shadow-lg hover:shadow-white/5'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isUploaded ? 'bg-emerald/10 text-emerald' : isUploading ? 'bg-electric/10 text-electric' : errorMsg ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-neutral'}`}>
                  {isUploading ? <Activity className="w-8 h-8 animate-pulse" /> : errorMsg ? <AlertTriangle className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{isUploaded ? 'Statement Verified & Data Synced' : isUploading ? 'AI Analyzing Document Data...' : errorMsg ? 'OCR Engine Failed' : 'Upload Bank Statement'}</h3>
                  <p className={`text-xs mt-2 transition-colors max-w-md ${isUploaded ? 'text-emerald/80' : errorMsg ? 'text-red-400' : 'text-white/50'}`}>
                    {isUploaded 
                      ? `Successfully extracted insights from ${selectedFile?.name}. Your dashboard is mapped dynamically entirely via AI.`
                      : isUploading
                      ? 'Gemini flash vision engine is reading your transactions, structuring expenses, and calculating your real creditworthiness...'
                      : errorMsg
                      ? errorMsg
                      : 'Upload your latest PDF bank statement to execute real-time AI analysis. All metrics below require verified data points.'}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <button 
                  onClick={handleFileClick}
                  disabled={isUploading || isUploaded}
                  className={`w-full md:w-auto px-8 py-4 rounded-xl text-sm font-bold transition-all disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isUploaded ? 'bg-emerald/20 text-emerald' : errorMsg ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white text-navy-900 hover:bg-electric hover:text-white'}`}
                >
                  {isUploaded ? <><CheckCircle2 className="w-4 h-4" /> System Active</> : isUploading ? 'Extracting Data...' : errorMsg ? 'Try Uploading Again' : 'Browse PDF File'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LOCKED BLUR CONTAINER OVER THE DASHBOARD */}
        <div className="relative">
          
          {!hasData && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-32 pb-64 rounded-3xl">
              <div className="bg-navy-900/80 backdrop-blur-md border border-white/10 p-10 rounded-3xl flex flex-col items-center text-center max-w-md shadow-2xl dash-animate-header">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-neutral" />
                </div>
                <h3 className="text-xl font-bold mb-2">Metrics Locked</h3>
                <p className="text-sm text-neutral mb-8 leading-relaxed">
                  Your alternative credit score and dynamic financial insights require real-world transaction data to compute. 
                </p>
                <div className="text-[10px] uppercase tracking-widest text-electric font-bold flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 -rotate-90 animate-bounce" /> Upload PDF to Unlock Dashboard
                </div>
              </div>
            </div>
          )}

          <div className={`space-y-8 transition-all duration-1000 ${!hasData ? 'opacity-20 blur-xl pointer-events-none select-none' : ''}`}>
            {/* METRICS & SCORE */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Enhanced Score Card */}
              <div className="card-premium p-6 flex flex-col items-center dash-animate-data">
                <div className="relative w-32 h-32 mb-4">
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90 shadow-2xl rounded-full">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="15" />
                    <circle id="dash-score-arc" cx="100" cy="100" r="80" fill="none" stroke={dynData ? (dynData.score >= 700 ? '#10B981' : dynData.score >= 600 ? '#EAB308' : '#EF4444') : '#2563EB'} strokeWidth="15" strokeLinecap="round" strokeDasharray="502" strokeDashoffset="502" className="transition-colors duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span ref={scoreRef} className="text-3xl font-bold">0</span>
                    {hasData && dynData && (
                      <span className={`text-[10px] font-bold ${dynData.isPositiveDiff ? 'text-emerald' : 'text-red-500'}`}>
                        {dynData.isPositiveDiff ? '↑' : '↓'} {dynData.diff} pts
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="w-full mt-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-medium text-neutral uppercase tracking-widest">Score Status</span>
                    {hasData && dynData && (
                      <span className={`text-xs font-bold ${dynData.statusColor} ${dynData.statusBg} px-2 py-1 rounded transition-colors`}>{dynData.status}</span>
                    )}
                  </div>
                  {/* Financial Health Meter */}
                  <div className="flex h-2.5 w-full gap-1">
                    <div className="h-full bg-red-500 rounded-l-full flex-[1] relative group cursor-help">
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-2 py-1 rounded font-bold whitespace-nowrap transition-opacity">Poor (300-599)</div>
                    </div>
                    <div className="h-full bg-yellow-500 flex-[1] relative group cursor-help">
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-2 py-1 rounded font-bold whitespace-nowrap transition-opacity">Average (600-699)</div>
                    </div>
                    <div className="h-full bg-emerald rounded-r-full flex-[1.5] relative group cursor-help">
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-2 py-1 rounded font-bold whitespace-nowrap transition-opacity">Good (700-850)</div>
                      
                      {/* Current Score Marker */}
                      {hasData && dynData && (
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-white shadow shadow-black rounded-full transition-all duration-1000 ease-out z-10" 
                          style={{ left: `${Math.min(Math.max(((dynData.score - 300) / 550) * 100, 0), 100)}%`, marginLeft: '-4px' }}
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-[9px] text-neutral text-center mt-3 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3 text-neutral" /> AI Health Meter
                  </p>
                </div>
              </div>

              {/* Gamification Box */}
              <div className="card-premium p-6 flex flex-col justify-between dash-animate-data">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-neutral text-xs font-medium uppercase tracking-wider">Rewards Points</p>
                    <h2 className="text-2xl font-bold mt-1 text-warm">{hasData && dynData ? dynData.rewards : '0'} <span className="text-sm font-normal text-warm/60">pts</span></h2>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-warm/10 flex items-center justify-center">
                    <Gift className="text-warm w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-warm transition-all duration-1000" style={{ width: hasData && dynData ? `${(dynData.rewards % 1000) / 10}%` : '0%' }} />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-neutral">Tier: {hasData && dynData && dynData.rewards > 500 ? 'Gold' : 'Silver'}</span>
                    {hasData && dynData && (
                      <span className="text-[10px] text-warm font-bold">🎯 {1000 - (dynData.rewards % 1000)} pts to Next Tier</span>
                    )}
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-warm/10 to-transparent border border-warm/20">
                    <p className="text-[10px] text-warm italic font-medium">
                      Boost your score by 10 points this month to unlock 0% processing fee on your next loan drop.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6 flex flex-col justify-between dash-animate-data">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-neutral text-xs font-medium uppercase tracking-wider">Monthly Surplus</p>
                    <h2 className="text-2xl font-bold mt-1">₹{hasData && dynData && dynData.surplus ? dynData.surplus.toLocaleString('en-IN') : '0'}</h2>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                    <TrendingUp className="text-emerald w-5 h-5" />
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
                  {hasData && dynData && (
                    <div className="h-full bg-emerald transition-all duration-1000 delay-500" style={{ width: `${Math.min((dynData.surplus / 20000) * 100, 100)}%` }} />
                  )}
                </div>
                {hasData && dynData && (
                  <p className="text-[10px] text-neutral mt-2">Analyzed accurately from extracted deposits vs debit ratio across {selectedFile?.name}</p>
                )}
              </div>

              <div className="card-premium p-6 flex flex-col justify-between dash-animate-data">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-neutral text-xs font-medium uppercase tracking-wider">Schemes Matched</p>
                    <h2 className="text-2xl font-bold mt-1">{hasData && dynData ? dynData.schemes : '0'} Schemes</h2>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center">
                    <Landmark className="text-electric w-5 h-5" />
                  </div>
                </div>
                <button className="text-[10px] text-electric font-bold mt-4 flex items-center gap-1 hover:underline">
                  View All Matched Schemes <Target size={10} />
                </button>
              </div>
            </div>

            {/* INSIGHTS & RECOMMENDATIONS */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Personalized Insights */}
              <div className="card-premium p-8 dash-animate-data">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Zap className="text-electric w-5 h-5" /> Gemini Extracted Insights
                </h3>
                <div className="space-y-4">
                  
                  {hasData && dynData?.insights && dynData.insights.map((insight: any, i: number) => {
                    const isRed = insight.color === 'red';
                    return (
                        <div key={i} className={`flex gap-4 p-4 rounded-xl border items-center group cursor-pointer transition-colors ${isRed ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10' : 'border-emerald/20 bg-emerald/5 hover:bg-emerald/10'}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${isRed ? 'bg-red-500/10' : 'bg-emerald/10'}`}>
                                {renderIcon(insight.icon, isRed)}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${isRed ? 'text-red-400' : 'text-emerald'}`}>{insight.title}</h4>
                                <p className={`text-[10px] mt-1 ${isRed ? 'text-red-400/70' : 'text-emerald/70'}`}>{insight.desc}</p>
                            </div>
                        </div>
                    );
                  })}

                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="card-premium p-8 dash-animate-data">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="text-emerald w-5 h-5" /> How to Improve
                </h3>
                <div className="space-y-6">
                  
                  {hasData && dynData?.recommendations && dynData.recommendations.map((rec: any, i: number) => (
                      <div key={i} className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        {rec.type === 'save' && (
                            <>
                                <div className="flex justify-between items-end">
                                    <h4 className="text-sm font-bold text-warm flex items-center gap-2">💰 {rec.title}</h4>
                                    <span className="text-[10px] text-neutral font-mono">₹{dynData?.surplus?.toLocaleString()} / ₹15,000 Target</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-warm transition-all" style={{ width: `${Math.min(((dynData?.surplus || 0) / 15000) * 100, 100)}%` }} />
                                </div>
                            </>
                        )}
                        {rec.type === 'reduce' && (
                            <h4 className="text-sm font-bold text-electric flex items-center gap-2">🚫 {rec.title}</h4>
                        )}
                        {rec.type === 'pay' && (
                            <h4 className="text-sm font-bold text-emerald flex items-center gap-2">⏰ {rec.title}</h4>
                        )}
                        
                        <p className="text-[10px] text-neutral italic mt-2">{rec.desc}</p>
                        
                        {rec.type === 'reduce' && (
                            <div className="pt-2">
                                <span className="text-[9px] uppercase tracking-widest text-electric font-bold border border-electric/30 px-2 py-1 rounded bg-electric/10 cursor-pointer hover:bg-electric/20">Review Deficits</span>
                            </div>
                        )}
                    </div>
                  ))}

                </div>
              </div>
            </div>

            {/* Deep Dive Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="dash-card card-premium p-8 dash-animate-data">
                <h3 className="text-lg font-bold mb-8">What Makes Your AI Score</h3>
                <div className="h-64 w-full">
                  {hasData && dynData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dynData.scoreData} layout="vertical" barCategoryGap={10}>
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={120} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                        <Bar dataKey="value" fill={dynData.score >= 700 ? "#10B981" : dynData.score >= 600 ? "#EAB308" : "#EF4444"} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="dash-card card-premium p-8 dash-animate-data">
                <h3 className="text-lg font-bold mb-6">Gemini Spend Matrix</h3>
                <div className="h-64 w-full">
                  {hasData && dynData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dynData.spendingData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {dynData.spendingData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} itemStyle={{ color: 'white' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
