"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, Address } from 'viem';
import { CONTRACT_ADDRESSES, PURCHASE_MANAGER_ABI, MOCK_USDT_ABI } from '@/config/contracts';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export const usePurchaseManager = () => {
  const { address } = useAccount();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  
  const { writeContract, data: hash, error: writeError, isPending: isWritePending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  });

  // Read USDT balance
  const { data: usdtBalance, refetch: refetchUSDTBalance } = useReadContract({
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

  // Check if payment token is supported (MockUSDT)
  const { data: isPaymentTokenSupported } = useReadContract({
    address: CONTRACT_ADDRESSES.PurchaseManager,
    abi: PURCHASE_MANAGER_ABI,
    functionName: 'supportedPaymentTokens',
    args: [CONTRACT_ADDRESSES.MockUSDT],
  });

  // Check if asset token is supported
  const checkAssetTokenSupported = (assetTokenAddress: Address) => {
    const { data: isSupported } = useReadContract({
      address: CONTRACT_ADDRESSES.PurchaseManager,
      abi: PURCHASE_MANAGER_ABI,
      functionName: 'supportedAssetTokens',
      args: [assetTokenAddress],
    });
    return isSupported;
  };

  // Get URIP fund address
  const { data: uripFundAddress } = useReadContract({
    address: CONTRACT_ADDRESSES.PurchaseManager,
    abi: PURCHASE_MANAGER_ABI,
    functionName: 'uripFund',
  });

  // Check USDT allowance for PurchaseManager
  const { data: usdtAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MockUSDT,
    abi: MOCK_USDT_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.PurchaseManager] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Helper functions
  const formatUSDTBalance = (balance: bigint | undefined, decimals: number | undefined = 6): string => {
    if (!balance || decimals === undefined) return '0';
    return (Number(balance) / Math.pow(10, decimals)).toString();
  };

  const hasEnoughBalance = (amount: string): boolean => {
    if (!usdtBalance || !usdtDecimals) return false;
    const amountBigInt = parseUnits(amount, usdtDecimals);
    return usdtBalance >= amountBigInt;
  };

  const hasEnoughAllowance = (amount: string): boolean => {
    if (!usdtAllowance || !usdtDecimals) return false;
    const amountBigInt = parseUnits(amount, usdtDecimals);
    return usdtAllowance >= amountBigInt;
  };

  // Transaction functions
  const approveUSDT = async (amount: string, spender?: Address) => {
    if (!address) throw new Error('Wallet not connected');
    if (!usdtDecimals) throw new Error('USDT decimals not loaded');

    const amountBigInt = parseUnits(amount, usdtDecimals);
    const spenderAddress = spender || CONTRACT_ADDRESSES.PurchaseManager;
    
    setIsTransactionPending(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.MockUSDT,
        abi: MOCK_USDT_ABI,
        functionName: 'approve',
        args: [spenderAddress, amountBigInt],
      });
    } catch (error) {
      setIsTransactionPending(false);
      throw error;
    }
  };

  const purchaseAssetToken = async (assetTokenAddress: Address, paymentAmount: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!usdtDecimals) throw new Error('USDT decimals not loaded');
    if (!hasEnoughBalance(paymentAmount)) throw new Error('Insufficient USDT balance');
    // if (!hasEnoughAllowance(paymentAmount)) throw new Error('Insufficient USDT allowance');

    const amountBigInt = parseUnits(paymentAmount, usdtDecimals);
    
    setIsTransactionPending(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.PurchaseManager,
        abi: PURCHASE_MANAGER_ABI,
        functionName: 'purchaseAssetToken',
        args: [CONTRACT_ADDRESSES.MockUSDT, assetTokenAddress, amountBigInt],
      });
    } catch (error) {
      setIsTransactionPending(false);
      throw error;
    }
  };

  const purchaseMutualFund = async (paymentAmount: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!usdtDecimals) throw new Error('USDT decimals not loaded');
    if (!hasEnoughBalance(paymentAmount)) throw new Error('Insufficient USDT balance');
    if (!hasEnoughAllowance(paymentAmount)) throw new Error('Insufficient USDT allowance');

    const amountBigInt = parseUnits(paymentAmount, usdtDecimals);
    
    setIsTransactionPending(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.PurchaseManager,
        abi: PURCHASE_MANAGER_ABI,
        functionName: 'purchaseMutualFund',
        args: [CONTRACT_ADDRESSES.MockUSDT, amountBigInt],
      });
    } catch (error) {
      setIsTransactionPending(false);
      throw error;
    }
  };

  // Calculate estimated tokens for asset purchase
  const calculateAssetTokens = (paymentAmount: string, assetPrice: string): string => {
    if (!paymentAmount || !assetPrice) return '0';
    const payment = parseFloat(paymentAmount);
    const price = parseFloat(assetPrice);
    if (price === 0) return '0';
    return (payment / price).toFixed(6);
  };

  // Calculate estimated URIP tokens for mutual fund purchase
  const calculateURIPTokens = (paymentAmount: string, navPerToken: string): string => {
    if (!paymentAmount || !navPerToken) return '0';
    const payment = parseFloat(paymentAmount);
    const nav = parseFloat(navPerToken);
    if (nav === 0) return '0';
    return (payment / nav).toFixed(6);
  };

  // Refresh all data
  const refreshAll = () => {
    refetchUSDTBalance();
    refetchAllowance();
  };

  // Handle transaction completion
  const handleTransactionComplete = () => {
    setIsTransactionPending(false);
    refreshAll();
  };

  return {
    // USDT data
    usdtBalance: formatUSDTBalance(usdtBalance, usdtDecimals),
    usdtBalanceRaw: usdtBalance,
    usdtDecimals,
    usdtAllowance: usdtAllowance ? formatUSDTBalance(usdtAllowance, usdtDecimals) : '0',
    
    // Contract configuration
    isPaymentTokenSupported,
    uripFundAddress,
    
    // Loading states
    isTransactionPending: isTransactionPending || isWritePending || isConfirming,
    
    // Transaction states
    isConfirmed,
    transactionHash: hash,
    
    // Error states
    error: writeError || receiptError,
    
    // Helper functions
    hasEnoughBalance,
    hasEnoughAllowance,
    calculateAssetTokens,
    calculateURIPTokens,
    checkAssetTokenSupported,
    
    // Actions
    approveUSDT,
    purchaseAssetToken,
    purchaseMutualFund,
    refreshAll,
    handleTransactionComplete,
  };
};