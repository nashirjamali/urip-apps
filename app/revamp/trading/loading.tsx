import type React from "react";

const TradingLoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        {/* Trading Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-2 border-[#F77A0E]/30 animate-ping"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-black mb-4">Loading Trading Platform</h2>
        <p className="text-gray-600 mb-8">Fetching market data and asset information...</p>
        
        {/* Loading Skeleton Cards */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#F77A0E]/20 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#F77A0E]/20 rounded mb-2"></div>
                <div className="h-3 bg-[#F77A0E]/10 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 animate-pulse animation-delay-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#F77A0E]/20 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#F77A0E]/20 rounded mb-2"></div>
                <div className="h-3 bg-[#F77A0E]/10 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingLoadingPage;
