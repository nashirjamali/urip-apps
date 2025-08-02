"use client"

import React, { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UnprotectedRouteProps {
  children: ReactNode;
}

export const UnprotectedRoute = ({ children }: UnprotectedRouteProps) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // If user is connected and has an address, redirect to account page
    if (isConnected && address) {
      router.push('/dashboard');
    }
  }, [isConnected, address, router]);

  // Show loading while checking connection status
  if (isConnected && address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Render children if user is not connected
  return <>{children}</>;
}; 