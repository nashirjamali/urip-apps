import type React from "react";

const GovernanceLoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Governance Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Animated rings */}
          <div className="absolute inset-0 w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-2 border-[#F77A0E]/30 animate-ping"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-4">Loading DAO Governance</h2>
        <p className="text-gray-400 mb-8">Fetching proposals and voting data...</p>
        
        {/* Loading Skeleton Cards */}
        <div className="space-y-4 max-w-lg mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-pulse">
            <div className="mb-3">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-green-500/30 rounded w-16"></div>
                <div className="h-3 bg-red-500/30 rounded w-16"></div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-pulse animation-delay-200">
            <div className="mb-3">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-green-500/30 rounded w-16"></div>
                <div className="h-3 bg-red-500/30 rounded w-16"></div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceLoadingPage;
