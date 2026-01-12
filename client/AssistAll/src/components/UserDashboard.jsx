import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Navigation, Phone, Search, User, Shield, Menu, Car, Heart, Zap, 
  ShoppingBag, ArrowLeft, ArrowRight, Trash2, CreditCard, Star, CheckCircle, 
  Clock, Map, Bell, X, MessageSquare, AlertTriangle, Loader2, ChevronUp, Share2, ShieldCheck, Banknote
} from 'lucide-react';

// --- CONFIG ---
const DEPLOYED_API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://assistall-server.onrender.com';

// ==========================================
// 1. COMPONENT: FindingVolunteer (Your Code)
// ==========================================
const FindingVolunteer = ({ onCancel }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[2000] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-8 pb-12 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col items-center justify-center text-center mt-4">
        {/* Radar Animation */}
        <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-64 h-64 bg-green-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute w-48 h-48 bg-green-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="bg-black p-6 rounded-full z-10 shadow-2xl relative">
                <Loader2 className="text-white animate-spin" size={40} />
            </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">Finding Volunteers...</h3>
        <p className="text-gray-500 text-sm max-w-xs mb-8">
          Broadcasting your request to nearby verified helpers in Kottayam.
        </p>

        <button onClick={onCancel} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition">
            <X size={24}/>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPONENT: RideInProgress (Your Code)
// ==========================================
const RideInProgress = ({ requestData }) => {
  const [isExpanded, setIsExpanded] = useState(true); // "Movable" State

  if (!requestData) return <div className="absolute bottom-24 left-0 right-0 text-center text-xs font-bold text-white animate-pulse">Syncing GPS...</div>;

  return (
    <div className={`absolute left-0 right-0 bg-[#121212] rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50 border-t border-white/10 transition-all duration-500 ease-in-out ${isExpanded ? 'bottom-0 pb-24 h-[60vh]' : 'bottom-0 h-[180px]'}`}>
      
      {/* --- DRAG HANDLE --- */}
      <div className="w-full h-8 flex items-center justify-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mb-1"></div>
      </div>

      <div className="px-6">
          {/* Header Status */}
          <div className="flex justify-between items-center mb-6">
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <p className="text-green-500 text-xs font-bold uppercase tracking-widest">ON TRIP</p>
                  </div>
                  <h2 className="text-3xl font-black text-white">{isExpanded ? "Your Ride" : requestData.volunteerName}</h2>
              </div>
              <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-neutral-700 active:scale-90 transition">
                  <Share2 size={18}/>
              </button>
          </div>
          
          {/* --- EXPANDABLE CONTENT --- */}
          <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
              
              {/* Route Timeline */}
              <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/5 mb-6 relative">
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-neutral-700"></div>
                  <div className="flex items-start mb-6 relative z-10">
                      <div className="w-3 h-3 bg-white rounded-full border-2 border-neutral-500 shadow mr-4 mt-1"></div>
                      <div><p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pickup</p><p className="font-bold text-gray-200 text-sm">{requestData.pickupLocation || "Kottayam"}</p></div>
                  </div>
                  <div className="flex items-start relative z-10">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow mr-4 mt-1"></div>
                      <div><p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Destination</p><p className="font-bold text-gray-200 text-sm">{requestData.dropOffLocation || "Medical College"}</p></div>
                  </div>
              </div>

              {/* Driver Profile */}
              <div className="flex items-center justify-between bg-black border border-white/10 p-4 rounded-3xl shadow-lg">
                  <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-neutral-800 to-black text-white rounded-2xl flex items-center justify-center font-bold text-xl mr-4 border border-white/5">{requestData.volunteerName?.charAt(0)}</div>
                      <div>
                          <p className="font-bold text-white text-lg">{requestData.volunteerName}</p>
                          <div className="flex items-center mt-1"><ShieldCheck size={12} className="text-blue-500 mr-1"/><span className="text-[10px] text-blue-400 font-bold uppercase">Verified & Safe</span></div>
                      </div>
                  </div>
                  <div className="flex gap-3">
                      <button className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-white border border-white/10 active:scale-95"><MessageSquare size={18}/></button>
                      <button className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/40 active:scale-95"><Phone size={18}/></button>
                  </div>
              </div>
          </div>
          
          {/* Mini View (When Collapsed) */}
          {!isExpanded && (
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <p>Tap to see full ride details</p>
                  <ChevronUp size={16} className="animate-bounce"/>
              </div>
          )}
      </div>
    </div>
  );
};

// ==========================================
// 3. COMPONENT: RateAndTip (Your Code)
// ==========================================
const RateAndTip = ({ requestData, onSkip, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');

  const handleCashPayment = () => {
      setLoading(true);
      setTimeout(() => {
          alert(`Please give ₹${selectedTip} cash to volunteer.`);
          onSubmit();
          setLoading(false);
      }, 1000);
  };

  const handleOnlinePayment = () => {
      // Simulate Razorpay opening
      alert("Opening Razorpay Payment Gateway..."); 
      onSubmit();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[3000] p-6 pb-24 animate-in slide-in-from-bottom duration-500 font-sans">
      <div className="text-center mb-6"><div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4"><CheckCircle size={32} className="text-green-600" /></div><h2 className="text-2xl font-bold text-gray-900">Ride Completed!</h2><p className="text-gray-500 mt-1">Rate {requestData?.volunteerName}</p></div>
      <div className="flex justify-center gap-3 mb-8">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} size={36} className={`cursor-pointer transition hover:scale-110 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} onClick={() => setRating(star)}/>))}</div>
      <p className="font-bold text-gray-700 mb-4 text-center text-sm uppercase tracking-wide">Add a Tip</p>
      <div className="grid grid-cols-4 gap-3 mb-6">{[0, 20, 50, 100].map((amt) => (<button key={amt} onClick={() => setSelectedTip(amt)} className={`py-3 rounded-xl font-bold border transition ${selectedTip === amt ? 'bg-black text-white border-black scale-105' : 'bg-white text-gray-700 border-gray-200'}`}>{amt === 0 ? "No" : `₹${amt}`}</button>))}</div>
      {selectedTip > 0 && (<div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100"><p className="text-xs font-bold text-blue-600 uppercase mb-3 flex items-center"><ShieldCheck size={14} className="mr-1"/> Payment Method</p><div className="flex gap-3"><button onClick={() => setPaymentMode('online')} className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${paymentMode === 'online' ? 'border-blue-600 bg-white text-blue-700 shadow-sm' : 'border-transparent bg-blue-100/50 text-gray-500 hover:bg-white'}`}><CreditCard size={24} className="mb-1"/><span className="text-xs font-bold">Online</span></button><button onClick={() => setPaymentMode('cash')} className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${paymentMode === 'cash' ? 'border-green-600 bg-white text-green-700 shadow-sm' : 'border-transparent bg-green-100/50 text-gray-500 hover:bg-white'}`}><Banknote size={24} className="mb-1"/><span className="text-xs font-bold">Cash</span></button></div></div>)}
      {selectedTip > 0 ? (<button onClick={paymentMode === 'online' ? handleOnlinePayment : handleCashPayment} disabled={loading} className={`w-full text-white font-bold py-4 rounded-2xl mb-3 transition flex items-center justify-center shadow-lg active:scale-95 ${paymentMode === 'online' ? 'bg-[#3395ff] hover:bg-[#287acc]' : 'bg-green-600 hover:bg-green-700'}`}>{loading ? <><Loader2 className="animate-spin mr-2"/> Processing...</> : paymentMode === 'online' ? <><CreditCard className="mr-2" size={20}/> Pay ₹{selectedTip}</> : <><Banknote className="mr-2" size={20}/> Confirm Cash Payment</>}</button>) : (<button onClick={() => onSubmit(0)} className="w-full bg-black text-white font-bold py-4 rounded-2xl mb-3 hover:bg-gray-800 shadow-lg active:scale-95">Submit Review</button>)}
      <button onClick={onSkip} className="w-full text-gray-400 font-medium">Skip</button>
    </div>
  );
};

// ==========================================
// 3. MAIN DASHBOARD (Controller)
// ==========================================
const UserDashboard = () => {
  const [step, setStep] = useState('menu'); 
  const [selectedService, setSelectedService] = useState(null);
  const [rideId, setRideId] = useState(null); 
  const [rideData, setRideData] = useState(null);
  
  // Modals
  const [showPickupModal, setShowPickupModal] = useState(false);

  // Polling Refs (Prevents Loops)
  const pollingRef = useRef(null);
  const lastStatusRef = useRef(null); 

  // --- STABLE POLLING ---
  useEffect(() => {
    if (!rideId) return;

    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${DEPLOYED_API_URL}/api/requests?t=${Date.now()}`);
        if (res.ok) {
            const allRides = await res.json();
            const myRide = allRides.find(r => r._id === rideId);

            if (myRide) {
                const currentStatus = myRide.status;
                
                // 🛑 KEY FIX: Only update UI if status actually changed from last check
                if (currentStatus !== lastStatusRef.current) {
                    console.log(`Status Change Detected: ${lastStatusRef.current} -> ${currentStatus}`);
                    lastStatusRef.current = currentStatus;
                    setRideData(myRide);

                    // LOGIC SWITCHER
                    if (currentStatus === 'accepted') {
                        setStep('found'); // Show Arriving UI
                    } 
                    else if (currentStatus === 'in_progress') {
                        setStep('riding'); // Show RideInProgress Component
                        setShowPickupModal(true); // Trigger Pickup Popup
                    }
                    else if (currentStatus === 'completed') {
                        setStep('rating'); // Show RateAndTip Component
                        clearInterval(pollingRef.current); // Stop polling
                    }
                }
            }
        }
      } catch (e) {}
    }, 2000); // Check every 2s

    return () => clearInterval(pollingRef.current);
  }, [rideId]);

  // --- ACTIONS ---
  const handleConfirmRequest = async () => {
    try {
      const res = await fetch(`${DEPLOYED_API_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterName: "John User", type: selectedService || "Ride", price: 150, pickup: "Kottayam", drop: "Medical College" })
      });
      if (res.ok) {
        const data = await res.json();
        setRideId(data._id);
        lastStatusRef.current = 'pending'; 
        setStep('searching'); 
      }
    } catch (e) { alert("Connection Error"); }
  };

  const handleCancel = () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      setRideId(null);
      lastStatusRef.current = null;
      setStep('menu');
  };

  const handleReset = () => {
      window.location.reload();
  };

  // --- VIEWS ---
  // A. Arriving View (Volunteer Found)
  const ArrivingView = () => (
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#121212] border border-white/10 p-6 rounded-[32px] shadow-2xl text-white animate-in slide-in-from-bottom duration-500">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/50 flex items-center gap-2">
              <Bell size={10} fill="currentColor"/> Volunteer Found
          </div>
          <div className="flex justify-between items-start mb-6 mt-2">
              <div>
                  <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><Shield size={12}/> VERIFIED PARTNER</h3>
                  <h2 className="text-3xl font-black tracking-tight">{rideData?.volunteerName || "Volunteer"}</h2>
                  <div className="flex items-center gap-2 mt-2">
                      <div className="bg-white/10 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-current"/> 4.9</div>
                      <div className="bg-white/10 px-2 py-1 rounded text-xs font-bold text-neutral-400">Maruti Swift</div>
                  </div>
              </div>
              <div className="w-16 h-16 bg-neutral-800 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <User size={28} className="text-white"/>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
              <button className="bg-green-600 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95"><Phone size={20}/> Call</button>
              <button className="bg-neutral-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95"><Navigation size={20}/> Message</button>
          </div>
      </div>
  );

  // B. Pickup Modal
  const PickupModal = () => (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-[85%] max-w-sm p-6 rounded-[32px] text-center shadow-2xl animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                  <Car size={40} className="text-green-600"/>
              </div>
              <h2 className="text-2xl font-black mb-2 text-neutral-900">Trip Started!</h2>
              <p className="text-neutral-500 mb-8 font-medium">Sit back and relax.</p>
              <button onClick={() => setShowPickupModal(false)} className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition">Let's Go</button>
          </div>
      </div>
  );

  return (
    <div className="h-screen bg-neutral-100 text-black font-sans flex flex-col relative overflow-hidden">
      
      {/* HEADER */}
      {step !== 'rating' && (
        <div className="absolute top-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => setStep('menu')} className="p-3 bg-neutral-800/80 rounded-full text-white backdrop-blur-md border border-white/10 hover:bg-neutral-700 transition"><Menu size={20}/></button>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/80 rounded-full border border-neutral-700 text-white backdrop-blur-md">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div><span className="text-xs font-bold tracking-wider">ONLINE</span>
            </div>
        </div>
      )}

      {/* MAP */}
      {step !== 'rating' && (
        <div className="absolute inset-0 z-0">
            <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src="https://www.openstreetmap.org/export/embed.html?bbox=76.51%2C9.58%2C76.54%2C9.60&amp;layer=mapnik&amp;marker=9.59%2C76.52" style={{ filter: 'grayscale(100%) invert(90%) contrast(120%)' }}></iframe>
        </div>
      )}

      {/* STEPS */}
      {step === 'menu' && (
         <div className="absolute bottom-0 w-full z-10 bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-black mb-6 text-neutral-800">What do you need?</h2>
            <div className="grid grid-cols-2 gap-4">
                {[{ id: 'Ride', icon: Car, color: 'text-green-600', bg: 'bg-green-50' }, { id: 'Helper', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' }, { id: 'Meds', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' }, { id: 'Shop', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' }].map(s => (
                    <button key={s.id} onClick={() => { setSelectedService(s.id); setStep('input'); }} className={`p-5 ${s.bg} rounded-2xl flex flex-col items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-sm`}>
                        <s.icon size={32} className={s.color}/>
                        <span className="font-bold text-sm text-neutral-700">{s.id}</span>
                    </button>
                ))}
            </div>
         </div>
      )}

      {step === 'input' && (
         <div className="absolute bottom-0 w-full z-10 bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom">
            <button onClick={() => setStep('menu')} className="mb-4"><ArrowLeft className="text-neutral-400"/></button>
            <h2 className="text-2xl font-black mb-6">Request {selectedService}</h2>
            <button onClick={handleConfirmRequest} className="w-full bg-black text-white font-black py-4 rounded-2xl text-lg flex justify-center items-center gap-3 active:scale-95 transition-all">Confirm Request <ArrowRight size={20}/></button>
         </div>
      )}

      {step === 'searching' && <FindingVolunteer onCancel={handleCancel} />}
      
      {step === 'found' && <ArrivingView />}
      
      {step === 'riding' && <RideInProgress requestData={rideData} />}
      
      {step === 'rating' && <RateAndTip requestData={rideData} onSkip={handleReset} onSubmit={handleReset} />}

      {/* POPUP */}
      {showPickupModal && <PickupModal />}

    </div>
  );
};

export default UserDashboard;