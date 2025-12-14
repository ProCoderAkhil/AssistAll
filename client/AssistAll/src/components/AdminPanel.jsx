import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Car, Settings, LogOut, 
  CreditCard, Shield, Activity, Search, Bell, Menu, 
  Server, Database, Cpu, Zap, Map as MapIcon, 
  CheckCircle, XCircle, AlertTriangle, MoreVertical, 
  Filter, Download, Trash2, Eye, RefreshCw, ChevronRight, Lock, TrendingUp, Key, Power
} from 'lucide-react';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ volunteers: 0, users: 0, rides: 0, earnings: 0, recent: [] });
  const [volunteers, setVolunteers] = useState([]);
  const [allRides, setAllRides] = useState([]);
  const [systemHealth, setSystemHealth] = useState({ cpu: 12, ram: 34, latency: 24, uptime: '99.99%' });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [godMode, setGodMode] = useState(false); 
  const [generatedCode, setGeneratedCode] = useState("------"); // Initialize with placeholder

  const DEPLOYED_API_URL = `http://${window.location.hostname}:5000`;

  const fetchData = async () => {
    try {
        const resStats = await fetch(`${DEPLOYED_API_URL}/api/admin/stats`);
        if(resStats.ok) setStats(await resStats.json());

        if (activeTab === 'volunteers') {
            const resVol = await fetch(`${DEPLOYED_API_URL}/api/admin/volunteers`);
            if(resVol.ok) setVolunteers(await resVol.json());
        }
        if (activeTab === 'rides') {
            const resRides = await fetch(`${DEPLOYED_API_URL}/api/admin/rides`);
            if(resRides.ok) setAllRides(await resRides.json());
        }
    } catch (error) { console.error("Data Sync Error"); }
  };

  useEffect(() => { 
      fetchData(); 
      const interval = setInterval(() => {
          setSystemHealth(prev => ({
              cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 10 - 5))),
              ram: Math.min(100, Math.max(20, prev.ram + (Math.random() * 5 - 2))),
              latency: Math.floor(Math.random() * (50 - 20) + 20),
              uptime: prev.uptime
          }));
      }, 1500);
      return () => clearInterval(interval);
  }, [activeTab]);

  const generateCode = async () => {
    try {
        const res = await fetch(`${DEPLOYED_API_URL}/api/admin/generate-code`, { method: 'POST' });
        const data = await res.json();
        setGeneratedCode(data.code || "ERROR");
    } catch(e) { alert("Error generating code"); }
  };

  const toggleVerification = async (userId) => {
      try {
          const res = await fetch(`${DEPLOYED_API_URL}/api/admin/verify/${userId}`, { method: 'PUT' });
          if (res.ok) {
              setVolunteers(prev => prev.map(v => v._id === userId ? { ...v, isVerified: !v.isVerified } : v));
          }
      } catch(e) { alert("Update failed"); }
  };

  const handleGodAction = (action) => {
      if(!godMode) return alert("Enable God Mode in Settings first.");
      if(confirm(`⚠️ GOD MODE: Are you sure you want to ${action}?`)) alert(`${action} Executed.`);
  };

  // --- VIEWS ---

  const StatCard = ({ label, value, icon: Icon, color, trend }) => (
      <div className="bg-neutral-900/50 backdrop-blur-md p-6 rounded-2xl border border-neutral-800 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300">
          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 bg-${color}-500 group-hover:scale-125 transition-transform duration-500`}></div>
          <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 shadow-[0_0_15px_rgba(0,0,0,0.3)]`}><Icon size={24}/></div>
              <span className="text-xs font-bold text-green-500 flex items-center bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">+{trend}% <TrendingUp size={12} className="ml-1"/></span>
          </div>
          <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{value}</h3>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">{label}</p>
      </div>
  );

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Revenue" value={`₹${stats?.earnings || 0}`} icon={CreditCard} color="green" trend="12.5" />
            <StatCard label="Total Rides" value={stats?.rides || 0} icon={Car} color="blue" trend="8.2" />
            <StatCard label="Volunteers" value={stats?.volunteers || 0} icon={Shield} color="orange" trend="5.1" />
            <StatCard label="Users" value={stats?.users || 0} icon={Users} color="purple" trend="22.4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-3xl border border-neutral-800 col-span-1 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold flex items-center"><Activity className="mr-2 text-blue-500"/> System Telemetry</h3>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-green-500 text-xs font-bold">ONLINE</span></div>
                </div>
                <div className="space-y-6">
                    <div><div className="flex justify-between text-xs font-bold uppercase text-neutral-500 mb-2"><span>CPU Load</span><span className="text-white">{systemHealth.cpu.toFixed(0)}%</span></div><div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${systemHealth.cpu}%` }}></div></div></div>
                    <div><div className="flex justify-between text-xs font-bold uppercase text-neutral-500 mb-2"><span>Memory Usage</span><span className="text-white">{systemHealth.ram.toFixed(0)}%</span></div><div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${systemHealth.ram}%` }}></div></div></div>
                    <div><div className="flex justify-between text-xs font-bold uppercase text-neutral-500 mb-2"><span>API Latency</span><span className="text-green-400">{systemHealth.latency}ms</span></div><div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(systemHealth.latency / 100) * 100}%` }}></div></div></div>
                </div>
            </div>

            <div className="bg-black/40 rounded-3xl border border-neutral-800 col-span-2 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                    <h3 className="text-white font-bold flex items-center"><Zap className="mr-2 text-yellow-500"/> Global Activity Feed</h3>
                    <button className="text-xs font-bold text-neutral-400 hover:text-white flex items-center"><RefreshCw size={12} className="mr-1"/> Live</button>
                </div>
                <div className="p-0 overflow-y-auto max-h-[320px]">
                    <table className="w-full text-left">
                        <thead className="bg-black text-neutral-500 text-[10px] uppercase font-bold sticky top-0 z-10"><tr><th className="p-4 bg-black">Event Type</th><th className="p-4 bg-black">User / ID</th><th className="p-4 bg-black">Status</th><th className="p-4 text-right bg-black">Time</th></tr></thead>
                        <tbody className="divide-y divide-neutral-800">
                            {stats?.recent?.map(req => (
                                <tr key={req._id} className="hover:bg-white/5 transition duration-150 group">
                                    <td className="p-4"><div className="flex items-center"><div className={`p-1.5 rounded-lg mr-3 ${req.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{req.status === 'completed' ? <CheckCircle size={14}/> : <Clock size={14}/>}</div><span className="text-neutral-200 text-sm font-medium">{req.type} Request</span></div></td>
                                    <td className="p-4"><span className="text-neutral-400 text-sm">{req.requesterName}</span><br/><span className="text-[10px] text-neutral-600 font-mono">#{req._id.slice(-6)}</span></td>
                                    <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${req.status === 'completed' ? 'border-green-900 text-green-500 bg-green-900/20' : 'border-blue-900 text-blue-500 bg-blue-900/20'}`}>{req.status}</span></td>
                                    <td className="p-4 text-right text-neutral-500 text-xs font-mono">{new Date(req.createdAt).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );

  const VolunteersView = () => (
    <div className="bg-neutral-900 rounded-3xl shadow-xl border border-neutral-800 overflow-hidden animate-in fade-in">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/80 backdrop-blur"><div><h3 className="font-bold text-lg text-white">Volunteer Database</h3><p className="text-xs text-neutral-500">Manage verification and access.</p></div></div>
        <table className="w-full text-left"><thead className="bg-black text-neutral-400 text-xs uppercase font-bold"><tr><th className="p-4">Profile</th><th className="p-4">Contact</th><th className="p-4">Verification</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-neutral-800">{volunteers.map(vol => (<tr key={vol._id} className="hover:bg-white/5 transition group"><td className="p-4 font-bold text-white flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-full flex items-center justify-center text-sm font-bold border border-neutral-700">{vol.name.charAt(0)}</div><div><p>{vol.name}</p><p className="text-[10px] font-normal text-neutral-500 font-mono">ID: {vol.govtId || 'N/A'}</p></div></td><td className="p-4 text-neutral-400 text-sm">{vol.email}</td><td className="p-4">{vol.isVerified ? <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold bg-green-900/20 px-2 py-1 rounded w-fit border border-green-900/50"><CheckCircle size={12}/> Verified</span> : <span className="flex items-center gap-1.5 text-yellow-500 text-xs font-bold bg-yellow-900/20 px-2 py-1 rounded w-fit border border-yellow-900/50"><Clock size={12}/> Pending</span>}</td><td className="p-4 text-right flex justify-end gap-2"><button onClick={() => toggleVerification(vol._id)} className={`p-2 rounded-lg transition ${vol.isVerified ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}>{vol.isVerified ? <XCircle size={18}/> : <CheckCircle size={18}/>}</button><button onClick={() => handleGodAction('Ban User')} className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"><MoreVertical size={18}/></button></td></tr>))}</tbody></table>
    </div>
  );

  // FIX: Robust Settings View (Prevents White Screen)
  const SettingsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right">
        {/* Access Codes */}
        <div className="bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center"><Key className="mr-3 text-blue-500"/> Access Control</h3>
            <div className="bg-black p-8 rounded-2xl border-2 border-dashed border-neutral-700 text-center mb-6">
                <p className="text-xs font-bold text-neutral-500 uppercase mb-2 tracking-[0.2em]">ACTIVE OTP CODE</p>
                <div className="text-6xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    {generatedCode || "------"}
                </div>
            </div>
            <button onClick={generateCode} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"><RefreshCw size={20}/> Generate New Code</button>
        </div>

        {/* God Mode Panel */}
        <div className="bg-neutral-900 p-8 rounded-3xl shadow-lg border border-neutral-800 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white flex items-center"><Shield className="mr-3 text-red-500"/> God Mode</h3>
                 <div onClick={() => setGodMode(!godMode)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${godMode ? 'bg-red-600' : 'bg-neutral-700'}`}>
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${godMode ? 'left-7' : 'left-1'}`}></div>
                 </div>
             </div>
             
             <div className={`space-y-3 transition-opacity duration-300 ${godMode ? 'opacity-100 pointer-events-auto' : 'opacity-30 pointer-events-none'}`}>
                 <button onClick={() => handleGodAction('Reset Database')} className="w-full p-4 bg-red-900/20 border border-red-900/50 text-red-500 rounded-xl font-bold flex items-center justify-between hover:bg-red-900/30 transition"><span>Reset System Database</span><AlertTriangle size={18}/></button>
                 <button onClick={() => handleGodAction('Force Stop Rides')} className="w-full p-4 bg-neutral-800 border border-neutral-700 text-white rounded-xl font-bold flex items-center justify-between hover:bg-neutral-700 transition"><span>Emergency Stop All Rides</span><Power size={18}/></button>
             </div>
             {!godMode && <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center"><div className="bg-black px-4 py-2 rounded-lg border border-neutral-700 text-xs font-bold text-neutral-400 flex items-center"><Lock size={12} className="mr-2"/> LOCKED</div></div>}
        </div>
    </div>
  );

  const RidesView = () => (<div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden"><table className="w-full text-left text-neutral-300"><thead className="bg-black text-neutral-500 text-xs uppercase font-bold"><tr><th className="p-4">User</th><th className="p-4">Vol</th><th className="p-4">Type</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-neutral-800">{allRides.map(r => (<tr key={r._id}><td className="p-4">{r.requesterName}</td><td className="p-4">{r.volunteerName}</td><td className="p-4">{r.type}</td><td className="p-4 font-bold">{r.status}</td></tr>))}</tbody></table></div>);

  return (
    <div className="min-h-screen bg-black font-sans flex text-gray-100 selection:bg-blue-500 selection:text-white">
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-neutral-900 border-r border-neutral-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full p-6">
            <div className="flex items-center mb-10 px-2"><div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-900/40"><Shield size={24} className="text-white"/></div><div><h1 className="text-xl font-black text-white tracking-tight">AssistAll</h1><p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Admin Pro v10</p></div></div>
            <nav className="flex-grow space-y-1">
                <p className="px-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 mt-4">Main Menu</p>
                {['dashboard', 'volunteers', 'rides', 'settings'].map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`w-full flex items-center p-3 rounded-xl font-medium transition-all duration-200 capitalize ${activeTab===t?'bg-blue-600 text-white shadow-lg shadow-blue-900/20':'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}><LayoutDashboard size={20} className="mr-3"/> {t}</button>))}
            </nav>
            <button onClick={onLogout} className="flex items-center text-red-500 font-bold mt-auto p-4 hover:bg-red-900/10 rounded-xl transition border border-transparent hover:border-red-900/30 group"><LogOut size={20} className="mr-3 group-hover:-translate-x-1 transition-transform"/> Sign Out</button>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 p-6 flex justify-between items-center z-20">
              <div className="flex items-center"><button className="lg:hidden mr-4 text-neutral-400" onClick={() => setSidebarOpen(!isSidebarOpen)}><Menu/></button><h1 className="text-2xl font-bold text-white capitalize tracking-tight">{activeTab}</h1></div>
              <div className="flex items-center gap-4"><div className="hidden md:flex items-center bg-black px-4 py-2 rounded-full border border-neutral-800 text-xs font-bold text-neutral-400 gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> SYSTEM ONLINE</div><div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-neutral-800">A</div></div>
          </header>
          <main className="flex-1 overflow-y-auto p-8 bg-black">{activeTab==='dashboard'&&<DashboardView/>}{activeTab==='volunteers'&&<VolunteersView/>}{activeTab==='settings'&&<SettingsView/>}{activeTab==='rides'&&<RidesView/>}</main>
      </div>
    </div>
  );
};

export default AdminPanel;