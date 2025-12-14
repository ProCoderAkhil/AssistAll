import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const SOSModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#121212] border border-red-500/30 rounded-[32px] p-8 max-w-sm w-full shadow-[0_0_60px_rgba(220,38,38,0.3)] animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Decorative Background Pulse */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-600/20 rounded-full blur-[50px] animate-pulse pointer-events-none"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          
          {/* Icon */}
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)] animate-pulse">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          
          <h3 className="text-3xl font-black text-white mb-3 tracking-tight">EMERGENCY ALERT</h3>
          
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed font-medium">
            This will immediately share your <span className="text-white">Live Location</span> with nearby Police and your emergency contacts.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={onConfirm}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-lg tracking-wide shadow-lg shadow-red-900/40 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <AlertTriangle size={20} fill="currentColor" className="text-white"/>
              SEND SOS
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-4 bg-[#1a1a1a] hover:bg-[#222] text-neutral-400 hover:text-white rounded-2xl font-bold transition-colors active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;