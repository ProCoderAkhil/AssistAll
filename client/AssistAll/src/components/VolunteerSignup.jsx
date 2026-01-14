import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Shield, ArrowLeft, Loader2, Camera, FileText, Video, 
  Stethoscope, Car, HeartHandshake, AlertCircle, Check, Smartphone, Lock
} from 'lucide-react';

const VolunteerSignup = ({ onRegister, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
      name: '', email: '', password: '', address: '', phone: '', 
      serviceSector: 'transport', vehicleType: 'Car', vehicleModel: '', vehicleNumber: '' 
  });
  
  // --- SECURITY STATES ---
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToBackgroundCheck, setAgreedToBackgroundCheck] = useState(false);

  // --- FILE & CAMERA STATES ---
  const [govtIdFile, setGovtIdFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://assistall-server.onrender.com';

  // --- PASSWORD STRENGTH CHECKER ---
  const checkStrength = (pass) => {
      let score = 0;
      if (pass.length > 7) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;
      setPasswordStrength(score);
      setFormData({...formData, password: pass});
  };

  // --- SIMULATED PHONE OTP ---
  const sendOtp = () => {
      if (formData.phone.length < 10) return setError("Enter a valid phone number first.");
      setOtpSent(true);
      setError('');
      alert(`ASSIST-ALL SECURITY: Your verification code is 1234`); // Simulation
  };

  const verifyOtp = () => {
      if (otpInput === '1234') {
          setPhoneVerified(true);
          setOtpSent(false);
          setError('');
      } else {
          setError("Invalid OTP. Try again.");
      }
  };

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

  const handleSubmit = async () => {
    setLoading(true); setError('');
    
    if (!govtIdFile) { setError("Government ID is required."); setLoading(false); return; }
    if (!selfie) { setError("Live Selfie is required."); setLoading(false); return; }
    if (!agreedToTerms || !agreedToBackgroundCheck) { setError("You must agree to the terms."); setLoading(false); return; }

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
      if (res.ok) onRegister(data.user, data.token);
      else setError(data.message || "Registration Failed");
    } catch (e) { setError("Network Error"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#0a0a0a] border border-[#222] p-8 rounded-[32px] shadow-2xl relative z-10">
            <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full hover:bg-[#222] text-gray-500 hover:text-white transition"><ArrowLeft size={20}/></button>
            
            <div className="flex justify-center gap-2 mb-8 mt-2">
                {[1,2,3].map(i => <div key={i} className={`h-1 w-12 rounded-full transition-all ${step >= i ? 'bg-blue-600' : 'bg-[#222]'}`}></div>)}
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-black">{step === 1 ? "Secure Identity" : step === 2 ? "Documents" : "Live Verification"}</h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Step {step} of 3</p>
            </div>

            {error && <div className="bg-red-900/20 text-red-500 p-3 rounded-xl text-center text-sm font-bold mb-6 border border-red-900/50 flex items-center justify-center gap-2"><AlertCircle size={16}/> {error}</div>}

            {/* STEP 1: IDENTITY & PHONE */}
            {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-blue-600 outline-none" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
                    
                    {/* Phone Verification Module */}
                    <div className="bg-[#111] border border-[#222] p-4 rounded-xl space-y-3">
                        <div className="flex gap-2">
                            <input 
                                className="bg-transparent w-full outline-none" 
                                placeholder="Phone Number" 
                                disabled={phoneVerified}
                                onChange={e => setFormData({...formData, phone: e.target.value})} 
                            />
                            {phoneVerified ? (
                                <span className="text-green-500 font-bold text-xs flex items-center gap-1"><Check size={14}/> Verified</span>
                            ) : (
                                <button onClick={sendOtp} disabled={otpSent} className="text-blue-500 font-bold text-xs hover:text-white disabled:text-gray-600">
                                    {otpSent ? "Sent" : "Verify"}
                                </button>
                            )}
                        </div>
                        {otpSent && !phoneVerified && (
                            <div className="flex gap-2 border-t border-[#333] pt-3">
                                <input className="bg-transparent w-full outline-none text-center tracking-[0.5em] font-mono" placeholder="0000" maxLength={4} onChange={e => setOtpInput(e.target.value)} />
                                <button onClick={verifyOtp} className="bg-blue-600 text-white px-4 py-1 rounded-lg text-xs font-bold">Confirm</button>
                            </div>
                        )}
                    </div>

                    <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-blue-600 outline-none" placeholder="Email Address" type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
                    
                    {/* Password Strength */}
                    <div>
                        <input className="bg-[#111] border border-[#222] p-4 rounded-xl w-full focus:border-blue-600 outline-none" placeholder="Create Strong Password" type="password" onChange={e => checkStrength(e.target.value)} />
                        <div className="flex gap-1 mt-2 h-1 px-1">
                            {[1,2,3,4].map(i => <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= i ? (passwordStrength > 2 ? 'bg-green-500' : 'bg-yellow-500') : 'bg-[#222]'}`}></div>)}
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            if (!phoneVerified) setError("Please verify your phone number.");
                            else if (passwordStrength < 3) setError("Password is too weak.");
                            else setStep(2);
                        }} 
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition mt-2"
                    >
                        Next Step
                    </button>
                </div>
            )}

            {/* STEP 2: DOCUMENTS */}
            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right">
                    <div className="grid grid-cols-3 gap-3">
                        {['transport', 'medical', 'companionship'].map(sector => (
                            <button key={sector} onClick={() => setFormData({...formData, serviceSector: sector})} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${formData.serviceSector === sector ? 'bg-blue-600 border-blue-400 text-white' : 'bg-[#111] border-[#222] text-gray-500'}`}>
                                {sector === 'transport' ? <Car/> : sector === 'medical' ? <Stethoscope/> : <HeartHandshake/>}
                                <span className="text-[10px] font-bold uppercase">{sector}</span>
                            </button>
                        ))}
                    </div>

                    <div onClick={() => document.getElementById('govtId').click()} className="flex justify-between p-4 bg-[#111] rounded-xl border border-[#222] cursor-pointer hover:border-blue-500 transition">
                        <div className="flex gap-3 items-center"><Shield className="text-blue-500"/><span className="text-sm font-medium">Government ID Proof</span></div>
                        <span className="text-xs text-blue-400 font-bold">{govtIdFile ? "File Selected" : "Upload"}</span>
                        <input id="govtId" type="file" hidden onChange={e => setGovtIdFile(e.target.files[0])}/>
                    </div>

                    {formData.serviceSector === 'transport' && (
                        <div onClick={() => document.getElementById('license').click()} className="flex justify-between p-4 bg-[#111] rounded-xl border border-[#222] cursor-pointer hover:border-orange-500 transition">
                            <div className="flex gap-3 items-center"><FileText className="text-orange-500"/><span className="text-sm font-medium">Driving License</span></div>
                            <span className="text-xs text-orange-400 font-bold">{licenseFile ? "File Selected" : "Upload"}</span>
                            <input id="license" type="file" hidden onChange={e => setLicenseFile(e.target.files[0])}/>
                        </div>
                    )}
                    
                    <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold bg-[#111] text-gray-400">Back</button>
                        <button onClick={() => setStep(3)} className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200">Next Step</button>
                    </div>
                </div>
            )}

            {/* STEP 3: LIVENESS & CONSENT */}
            {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right text-center">
                    <div className="bg-[#111] rounded-2xl overflow-hidden border border-[#333] relative h-56 flex items-center justify-center">
                        {selfie ? (
                            <img src={selfie} alt="Selfie" className="w-full h-full object-cover"/>
                        ) : cameraActive ? (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video>
                        ) : (
                            <div className="text-gray-500 flex flex-col items-center">
                                <Camera size={48} className="mb-2 opacity-50"/>
                                <p className="text-xs uppercase font-bold">Face Verification</p>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>

                    {!selfie ? (
                        cameraActive ? (
                            <button onClick={capturePhoto} className="w-full bg-white text-black font-bold py-3 rounded-xl">Capture Photo</button>
                        ) : (
                            <button onClick={startCamera} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Enable Camera</button>
                        )
                    ) : (
                        <button onClick={() => { setSelfie(null); startCamera(); }} className="w-full bg-[#222] text-white font-bold py-3 rounded-xl text-sm">Retake Photo</button>
                    )}

                    <div className="bg-[#111] p-4 rounded-xl text-left space-y-3 border border-[#222]">
                        <label className="flex gap-3 items-start cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-blue-600" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}/>
                            <span className="text-xs text-gray-400">I agree to the <b className="text-white">Code of Conduct</b> and pledge to ensure the safety of all seniors.</span>
                        </label>
                        <label className="flex gap-3 items-start cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-blue-600" checked={agreedToBackgroundCheck} onChange={e => setAgreedToBackgroundCheck(e.target.checked)}/>
                            <span className="text-xs text-gray-400">I consent to a <b className="text-white">Background Check</b> using my Government ID.</span>
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold bg-[#111] text-gray-400">Back</button>
                        <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-green-600 text-black font-bold py-4 rounded-xl disabled:opacity-50 hover:bg-green-500 transition shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Submit Application"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
export default VolunteerSignup;