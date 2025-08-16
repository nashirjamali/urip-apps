import type React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* URIP Logo with Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-2 border-[#F77A0E]/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-xl border-2 border-[#E6690D]/20 animate-ping animation-delay-200"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-4">Loading URIP</h2>
        <p className="text-gray-400 mb-8">Preparing your trading experience...</p>
        
        {/* Loading Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#F77A0E] to-[#E6690D] rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-[#F77A0E] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#E6690D] rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-[#FF8C42] rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
