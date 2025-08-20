"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

interface UseUserPointsReturn {
  points: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserPoints = (): UseUserPointsReturn => {
  const { address, isConnected } = useAccount();
  const [points, setPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = useCallback(async () => {
    if (!address || !isConnected) {
      setPoints(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For now, generate mock points based on wallet address
      // In a real app, this would fetch from your backend/smart contract
      const addressHash = address.toLowerCase();
      let mockPoints = 0;
      
      // Generate pseudo-random points based on address
      for (let i = 0; i < addressHash.length; i++) {
        mockPoints += addressHash.charCodeAt(i);
      }
      
      // Scale to reasonable range (0-10000 points)
      mockPoints = (mockPoints % 10000) + 100;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPoints(mockPoints);
    } catch (err) {
      setError("Failed to fetch points");
      console.error("Error fetching points:", err);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const refetch = useCallback(() => {
    fetchPoints();
  }, [fetchPoints]);

  return {
    points,
    isLoading,
    error,
    refetch,
  };
};
