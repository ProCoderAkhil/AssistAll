import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, ChevronDown, Car, Shield, Heart, MapPin, 
  Users, Activity, Phone, Mail, Globe, Star, CheckCircle, 
  Zap, Target, Clock, ChevronRight, HelpCircle, Plus, Send, MessageSquare
} from 'lucide-react';

// ROBUST LOGO PATH
const logoImg = "/logo.png"; 

const LandingPage = ({ onGetStarted, onVolunteerJoin }) => {
  const [scrollY, setScrollY] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-green-500 selection:text-black">
      
      {/* --- LIVE AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] animate-pulse duration-[5000ms]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse duration-[8000ms]"></div>
      </div>

      {/* 1. NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex justify-between items-center ${scrollY > 20 ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => smoothScroll('home')}>
            <img 
                src={logoImg} 
                alt="AssistAll" 
                className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-green-500 transition duration-300"
                onError={(e) => {e.target.style.display='none';}} 
            />
            <span className="text-xl font-black tracking-tight text-white group-hover:text-gray-200 transition">AssistAll</span>
        </div>
        
        <div className="hidden md:flex gap-1 text-sm font-medium bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
            {['Home', 'How It Works', 'Services', 'FAQ', 'Contact'].map((item) => (
                <button 
                    key={item} 
                    onClick={() => smoothScroll(item.toLowerCase().replace(/\s+/g, ''))} 
                    className="px-5 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition duration-300"
                >
                    {item}
                </button>
            ))}
        </div>

        <div className="flex gap-3">
            <button onClick={onGetStarted} className="px-5 py-2 text-sm font-bold text-white hover:text-green-400 transition">Log In</button>
            <button onClick={onVolunteerJoin} className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition transform hover:scale-105 shadow-lg shadow-white/10">Get Started</button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center min-h-[90vh] justify-center z-10">
        <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-in slide-in-from-top duration-700 hover:border-green-500/50 transition cursor-default">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-[8px] font-bold">U{i}</div>)}
                </div>
                <span className="text-xs font-bold text-gray-300"><span className="text-green-400">12 Volunteers</span> active nearby</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] animate-in zoom-in duration-700">
                Freedom to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">Move & Live.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom duration-1000">
                The community-powered mobility platform. Connect with verified neighbors for rides, help, and companionship.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full animate-in slide-in-from-bottom duration-1000 delay-200">
                <button onClick={onGetStarted} className="w-full md:w-auto px-8 py-4 bg-green-600 text-black rounded-full font-bold text-lg flex items-center justify-center hover:bg-green-500 hover:scale-105 transition shadow-[0_0_40px_rgba(34,197,94,0.3)] group">
                    Find Help Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform"/>
                </button>
                <button onClick={onVolunteerJoin} className="w-full md:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/5 transition flex items-center justify-center gap-2">
                    <Heart size={20} className="text-red-500"/> Volunteer
                </button>
            </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="howitworks" className="py-24 px-6 relative z-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                  <span className="text-green-500 font-bold uppercase tracking-widest text-xs">Simple Process</span>
                  <h2 className="text-3xl md:text-5xl font-black mt-2">Help in 3 Steps</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"></div>
                  {[
                      { title: "Request", desc: "Choose a service (Ride, Meds, etc.) and set your location.", icon: MapPin },
                      { title: "Match", desc: "Our system finds the nearest verified volunteer instantly.", icon: Users },
                      { title: "Go", desc: "Track your volunteer in real-time and enjoy the help.", icon: Car }
                  ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center text-center group">
                          <div className="w-24 h-24 bg-neutral-900 border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-green-500/50 transition duration-300 shadow-2xl relative">
                              <step.icon size={32} className="text-white group-hover:text-green-400 transition"/>
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-sm font-bold border border-black">{i+1}</div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-gray-400 text-sm max-w-xs">{step.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. SERVICES */}
      <section id="services" className="py-32 px-6 relative z-10 bg-neutral-950">
          <div className="max-w-6xl mx-auto">
              <div className="mb-16">
                  <h2 className="text-4xl font-black mb-4">Our Services</h2>
                  <p className="text-gray-400 max-w-lg">Designed for seniors, students, and anyone needing a helping hand.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2 bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:border-green-500/30 transition group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><Car size={200}/></div>
                      <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-green-500"><Car size={24}/></div>
                      <h3 className="text-2xl font-bold mb-2">Transport & Rides</h3>
                      <p className="text-gray-400 max-w-sm">Door-to-door rides for medical appointments, social visits, and errands.</p>
                  </div>
                  <div className="bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:border-blue-500/30 transition group">
                      <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-blue-500"><Heart size={24}/></div>
                      <h3 className="text-xl font-bold mb-2">Companionship</h3>
                      <p className="text-gray-400 text-sm">Friendly faces for walks or just a chat.</p>
                  </div>
                  <div className="bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:border-purple-500/30 transition group">
                      <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-purple-500"><Activity size={24}/></div>
                      <h3 className="text-xl font-bold mb-2">Medicine Delivery</h3>
                      <p className="text-gray-400 text-sm">Prescriptions picked up safely.</p>
                  </div>
                  <div className="col-span-1 md:col-span-2 bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:border-orange-500/30 transition flex flex-col justify-center">
                       <div className="flex items-center gap-4 mb-4"><Shield className="text-orange-500" size={32}/><h3 className="text-xl font-bold">Safety Guarantee</h3></div>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="flex items-center gap-2 text-sm text-gray-400"><CheckCircle size={14} className="text-green-500"/> Govt ID Verified</div>
                           <div className="flex items-center gap-2 text-sm text-gray-400"><CheckCircle size={14} className="text-green-500"/> SOS Monitoring</div>
                       </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" className="py-24 px-6 bg-neutral-950 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-black mb-10 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                  {[
                      { q: "Is AssistAll really free?", a: "The app is free to use. Riders pay a nominal fee to volunteers to cover fuel and maintenance costs." },
                      { q: "How are volunteers verified?", a: "Every volunteer submits Government ID (Aadhaar/License) and undergoes a background check before activation." },
                      { q: "Can I book a ride for my parents?", a: "Yes! You can book on behalf of others and track their ride in real-time." }
                  ].map((item, i) => (
                      <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-neutral-900">
                          <button onClick={() => toggleFaq(i)} className="w-full p-5 flex justify-between items-center text-left hover:bg-white/5 transition">
                              <span className="font-bold">{item.q}</span>
                              <ChevronDown className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`}/>
                          </button>
                          {activeFaq === i && <div className="p-5 pt-0 text-gray-400 text-sm animate-in slide-in-from-top-2">{item.a}</div>}
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 6. CONTACT SECTION (NEW) */}
      <section id="contact" className="py-24 px-6 relative z-10 bg-black border-t border-white/10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
              
              {/* Left Column: Info */}
              <div>
                  <h2 className="text-4xl font-black mb-6">Get in Touch</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                      Have questions about our services or interested in partnering? 
                      We'd love to hear from you. Reach out to us directly or fill out the form.
                  </p>
                  
                  <div className="space-y-6">
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500"><Mail size={24}/></div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Email Us</p>
                              <p className="text-white font-bold">help@assistall.com</p>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500"><Phone size={24}/></div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Call Us</p>
                              <p className="text-white font-bold">+91 8089 123 456</p>
                          </div>
                      </div>

                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500"><MapPin size={24}/></div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Visit Us</p>
                              <p className="text-white font-bold">Tech Park, Kottayam, Kerala</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right Column: Form */}
              <div className="bg-neutral-900 p-8 rounded-3xl border border-white/10 shadow-2xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageSquare size={20} className="text-green-500"/> Send Message</h3>
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="First Name" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-green-500 outline-none transition"/>
                          <input type="text" placeholder="Last Name" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-green-500 outline-none transition"/>
                      </div>
                      <input type="email" placeholder="Email Address" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-green-500 outline-none transition"/>
                      <textarea rows="4" placeholder="How can we help?" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-green-500 outline-none transition resize-none"></textarea>
                      <button className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                          Send Message <Send size={18}/>
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 px-6 bg-black border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition">
                  <img src={logoImg} alt="logo" className="w-6 h-6 rounded-full grayscale" onError={(e) => {e.target.style.display='none';}}/>
                  <span className="font-bold text-sm">AssistAll Inc.</span>
              </div>
              <p className="text-gray-600 text-xs">© 2025 All Rights Reserved.</p>
              <div className="flex gap-6 text-xs text-gray-500 font-bold uppercase">
                  <a href="#" className="hover:text-white transition">Privacy</a>
                  <a href="#" className="hover:text-white transition">Terms</a>
                  <a href="#" className="hover:text-white transition">Twitter</a>
              </div>
          </div>
      </footer>
    </div>
  );
};
export default LandingPage;