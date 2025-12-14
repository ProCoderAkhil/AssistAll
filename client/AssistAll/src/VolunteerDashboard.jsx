import React, { useEffect, useState } from 'react';
import { MapPin, User, Navigation, Shield, LogOut, Phone, Menu, X, ArrowRight, DollarSign, Clock, BarChart2, Star, ChevronRight, CreditCard, RefreshCw } from 'lucide-react';

const VolunteerDashboard = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  
  // Real Financial Data
  const [financials, setFinancials] = useState({ total: 0, base: 0, tips: 0, jobs: 0 });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // UI States
  const [isOnline, setIsOnline] = useState(false);
  const [view, setView] = useState('map'); // 'map', 'wallet', 'profile'
  const [onlineTime, setOnlineTime] = useState(0);

  // --- 1. FETCH REAL EARNINGS ---
  const updateFinancials = async () => {
      if(!user?._id) return;
      try {
          const res = await fetch(`http://localhost:5000/api/requests/earnings/${user._id}`);
          const data = await res.json();
          setFinancials(data);
      } catch (err) { console.error(err); }
  };

  // --- 2. POLL REQUESTS ---
  const fetchRequests = async () => {
    if (!isOnline) return;
    updateFinancials(); // Update money every time we check for rides

    try {
      const res = await fetch('http://localhost:5000/api/requests');
      const data = await res.json();
      const myActive = data.find(r => r.volunteerId === user._id && r.status !== 'completed');
      setActiveJob(myActive);
      if (!myActive) {
        setRequests(data.filter(r => r.status === 'pending'));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000);
    return () => clearInterval(interval);
  }, [isOnline]);

  useEffect(() => {
    let timer;
    if (isOnline) timer = setInterval(() => setOnlineTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isOnline]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  // --- 3. ACTIONS ---
  const handleAction = async (id, action) => {
    try {
        await fetch(`http://localhost:5000/api/requests/${id}/${action}`, { 
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ volunteerName: user.name, volunteerId: user._id })
        });
        if (action === 'complete') {
            alert("🎉 Job Complete! Waiting for customer tip...");
            setActiveJob(null);
            setTimeout(updateFinancials, 3000); // Check for tip update
        }
        fetchRequests();
    } catch(e) { console.error(e); }
  };

  const handleWithdraw = () => {
      if (financials.total === 0) return alert("Balance is empty.");
      setIsWithdrawing(true);
      setTimeout(() => {
          alert(`₹${financials.total} sent to Bank Account ****1234`);
          setFinancials({ ...financials, total: 0, base: 0, tips: 0 }); // Reset local view
          setIsWithdrawing(false);
      }, 2000);
  };

  // --- VIEW: WALLET (Graphs & Money) ---
  if (view === 'wallet') {
      return (
        <div className="h-screen bg-gray-50 z-50 flex flex-col font-sans animate-in slide-in-from-bottom">
            <div className="p-6 bg-black text-white rounded-b-3xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setView('map')}><X className="text-white"/></button>
                    <span className="font-bold">Earnings</span>
                    <div className="w-6"></div>
                </div>
                <div className="text-center mb-8">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Available Balance</p>
                    <h1 className="text-6xl font-bold">₹{financials.total}</h1>
                </div>
                
                {/* Money Breakdown */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <p className="text-gray-400 text-xs mb-1">Ride Fares</p>
                        <p className="text-xl font-bold text-blue-400">₹{financials.base}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <p className="text-gray-400 text-xs mb-1">Tips</p>
                        <p className="text-xl font-bold text-green-400">₹{financials.tips}</p>
                    </div>
                </div>

                <button 
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || financials.total === 0}
                    className="w-full bg-green-600 py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isWithdrawing ? "Processing..." : "Withdraw to Bank"} <ChevronRight size={20} className="ml-1"/>
                </button>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto">
                <h3 className="font-bold text-gray-800 mb-4">Weekly Report</h3>
                
                {/* Graph: Shows Previous Days (Fake) + Today (Real) */}
                <div className="flex justify-between items-end h-32 mb-8 px-2 border-b border-gray-200 pb-2">
                    {['M','T','W','T','F','S'].map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-full">
                            <div className="w-4 bg-gray-200 rounded-full h-full relative">
                                <div style={{ height: `${Math.random() * 40}%` }} className="absolute bottom-0 w-full bg-gray-300 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-400 font-bold">{day}</span>
                        </div>
                    ))}
                    {/* Today's Bar (Real Data Visualized) */}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-4 bg-gray-200 rounded-full h-full relative">
                            <div style={{ height: financials.total > 0 ? '80%' : '5%' }} className="absolute bottom-0 w-full bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-xs text-black font-bold">TODAY</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3"><Navigation className="text-blue-600" size={20}/></div>
                        <span className="font-bold text-gray-700">Completed Trips</span>
                    </div>
                    <span className="font-bold text-xl">{financials.jobs}</span>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: PROFILE ---
  if (view === 'profile') {
      return (
        <div className="h-screen bg-gray-50 z-50 flex flex-col animate-in slide-in-from-left">
            <div className="bg-white p-6 pb-10 shadow-sm">
                <button onClick={() => setView('map')} className="mb-6"><ArrowRight className="rotate-180"/></button>
                <div className="flex items-center">
                    <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold mr-4">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Shield size={14} className="text-green-500 mr-1"/> Verified Partner
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                    <span className="font-bold text-gray-700">Rating</span>
                    <span className="flex items-center font-bold text-lg">4.9 <Star size={16} className="ml-1 text-yellow-400 fill-current"/></span>
                </div>
                <div className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                    <span className="font-bold text-gray-700">Time Online</span>
                    <span className="font-bold text-lg text-blue-600">{formatTime(onlineTime)}</span>
                </div>
                <button onClick={() => window.location.reload()} className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl mt-10">Log Out</button>
            </div>
        </div>
      );
  }

  // --- VIEW: MAP (OFFLINE) ---
  if (!isOnline) {
      return (
        <div className="h-screen w-full relative bg-slate-900 font-sans">
            <div className="absolute inset-0 bg-slate-900/90 z-10 flex flex-col items-center justify-end pb-20">
                <div className="text-center text-white mb-10">
                    <h1 className="text-3xl font-bold mb-2">You are Offline</h1>
                    <p className="text-gray-400">Go online to receive jobs</p>
                </div>
                <button onClick={() => setIsOnline(true)} className="w-24 h-24 rounded-full bg-blue-600 border-4 border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.5)] flex items-center justify-center text-white font-bold text-xl hover:scale-105 transition">GO</button>
            </div>
        </div>
      );
  }

  // --- VIEW: MAP (ONLINE) ---
  return (
    <div className="h-screen w-full relative font-sans pointer-events-none">
      
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
         <img src="https://media.wired.com/photos/59269cd37034dc5f91becd64/master/pass/GoogleMapTA.jpg" className="w-full h-full object-cover" alt="Map" />
         
         {activeJob && (
             <div className="absolute top-0 left-0 right-0 bg-green-700 p-4 pt-8 pb-4 text-white shadow-lg z-20 flex items-center animate-in slide-in-from-top">
                 <ArrowRight size={40} className="mr-4"/>
                 <div><h2 className="font-bold text-xl">Turn Right</h2><p className="text-green-200">150m • Central Rd</p></div>
             </div>
         )}
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-10 z-20 flex justify-between items-start pointer-events-auto">
        <button onClick={() => setView('wallet')} className="bg-black text-white px-5 py-2 rounded-full shadow-xl flex items-center gap-3 hover:bg-gray-800 transition">
            <span className="font-bold text-lg">₹{financials.total}</span>
            <div className="w-[1px] h-4 bg-gray-600"></div>
            <CreditCard size={16} className="text-green-400"/>
        </button>

        <button onClick={() => setView('profile')} className="bg-white p-3 rounded-full shadow-lg border border-gray-200">
            <User size={20} className="text-gray-700"/>
        </button>
      </div>

      {/* Active Job Card */}
      {activeJob && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-30 p-6 animate-in slide-in-from-bottom pointer-events-auto">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-2xl font-bold text-gray-800">{activeJob.requesterName}</h2>
                      <p className="text-blue-600 font-bold text-sm">{activeJob.type}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-full"><Phone size={24}/></div>
              </div>
              
              {activeJob.status === 'accepted' ? (
                  <button onClick={() => handleAction(activeJob._id, 'pickup')} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg">Slide to Pickup</button>
              ) : (
                  <button onClick={() => handleAction(activeJob._id, 'complete')} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg">Complete Ride</button>
              )}
          </div>
      )}

      {/* Request Cards */}
      {!activeJob && requests.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 z-30 pointer-events-auto space-y-3">
              {requests.map(req => (
                  <div key={req._id} className="bg-black text-white p-5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom">
                      <div className="flex justify-between items-center mb-4">
                          <div className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold uppercase">Opportunity</div>
                          <h2 className="text-2xl font-bold">₹{req.price}</h2>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{req.requesterName}</h3>
                      <p className="text-gray-400 text-sm mb-4">{req.distance} • {req.type}</p>
                      <button onClick={() => handleAction(req._id, 'accept')} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-500">Tap to Accept</button>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;