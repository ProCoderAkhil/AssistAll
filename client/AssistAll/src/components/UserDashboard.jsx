import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Navigation, Phone, Search, User, Shield, Menu, Car, Heart, Zap, 
  ShoppingBag, ArrowLeft, ArrowRight, Trash2, CreditCard, Star, CheckCircle, 
  Clock, Map, Bell, Loader2
} from 'lucide-react';

const UserDashboard = () => {
  const [step, setStep] = useState('menu'); // menu -> input -> searching -> found -> completed
  const [selectedService, setSelectedService] = useState(null);
  const [rideId, setRideId] = useState(null); 
  const [volunteerDetails, setVolunteerDetails] = useState(null);
  const [rideStatus, setRideStatus] = useState(null); // New: Tracks 'accepted' vs 'in_progress'
  
  // Payment States
  const [tip, setTip] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('online'); 

  // Fixed URL
  const DEPLOYED_API_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://assistall-server.onrender.com';

  const pollingInterval = useRef(null);

  // --- 1. ROBUST POLLING ENGINE ---
  // This effect runs ONLY when rideId changes. It handles all status transitions internally.
  useEffect(() => {
    if (!rideId) return;

    const pollRideStatus = async () => {
      try {
        const res = await fetch(`${DEPLOYED_API_URL}/api/requests`);
        if (!res.ok) return;
        
        const allRides = await res.json();
        const myRide = allRides.find(r => r._id === rideId);

        if (myRide) {
          console.log("Ride Status:", myRide.status); // Debugging

          // 1. VOLUNTEER ACCEPTED
          if (myRide.status === 'accepted') {
             setRideStatus('accepted');
             setVolunteerDetails({ name: myRide.volunteerName || "Volunteer" });
             // Only switch step if not already there to prevent loop
             setStep((prev) => prev !== 'found' ? 'found' : prev);
          }
          
          // 2. RIDE IN PROGRESS (Slide to Pickup)
          else if (myRide.status === 'in_progress') {
             setRideStatus('in_progress');
             setVolunteerDetails({ name: myRide.volunteerName || "Volunteer" });
             setStep((prev) => prev !== 'found' ? 'found' : prev); // Stay on 'found' screen but UI changes
          }

          // 3. RIDE COMPLETED
          else if (myRide.status === 'completed') {
             setRideStatus('completed');
             setStep('completed');
             stopPolling(); // Stop checking once complete
          }
        }
      } catch (err) { console.error("Polling Error:", err); }
    };

    // Start Polling
    pollingInterval.current = setInterval(pollRideStatus, 2000); // Check every 2 seconds

    // Cleanup function
    return () => stopPolling();
  }, [rideId]);

  const stopPolling = () => {
      if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
      }
  };

  // --- 2. HAPTIC FEEDBACK ---
  useEffect(() => {
      if (rideStatus === 'accepted') navigator.vibrate?.([200, 100, 200]);
      if (rideStatus === 'in_progress') navigator.vibrate?.(500);
      if (rideStatus === 'completed') navigator.vibrate?.([100, 50, 100, 50, 100]);
  }, [rideStatus]);

  // --- 3. PAYMENT HANDLER ---
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (paymentMethod === 'cash') {
        alert("Please pay cash to the volunteer.");
        window.location.reload(); 
        return;
    }

    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Check internet.');
      return;
    }

    const totalAmount = 150 + tip;

    const options = {
      key: "rzp_test_S1HtYIQWxqe96O", 
      amount: totalAmount * 100, 
      currency: "INR",
      name: "AssistAll Payment",
      description: `Ride Fare + Tip`,
      image: "https://cdn-icons-png.flaticon.com/512/1041/1041888.png",
      handler: function (response) {
        alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        window.location.reload(); 
      },
      prefill: { name: "John User", contact: "9999999999" },
      theme: { color: "#3B82F6" }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // --- ACTIONS ---
  const handleSelectService = (service) => { setSelectedService(service); setStep('input'); };
  
  const handleCancel = () => { 
      setStep('menu'); 
      setRideId(null); 
      setRideStatus(null);
      setSelectedService(null);
      stopPolling();
  };
  
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
        setStep('searching'); 
      } else {
          alert("Request Failed. Is server running?");
      }
    } catch (e) { alert("Connection Failed."); }
  };

  return (
    <div className="h-screen bg-neutral-100 text-black font-sans flex flex-col relative overflow-hidden">
      
      {/* HEADER */}
      {step !== 'completed' && (
        <div className="absolute top-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => setStep('menu')} className="p-3 bg-neutral-800/80 rounded-full text-white backdrop-blur-md border border-white/10 hover:bg-neutral-700 transition"><Menu size={20}/></button>
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800/80 rounded-full border border-neutral-700 text-white backdrop-blur-md">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div><span className="text-xs font-bold tracking-wider">ONLINE</span>
            </div>
        </div>
      )}

      {/* MAP */}
      {step !== 'completed' && (
        <div className="absolute inset-0 z-0">
            <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src="https://www.openstreetmap.org/export/embed.html?bbox=76.51%2C9.58%2C76.54%2C9.60&amp;layer=mapnik&amp;marker=9.59%2C76.52" style={{ filter: 'grayscale(100%) invert(90%) contrast(120%)' }}></iframe>
        </div>
      )}

      {/* --- STEP 1: MENU --- */}
      {step === 'menu' && (
         <div className="absolute bottom-0 w-full z-10 bg-white rounded-t-[32px] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-black mb-6 text-neutral-800">What do you need?</h2>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { id: 'Ride', icon: Car, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
                    { id: 'Helper', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
                    { id: 'Meds', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
                    { id: 'Shop', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' }
                ].map(s => (
                    <button key={s.id} onClick={() => handleSelectService(s.id)} className={`p-5 ${s.bg} border ${s.border} rounded-2xl flex flex-col items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-sm`}>
                        <s.icon size={32} className={s.color}/>
                        <span className="font-bold text-sm text-neutral-700">{s.id}</span>
                    </button>
                ))}
            </div>
         </div>
      )}

      {/* --- STEP 2: INPUT --- */}
      {step === 'input' && (
         <div className="absolute bottom-0 w-full z-10 bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setStep('menu')}><ArrowLeft className="text-neutral-400"/></button>
                <h2 className="text-2xl font-black">Request {selectedService}</h2>
            </div>
            <div className="space-y-4 mb-8">
                 <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 border border-gray-100"><div className="bg-blue-100 p-2 rounded-full"><Navigation size={16} className="text-blue-600"/></div><input type="text" placeholder="Current Location" className="bg-transparent font-bold w-full outline-none"/></div>
                 <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 border border-gray-100"><div className="bg-red-100 p-2 rounded-full"><MapPin size={16} className="text-red-600"/></div><input type="text" placeholder="Where to?" className="bg-transparent font-bold w-full outline-none"/></div>
            </div>
            <button onClick={handleConfirmRequest} className="w-full bg-black text-white font-black py-4 rounded-2xl text-lg flex justify-center items-center gap-3 shadow-xl active:scale-95 transition-all">Confirm Request <ArrowRight size={20}/></button>
         </div>
      )}

      {/* --- STEP 3: SEARCHING --- */}
      {step === 'searching' && (
          <div className="absolute bottom-0 w-full z-10 p-6 flex flex-col items-center pb-12 bg-gradient-to-t from-black via-black/90 to-transparent text-white animate-in fade-in duration-700">
               <div className="relative mb-8">
                   <div className="w-32 h-32 bg-blue-500/10 rounded-full animate-ping absolute inset-0"></div>
                   <div className="w-32 h-32 bg-black border-4 border-blue-500 rounded-full flex items-center justify-center relative z-10"><Search size={40} className="text-blue-500 animate-pulse"/></div>
               </div>
               <h3 className="text-2xl font-black mb-1">Finding Help...</h3>
               <button onClick={handleCancel} className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full font-bold text-sm text-white hover:bg-white/20 transition mt-6">Cancel Request</button>
          </div>
      )}

      {/* --- STEP 4: FOUND / IN PROGRESS (Dynamic) --- */}
      {step === 'found' && (
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#121212] border border-white/10 p-6 rounded-[32px] shadow-2xl text-white animate-in slide-in-from-bottom duration-500">
              {/* Dynamic Badge Status */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 ${rideStatus === 'in_progress' ? 'bg-green-600 shadow-green-900/50' : 'bg-blue-600 shadow-blue-900/50'}`}>
                  {rideStatus === 'in_progress' ? <Navigation size={10} fill="currentColor"/> : <Bell size={10} fill="currentColor"/>}
                  {rideStatus === 'in_progress' ? "RIDE IN PROGRESS" : "VOLUNTEER ARRIVING"}
              </div>

              <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                      <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><Shield size={12}/> VERIFIED PARTNER</h3>
                      <h2 className="text-3xl font-black tracking-tight">{volunteerDetails?.name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                          <div className="bg-white/10 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-current"/> 4.9</div>
                          <div className="bg-white/10 px-2 py-1 rounded text-xs font-bold text-neutral-400">Maruti Swift</div>
                      </div>
                  </div>
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center relative ${rideStatus === 'in_progress' ? 'bg-green-900/20 border-green-500 animate-pulse' : 'bg-neutral-800 border-blue-500'}`}>
                      <User size={28} className="text-white"/>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                  <button className="bg-green-600 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 transition active:scale-95"><Phone size={20}/> Call</button>
                  <button className="bg-neutral-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-neutral-700 transition active:scale-95"><Navigation size={20}/> Message</button>
              </div>
          </div>
      )}

      {/* --- STEP 5: COMPLETED --- */}
      {step === 'completed' && (
          <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 animate-in zoom-in duration-500 relative z-50">
              <div className="bg-green-50 p-8 rounded-full shadow-xl mb-6 border border-green-100 animate-bounce">
                  <CheckCircle size={64} className="text-green-500"/>
              </div>
              <h1 className="text-4xl font-black mb-2 text-neutral-900 tracking-tight">Ride Completed!</h1>
              <p className="text-neutral-500 font-medium mb-10 text-center">How was your experience with <br/><span className="font-bold text-black">{volunteerDetails?.name}</span>?</p>
              
              <div className="flex gap-2 mb-10">
                  {[1,2,3,4,5].map(i => <Star key={i} size={36} className="text-yellow-400 fill-current drop-shadow-md cursor-pointer hover:scale-110 transition"/>)}
              </div>

              <div className="w-full max-w-md bg-gray-50 p-2 rounded-2xl border border-gray-200 flex mb-8">
                  <button onClick={() => setPaymentMethod('online')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${paymentMethod === 'online' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400'}`}><CreditCard size={16}/> Online</button>
                  <button onClick={() => setPaymentMethod('cash')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${paymentMethod === 'cash' ? 'bg-white text-green-600 shadow-md' : 'text-gray-400'}`}><span>💵</span> Cash</button>
              </div>

              <button onClick={handlePayment} className="w-full max-w-md bg-blue-600 text-white font-black py-5 rounded-2xl text-lg shadow-xl hover:bg-blue-700 transition active:scale-[0.98] flex items-center justify-center gap-2">
                  {paymentMethod === 'online' ? `Pay ₹${150 + tip}` : `Confirm Cash Payment`} <ArrowRight size={20}/>
              </button>
              <button onClick={() => window.location.reload()} className="mt-6 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-black transition">Skip Rating</button>
          </div>
      )}
    </div>
  );
};

export default UserDashboard;