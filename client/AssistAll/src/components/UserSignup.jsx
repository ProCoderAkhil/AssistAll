import React, { useState } from 'react';
import { User, Mail, Lock, Phone, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const UserSignup = ({ onRegister, onBack }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const DEPLOYED_API_URL = `http://${window.location.hostname}:5000`;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    if (!formData.name || !formData.email || !formData.password || !formData.phone) { setError("All fields required."); setLoading(false); return; }
    if (formData.password.length < 6) { setError("Password too short."); setLoading(false); return; }

    try {
      const response = await fetch(`${DEPLOYED_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: 'user' }),
      });
      const data = await response.json();
      if (response.ok) onRegister(data);
      else setError(data.message || "Registration failed.");
    } catch (err) { setError("Connection failed."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
        
        {/* Background V5 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-in zoom-in duration-300 hover:border-purple-500/30 transition-colors">
            
            <button onClick={onBack} className="absolute top-6 left-6 text-neutral-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
                <ArrowLeft size={20}/>
            </button>

            <div className="text-center mb-8 pt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                    <Sparkles size={28} fill="currentColor" className="text-white"/>
                </div>
                <h2 className="text-2xl font-black tracking-tight">Join AssistAll</h2>
                <p className="text-neutral-500 text-sm mt-2">Start your journey to independence.</p>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-xs font-bold text-center">{error}</div>}

            <div className="space-y-3">
                {[{i:User, n:'name', p:'Full Name', t:'text'}, {i:Mail, n:'email', p:'Email Address', t:'email'}, {i:Phone, n:'phone', p:'Mobile Number', t:'tel'}, {i:Lock, n:'password', p:'Create Password', t:'password'}].map((f, i) => (
                    <div key={i} className="group relative">
                        <f.i className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-500 transition duration-300" size={18} />
                        <input name={f.n} type={f.t} placeholder={f.p} className="w-full bg-[#111] border border-neutral-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 focus:bg-[#151515] transition-all duration-300" onChange={handleChange} />
                    </div>
                ))}
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-xl mt-8 flex items-center justify-center hover:bg-gray-200 transition transform active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                {loading ? <Loader2 className="animate-spin" /> : "Create Account"} <ArrowRight className="ml-2" size={18} />
            </button>
        </div>
    </div>
  );
};
export default UserSignup;