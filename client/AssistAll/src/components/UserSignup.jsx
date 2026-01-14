import React, { useState } from 'react';
import { 
  User, Mail, Lock, Phone, ArrowLeft, Loader2, Heart, 
  ShieldAlert, Eye, Type, Accessibility, Check, ChevronRight 
} from 'lucide-react';

const UserSignup = ({ onRegister, onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // --- FORM DATA ---
  const [formData, setFormData] = useState({
      name: '', email: '', password: '', phone: '',
      emergencyName: '', emergencyPhone: '', emergencyRelation: '',
      medicalCondition: '',
      prefersLargeText: false,
      needsWheelchair: false
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://assistall-server.onrender.com';

  // --- ACTIONS ---
  const handleSendOtp = () => {
      if(formData.phone.length < 10) return setError("Enter valid phone number");
      setOtpSent(true);
      alert("AssistAll: Your code is 5555"); // Simulating SMS
  };

  const handleVerifyOtp = () => {
      if(otpInput === '5555') {
          setOtpVerified(true);
          setError('');
      } else {
          setError("Wrong Code");
      }
  };

  const handleSubmit = async () => {
      setLoading(true);
      try {
          const payload = {
              ...formData,
              role: 'user',
              // Combine emergency info into an object for backend
              emergencyContact: {
                  name: formData.emergencyName,
                  phone: formData.emergencyPhone,
                  relation: formData.emergencyRelation
              }
          };

          const res = await fetch(`${API_URL}/api/auth/register`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (res.ok) onRegister(data.user, data.token);
          else setError(data.message || "Registration Failed");
      } catch (e) { setError("Network Error"); } 
      finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222] p-8 rounded-[32px] shadow-2xl relative">
            <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full hover:bg-[#222] text-gray-500 transition"><ArrowLeft size={20}/></button>
            
            {/* Progress Bar */}
            <div className="flex justify-center gap-2 mb-8 mt-2">
                {[1,2,3].map(i => <div key={i} className={`h-1 w-12 rounded-full transition-all ${step >= i ? 'bg-green-500' : 'bg-[#222]'}`}></div>)}
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-black">{step === 1 ? "Create Account" : step === 2 ? "Safety First" : "Your Comfort"}</h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Step {step} of 3</p>
            </div>

            {error && <div className="bg-red-900/20 text-red-500 p-3 rounded-xl text-center text-sm font-bold mb-6 border border-red-900/50">{error}</div>}

            {/* STEP 1: CREDENTIALS */}
            {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <div className="relative"><User className="absolute left-4 top-4 text-gray-500" size={20}/><input className="bg-[#111] border border-[#222] p-4 pl-12 rounded-xl w-full focus:border-green-500 outline-none" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div className="relative"><Mail className="absolute left-4 top-4 text-gray-500" size={20}/><input className="bg-[#111] border border-[#222] p-4 pl-12 rounded-xl w-full focus:border-green-500 outline-none" placeholder="Email Address" type="email" onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                    
                    {/* Phone OTP Section */}
                    <div className="bg-[#111] border border-[#222] p-4 rounded-xl space-y-3">
                        <div className="flex gap-2 items-center">
                            <Phone size={20} className="text-gray-500"/>
                            <input className="bg-transparent w-full outline-none" placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})} disabled={otpVerified}/>
                            {otpVerified ? <Check size={20} className="text-green-500"/> : <button onClick={handleSendOtp} className="text-green-500 font-bold text-xs">VERIFY</button>}
                        </div>
                        {otpSent && !otpVerified && (
                            <div className="flex gap-2 border-t border-[#333] pt-3">
                                <input className="bg-transparent w-full tracking-widest text-center" placeholder="0000" onChange={e => setOtpInput(e.target.value)}/>
                                <button onClick={handleVerifyOtp} className="bg-green-600 px-4 rounded-lg text-xs font-bold">OK</button>
                            </div>
                        )}
                    </div>

                    <div className="relative"><Lock className="absolute left-4 top-4 text-gray-500" size={20}/><input className="bg-[#111] border border-[#222] p-4 pl-12 rounded-xl w-full focus:border-green-500 outline-none" placeholder="Password" type="password" onChange={e => setFormData({...formData, password: e.target.value})} /></div>
                    
                    <button onClick={() => otpVerified ? setStep(2) : setError("Verify phone first")} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition mt-2">Next Step</button>
                </div>
            )}

            {/* STEP 2: EMERGENCY CONTACTS */}
            {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <div className="bg-red-900/10 p-4 rounded-xl border border-red-900/30 mb-4 flex gap-3">
                        <ShieldAlert className="text-red-500 shrink-0"/>
                        <p className="text-xs text-red-200">We will alert this person if you press the <b>SOS Button</b> during a ride.</p>
                    </div>
                    
                    <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-red-500 outline-none" placeholder="Emergency Contact Name" onChange={e => setFormData({...formData, emergencyName: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-red-500 outline-none" placeholder="Relation (e.g. Son)" onChange={e => setFormData({...formData, emergencyRelation: e.target.value})} />
                        <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-red-500 outline-none" placeholder="Their Phone" onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} />
                    </div>
                    
                    <div className="relative"><Heart className="absolute left-4 top-4 text-gray-500" size={20}/><input className="bg-[#111] border border-[#222] p-4 pl-12 rounded-xl w-full focus:border-blue-500 outline-none" placeholder="Medical Condition (Optional)" onChange={e => setFormData({...formData, medicalCondition: e.target.value})} /></div>

                    <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold bg-[#111] text-gray-400">Back</button>
                        <button onClick={() => setStep(3)} className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200">Next Step</button>
                    </div>
                </div>
            )}

            {/* STEP 3: ACCESSIBILITY */}
            {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#222] space-y-4">
                        <div onClick={() => setFormData({...formData, prefersLargeText: !formData.prefersLargeText})} className={`flex justify-between items-center p-3 rounded-xl cursor-pointer border transition ${formData.prefersLargeText ? 'border-green-500 bg-green-900/20' : 'border-transparent hover:bg-[#222]'}`}>
                            <div className="flex gap-3 items-center"><Type size={24}/><span className={formData.prefersLargeText ? "text-lg font-bold" : "text-sm"}>Large Text Mode</span></div>
                            {formData.prefersLargeText && <Check className="text-green-500"/>}
                        </div>

                        <div onClick={() => setFormData({...formData, needsWheelchair: !formData.needsWheelchair})} className={`flex justify-between items-center p-3 rounded-xl cursor-pointer border transition ${formData.needsWheelchair ? 'border-blue-500 bg-blue-900/20' : 'border-transparent hover:bg-[#222]'}`}>
                            <div className="flex gap-3 items-center"><Accessibility size={24}/><span className="text-sm">Wheelchair Access</span></div>
                            {formData.needsWheelchair && <Check className="text-blue-500"/>}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold bg-[#111] text-gray-400">Back</button>
                        <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-green-600 text-black font-bold py-4 rounded-xl hover:bg-green-500 transition shadow-lg shadow-green-900/20">
                            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Create Account"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
export default UserSignup;