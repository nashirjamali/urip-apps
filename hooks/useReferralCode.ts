"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";

interface UseReferralCodeReturn {
  referralCode: string;
  isLoading: boolean;
}

export const useReferralCode = (): UseReferralCodeReturn => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  // Generate a unique referral code based on wallet address
  const referralCode = useMemo(() => {
    if (!address) return "";
    
    // Create a deterministic referral code from the wallet address
    // Take specific characters from the address and create a readable code
    const addressLower = address.toLowerCase();
    const prefix = "URIP";
    const addressPart = addressLower.slice(2, 8); // Remove '0x' and take 6 chars
    const checksum = addressLower.slice(-4); // Last 4 characters
    
    return `${prefix}-${addressPart.toUpperCase()}-${checksum.toUpperCase()}`;
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      // Simulate loading time for generating code
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
    }
  }, [address, isConnected]);

  return {
    referralCode,
    isLoading: !isConnected || !address || isLoading,
  };
};
