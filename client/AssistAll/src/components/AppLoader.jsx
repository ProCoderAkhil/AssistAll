import React, { useState, useEffect } from 'react';
import { Shield, Zap, Activity } from 'lucide-react';

const AppLoader = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing System...");

  useEffect(() => {
    // 1. Progress Bar Animation
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    // 2. Message Cycling
    const msgTimer = setTimeout(() => setMessage("Connecting to Secure Server..."), 800);
    const msgTimer2 = setTimeout(() => setMessage("Verifying User Credentials..."), 1800);
    const msgTimer3 = setTimeout(() => setMessage("Loading Maps & Assets..."), 2800);

    return () => {
      clearInterval(timer);
      clearTimeout(msgTimer);
      clearTimeout(msgTimer2);
      clearTimeout(msgTimer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative mb-12">
            {/* Spinning Rings */}
            <div className="absolute inset-0 border-4 border-t-green-500 border-r-transparent border-b-green-500/30 border-l-transparent rounded-full w-32 h-32 animate-spin duration-1000"></div>
            <div className="absolute inset-2 border-2 border-t-transparent border-r-blue-500 border-b-transparent border-l-blue-500/50 rounded-full w-28 h-28 animate-spin-slow"></div>
            
            {/* Center Icon */}
            <div className="w-32 h-32 flex items-center justify-center bg-black rounded-full shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-black font-black text-4xl shadow-inner">
                    A
                </div>
            </div>
        </div>

        {/* Text & Progress */}
        <div className="w-64 text-center">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">AssistAll <span className="text-green-500 text-xs align-top">PRO</span></h2>
            <p className="text-xs text-gray-500 font-mono mb-6 uppercase tracking-widest h-4">{message}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            
            <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-mono">
                <span>V 10.0.4</span>
                <span>SECURE CONNECTION</span>
            </div>
        </div>
      </div>

      {/* Decorative Bottom Text */}
      <div className="absolute bottom-10 text-[10px] text-gray-700 font-bold tracking-[0.3em] opacity-50">
          POWERED BY ASSISTALL CLOUD
      </div>
    </div>
  );
};

export default AppLoader;