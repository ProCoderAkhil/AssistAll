import React from 'react';
import { Home, Clock, User, AlertCircle } from 'lucide-react';

const BottomNav = ({ activeTab, onHomeClick, onActivityClick, onProfileClick, onSOSClick }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHomeClick },
    { id: 'activity', icon: Clock, label: 'History', onClick: onActivityClick },
    { id: 'profile', icon: User, label: 'Profile', onClick: onProfileClick },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 px-6 py-2 flex justify-between items-center z-[100] pb-6">
      {navItems.map((item) => (
        <button 
          key={item.id} 
          onClick={item.onClick}
          className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
        >
          <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} className={`mb-1 transition-transform ${activeTab === item.id ? 'scale-110 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : ''}`} />
          <span className="text-[9px] font-bold tracking-widest uppercase">{item.label}</span>
        </button>
      ))}
       <button onClick={onSOSClick} className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-red-500 hover:text-red-400 transition-all hover:scale-105 active:scale-95 relative top-[-20px] bg-[#0a0a0a] border-4 border-[#050505] shadow-[0_0_20px_rgba(220,38,38,0.4)] rounded-full h-16 w-16">
            <AlertCircle size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default BottomNav;