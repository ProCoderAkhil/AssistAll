import React, { useState, useRef } from 'react';
import { 
  User, Shield, ArrowLeft, Loader2, Camera, FileText, Video, 
  Stethoscope, Car, HeartHandshake, AlertCircle, Check, ExternalLink, Lock 
} from 'lucide-react';

const VolunteerSignup = ({ onRegister, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
      name: '', email: '', password: '', address: '', phone: '', 
      serviceSector: 'transport', vehicleType: 'Car', vehicleModel: '', vehicleNumber: '' 
  });
  
  // --- STATES ---
  const [govtIdFile, setGovtIdFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToBackgroundCheck, setAgreedToBackgroundCheck] = useState(false);
  
  // Verification State
  const [registeredUserId, setRegisteredUserId] = useState(null);
  const [adminCodeInput, setAdminCodeInput] = useState(''); // The code you give them verbally

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://assistall-server.onrender.com';
  // 🔴 REPLACE THIS with your actual permanent Meet link
  const GOOGLE_MEET_LINK = "https://meet.google.com/hva-psuy-qds"; 

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraActive(true);
    } catch (err) { setError("Camera access denied."); }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        setSelfie(canvas.toDataURL('image/jpeg'));
        video.srcObject.getTracks().forEach(track => track.stop());
        setCameraActive(false);
    }
  };

  // --- STEP 3 SUBMIT: CREATE ACCOUNT ---
  const handleVerificationSubmit = async () => {
    setLoading(true); setError('');
    
    if (!govtIdFile) { setError("Government ID is required."); setLoading(false); return; }
    if (!selfie) { setError("Live Selfie is required."); setLoading(false); return; }
    if (!agreedToTerms || !agreedToBackgroundCheck) { setError("Please agree to the terms."); setLoading(false); return; }

    try {
      const payload = {
          ...formData,
          role: 'volunteer',
          govtId: govtIdFile.name,
          drivingLicense: licenseFile ? licenseFile.name : '',
          selfieImage: selfie, 
          phoneVerified: true,
          agreedToTerms: true,
          vehicleDetails: formData.serviceSector === 'transport' ? {
              type: formData.vehicleType,
              model: formData.vehicleModel,
              number: formData.vehicleNumber
          } : {}
      };

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
          setRegisteredUserId(data.user._id);
          setStep(4); // Move to Interview Step
      } else {
          setError(data.message || "Registration Failed.");
      }
    } catch (e) { setError("Network Error"); } finally { setLoading(false); }
  };

  // --- STEP 4 SUBMIT: VERIFY CODE ---
  const handleCodeSubmit = async () => {
      setLoading(true);
      try {
          const res = await fetch(`${API_URL}/api/auth/complete-interview/${registeredUserId}`, {
              method: "PUT", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ adminCode: adminCodeInput })
          });
          
          if(res.ok) {
              alert("Interview Verified! Your account is now pending final Admin Approval.");
              window.location.reload(); // Reset to login screen
          } else {
              setError("Invalid Code. Please ask the Admin.");
          }
      } catch (e) { setError("Validation Failed."); }
      finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#0a0a0a] border border-[#222] p-8 rounded-[32px] shadow-2xl relative z-10">
            {step < 4 && <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full hover:bg-[#222] text-gray-500 hover:text-white transition"><ArrowLeft size={20}/></button>}
            
            <div className="flex justify-center gap-2 mb-8 mt-2">
                {[1,2,3,4].map(i => <div key={i} className={`h-1 w-12 rounded-full transition-all ${step >= i ? 'bg-blue-600' : 'bg-[#222]'}`}></div>)}
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-black">
                    {step === 4 ? "Live Interview" : "Registration"}
                </h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Step {step} of 4</p>
            </div>

            {error && <div className="bg-red-900/20 text-red-500 p-3 rounded-xl text-center text-sm font-bold mb-6 border border-red-900/50 flex items-center justify-center gap-2"><AlertCircle size={16}/> {error}</div>}

            {/* Steps 1 & 2 omitted for brevity (Assume they are same as before) */}
            {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-blue-600 outline-none" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-blue-600 outline-none" placeholder="Email" type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-blue-600 outline-none" placeholder="Password" type="password" onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button onClick={() => setStep(2)} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition mt-2">Next Step</button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right">
                    <div className="bg-[#111] p-5 rounded-2xl border border-[#222]">
                        <div onClick={() => document.getElementById('govtId').click()} className="flex justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#222] cursor-pointer hover:border-blue-500">
                            <span className="text-sm">Government ID</span>
                            <span className="text-xs text-blue-400 font-bold">{govtIdFile ? "Uploaded" : "Upload"}</span>
                            <input id="govtId" type="file" hidden onChange={e => setGovtIdFile(e.target.files[0])}/>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold bg-[#111] text-gray-400">Back</button>
                        <button onClick={() => setStep(3)} className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200">Next Step</button>
                    </div>
                </div>
            )}

            {/* STEP 3: LIVENESS */}
            {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right text-center">
                    <div className="bg-[#111] rounded-2xl overflow-hidden border border-[#333] relative h-56 flex items-center justify-center">
                        {selfie ? <img src={selfie} alt="Selfie" className="w-full h-full object-cover"/> : cameraActive ? <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video> : <Camera size={48} className="text-gray-500 opacity-50"/>}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    {!selfie ? (cameraActive ? <button onClick={capturePhoto} className="w-full bg-white text-black font-bold py-3 rounded-xl">Capture</button> : <button onClick={startCamera} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Start Camera</button>) : <button onClick={() => { setSelfie(null); startCamera(); }} className="w-full bg-[#222] text-white font-bold py-3 rounded-xl">Retake</button>}
                    
                    <div className="text-left space-y-2 px-2">
                        <label className="flex gap-3 items-center cursor-pointer"><input type="checkbox" className="accent-blue-600" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}/><span className="text-xs text-gray-400">Code of Conduct</span></label>
                        <label className="flex gap-3 items-center cursor-pointer"><input type="checkbox" className="accent-blue-600" checked={agreedToBackgroundCheck} onChange={e => setAgreedToBackgroundCheck(e.target.checked)}/><span className="text-xs text-gray-400">Background Check</span></label>
                    </div>

                    <button onClick={handleVerificationSubmit} disabled={loading} className="w-full bg-green-600 text-black font-bold py-4 rounded-xl disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Proceed to Interview"}
                    </button>
                </div>
            )}

            {/* ✅ STEP 4: LIVE GOOGLE MEET & CODE */}
            {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right text-center">
                    <div className="bg-blue-900/10 p-6 rounded-3xl border border-blue-500/30 flex flex-col items-center">
                        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400 animate-pulse border-4 border-black">
                            <Video size={36}/>
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Live Interview</h3>
                        <p className="text-sm text-gray-400 mb-6 max-w-xs">
                            1. Click button to join Google Meet.<br/>
                            2. Show your ID to the Admin.<br/>
                            3. Enter the <b>Code</b> the Admin gives you.
                        </p>
                        
                        <a 
                            href={GOOGLE_MEET_LINK} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mb-6 transition"
                        >
                            <ExternalLink size={18}/> Join Google Meet Now
                        </a>

                        <div className="w-full bg-black/50 p-4 rounded-xl border border-white/10">
                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2 text-left">Admin Verification Code</label>
                            <input 
                                type="text" 
                                placeholder="ENTER CODE" 
                                className="bg-transparent text-white text-center text-2xl font-mono tracking-[0.2em] outline-none w-full uppercase"
                                value={adminCodeInput}
                                onChange={(e) => setAdminCodeInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <button onClick={handleCodeSubmit} disabled={loading} className="w-full bg-green-600 text-black font-black py-4 rounded-xl hover:bg-green-500 transition shadow-[0_0_20px_rgba(22,163,74,0.4)]">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Verify & Submit"}
                    </button>
                    
                    <p className="text-[10px] text-red-400 font-bold uppercase mt-4 flex items-center justify-center gap-1">
                        <Lock size={10}/> Account will remain locked until Admin Approval
                    </p>
                </div>
            )}
        </div>
    </div>
  );
};
export default VolunteerSignup;