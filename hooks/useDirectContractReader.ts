"use client";

import { useState, useEffect } from 'react';
import { readContract } from '@wagmi/core';
import { formatUnits } from 'viem';
import { config } from '@/config/xellarConfig';
import { ASSET_TOKENS, ASSET_TOKEN_ABI } from '@/config/contracts';
import { useAccount } from 'wagmi';

export interface DirectTokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  currentPrice: string;
  balance: string;
  isActive: boolean;
  assetType: string;
  lastUpdate: number;
}

export const useDirectContractReader = () => {
  const { address } = useAccount();
  const [tokens, setTokens] = useState<DirectTokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Direct contract reading function - similar to your approach
  const readSingleToken = async (tokenAddress: string, tokenInfo: any): Promise<DirectTokenData | null> => {
    try {
      console.log(`🔍 Reading token: ${tokenInfo.symbol} at ${tokenAddress}`);
      
      // Read basic token info in parallel
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        readContract(config, {
          address: tokenAddress as any,
          abi: ASSET_TOKEN_ABI,
          functionName: 'name',
        }),
        readContract(config, {
          address: tokenAddress as any,
          abi: ASSET_TOKEN_ABI,
          functionName: 'symbol',
        }),
        readContract(config, {
          address: tokenAddress as any,
          abi: ASSET_TOKEN_ABI,
          functionName: 'decimals',
        }),
        readContract(config, {
          address: tokenAddress as any,
          abi: ASSET_TOKEN_ABI,
          functionName: 'totalSupply',
        }),
      ]);

      // Read asset-specific info
      const [priceResult, assetInfoResult] = await Promise.all([
        readContract(config, {
          address: tokenAddress as any,
          abi: ASSET_TOKEN_ABI,
          functionName: 'getCurrentPrice',
        }),
        readContract(config, {
          address: tokenAddress as any,
          abi: ASSET_TOKEN_ABI,
          functionName: 'assetInfo',
        }),
      ]);

      // Read user balance if connected
      let balance = '0';
      if (address) {
        try {
          const balanceRaw = await readContract(config, {
            address: tokenAddress as any,
            abi: ASSET_TOKEN_ABI,
            functionName: 'balanceOf',
            args: [address],
          });
          balance = formatUnits(balanceRaw as bigint, decimals as number);
        } catch (balanceError) {
          console.warn(`Failed to read balance for ${tokenInfo.symbol}:`, balanceError);
        }
      }

      const [priceRaw, lastUpdate] = priceResult as [bigint, bigint];
      const [, assetType, , , isActive] = assetInfoResult as [string, string, bigint, bigint, boolean];

      const tokenData: DirectTokenData = {
        address: tokenAddress,
        symbol: symbol as string,
        name: name as string,
        decimals: decimals as number,
        totalSupply: formatUnits(totalSupply as bigint, decimals as number),
        currentPrice: formatUnits(priceRaw, 8), // Prices are stored with 8 decimals
        balance,
        isActive: isActive as boolean,
        assetType: assetType as string,
        lastUpdate: Number(lastUpdate),
      };

      console.log(`✅ Successfully read ${tokenInfo.symbol}:`, tokenData);
      return tokenData;
    } catch (error) {
      console.error(`❌ Failed to read token ${tokenInfo.symbol}:`, error);
      return null;
    }
  };

  // Load all tokens sequentially to avoid overwhelming the RPC
  const loadAllTokens = async () => {
    setIsLoading(true);
    setError(null);
    setTokens([]);

    try {
      const tokenAddresses = Object.values(ASSET_TOKENS);
      setProgress({ current: 0, total: tokenAddresses.length });

      const results: DirectTokenData[] = [];

      for (let i = 0; i < tokenAddresses.length; i++) {
        const tokenInfo = tokenAddresses[i];
        setProgress({ current: i + 1, total: tokenAddresses.length });

        const tokenData = await readSingleToken(tokenInfo.address, tokenInfo);
        if (tokenData) {
          results.push(tokenData);
        }

        // Small delay between requests to avoid rate limiting
        if (i < tokenAddresses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      console.log(`🎯 Loaded ${results.length} out of ${tokenAddresses.length} tokens`);
      
      if (results.length === 0) {
        setError('No tokens could be loaded. Please check your network connection and contract deployment.');
      } else {
        setTokens(results);
      }
    } catch (error) {
      console.error('❌ Error loading tokens:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tokens');
    } finally {
      setIsLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  // Load tokens on mount and when address changes
  useEffect(() => {
    loadAllTokens();
  }, [address]);

  // Helper functions
  const getTokenBySymbol = (symbol: string): DirectTokenData | undefined => {
    return tokens.find(token => token.symbol === symbol);
  };

  const getTokenByAddress = (address: string): DirectTokenData | undefined => {
    return tokens.find(token => token.address.toLowerCase() === address.toLowerCase());
  };

  const getActiveTokens = (): DirectTokenData[] => {
    return tokens.filter(token => token.isActive);
  };

  const getUserHoldings = (): DirectTokenData[] => {
    if (!address) return [];
    return tokens.filter(token => parseFloat(token.balance) > 0);
  };

  const getTotalPortfolioValue = (): number => {
    if (!address) return 0;
    return tokens.reduce((total, token) => {
      const balance = parseFloat(token.balance);
      const price = parseFloat(token.currentPrice);
      return total + (balance * price);
    }, 0);
  };

  return {
    // Data
    tokens,
    activeTokens: getActiveTokens(),
    userHoldings: getUserHoldings(),
    totalPortfolioValue: getTotalPortfolioValue(),
    
    // Loading and error states
    isLoading,
    error,
    progress,
    
    // Helper functions
    getTokenBySymbol,
    getTokenByAddress,
    
    // Actions
    refetch: loadAllTokens,
  };
}; 