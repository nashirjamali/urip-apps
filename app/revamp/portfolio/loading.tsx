import type React from "react";

const PortfolioLoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        {/* Portfolio Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-2 border-[#F77A0E]/30 animate-ping"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-black mb-4">Loading Portfolio</h2>
        <p className="text-gray-600 mb-8">Calculating your investment performance...</p>
        
        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-[#F77A0E]/20 rounded w-20"></div>
              <div className="w-6 h-6 bg-[#F77A0E]/20 rounded"></div>
            </div>
            <div className="h-8 bg-[#F77A0E]/30 rounded mb-2"></div>
            <div className="h-3 bg-[#F77A0E]/10 rounded w-3/4"></div>
          </div>
          
          <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 animate-pulse animation-delay-200">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-[#F77A0E]/20 rounded w-16"></div>
              <div className="w-6 h-6 bg-[#F77A0E]/20 rounded"></div>
            </div>
            <div className="h-8 bg-green-500/30 rounded mb-2"></div>
            <div className="h-3 bg-[#F77A0E]/10 rounded w-2/3"></div>
          </div>
          
          <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 animate-pulse animation-delay-400">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-[#F77A0E]/20 rounded w-14"></div>
              <div className="w-6 h-6 bg-[#F77A0E]/20 rounded"></div>
            </div>
            <div className="h-8 bg-[#F77A0E]/30 rounded mb-2"></div>
            <div className="h-3 bg-[#F77A0E]/10 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Loading Asset Cards */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-[#F77A0E]/20 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#F77A0E]/20 rounded mb-2"></div>
                <div className="h-3 bg-[#F77A0E]/10 rounded w-2/3"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-[#F77A0E]/20 rounded mb-1 w-16"></div>
                <div className="h-3 bg-[#F77A0E]/10 rounded w-12"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 animate-pulse animation-delay-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-[#F77A0E]/20 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#F77A0E]/20 rounded mb-2"></div>
                <div className="h-3 bg-[#F77A0E]/10 rounded w-2/3"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-[#F77A0E]/20 rounded mb-1 w-16"></div>
                <div className="h-3 bg-[#F77A0E]/10 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioLoadingPage;
