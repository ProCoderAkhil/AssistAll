import React, { useState } from 'react';
import { Star, CheckCircle, IndianRupee, CreditCard, Loader2, Banknote, ShieldCheck } from 'lucide-react';

// Simplified for brevity - assumes script load logic exists or loads fast
const RateAndTip = ({ requestData, onSkip, onSubmit, showToast }) => {
  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');

  const DEPLOYED_API_URL = 'http://localhost:5000'; 
  const RAZORPAY_KEY_ID = 'rzp_test_Rp78fSKZ69hMxt'; 

  const handleFinalSubmit = async (method) => {
      try {
        await fetch(`${DEPLOYED_API_URL}/api/requests/${requestData._id}/tip`, {
            method: 'PUT', headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: selectedTip, paymentMethod: method })
        });
        if (showToast) showToast(`Tip of ₹${selectedTip} Sent!`, "success");
        onSubmit();
      } catch (err) { onSubmit(); }
  };

  const handleCashPayment = () => {
      setLoading(true);
      if (showToast) showToast(`Please give ₹${selectedTip} cash to volunteer.`, "info"); // <--- TOAST INSTEAD OF ALERT
      setTimeout(() => {
          handleFinalSubmit('cash');
          setLoading(false);
      }, 3000);
  };

  const handleOnlinePayment = async () => { /* ... (Razorpay logic stays same) ... */ }; 
  // Note: For brevity in this response, assume Razorpay logic is same as previous step. 
  // Just ensure handleCashPayment uses showToast.

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[3000] p-6 pb-24 animate-in slide-in-from-bottom duration-500 font-sans">
      <div className="text-center mb-6"><div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4"><CheckCircle size={32} className="text-green-600" /></div><h2 className="text-2xl font-bold text-gray-900">Ride Completed!</h2><p className="text-gray-500 mt-1">Rate {requestData?.volunteerName}</p></div>
      <div className="flex justify-center gap-3 mb-8">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} size={36} className={`cursor-pointer transition hover:scale-110 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} onClick={() => setRating(star)}/>))}</div>
      <p className="font-bold text-gray-700 mb-4 text-center text-sm uppercase tracking-wide">Add a Tip</p>
      <div className="grid grid-cols-4 gap-3 mb-6">{[0, 20, 50, 100].map((amt) => (<button key={amt} onClick={() => setSelectedTip(amt)} className={`py-3 rounded-xl font-bold border transition ${selectedTip === amt ? 'bg-black text-white border-black scale-105' : 'bg-white text-gray-700 border-gray-200'}`}>{amt === 0 ? "No" : `₹${amt}`}</button>))}</div>
      {selectedTip > 0 && (<div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100"><p className="text-xs font-bold text-blue-600 uppercase mb-3 flex items-center"><ShieldCheck size={14} className="mr-1"/> Payment Method</p><div className="flex gap-3"><button onClick={() => setPaymentMode('online')} className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${paymentMode === 'online' ? 'border-blue-600 bg-white text-blue-700 shadow-sm' : 'border-transparent bg-blue-100/50 text-gray-500 hover:bg-white'}`}><CreditCard size={24} className="mb-1"/><span className="text-xs font-bold">Online</span></button><button onClick={() => setPaymentMode('cash')} className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${paymentMode === 'cash' ? 'border-green-600 bg-white text-green-700 shadow-sm' : 'border-transparent bg-green-100/50 text-gray-500 hover:bg-white'}`}><Banknote size={24} className="mb-1"/><span className="text-xs font-bold">Cash</span></button></div></div>)}
      {selectedTip > 0 ? (<button onClick={paymentMode === 'online' ? handleOnlinePayment : handleCashPayment} disabled={loading} className={`w-full text-white font-bold py-4 rounded-2xl mb-3 transition flex items-center justify-center shadow-lg active:scale-95 ${paymentMode === 'online' ? 'bg-[#3395ff] hover:bg-[#287acc]' : 'bg-green-600 hover:bg-green-700'}`}>{loading ? <><Loader2 className="animate-spin mr-2"/> Processing...</> : paymentMode === 'online' ? <><CreditCard className="mr-2" size={20}/> Pay ₹{selectedTip}</> : <><Banknote className="mr-2" size={20}/> Confirm Cash Payment</>}</button>) : (<button onClick={() => onSubmit(0)} className="w-full bg-black text-white font-bold py-4 rounded-2xl mb-3 hover:bg-gray-800 shadow-lg active:scale-95">Submit Review</button>)}
      <button onClick={onSkip} className="w-full text-gray-400 font-medium">Skip</button>
    </div>
  );
};
export default RateAndTip;