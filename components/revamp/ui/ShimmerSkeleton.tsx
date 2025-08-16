"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps {
  className?: string;
  variant?: "default" | "rounded" | "circle" | "card";
  children?: React.ReactNode;
}

export const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
  className,
  variant = "default",
  children
}) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-800/30 via-gray-700/50 to-gray-800/30 bg-[length:200%_100%] animate-shimmer";
  
  const variantClasses = {
    default: "rounded",
    rounded: "rounded-lg",
    circle: "rounded-full",
    card: "rounded-xl"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

// Add shimmer animation to global CSS
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;

// Portfolio Page Shimmer
export const PortfolioPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <ShimmerSkeleton className="h-10 w-32" />
            <div className="flex gap-4">
              <ShimmerSkeleton className="h-10 w-24" />
              <ShimmerSkeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <ShimmerSkeleton className="h-10 w-48 mb-2" />
              <ShimmerSkeleton className="h-5 w-64" />
            </div>
            <div className="flex gap-2">
              <ShimmerSkeleton className="h-10 w-24" />
              <ShimmerSkeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
        
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((item) => (
            <ShimmerSkeleton key={item} variant="card" className="h-32 p-6">
              <div className="flex items-center justify-between mb-4">
                <ShimmerSkeleton className="h-6 w-24" />
                <ShimmerSkeleton variant="circle" className="h-6 w-6" />
              </div>
              <ShimmerSkeleton className="h-8 w-32 mb-2" />
              <ShimmerSkeleton className="h-4 w-40" />
            </ShimmerSkeleton>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Individual Assets Skeleton */}
          <div className="space-y-6">
            <ShimmerSkeleton className="h-8 w-48 mb-6" />
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <ShimmerSkeleton key={item} variant="card" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <ShimmerSkeleton variant="circle" className="h-12 w-12" />
                      <div>
                        <ShimmerSkeleton className="h-5 w-32 mb-2" />
                        <ShimmerSkeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <ShimmerSkeleton className="h-6 w-24 mb-1" />
                      <ShimmerSkeleton className="h-4 w-20" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <ShimmerSkeleton className="h-4 w-16 mb-1" />
                      <ShimmerSkeleton className="h-5 w-28" />
                    </div>
                    <ShimmerSkeleton className="h-9 w-28" />
                  </div>
                  
                  <ShimmerSkeleton className="h-3 w-full" />
                </ShimmerSkeleton>
              ))}
            </div>
          </div>
          
          {/* Mutual Fund Skeleton */}
          <div className="space-y-6">
            <ShimmerSkeleton className="h-8 w-32 mb-6" />
            
            <ShimmerSkeleton variant="card" className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <ShimmerSkeleton variant="circle" className="h-12 w-12" />
                  <div>
                    <ShimmerSkeleton className="h-6 w-28 mb-2" />
                    <ShimmerSkeleton className="h-4 w-40" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <ShimmerSkeleton className="h-4 w-32 mb-1" />
                    <ShimmerSkeleton className="h-6 w-24" />
                  </div>
                  <div>
                    <ShimmerSkeleton className="h-4 w-32 mb-1" />
                    <ShimmerSkeleton className="h-6 w-24" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <ShimmerSkeleton className="h-4 w-12 mb-2" />
                  <div className="flex items-center space-x-4">
                    <ShimmerSkeleton className="h-7 w-20" />
                    <ShimmerSkeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
              
              <ShimmerSkeleton className="h-12 w-full" />
            </ShimmerSkeleton>
            
            {/* Performance Chart Skeleton */}
            <ShimmerSkeleton variant="card" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <ShimmerSkeleton className="h-6 w-40" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <ShimmerSkeleton key={item} className="h-6 w-8" />
                  ))}
                </div>
              </div>
              <ShimmerSkeleton className="h-64 w-full" />
            </ShimmerSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trading Page Shimmer
export const TradingPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <ShimmerSkeleton className="h-10 w-32" />
            <div className="flex gap-4">
              <ShimmerSkeleton className="h-10 w-64" />
              <ShimmerSkeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Title and Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <ShimmerSkeleton className="h-10 w-48 mb-2" />
              <ShimmerSkeleton className="h-5 w-64" />
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((item) => (
              <ShimmerSkeleton key={item} className="h-10 w-24" />
            ))}
          </div>
        </div>
        
        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <ShimmerSkeleton key={item} variant="card" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <ShimmerSkeleton variant="circle" className="h-10 w-10" />
                  <div>
                    <ShimmerSkeleton className="h-5 w-24 mb-1" />
                    <ShimmerSkeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <ShimmerSkeleton className="h-4 w-16 mb-1" />
                  <ShimmerSkeleton className="h-6 w-20" />
                </div>
                
                <div>
                  <ShimmerSkeleton className="h-4 w-20 mb-1" />
                  <ShimmerSkeleton className="h-5 w-16" />
                </div>
                
                <ShimmerSkeleton className="h-9 w-full" />
              </div>
            </ShimmerSkeleton>
          ))}
        </div>
      </div>
    </div>
  );
};

// Governance Page Shimmer
export const GovernancePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <ShimmerSkeleton className="h-10 w-32" />
            <div className="flex gap-4">
              <ShimmerSkeleton className="h-10 w-24" />
              <ShimmerSkeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <ShimmerSkeleton className="h-10 w-48 mb-2" />
              <ShimmerSkeleton className="h-5 w-64" />
            </div>
            <ShimmerSkeleton className="h-10 w-40" />
          </div>
        </div>
        
        {/* Governance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <ShimmerSkeleton key={item} variant="card" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <ShimmerSkeleton className="h-5 w-24" />
                <ShimmerSkeleton variant="circle" className="h-6 w-6" />
              </div>
              <ShimmerSkeleton className="h-8 w-16 mb-2" />
              <ShimmerSkeleton className="h-4 w-20" />
            </ShimmerSkeleton>
          ))}
        </div>
        
        {/* Proposals List */}
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <ShimmerSkeleton key={item} variant="card" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <ShimmerSkeleton className="h-6 w-20" />
                    <ShimmerSkeleton className="h-6 w-24" />
                  </div>
                  <ShimmerSkeleton className="h-6 w-3/4 mb-2" />
                  <ShimmerSkeleton className="h-4 w-full mb-2" />
                  <ShimmerSkeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2">
                  <ShimmerSkeleton className="h-10 w-20" />
                  <ShimmerSkeleton className="h-10 w-20" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <ShimmerSkeleton className="h-4 w-16 mb-2" />
                  <ShimmerSkeleton className="h-6 w-20" />
                </div>
                <div>
                  <ShimmerSkeleton className="h-4 w-20 mb-2" />
                  <ShimmerSkeleton className="h-6 w-24" />
                </div>
                <div>
                  <ShimmerSkeleton className="h-4 w-16 mb-2" />
                  <ShimmerSkeleton className="h-6 w-16" />
                </div>
              </div>
              
              <ShimmerSkeleton className="h-2 w-full" />
            </ShimmerSkeleton>
          ))}
        </div>
      </div>
    </div>
  );
};

// Trading Detail Page Shimmer  
export const TradingDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShimmerSkeleton className="h-10 w-32" />
              <ShimmerSkeleton className="h-8 w-40" />
            </div>
            <ShimmerSkeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <ShimmerSkeleton className="h-8 w-48 mb-4" />
              <ShimmerSkeleton variant="card" className="h-96 p-6">
                <div className="flex items-center justify-between mb-4">
                  <ShimmerSkeleton className="h-6 w-32" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <ShimmerSkeleton key={item} className="h-6 w-8" />
                    ))}
                  </div>
                </div>
                <ShimmerSkeleton className="h-80 w-full" />
              </ShimmerSkeleton>
            </div>
            
            {/* Company Info */}
            <ShimmerSkeleton variant="card" className="p-6">
              <ShimmerSkeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                <ShimmerSkeleton className="h-4 w-full" />
                <ShimmerSkeleton className="h-4 w-3/4" />
                <ShimmerSkeleton className="h-4 w-5/6" />
              </div>
            </ShimmerSkeleton>
          </div>
          
          {/* Trading Panel */}
          <div className="space-y-6">
            <ShimmerSkeleton variant="card" className="p-6">
              <div className="flex gap-2 mb-6">
                <ShimmerSkeleton className="h-10 w-1/2" />
                <ShimmerSkeleton className="h-10 w-1/2" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <ShimmerSkeleton className="h-4 w-16 mb-2" />
                  <ShimmerSkeleton className="h-12 w-full" />
                </div>
                
                <div>
                  <ShimmerSkeleton className="h-4 w-20 mb-2" />
                  <ShimmerSkeleton className="h-12 w-full" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ShimmerSkeleton className="h-4 w-16 mb-2" />
                    <ShimmerSkeleton className="h-6 w-full" />
                  </div>
                  <div>
                    <ShimmerSkeleton className="h-4 w-20 mb-2" />
                    <ShimmerSkeleton className="h-6 w-full" />
                  </div>
                </div>
                
                <ShimmerSkeleton className="h-12 w-full" />
              </div>
            </ShimmerSkeleton>
            
            {/* Market Info */}
            <ShimmerSkeleton variant="card" className="p-6">
              <ShimmerSkeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex justify-between">
                    <ShimmerSkeleton className="h-4 w-24" />
                    <ShimmerSkeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </ShimmerSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Page Shimmer
export const ProfilePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Shimmer */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShimmerSkeleton className="w-8 h-8 rounded-lg" />
              <ShimmerSkeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center space-x-8">
              {[1, 2, 3, 4].map((item) => (
                <ShimmerSkeleton key={item} className="h-4 w-16" />
              ))}
            </div>
            <ShimmerSkeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Page Title */}
        <div className="mb-8">
          <ShimmerSkeleton className="h-8 w-48 mb-2" />
          <ShimmerSkeleton className="h-4 w-64" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <ShimmerSkeleton variant="card" className="p-4 sticky top-6">
              <div className="space-y-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="flex items-center space-x-3 px-3 py-2">
                    <ShimmerSkeleton className="w-4 h-4 rounded" />
                    <ShimmerSkeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </ShimmerSkeleton>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Profile Information Card */}
            <ShimmerSkeleton variant="card" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <ShimmerSkeleton className="w-5 h-5 mr-2" />
                  <ShimmerSkeleton className="h-6 w-32" />
                </div>
                <ShimmerSkeleton className="h-8 w-16 rounded-lg" />
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <ShimmerSkeleton className="w-24 h-24 rounded-full" />
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <ShimmerSkeleton className="h-4 w-20 mb-1" />
                      <ShimmerSkeleton className="h-6 w-full" />
                    </div>
                    <div>
                      <ShimmerSkeleton className="h-4 w-16 mb-1" />
                      <ShimmerSkeleton className="h-6 w-full" />
                    </div>
                  </div>
                  
                  <div>
                    <ShimmerSkeleton className="h-4 w-8 mb-1" />
                    <ShimmerSkeleton className="h-16 w-full" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <ShimmerSkeleton className="h-4 w-16 mb-1" />
                      <ShimmerSkeleton className="h-6 w-full" />
                    </div>
                    <div>
                      <ShimmerSkeleton className="h-4 w-20 mb-1" />
                      <ShimmerSkeleton className="h-6 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </ShimmerSkeleton>

            {/* Connected Wallets Card */}
            <ShimmerSkeleton variant="card" className="p-6">
              <div className="flex items-center mb-6">
                <ShimmerSkeleton className="w-5 h-5 mr-2" />
                <ShimmerSkeleton className="h-6 w-32" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShimmerSkeleton className="w-8 h-8 rounded-full" />
                    <div>
                      <ShimmerSkeleton className="h-4 w-20 mb-1" />
                      <ShimmerSkeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="text-right">
                    <ShimmerSkeleton className="h-5 w-16 mb-1" />
                    <ShimmerSkeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </ShimmerSkeleton>

            {/* Additional Settings Cards */}
            <ShimmerSkeleton variant="card" className="p-6">
              <div className="flex items-center mb-6">
                <ShimmerSkeleton className="w-5 h-5 mr-2" />
                <ShimmerSkeleton className="h-6 w-40" />
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShimmerSkeleton className="w-5 h-5" />
                      <div>
                        <ShimmerSkeleton className="h-4 w-32 mb-1" />
                        <ShimmerSkeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <ShimmerSkeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            </ShimmerSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
};
