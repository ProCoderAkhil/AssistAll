import React from 'react';
import { Loader2, X } from 'lucide-react';

const FindingVolunteer = ({ requestId, onCancel }) => {
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

export default FindingVolunteer;