import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

const VolunteerFound = ({ requestData, onReset }) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 z-[2000] p-6 pb-24 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-500 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><CheckCircle size={40} className="text-green-600" /></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Volunteer Found!</h2>
            <p className="text-gray-500 mb-8">{requestData?.volunteerName} is heading your way.</p>
            
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-3">{requestData?.volunteerName?.charAt(0)}</div>
                    <div className="text-left"><p className="font-bold text-sm">{requestData?.volunteerName}</p><p className="text-[10px] font-bold text-green-600 uppercase">Verified</p></div>
                </div>
                <div><p className="text-[10px] font-bold text-gray-400 uppercase">Fare</p><p className="font-bold text-lg text-gray-900">₹{requestData?.price}</p></div>
            </div>
            <button onClick={onReset} className="text-red-500 font-bold text-sm hover:underline">Cancel Request</button>
        </div>
    );
};
export default VolunteerFound;