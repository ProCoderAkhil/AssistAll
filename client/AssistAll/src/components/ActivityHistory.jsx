import React from 'react';
import { Clock, MapPin, ChevronRight, RotateCcw, Calendar, CheckCircle } from 'lucide-react';

const ActivityHistory = ({ user, onBack }) => {
  const history = [
      { id: 1, type: "Transport", dest: "Cyber Park", date: "Today, 9:30 AM", price: "₹120", status: "Completed", driver: "Akhil K." },
      { id: 2, type: "Medicine", dest: "City Pharmacy", date: "Yesterday, 4:00 PM", price: "₹45", status: "Completed", driver: "Sarah J." },
      { id: 3, type: "Companion", dest: "Home Visit", date: "Mon, 10:00 AM", price: "₹200", status: "Completed", driver: "Rahul S." },
  ];

  return (
    <div className="flex-grow overflow-y-auto pb-32">
        {/* Header */}
        <div className="p-6 pt-12 pb-6 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">Your Activity</h1>
            <p className="text-neutral-500 text-sm font-medium">Recent trips and requests</p>
        </div>

        {/* List */}
        <div className="p-6 space-y-4">
            {history.map((item) => (
                <div key={item.id} className="bg-[#121212] p-5 rounded-3xl border border-white/5 hover:border-white/10 transition group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500"><Clock size={20}/></div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{item.dest}</h3>
                                <p className="text-neutral-500 text-xs font-medium">{item.date}</p>
                            </div>
                        </div>
                        <span className="font-mono font-bold text-white bg-[#1a1a1a] px-3 py-1 rounded-lg border border-white/5">{item.price}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500"/>
                            <span className="text-xs font-bold text-green-500 uppercase tracking-wider">{item.status}</span>
                            <span className="text-neutral-600 text-xs">• {item.driver}</span>
                        </div>
                        <button className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-white transition">
                            <RotateCcw size={14}/> Rebook
                        </button>
                    </div>
                </div>
            ))}
            
            <div className="text-center mt-8">
                <button className="text-neutral-500 text-xs font-bold uppercase tracking-widest hover:text-white transition">Load Older Activity</button>
            </div>
        </div>
    </div>
  );
};

export default ActivityHistory;