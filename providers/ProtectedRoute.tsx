"use client"

import React, { ReactNode, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Short delay to prevent flash of loading state
    const checkAuth = setTimeout(() => {
      if (!isConnected || !address) {
        // Redirect to login if not connected
        router.push('/login');
      } else {
        // User is authenticated, show content
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(checkAuth);
  }, [isConnected, address, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
          <p className="text-xl font-medium text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}; 