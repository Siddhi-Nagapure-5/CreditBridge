import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Layout, Plus, Building2, MapPin, Hash, Trash2, ArrowRight } from 'lucide-react';

interface Branch {
  id: string;
  branchName: string;
  branchCode: string;
}

const BranchManagement = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBranch, setNewBranch] = useState({ branchName: '', branchCode: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('/super/branches');
      setBranches(response.data);
    } catch (error) {
      console.error('Failed to fetch branches', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/super/branches', newBranch);
      setShowAddForm(false);
      setNewBranch({ branchName: '', branchCode: '' });
      fetchBranches();
    } catch (error) {
      console.error('Failed to add branch', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-pure-black min-h-screen text-white font-['JetBrains_Mono']">
      <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">BRANCH_DIRECTORY</h1>
          <p className="text-zinc-500 uppercase text-xs tracking-[0.2em]">Institutional Mesh Control / Local Offices</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 hover:bg-zinc-200 transition-colors uppercase text-xs font-bold"
        >
          <Plus size={16} />
          {showAddForm ? 'CANCEL_REGISTRATION' : 'REGISTER_NEW_BRANCH'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-12 border border-zinc-800 p-8 bg-zinc-900/30">
          <form onSubmit={handleAddBranch} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block">Branch Name</label>
              <input
                type="text"
                value={newBranch.branchName}
                onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
                className="w-full bg-pure-black border border-grid-line p-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="e.g. DOWNTOWN_HUB"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block">Branch Identification Code</label>
              <input
                type="text"
                value={newBranch.branchCode}
                onChange={(e) => setNewBranch({ ...newBranch, branchCode: e.target.value })}
                className="w-full bg-pure-black border border-grid-line p-3 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="BR-XXXX"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-4 font-bold uppercase text-sm hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'PROCESSING...' : 'INITIALIZE_BRANCH_ENTITY'}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="group border border-zinc-800 p-6 hover:border-white transition-all bg-zinc-900/10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 border border-zinc-800 group-hover:bg-white group-hover:text-black transition-colors">
                  <Building2 size={24} />
                </div>
                <div className="text-[10px] text-zinc-600 font-mono">{branch.id.substring(0, 8)}</div>
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:translate-x-1 transition-transform uppercase">
                {branch.branchName}
              </h3>
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-6">
                <Hash size={12} />
                <span className="tracking-widest">{branch.branchCode}</span>
              </div>
              <div className="pt-6 border-t border-zinc-900 flex justify-between items-center text-[10px] tracking-widest text-zinc-500">
                <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                  <MapPin size={10} /> ACTIVE_ENDPOINT
                </span>
                <button className="hover:text-red-500 transition-colors">TERMINATE</button>
              </div>
            </div>
          ))}

          {branches.length === 0 && (
            <div className="col-span-full border border-zinc-800 border-dashed p-12 text-center text-zinc-500 flex flex-col items-center gap-4">
              <Layout size={48} className="opacity-20 transition-opacity group-hover:opacity-40" />
              <p className="uppercase text-xs tracking-widest">No active branch entities detected in institutional mesh</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
