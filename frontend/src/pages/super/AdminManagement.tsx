import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Search, Building2 } from 'lucide-react';
import axios from '../../api/axios';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    branchId: ''
  });

  const fetchData = async () => {
    try {
      const [adminsRes, branchesRes] = await Promise.all([
        axios.get('/super/admins'),
        axios.get('/super/branches')
      ]);
      setAdmins(adminsRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/super/admins', form);
      setForm({ name: '', email: '', branchId: '' });
      setIsModalOpen(false);
      fetchData();
      alert('AUTHORITY DELEGATED. TEMP_CRED_PRINTED_TO_CONSOLE.');
    } catch (error) {
      console.error('Failed to create admin', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0 border-l border-grid-line min-h-screen">
      <div className="p-12 border-b border-grid-line flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-xl">
          <div className="mono-label mb-4">Personnel / Access_Control</div>
          <h1 className="text-4xl font-mono text-white tracking-tighter uppercase">Administrators</h1>
          <p className="text-neutral mt-4 font-mono text-xs leading-relaxed">
            Delegated authorities with granular control over institutional data perimeters.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          Register Authority
        </button>
      </div>

      <div className="p-12 border-b border-grid-line bg-neutral-900/10">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral" />
          <input 
            type="text"
            placeholder="FILTER PERSONNEL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-transparent border border-grid-line text-white font-mono text-xs focus:outline-none focus:border-white transition-all uppercase tracking-widest placeholder:text-neutral/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-b border-grid-line">
          <thead>
            <tr className="border-b border-grid-line bg-neutral-900/20">
              <th className="px-12 py-6 mono-label text-left text-neutral">Administrator.Entity</th>
              <th className="px-12 py-6 mono-label text-left text-neutral">Assigned_Node</th>
              <th className="px-12 py-6 mono-label text-left text-neutral">Auth_Level</th>
              <th className="px-12 py-6 mono-label text-right text-neutral">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grid-line font-mono">
            {filteredAdmins.map((admin) => (
              <tr
                key={admin.id}
                className="hover:bg-neutral-900/30 transition-colors group"
              >
                <td className="px-12 py-8">
                  <div className="flex items-center gap-4">
                    <div className="p-2 border border-grid-line text-neutral group-hover:text-white transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white text-sm uppercase tracking-wider">{admin.name}</div>
                      <div className="text-neutral text-[10px] mt-1">{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-8">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral group-hover:text-white transition-colors">
                    <Building2 className="w-3.5 h-3.5" />
                    {admin.bankName}
                  </div>
                </td>
                <td className="px-12 py-8">
                  <span className="text-[10px] text-white border border-white/20 px-2 py-0.5 tracking-[0.2em]">
                    {admin.role}
                  </span>
                </td>
                <td className="px-12 py-8 text-right">
                  <button className="text-[10px] text-neutral hover:text-white underline underline-offset-4 tracking-[0.2em] uppercase transition-colors">
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAdmins.length === 0 && (
          <div className="py-40 text-center border-b border-grid-line">
            <p className="mono-label">NO PERSONNEL DETECTED</p>
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-lg p-12 bg-pure-black border border-grid-line shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-neutral hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mono-label mb-8">Access_Provisioning.new</div>
              <h2 className="text-3xl font-mono text-white mb-2 tracking-tighter uppercase">Register Admin</h2>
              <p className="font-mono text-[10px] text-neutral mb-12 uppercase tracking-widest leading-relaxed">
                Assigning administrative authority requires perimeter validation. 
                <br />Temporary credentials will be generated post-provisioning.
              </p>
              
              <form onSubmit={handleCreateAdmin} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="border-l border-grid-line pl-6">
                    <label className="block mono-label mb-4">Legal Name</label>
                    <input 
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="NAME..."
                      className="w-full bg-transparent border-b border-grid-line py-2 text-white font-mono text-sm focus:outline-none focus:border-white transition-all uppercase placeholder:text-neutral/20"
                    />
                  </div>
                  <div className="border-l border-grid-line pl-6">
                    <label className="block mono-label mb-4">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="EMAIL..."
                      className="w-full bg-transparent border-b border-grid-line py-2 text-white font-mono text-sm focus:outline-none focus:border-white transition-all uppercase placeholder:text-neutral/20"
                    />
                  </div>
                </div>

                <div className="border-l border-grid-line pl-6">
                  <label className="block mono-label mb-4">Branch_Node</label>
                  <select
                    required
                    value={form.branchId}
                    onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                    className="w-full bg-transparent border-b border-grid-line py-2 text-white font-mono text-sm focus:outline-none focus:border-white transition-all uppercase appearance-none"
                  >
                    <option value="" className="bg-pure-black">SELECT BRANCH NODE...</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id} className="bg-pure-black text-white">
                        {branch.branchName.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary !py-5 font-mono text-xs uppercase tracking-[0.3em]"
                >
                  {loading ? 'PROVISIONING...' : 'AUTHORIZE PERSONNEL'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManagement;
