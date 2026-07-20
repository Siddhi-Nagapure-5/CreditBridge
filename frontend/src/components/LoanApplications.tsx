import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Cpu, ArrowRight } from 'lucide-react';

const MOCK_APPLICATIONS = [
  { id: 'APP-1029', name: 'Ravi Thakur', aadhar: '1111-2222-3333', amount: 45000, intent: 'Business / Venture', status: 'Pending Review' },
  { id: 'APP-1030', name: 'Priya Desai', aadhar: '4444-5555-6666', amount: 120000, intent: 'Medical Emergency', status: 'Pending Review' },
  { id: 'APP-1031', name: 'Alok Singh', aadhar: '7777-8888-9999', amount: 800000, intent: 'Home Improvement', status: 'Pending Review' },
  { id: 'APP-1032', name: 'Unknown User', aadhar: '0000-0000-0000', amount: 25000, intent: 'Personal Loan', status: 'New (Credit Invisible)' },
];

const LoanApplications = () => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAssessApplication = (app: any) => {
    // Navigate to the ML scoring tab and pass the applicant's Aadhar number
    navigate('/admin/scoring', { state: { aadharNumber: app.aadhar, prefill: true } });
  };

  return (
    <div className="space-y-8 mt-4">
      <div className="flex justify-between items-end border-b border-grid-line pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Loan Applications</h2>
          <p className="text-neutral text-sm">Review applications submitted to this branch and forward them to the AI Credit Engine.</p>
        </div>
      </div>

      <div className="dash-card card-premium p-8 border-electric/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <FileText size={100} />
        </div>
        
        <table className="w-full text-left border-collapse relative z-10">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-4 text-xs font-medium text-neutral uppercase tracking-wider">App ID</th>
              <th className="py-4 text-xs font-medium text-neutral uppercase tracking-wider">Applicant Name</th>
              <th className="py-4 text-xs font-medium text-neutral uppercase tracking-wider">Aadhar / PAN</th>
              <th className="py-4 text-xs font-medium text-neutral uppercase tracking-wider">Requested Line</th>
              <th className="py-4 text-xs font-medium text-neutral uppercase tracking-wider">Intent</th>
              <th className="py-4 text-xs font-medium text-neutral uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_APPLICATIONS.map((app) => (
              <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 text-xs font-mono text-neutral">{app.id}</td>
                <td className="py-4 font-bold text-sm">{app.name}</td>
                <td className="py-4 font-mono text-xs text-white/70">{app.aadhar}</td>
                <td className="py-4 text-sm font-bold text-warm">{formatCurrency(app.amount)}</td>
                <td className="py-4 text-xs text-neutral italic">{app.intent}</td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => handleAssessApplication(app)}
                    className="px-4 py-2 border border-electric text-electric text-xs font-bold uppercase tracking-widest hover:bg-electric hover:text-black transition-colors flex items-center justify-end gap-2 ml-auto"
                  >
                    Assess via AI <Cpu className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanApplications;
