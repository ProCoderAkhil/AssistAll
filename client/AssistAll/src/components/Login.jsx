import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';

// FIX: Direct path to public folder. No import required.
const logoImg = "/logo.png"; 

const Login = ({ onLogin, onVolunteerClick, onSignupClick, onBack }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const DEPLOYED_API_URL = `http://${window.location.hostname}:5000`;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${DEPLOYED_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) onLogin(data);
      else setError(data.message || 'Invalid credentials');
    } catch (err) {
      setError('Connection failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-500">
        
        {/* Back Button */}
        <button onClick={onBack} className="absolute top-6 left-6 text-neutral-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
            <ArrowLeft size={20}/>
        </button>

        <div className="text-center mb-10 mt-6">
            <img 
                src={logoImg} 
                alt="AssistAll Logo" 
                className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] border-2 border-white/10"
                onError={(e) => {e.target.style.display='none';}} 
            />
            <h2 className="text-3xl font-black tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue.</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-xs font-bold text-center">{error}</div>}

        <div className="space-y-4">
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition" size={20}/>
                <input type="email" placeholder="Email Address" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-black/60 transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition" size={20}/>
                <input type="password" placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:bg-black/60 transition-all" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-xl mt-8 flex items-center justify-center hover:bg-gray-200 transition transform active:scale-95 disabled:opacity-50">
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="ml-2" size={20}/>
        </button>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
            <button onClick={onSignupClick} className="text-sm font-medium text-neutral-400 hover:text-white transition flex items-center group">
                Create Account <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0"/>
            </button>
            <button onClick={onVolunteerClick} className="text-sm font-bold text-green-500 hover:text-green-400 transition flex items-center bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                <ShieldCheck size={14} className="mr-2"/> Partner Program
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;