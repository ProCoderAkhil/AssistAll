import React, { useState, useEffect } from 'react';
import { Menu, Bell, Shield, MapPin, Search, ArrowLeft, Phone, X, Check } from 'lucide-react';
import BottomNav from './components/BottomNav';
import MapBackground from './components/MapBackground';
import ServiceSelector from './components/ServiceSelector';
import FindingVolunteer from './components/FindingVolunteer';
import VolunteerFound from './components/VolunteerFound';
import RideInProgress from './components/RideInProgress';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import VolunteerDashboard from './components/VolunteerDashboard';
import ActivityHistory from './components/ActivityHistory';
import VolunteerSignup from './components/VolunteerSignup';
import UserSignup from './components/UserSignup'; 
import AdminPanel from './components/AdminPanel';
import RateAndTip from './components/RateAndTip';
import Toast from './components/Toast';
import LandingPage from './components/LandingPage'; 
import AppLoader from './components/AppLoader'; 
import SOSModal from './components/SOSModal'; 

// SMART URL
const DEPLOYED_API_URL = "https://assistall-server.onrender";

// MOCK NOTIFICATIONS FOR V15
const initialNotifs = [
    { id: 1, title: "Ride Completed", msg: "Your trip to Cyber Park was successful.", time: "10m ago", type: 'success' },
    { id: 2, title: "Promo Applied", msg: "You saved ₹50 on your last ride.", time: "1h ago", type: 'info' }
];

function App() {
  const [user, setUser] = useState(null); 
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState('home'); 
  const [step, setStep] = useState('selecting'); 
  const [showVolunteerRegister, setShowVolunteerRegister] = useState(false); 
  const [showUserRegister, setShowUserRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  
  // V15 FEATURES
  const [showSOS, setShowSOS] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifs);

  const [activeRequestId, setActiveRequestId] = useState(null);
  const [acceptedRequestData, setAcceptedRequestData] = useState(null);
  const [toast, setToast] = useState(null); 

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 1500); return () => clearTimeout(timer); }, []);

  // REAL-TIME STATUS
  useEffect(() => {
    let interval;
    if (activeRequestId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${DEPLOYED_API_URL}/api/requests`); 
          if (!res.ok) return;
          const data = await res.json();
          const myRequest = data.find(r => r._id === activeRequestId);
          
          if (myRequest) {
             if (myRequest.status === 'accepted' && step !== 'found') {
                setAcceptedRequestData(myRequest); setStep('found'); showToast(`Volunteer Found!`, 'success');
             } else if (myRequest.status === 'in_progress' && step !== 'in_progress') {
               setStep('in_progress'); showToast("Ride Started", 'info');
             } else if (myRequest.status === 'completed' && step !== 'rating') {
               setStep('rating'); showToast("Ride Completed", 'success');
             }
          }
        } catch (err) { }
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [activeRequestId, step]);

  const triggerSOS = () => setShowSOS(true);
  const confirmSOS = () => { setShowSOS(false); showToast("🚨 EMERGENCY ALERT SENT!", "error"); };
  const handleRideFinished = () => { setStep('selecting'); setActiveRequestId(null); setAcceptedRequestData(null); };

  const handleFindVolunteer = async (bookingDetails) => { 
    if (!bookingDetails.dropOff) { showToast("Please enter a destination", "error"); return; }
    setStep('searching'); 
    try {
      const requestData = {
        requesterName: user.name, requesterId: user._id,
        type: bookingDetails.type, dropOffLocation: bookingDetails.dropOff,
        scheduledTime: bookingDetails.time, location: { lat: 9.5916, lng: 76.5222 } 
      };
      const res = await fetch(`${DEPLOYED_API_URL}/api/requests`, {
        method: 'POST', headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const data = await res.json();
      setActiveRequestId(data._id);
      showToast("Searching for volunteers...", "info");
    } catch (err) { showToast("Network Error", "error"); setStep('selecting'); }
  };

  // --- V15 NOTIFICATION OVERLAY ---
  const NotificationOverlay = () => (
      <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-md animate-in slide-in-from-right duration-300">
          <div className="p-6 pt-12">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-white">Notifications</h2>
                  <button onClick={() => setShowNotifs(false)} className="p-2 bg-[#222] rounded-full text-white"><X size={20}/></button>
              </div>
              <div className="space-y-3">
                  {notifications.length === 0 ? <p className="text-neutral-500 text-center">No new alerts</p> : notifications.map(n => (
                      <div key={n.id} className="bg-[#121212] p-4 rounded-2xl border border-white/10 flex gap-4">
                          <div className={`mt-1 w-2 h-2 rounded-full ${n.type==='success'?'bg-green-500':'bg-blue-500'}`}></div>
                          <div>
                              <h4 className="font-bold text-white">{n.title}</h4>
                              <p className="text-sm text-neutral-400">{n.msg}</p>
                              <p className="text-[10px] text-neutral-600 mt-2 uppercase font-bold">{n.time}</p>
                          </div>
                      </div>
                  ))}
                  {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])} className="w-full py-3 mt-4 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition">Clear All</button>
                  )}
              </div>
          </div>
      </div>
  );

  // --- ROUTING ---
  if (isLoading) return <AppLoader />;
  if (showLanding) return <LandingPage onGetStarted={() => setShowLanding(false)} onVolunteerJoin={() => { setShowLanding(false); setShowVolunteerRegister(true); }} />;
  if (showVolunteerRegister) return <VolunteerSignup onRegister={(u) => { setUser(u); showToast("Welcome Partner!"); }} onBack={() => {setShowVolunteerRegister(false); setShowLanding(true);}} />;
  if (showUserRegister) return <UserSignup onRegister={(u) => { setUser(u); showToast("Welcome!"); }} onBack={() => setShowUserRegister(false)} />;
  if (!user) return <Login onLogin={(u) => { setUser(u); showToast(`Welcome ${u.name}`); }} onVolunteerClick={() => setShowVolunteerRegister(true)} onSignupClick={() => setShowUserRegister(true)} onBack={() => setShowLanding(true)} />;
  if (user.email === 'admin@assistall.com') return <AdminPanel onLogout={() => setUser(null)} />;
  if (user.role === 'volunteer') return <VolunteerDashboard user={user} globalToast={showToast} />;
  
  if (currentPage === 'profile') return <UserProfile user={user} onLogout={() => { setUser(null); setShowLanding(true); }} onBack={() => setCurrentPage('home')} onSwitchToVolunteer={() => {}} />;
  
  // V15 HISTORY VIEW
  if (currentPage === 'activity') return <div className="h-screen w-full bg-[#050505] text-white flex flex-col"><ActivityHistory user={user} onBack={() => setCurrentPage('home')}/><BottomNav activeTab="activity" onHomeClick={() => setCurrentPage('home')} onProfileClick={() => setCurrentPage('profile')} onActivityClick={() => setCurrentPage('activity')} onSOSClick={triggerSOS} /></div>;

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#050505] font-sans text-white">
      {/* 1. Layers */}
      <div className="absolute inset-0 z-0"><MapBackground activeRequest={acceptedRequestData} /></div>
      <SOSModal isOpen={showSOS} onClose={() => setShowSOS(false)} onConfirm={confirmSOS} />
      {showNotifs && <NotificationOverlay />}

      {/* 2. Dynamic Header V15 */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-10 z-20 flex justify-between items-start pointer-events-none">
          <button onClick={() => setCurrentPage('profile')} className="pointer-events-auto w-10 h-10 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 text-white shadow-xl active:scale-90 transition"><Menu size={20}/></button>
          
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500">
             {step === 'selecting' && <><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div><span className="text-xs font-bold text-white uppercase tracking-wider">Live in Kottayam</span></>}
             {step === 'searching' && <><div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div><span className="text-xs font-bold text-white uppercase tracking-wider">Connecting...</span></>}
             {step === 'found' && <><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span className="text-xs font-bold text-white uppercase tracking-wider">Driver Found</span></>}
             {step === 'in_progress' && <><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div><span className="text-xs font-bold text-white uppercase tracking-wider">On Ride</span></>}
          </div>

          <div className="flex gap-3 pointer-events-auto">
              <button onClick={() => setShowNotifs(true)} className="w-10 h-10 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 text-white shadow-xl active:scale-90 transition relative">
                  <Bell size={18}/>
                  {notifications.length > 0 && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-black rounded-full"></div>}
              </button>
              <button onClick={triggerSOS} className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-2 border-red-500 shadow-lg text-white animate-pulse active:scale-90 transition"><Shield size={18}/></button>
          </div>
      </div>

      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[5000] w-full max-w-sm px-4">{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</div>

      {/* 3. Main Content */}
      {step === 'selecting' && <ServiceSelector onClose={() => {}} onFindClick={handleFindVolunteer} user={user} />}
      {step === 'searching' && <FindingVolunteer requestId={activeRequestId} onCancel={() => setStep('selecting')} />}
      {step === 'found' && <VolunteerFound requestData={acceptedRequestData} onReset={() => setStep('selecting')} />}
      {step === 'in_progress' && <RideInProgress requestData={acceptedRequestData} />}
      {step === 'rating' && <RateAndTip requestData={acceptedRequestData} onSkip={handleRideFinished} onSubmit={handleRideFinished} showToast={showToast} />}

      {/* 4. Navigation */}
      {step !== 'searching' && step !== 'rating' && <BottomNav activeTab="home" onHomeClick={() => setCurrentPage('home')} onProfileClick={() => setCurrentPage('profile')} onActivityClick={() => setCurrentPage('activity')} onSOSClick={triggerSOS} />}
    </div>
  );
}

export default App;