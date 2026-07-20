import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, X, Search, MoreVertical } from 'lucide-react';
import axios from '../../api/axios';

const BankManagement = () => {
  const [banks, setBanks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBanks = async () => {
    try {
      const response = await axios.get('/super/banks');
      setBanks(response.data);
    } catch (error) {
      console.error('Failed to fetch banks', error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/super/banks', { bankName: newBankName });
      setNewBankName('');
      setIsModalOpen(false);
      fetchBanks();
    } catch (error) {
      console.error('Failed to create bank', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBanks = banks.filter(bank => 
    bank.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0 border-l border-grid-line min-h-screen">
      <div className="p-12 border-b border-grid-line flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-xl">
          <div className="mono-label mb-4">Registry / Institutions</div>
          <h1 className="text-4xl font-mono text-white tracking-tighter uppercase">Banks</h1>
          <p className="text-neutral mt-4 font-mono text-xs leading-relaxed">
            Authorized financial entities within the secure lending perimeter.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Register Institution
        </button>
      </div>

      <div className="p-12 border-b border-grid-line bg-neutral-900/10">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral" />
          <input 
            type="text"
            placeholder="FILTER INSTITUTIONS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-transparent border border-grid-line text-white font-mono text-xs focus:outline-none focus:border-white transition-all uppercase tracking-widest placeholder:text-neutral/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredBanks.map((bank) => (
          <div
            key={bank.id}
            className="p-12 border-r border-b border-grid-line group hover:bg-neutral-900/50 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="p-3 border border-grid-line text-neutral group-hover:text-white group-hover:border-white transition-all">
                <Building2 className="w-5 h-5" />
              </div>
              <button className="text-neutral hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="mono-label mb-2 text-neutral">Bank.Entity</div>
            <h3 className="text-xl font-mono font-medium text-white tracking-tighter mb-6">{bank.bankName}</h3>
            <div className="pt-6 border-t border-grid-line text-[10px] font-mono text-neutral group-hover:text-white transition-colors">
              NODE_ID: {bank.id}
            </div>
          </div>
        ))}
        {filteredBanks.length === 0 && (
          <div className="col-span-full py-40 text-center border-b border-grid-line">
            <p className="mono-label">NO INSTITUTIONS REGISTERED</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-pure-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative w-full max-w-md p-12 bg-pure-black border border-grid-line shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-neutral hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mono-label mb-8">Registry_Entry.new</div>
              <h2 className="text-2xl font-mono text-white mb-10 tracking-tighter">BANK REGISTRATION</h2>
              
              <form onSubmit={handleCreateBank} className="space-y-10">
                <div className="border-l-2 border-grid-line pl-6">
                  <label className="block mono-label mb-4">Official Nomenclature</label>
                  <input 
                    type="text"
                    required
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    placeholder="ENTER BANK NAME..."
                    className="w-full bg-transparent border-b border-grid-line py-3 text-white font-mono text-sm focus:outline-none focus:border-white transition-all tracking-wider placeholder:text-neutral/30 uppercase"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary !py-5 font-mono text-xs uppercase tracking-[0.2em]"
                >
                  {loading ? 'EXECUTING...' : 'REGISTER ON PERIMETER'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BankManagement;
