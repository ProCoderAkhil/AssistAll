import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); 
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const config = {
    info: { icon: Info, color: 'bg-blue-600', textColor: 'text-white' },
    success: { icon: CheckCircle, color: 'bg-green-600', textColor: 'text-white' },
    error: { icon: AlertTriangle, color: 'bg-red-600', textColor: 'text-white' },
  };

  const { icon: Icon, color, textColor } = config[type] || config.info;

  return (
    <div 
        className={`flex items-center w-80 p-4 rounded-xl shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 
                   ${color} ${textColor} font-sans animate-in slide-in-from-top-4 fade-in-30 slide-out-to-top-4 fade-out-30`}
        role="alert"
    >
      <Icon size={20} className="mr-3 flex-shrink-0" />
      <div className="flex-grow text-sm font-medium">{message}</div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition ml-3">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;