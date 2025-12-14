import React, { useState } from 'react';
import { Navigation, ShieldCheck, MapPin, Phone, MessageSquare, Share2, ChevronUp, ChevronDown } from 'lucide-react';

const RideInProgress = ({ requestData }) => {
  const [isExpanded, setIsExpanded] = useState(true); // "Movable" State

  if (!requestData) return <div className="absolute bottom-24 left-0 right-0 text-center text-xs font-bold text-white animate-pulse">Syncing GPS...</div>;

  return (
    <div 
        className={`absolute left-0 right-0 bg-[#121212] rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50 border-t border-white/10 transition-all duration-500 ease-in-out ${isExpanded ? 'bottom-0 pb-24 h-[60vh]' : 'bottom-20 h-[180px]'}`}
    >
      {/* --- DRAG HANDLE (CLICK TO MOVE) --- */}
      <div 
        className="w-full h-8 flex items-center justify-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
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
                      <p className="text-green-500 text-xs font-bold uppercase tracking-widest">ARRIVING IN 3 MIN</p>
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
                      <div><p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pickup</p><p className="font-bold text-gray-200 text-sm">{requestData.pickupLocation || "Current Location"}</p></div>
                  </div>
                  <div className="flex items-start relative z-10">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow mr-4 mt-1"></div>
                      <div><p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Destination</p><p className="font-bold text-gray-200 text-sm">{requestData.dropOffLocation}</p></div>
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
export default RideInProgress;