"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, URIP_TOKEN_ABI, MOCK_USDT_ABI } from '@/config/contracts';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export interface URIPFundStats {
  totalValue: bigint;
  nav: bigint;
  totalTokens: bigint;
  managementFee: bigint;
}

export interface URIPFundInfo {
  totalAssetValue: bigint;
  navPerToken: bigint;
  lastNavUpdate: bigint;
  managementFee: bigint;
  isActive: boolean;
}

export const useURIPContract = () => {
  const { address } = useAccount();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  
  console.log('🏦 URIP Contract Hook - Address:', address);
  
  const { writeContract, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  // Read URIP token balance for connected wallet
  const { data: uripBalance, isError: balanceError, isLoading: balanceLoading, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.URIP,
    abi: URIP_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read URIP token decimals
  const { data: uripDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.URIP,
    abi: URIP_TOKEN_ABI,
    functionName: 'decimals',
  });

  // Read URIP token symbol
  const { data: uripSymbol } = useReadContract({
    address: CONTRACT_ADDRESSES.URIP,
    abi: URIP_TOKEN_ABI,
    functionName: 'symbol',
  });

  // Read URIP token name
  const { data: uripName } = useReadContract({
    address: CONTRACT_ADDRESSES.URIP,
    abi: URIP_TOKEN_ABI,
    functionName: 'name',
  });

  // Read current NAV
  const { data: navData, isError: navError, isLoading: navLoading, refetch: refetchNAV } = useReadContract({
    address: CONTRACT_ADDRESSES.URIP,
    abi: URIP_TOKEN_ABI,
    functionName: 'getCurrentNAV',
  });

  // Read fund statistics
  const { data: fundStats, isError: statsError, isLoading: statsLoading, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESSES.URIP,
    abi: URIP_TOKEN_ABI,
    functionName: 'getFundStats',
  });

  // Read fund info
  const { data: fundInfo, isError: infoError, isLoading: infoLoading, refetch: refetchInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.URIP,
    abi: URIP_TOKEN_ABI,
    functionName: 'fundInfo',
  });

  // Read USDT balance
  const { data: usdtBalance, isError: usdtBalanceError, isLoading: usdtBalanceLoading, refetch: refetchUSDTBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.MockUSDT,
    abi: MOCK_USDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read USDT decimals
  const { data: usdtDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.MockUSDT,
    abi: MOCK_USDT_ABI,
    functionName: 'decimals',
  });

  // Read USDT allowance for URIP contract
  const { data: usdtAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MockUSDT,
    abi: MOCK_USDT_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.URIP] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read faucet info
  const { data: lastFaucetClaim } = useReadContract({
    address: CONTRACT_ADDRESSES.MockUSDT,
    abi: MOCK_USDT_ABI,
    functionName: 'lastFaucetClaim',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: faucetCooldown } = useReadContract({
    address: CONTRACT_ADDRESSES.MockUSDT,
    abi: MOCK_USDT_ABI,
    functionName: 'faucetCooldown',
  });

  const { data: faucetAmount } = useReadContract({
    address: CONTRACT_ADDRESSES.MockUSDT,
    abi: MOCK_USDT_ABI,
    functionName: 'faucetAmount',
  });

  // Helper functions
  const formatURIPBalance = (balance: bigint | undefined, decimals: number | undefined = 18): string => {
    if (!balance || decimals === undefined) return '0';
    return formatUnits(balance, decimals);
  };

  const formatUSDTBalance = (balance: bigint | undefined, decimals: number | undefined = 6): string => {
    if (!balance || decimals === undefined) return '0';
    return formatUnits(balance, decimals);
  };

  const formatNAV = (nav: bigint | undefined): string => {
    if (!nav) return '0';
    return formatUnits(nav, 18); // NAV is in 18 decimals
  };

  const canUseFaucet = (): boolean => {
    if (!lastFaucetClaim || !faucetCooldown) return true;
    const now = Math.floor(Date.now() / 1000);
    const nextClaimTime = Number(lastFaucetClaim) + Number(faucetCooldown);
    return now >= nextClaimTime;
  };

  const getNextFaucetTime = (): Date | null => {
    if (!lastFaucetClaim || !faucetCooldown) return null;
    const nextClaimTime = (Number(lastFaucetClaim) + Number(faucetCooldown)) * 1000;
    return new Date(nextClaimTime);
  };

  // Transaction functions
  const claimFaucet = async () => {
    if (!address) throw new Error('Wallet not connected');
    if (!canUseFaucet()) throw new Error('Faucet cooldown not met');

    setIsTransactionPending(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.MockUSDT,
        abi: MOCK_USDT_ABI,
        functionName: 'faucet',
      });
    } catch (error) {
      setIsTransactionPending(false);
      throw error;
    }
  };

  const approveUSDT = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!usdtDecimals) throw new Error('USDT decimals not loaded');

    const amountBigInt = parseUnits(amount, usdtDecimals);
    
    setIsTransactionPending(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.MockUSDT,
        abi: MOCK_USDT_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.URIP, amountBigInt],
      });
    } catch (error) {
      setIsTransactionPending(false);
      throw error;
    }
  };

  const hasEnoughAllowance = (amount: string): boolean => {
    if (!usdtAllowance || !usdtDecimals) return false;
    const amountBigInt = parseUnits(amount, usdtDecimals);
    return usdtAllowance >= amountBigInt;
  };

  const hasEnoughBalance = (amount: string): boolean => {
    if (!usdtBalance || !usdtDecimals) return false;
    const amountBigInt = parseUnits(amount, usdtDecimals);
    return usdtBalance >= amountBigInt;
  };

  // Refresh all data
  const refreshAll = () => {
    refetchBalance();
    refetchNAV();
    refetchStats();
    refetchInfo();
    refetchUSDTBalance();
    refetchAllowance();
  };

  // Handle transaction completion
  const handleTransactionComplete = () => {
    setIsTransactionPending(false);
    refreshAll();
  };

  // Log key data
  console.log('🏦 URIP Contract Data:', {
    uripBalance: formatURIPBalance(uripBalance, uripDecimals),
    uripBalanceRaw: uripBalance,
    uripDecimals,
    uripSymbol,
    uripName,
    currentNAV: navData ? formatNAV(navData[0]) : '0',
    navTimestamp: navData ? Number(navData[1]) : 0,
    usdtBalance: formatUSDTBalance(usdtBalance, usdtDecimals),
    fundStats,
    fundInfo,
    canUseFaucet: canUseFaucet(),
    isLoading: balanceLoading || navLoading || statsLoading || infoLoading || usdtBalanceLoading,
    error: balanceError || navError || statsError || infoError || usdtBalanceError || writeError || receiptError, 
  });

  return {
    // Contract data
    uripBalance: formatURIPBalance(uripBalance, uripDecimals),
    uripBalanceRaw: uripBalance,
    uripDecimals,
    uripSymbol,
    uripName,
    
    // NAV data
    currentNAV: navData ? formatNAV(navData[0]) : '0',
    navTimestamp: navData ? Number(navData[1]) : 0,
    
    // Fund statistics
    fundStats: fundStats ? {
      totalValue: fundStats[0],
      nav: fundStats[1],
      totalTokens: fundStats[2],
      managementFee: fundStats[3],
    } as URIPFundStats : null,
    
    // Fund info
    fundInfo: fundInfo ? {
      totalAssetValue: fundInfo[0],
      navPerToken: fundInfo[1],
      lastNavUpdate: fundInfo[2],
      managementFee: fundInfo[3],
      isActive: fundInfo[4],
    } as URIPFundInfo : null,
    
    // USDT data
    usdtBalance: formatUSDTBalance(usdtBalance, usdtDecimals),
    usdtBalanceRaw: usdtBalance,
    usdtDecimals,
    usdtAllowance: usdtAllowance ? formatUSDTBalance(usdtAllowance, usdtDecimals) : '0',
    
    // Faucet data
    canUseFaucet: canUseFaucet(),
    nextFaucetTime: getNextFaucetTime(),
    faucetAmount: faucetAmount ? formatUSDTBalance(faucetAmount, usdtDecimals) : '0',
    
    // Loading states
    isLoading: balanceLoading || navLoading || statsLoading || infoLoading || usdtBalanceLoading,
    isTransactionPending: isTransactionPending || isWritePending || isConfirming,
    
    // Error states
    error: balanceError || navError || statsError || infoError || usdtBalanceError || writeError || receiptError,
    
    // Transaction states
    isConfirmed,
    transactionHash: hash,
    
    // Helper functions
    hasEnoughAllowance,
    hasEnoughBalance,
    
    // Actions
    claimFaucet,
    approveUSDT,
    refreshAll,
    handleTransactionComplete,
  };
};