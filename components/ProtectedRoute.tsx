"use client"

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/' 
}: ProtectedRouteProps) {
  const { address, isConnecting, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If still connecting, keep loading
    if (isConnecting) {
      setIsLoading(true);
      return;
    }
    
    // If not connected and not connecting, redirect
    if (!isConnected && !address) {
      router.push(redirectTo);
      return;
    }
    
    // If connected and has address, stop loading
    if (isConnected && address) {
      setIsLoading(false);
    }
  }, [address, isConnecting, isConnected, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading || isConnecting) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg-primary to-dark-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent-blue mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!address) {
    return null;
  }

  return <>{children}</>;
} 