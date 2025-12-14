import React from 'react';
import { Home, User, History, ShieldAlert } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 flex justify-around items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-2">
      
      {/* Home Button */}
      <button className="flex flex-col items-center text-blue-600 hover:scale-110 transition">
        <Home size={28} />
        <span className="text-xs font-bold mt-1">Home</span>
      </button>
      
      {/* Activity Button */}
      <button className="flex flex-col items-center text-gray-400 hover:text-blue-500 transition">
        <History size={28} />
        <span className="text-xs font-medium mt-1">Activity</span>
      </button>

      {/* The SOS Button (Popping out) */}
      <div className="relative -top-8">
        <button className="bg-red-600 text-white p-5 rounded-full shadow-xl border-4 border-white flex items-center justify-center animate-pulse">
           <ShieldAlert size={32} />
        </button>
      </div>

      {/* Profile Button */}
      <button className="flex flex-col items-center text-gray-400 hover:text-blue-500 transition">
        <User size={28} />
        <span className="text-xs font-medium mt-1">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;