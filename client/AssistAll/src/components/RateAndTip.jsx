import React, { useState } from 'react';
import { Star, CheckCircle, CreditCard, Loader2, Banknote, ShieldCheck, MessageSquare } from 'lucide-react';

const RateAndTip = ({ requestData, onSkip, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [selectedTip, setSelectedTip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');

  const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://assistall-server.onrender.com';

  // --- 1. HELPER: Load Razorpay Script ---
  const loadRazorpayScript = () => {
      return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
      });
  };

  // --- 2. PAYMENT HANDLER ---
  const handleOnlinePayment = async () => {
      setLoading(true);
      
      const res = await loadRazorpayScript();
      if (!res) {
          alert('Razorpay SDK failed to load. Check internet.');
          setLoading(false);
          return;
      }

      try {
          // A. Create Order
          const orderRes = await fetch(`${API_BASE}/api/payment/orders`, {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: selectedTip })
          });
          const orderData = await orderRes.json();

          // B. Open Options
          const options = {
              key: "rzp_test_S44Rgy9G3Yrika", 
              amount: orderData.amount,
              currency: orderData.currency,
              name: "AssistAll Tip",
              description: `Tip for ${requestData?.volunteerName}`,
              order_id: orderData.id,
              handler: async function (response) {
                  // C. Verify Payment
                  try {
                      const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
                          method: 'POST',
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                              razorpay_order_id: response.razorpay_order_id,
                              razorpay_payment_id: response.razorpay_payment_id,
                              razorpay_signature: response.razorpay_signature,
                          }),
                      });
                      
                      const verifyData = await verifyRes.json();
                      if (verifyData.status === 'success') {
                          // D. Submit Review with Payment Info
                          handleFinalSubmit('online');
                      } else {
                          alert("Payment Verification Failed");
                          setLoading(false);
                      }
                  } catch (e) {
                      alert("Server Error during verification");
                      setLoading(false);
                  }
              },
              theme: { color: "#16a34a" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
      } catch (err) {
          console.error(err);
          setLoading(false);
      }
  };

  const handleCashPayment = () => {
      setLoading(true);
      alert(`Please give ₹${selectedTip} cash to the volunteer.`);
      setTimeout(() => { handleFinalSubmit('cash'); }, 2000);
  };

  const handleFinalSubmit = async (method) => {
      // If called from online payment, loading is already true. If direct, set it.
      if (method === 'none') setLoading(true);

      try {
          await fetch(`${API_BASE}/api/requests/${requestData._id}/review`, {
              method: 'PUT',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                  rating, 
                  review: feedback, 
                  tip: selectedTip, 
                  paymentMethod: method 
              })
          });
          alert("Thank you! Feedback Submitted.");
          onSubmit(); 
      } catch (err) { 
          onSubmit(); 
      } finally { 
          setLoading(false); 
      }
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-white flex flex-col items-center justify-center p-6 animate-in zoom-in font-sans">
      <div className="text-center mb-6">
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4 border-green-50 animate-bounce">
              <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">Ride Completed!</h2>
          <p className="text-gray-500 mt-2 font-medium">How was {requestData?.volunteerName}?</p>
      </div>
      
      {/* Star Rating */}
      <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map(star => (
              <Star 
                  key={star} 
                  size={40} 
                  className={`cursor-pointer transition hover:scale-110 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                  onClick={() => setRating(star)}
              />
          ))}
      </div>
      
      {/* Feedback */}
      <div className="w-full max-w-sm mb-6 relative">
          <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
          <textarea className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pl-12 text-sm focus:outline-none focus:border-green-500 resize-none text-gray-700" rows="2" placeholder="Write a review..." value={feedback} onChange={(e) => setFeedback(e.target.value)}/>
      </div>

      {/* Tips */}
      <p className="font-bold text-gray-700 mb-3 text-center text-xs uppercase tracking-wide">Add a Tip</p>
      <div className="grid grid-cols-4 gap-3 mb-6 w-full max-w-sm">
          {[0, 20, 50, 100].map(amt => (
              <button key={amt} onClick={() => setSelectedTip(amt)} className={`py-3 rounded-xl font-bold border transition ${selectedTip === amt ? 'bg-black text-white' : 'bg-gray-50 text-gray-700'}`}>{amt === 0 ? "No" : `₹${amt}`}</button>
          ))}
      </div>
      
      {/* Payment Selection */}
      {selectedTip > 0 && (
          <div className="bg-blue-50 p-4 rounded-xl mb-6 w-full max-w-sm border border-blue-100 animate-in fade-in">
              <p className="text-xs font-bold text-blue-600 uppercase mb-3 flex items-center"><ShieldCheck size={14} className="mr-1"/> Payment Method</p>
              <div className="flex gap-3">
                  <button onClick={() => setPaymentMode('online')} className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${paymentMode === 'online' ? 'border-blue-600 bg-white text-blue-700' : 'border-transparent bg-blue-100/50 text-gray-500'}`}><CreditCard size={24} className="mb-1"/><span className="text-xs font-bold">Online</span></button>
                  <button onClick={() => setPaymentMode('cash')} className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition ${paymentMode === 'cash' ? 'border-green-600 bg-white text-green-700' : 'border-transparent bg-green-100/50 text-gray-500'}`}><Banknote size={24} className="mb-1"/><span className="text-xs font-bold">Cash</span></button>
              </div>
          </div>
      )}
      
      {/* Main Action Button */}
      {selectedTip > 0 ? (
          <button 
              onClick={paymentMode === 'online' ? handleOnlinePayment : handleCashPayment} 
              disabled={loading} 
              className={`w-full max-w-sm text-white font-bold py-4 rounded-2xl mb-3 transition flex items-center justify-center shadow-lg active:scale-95 ${paymentMode === 'online' ? 'bg-[#3395ff]' : 'bg-green-600'}`}
          >
              {loading ? <Loader2 className="animate-spin"/> : paymentMode === 'online' ? `Pay ₹${selectedTip}` : `Confirm Cash Payment`}
          </button>
      ) : (
          <button onClick={() => handleFinalSubmit('none')} disabled={loading} className="w-full max-w-sm bg-black text-white font-bold py-4 rounded-2xl mb-3 hover:bg-gray-800 shadow-lg active:scale-95 flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin"/> : "Submit Review"}
          </button>
      )}
      
      <button onClick={onSkip} className="text-gray-400 font-bold text-sm">Skip Feedback</button>
    </div>
  );
};

export default RateAndTip;