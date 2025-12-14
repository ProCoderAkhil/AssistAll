import React, { useState } from 'react';
import { Car, HeartHandshake, Home, Briefcase, ShoppingBag, Pill, ArrowRight, Search, Zap, ChevronUp } from 'lucide-react';

const ServiceSelector = ({ onClose, onFindClick, user }) => { 
  const [serviceType, setServiceType] = useState('Transport');
  const [dropOff, setDropOff] = useState('');
  
  // Start expanded for better visibility
  const [isExpanded, setIsExpanded] = useState(true);

  const services = [
      { id: 'Transport', label: 'Ride', icon: Car, time: '3 min', price: '₹40+', surge: false },
      { id: 'Companion', label: 'Helper', icon: HeartHandshake, time: '10 min', price: '₹150/h', surge: false },
      { id: 'Medicine', label: 'Meds', icon: Pill, time: '30 min', price: 'Delivery', surge: true },
      { id: 'Groceries', label: 'Shop', icon: ShoppingBag, time: '45 min', price: 'Delivery', surge: false },
  ];

  const recent = [
      { name: "Home", icon: Home, addr: "Home Address" },
      { name: "Work", icon: Briefcase, addr: "Office" },
      { name: "Clinic", icon: HeartHandshake, addr: "City Hospital" }
  ];

  return (
    <>
        {/* --- 1. EXPANDED DRAWER --- */}
        <div 
            className={`absolute left-0 right-0 bg-[#121212] rounded-t-[40px] shadow-[0_-10px_60px_rgba(0,0,0,0.8)] z-[40] border-t border-white/5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isExpanded ? 'bottom-0 translate-y-0 opacity-100' : 'bottom-0 translate-y-[110%] opacity-0 pointer-events-none'}`}
            style={{ paddingBottom: '100px' }} // Padding for BottomNav
        >
            {/* Drag Handle (Tap to Close) */}
            <div 
                className="w-full flex justify-center pt-4 pb-2 cursor-pointer active:scale-95 transition"
                onClick={() => setIsExpanded(false)}
            >
                <div className="w-12 h-1.5 bg-neutral-700 rounded-full hover:bg-neutral-500 transition"></div>
            </div>

            <div className="p-6 pt-2">
                {/* Search Box */}
                <div className="bg-[#1a1a1a] p-4 rounded-2xl flex items-center mb-8 focus-within:bg-[#222] focus-within:ring-1 ring-green-500 transition-all border border-white/5 shadow-lg">
                    <div className="bg-green-600/20 text-green-500 p-2 rounded-xl mr-3"><Search size={20}/></div>
                    <input 
                        type="text" 
                        placeholder="Where to?" 
                        className="w-full bg-transparent outline-none font-bold text-lg text-white placeholder-neutral-600" 
                        value={dropOff} 
                        onChange={(e) => setDropOff(e.target.value)}
                    />
                </div>

                {/* Saved Places */}
                <div className="flex gap-4 mb-8 overflow-x-auto scrollbar-hide pb-2">
                    {recent.map((p,i) => (
                        <button key={i} onClick={() => setDropOff(p.addr)} className="flex flex-col items-center min-w-[70px] group">
                            <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-2 border border-white/5 group-hover:border-green-500/50 group-hover:bg-green-500/10 transition duration-300 shadow-md">
                                <p.icon size={24} className="text-gray-400 group-hover:text-green-400 transition"/>
                            </div>
                            <span className="text-xs font-bold text-gray-500 group-hover:text-white transition">{p.name}</span>
                        </button>
                    ))}
                </div>

                {/* Service Grid */}
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Select Service</p>
                <div className="grid grid-cols-4 gap-3 mb-8">
                    {services.map(s => (
                        <button key={s.id} onClick={() => setServiceType(s.id)} className={`flex flex-col items-center p-2 py-4 rounded-2xl border transition-all active:scale-95 duration-300 relative ${serviceType === s.id ? 'border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/5 bg-[#1a1a1a] hover:bg-[#222]'}`}>
                            {s.surge && <div className="absolute top-2 right-2"><Zap size={10} className="text-yellow-500 fill-current animate-pulse"/></div>}
                            <s.icon size={28} className={`mb-3 ${serviceType === s.id ? 'text-green-400' : 'text-gray-400'}`}/>
                            <span className={`text-[10px] font-bold ${serviceType === s.id ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
                            {serviceType === s.id && <span className="text-[9px] text-green-500 font-bold mt-1">{s.time}</span>}
                        </button>
                    ))}
                </div>

                <button onClick={() => { if(!dropOff) return alert("Enter destination"); onFindClick({ type: serviceType, dropOff, time: "Now" }); }} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-gray-200 transition active:scale-95 flex justify-between items-center px-6">
                    <span className="text-lg">Confirm {serviceType}</span>
                    <div className="bg-black text-white p-2 rounded-full"><ArrowRight size={20}/></div>
                </button>
            </div>
        </div>

        {/* --- 2. FLOATING SEARCH BAR (VISIBLE WHEN COLLAPSED) --- */}
        <div 
            className={`absolute bottom-24 left-4 right-4 z-[35] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${!isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
        >
            <div 
                onClick={() => setIsExpanded(true)}
                className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-full shadow-2xl flex items-center justify-between cursor-pointer active:scale-95 transition hover:bg-[#222]"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-green-500 text-black p-2 rounded-full"><Search size={18} strokeWidth={3}/></div>
                    <span className="text-white font-bold text-sm">Where to?</span>
                </div>
                <div className="bg-[#111] p-2 rounded-full border border-white/5">
                    <ChevronUp size={18} className="text-gray-400"/>
                </div>
            </div>
        </div>
    </>
  );
};
export default ServiceSelector;