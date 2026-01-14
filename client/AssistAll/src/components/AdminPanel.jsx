import React, { useState, useEffect } from 'react';
import { 
  Shield, Check, X, LogOut, Users, FileText, Search, LayoutDashboard, 
  Bell, Activity, Lock, Eye, AlertTriangle, MapPin, Menu 
} from 'lucide-react';

const DEPLOYED_API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://assistall-server.onrender.com';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVol, setSelectedVol] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, activeRides: 0, pendingVerifications: 0, sosAlerts: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchPendingVolunteers();
    // Simulate fetching stats
    setStats({ totalUsers: 1240, activeRides: 45, pendingVerifications: 12, sosAlerts: 3 });
  }, []);

  const fetchPendingVolunteers = async () => {
    try {
        const res = await fetch(`${DEPLOYED_API_URL}/api/auth/pending-volunteers`); 
        if (res.ok) {
            const data = await res.json();
            setVolunteers(data);
            setStats(prev => ({ ...prev, pendingVerifications: data.length }));
        }
    } catch (e) { console.error(e); }
  };

  const handleDecision = async (id, status) => {
      try {
          await fetch(`${DEPLOYED_API_URL}/api/auth/verify/${id}`, {
              method: 'PUT',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status })
          });
          setVolunteers(prev => prev.filter(v => v._id !== id));
          setSelectedVol(null);
          alert(`Volunteer ${status === 'approved' ? 'Verified' : 'Rejected'}`);
          fetchPendingVolunteers(); // Refresh counts
      } catch (e) { alert("Action Failed"); }
  };

  // --- SUB-COMPONENTS ---

  const SidebarItem = ({ id, icon: Icon, label, count }) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeTab === id ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
      >
          <Icon size={20} />
          <span className="font-bold text-sm flex-1 text-left">{label}</span>
          {count > 0 && <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{count}</span>}
      </button>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
      <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition">
          <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110 ${color}`}>
              <Icon size={64} />
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color.replace('text-', 'bg-').replace('500', '500/20')} ${color}`}>
              <Icon size={24} />
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
          <h3 className="text-3xl font-black text-white mt-1">{value}</h3>
      </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-[#0a0a0a] border-r border-white/10 flex flex-col transition-all duration-300 z-20`}>
            <div className="p-6 flex items-center justify-between">
                {sidebarOpen && (
                    <div className="flex items-center gap-2 text-green-500 animate-in fade-in">
                        <Shield size={28} strokeWidth={2.5}/> 
                        <span className="font-black text-xl tracking-tight text-white">Admin<span className="text-green-500">.</span></span>
                    </div>
                )}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                    <Menu size={20}/>
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                <SidebarItem id="dashboard" icon={LayoutDashboard} label={sidebarOpen ? "Overview" : ""} />
                <SidebarItem id="verification" icon={Check} label={sidebarOpen ? "Verification" : ""} count={volunteers.length} />
                <SidebarItem id="users" icon={Users} label={sidebarOpen ? "All Users" : ""} />
                <SidebarItem id="audit" icon={Activity} label={sidebarOpen ? "Audit Logs" : ""} />
                <SidebarItem id="alerts" icon={AlertTriangle} label={sidebarOpen ? "SOS Alerts" : ""} count={stats.sosAlerts} />
            </nav>

            <div className="p-4 border-t border-white/10">
                <button onClick={onLogout} className={`flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-900/10 transition ${!sidebarOpen && 'justify-center'}`}>
                    <LogOut size={20}/>
                    {sidebarOpen && <span className="font-bold text-sm">Logout</span>}
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 h-screen overflow-y-auto bg-[#050505] p-8">
            
            {/* TOP HEADER */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, Administrator.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                        <input type="text" placeholder="Search..." className="bg-[#1a1a1a] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:border-green-500 outline-none w-64 transition"/>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition relative">
                        <Bell size={18}/>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 border-2 border-[#050505]"></div>
                </div>
            </header>

            {/* --- DASHBOARD VIEW --- */}
            {activeTab === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard icon={Users} label="Total Users" value="1,240" color="text-blue-500" />
                        <StatCard icon={Check} label="Active Volunteers" value="86" color="text-green-500" />
                        <StatCard icon={Lock} label="Pending Review" value={volunteers.length} color="text-yellow-500" />
                        <StatCard icon={AlertTriangle} label="SOS Triggers" value="3" color="text-red-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-[#121212] rounded-[32px] border border-white/5 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Live Activity</h3>
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-green-500 font-bold uppercase tracking-widest">Realtime</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-blue-500"><MapPin size={18}/></div>
                                            <div>
                                                <p className="font-bold text-sm text-white">New Ride Request</p>
                                                <p className="text-xs text-gray-500">Kottayam Central → Medical College</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 font-mono">2m ago</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-900/20 to-[#121212] rounded-[32px] border border-green-500/20 p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Broadcast</h3>
                                <p className="text-sm text-gray-400 mb-6">Send a push notification to all volunteers in a specific area.</p>
                                <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">Create Alert</button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-[50px]"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VERIFICATION VIEW --- */}
            {activeTab === 'verification' && (
                <div className="flex gap-8 h-[calc(100vh-140px)] animate-in fade-in">
                    {/* List */}
                    <div className="w-1/3 bg-[#121212] rounded-[24px] border border-white/5 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-lg font-bold">Pending Queue</h2>
                            <p className="text-xs text-gray-500">{volunteers.length} volunteers waiting</p>
                        </div>
                        <div className="overflow-y-auto flex-1 p-4 space-y-2">
                            {volunteers.map(v => (
                                <div 
                                    key={v._id} 
                                    onClick={() => setSelectedVol(v)}
                                    className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center ${selectedVol?._id === v._id ? 'bg-blue-600 text-white border-blue-500' : 'bg-[#1a1a1a] border-white/5 text-gray-400 hover:bg-[#222]'}`}
                                >
                                    <div>
                                        <h4 className={`font-bold text-sm ${selectedVol?._id === v._id ? 'text-white' : 'text-gray-200'}`}>{v.name}</h4>
                                        <p className={`text-[10px] ${selectedVol?._id === v._id ? 'text-blue-200' : 'text-gray-600'}`}>{v.email}</p>
                                    </div>
                                    <ChevronRight size={16} className={selectedVol?._id === v._id ? 'text-white' : 'text-gray-600'}/>
                                </div>
                            ))}
                            {volunteers.length === 0 && <div className="p-8 text-center text-gray-600 text-sm">All caught up! 🎉</div>}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 bg-[#121212] rounded-[24px] border border-white/5 p-8 relative flex flex-col">
                        {selectedVol ? (
                            <>
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h1 className="text-3xl font-black">{selectedVol.name}</h1>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{selectedVol.serviceSector}</span>
                                            <span className="bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">ID: {selectedVol._id.slice(-4)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Applied On</p>
                                        <p className="font-mono text-sm text-white">{new Date(selectedVol.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8 flex-1 overflow-y-auto">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-blue-500 uppercase">Govt ID Proof</p>
                                        <div className="w-full h-64 bg-black rounded-xl border border-white/10 flex items-center justify-center text-gray-600 relative overflow-hidden group">
                                            <span className="text-xs z-10 font-mono">{selectedVol.govtId}</span>
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold">View Full</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-green-500 uppercase">Live Selfie Capture</p>
                                        <div className="w-full h-64 bg-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                                            {selectedVol.selfieImage ? (
                                                <img src={selectedVol.selfieImage} className="w-full h-full object-cover" alt="Selfie"/>
                                            ) : (
                                                <span className="text-xs text-gray-600">No Image</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <button onClick={() => handleDecision(selectedVol._id, 'rejected')} className="py-4 rounded-xl border border-red-900/50 text-red-500 font-bold hover:bg-red-900/10 transition flex items-center justify-center gap-2 uppercase text-sm tracking-widest"><X size={18}/> Reject Application</button>
                                    <button onClick={() => handleDecision(selectedVol._id, 'approved')} className="py-4 rounded-xl bg-green-600 text-black font-bold hover:bg-green-500 transition flex items-center justify-center gap-2 uppercase text-sm tracking-widest shadow-lg shadow-green-900/20"><Check size={18}/> Approve Volunteer</button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4"><Users size={24}/></div>
                                <p>Select a volunteer to review details.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- PLACEHOLDER FOR OTHER TABS --- */}
            {['users', 'audit', 'alerts'].includes(activeTab) && (
                <div className="h-96 flex flex-col items-center justify-center text-gray-600 bg-[#121212] rounded-[32px] border border-white/5">
                    <Lock size={48} className="mb-4 opacity-50"/>
                    <h3 className="text-xl font-bold text-white mb-1">Restricted Access</h3>
                    <p className="text-sm">This module is currently locked or under development.</p>
                </div>
            )}

        </main>
    </div>
  );
};

// Helper Icon for chevron (missing in import list sometimes)
const ChevronRight = ({size, className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export default AdminPanel;