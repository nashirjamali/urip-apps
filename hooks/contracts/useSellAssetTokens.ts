"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { parseUnits, formatUnits, Address } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useConfig,
} from "wagmi";
import { readContract } from "wagmi/actions";
import deployments from "@/contracts/deployments/sepolia.json";
import USDT_ABI from "@/contracts/abis/USDT.json";
import PURCHASE_MANAGER_ABI from "@/contracts/abis/PurchaseManager.json";
import ASSET_TOKEN_ABI from "@/contracts/abis/AssetToken.json";
import { AssetSaleParams, TradeEstimation } from "@/types";

const USDT_ADDRESS = deployments.USDT as Address;
const PURCHASE_MANAGER_ADDRESS = deployments.PurchaseManager as Address;

export interface UseSellAssetTokensReturn {
  // Loading and error states
  loading: boolean;
  error: Error | null;

  // Balance data
  usdtBalance: string;
  usdtBalanceRaw?: bigint;
  usdtDecimals?: number;

  // Asset token data
  assetTokenBalance: string;
  assetTokenBalanceRaw?: bigint;
  assetTokenDecimals?: number;
  assetTokenPrice: string;
  assetTokenInfo: {
    name: string;
    symbol: string;
    assetType: string;
    isActive: boolean;
  } | null;

  // Transaction states
  isTransactionPending: boolean;
  isConfirmed: boolean;
  transactionHash?: `0x${string}`;

  // Validation functions
  hasEnoughAssetTokens: (amount: string) => boolean;
  isAssetTokenSupported: boolean;

  // Estimation functions
  estimateSellValue: (tokenAmount: string) => Promise<TradeEstimation>;

  // Transaction functions
  sellAssetTokens: (params: AssetSaleParams) => Promise<void>;

  // Utility functions
  refreshBalances: () => void;
  resetTransaction: () => void;
}

/**
 * Hook for selling asset tokens
 * Handles asset token sale transactions
 */
export const useSellAssetTokens = (
  assetTokenAddress?: Address
): UseSellAssetTokensReturn => {
  const { address } = useAccount();
  const config = useConfig();
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  // State for manually managed contract data
  const [usdtBalance, setUsdtBalance] = useState<bigint | undefined>();
  const [usdtDecimals, setUsdtDecimals] = useState<number | undefined>();
  const [assetTokenBalance, setAssetTokenBalance] = useState<
    bigint | undefined
  >();
  const [assetTokenDecimals, setAssetTokenDecimals] = useState<
    number | undefined
  >();
  const [assetTokenName, setAssetTokenName] = useState<string | undefined>();
  const [assetTokenSymbol, setAssetTokenSymbol] = useState<
    string | undefined
  >();
  const [assetTokenPriceData, setAssetTokenPriceData] = useState<
    [bigint, bigint] | undefined
  >();
  const [assetInfoData, setAssetInfoData] = useState<any>();
  const [isAssetSupported, setIsAssetSupported] = useState<
    boolean | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Write contract hook
  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending: isWritePending,
  } = useWriteContract();

  // Transaction receipt hook
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Function to read all contract data
  const fetchContractData = useCallback(async () => {
    if (!address || !config) return;

    setLoading(true);
    setError(null);

    try {
      // Read USDT data
      const [usdtBalanceResult, usdtDecimalsResult] = await Promise.all([
        readContract(config, {
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        readContract(config, {
          address: USDT_ADDRESS,
          abi: USDT_ABI,
          functionName: "decimals",
        }),
      ]);

      setUsdtBalance(usdtBalanceResult as bigint);
      setUsdtDecimals(usdtDecimalsResult as number);

      // Read asset token data if address is provided
      if (assetTokenAddress) {
        const [
          assetTokenBalanceResult,
          assetTokenDecimalsResult,
          assetTokenNameResult,
          assetTokenSymbolResult,
          assetTokenPriceResult,
          assetInfoResult,
          isAssetSupportedResult,
        ] = await Promise.all([
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "balanceOf",
            args: [address],
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "decimals",
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "name",
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "symbol",
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "getCurrentPrice",
          }),
          readContract(config, {
            address: assetTokenAddress,
            abi: ASSET_TOKEN_ABI,
            functionName: "getAssetInfo",
          }),
          readContract(config, {
            address: PURCHASE_MANAGER_ADDRESS,
            abi: PURCHASE_MANAGER_ABI,
            functionName: "isAssetTokenSupported",
            args: [assetTokenAddress],
          }),
        ]);

        setAssetTokenBalance(assetTokenBalanceResult as bigint);
        setAssetTokenDecimals(assetTokenDecimalsResult as number);
        setAssetTokenName(assetTokenNameResult as string);
        setAssetTokenSymbol(assetTokenSymbolResult as string);
        setAssetTokenPriceData(assetTokenPriceResult as [bigint, bigint]);
        setAssetInfoData(assetInfoResult);
        setIsAssetSupported(isAssetSupportedResult as boolean);
      }
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching contract data:", err);
    } finally {
      setLoading(false);
    }
  }, [address, assetTokenAddress, config]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  // Refetch functions
  const refetchUSDTBalance = useCallback(async () => {
    if (!address || !config) return;
    try {
      const balance = await readContract(config, {
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setUsdtBalance(balance as bigint);
    } catch (err) {
      console.error("Error refetching USDT balance:", err);
    }
  }, [address, config]);

  const refetchAssetBalance = useCallback(async () => {
    if (!address || !config || !assetTokenAddress) return;
    try {
      const balance = await readContract(config, {
        address: assetTokenAddress,
        abi: ASSET_TOKEN_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      setAssetTokenBalance(balance as bigint);
    } catch (err) {
      console.error("Error refetching asset balance:", err);
    }
  }, [address, config, assetTokenAddress]);

  // Format balance data
  const formattedUSDTBalance = useMemo(() => {
    if (!usdtBalance || !usdtDecimals) return "0";
    return formatUnits(usdtBalance, usdtDecimals);
  }, [usdtBalance, usdtDecimals]);

  const formattedAssetBalance = useMemo(() => {
    if (!assetTokenBalance || !assetTokenDecimals) return "0";
    return formatUnits(assetTokenBalance, assetTokenDecimals);
  }, [assetTokenBalance, assetTokenDecimals]);

  const formattedAssetPrice = useMemo(() => {
    if (!assetTokenPriceData) return "0";
    const [priceRaw] = assetTokenPriceData;
    return formatUnits(priceRaw, 8); // Asset prices have 8 decimals
  }, [assetTokenPriceData]);

  const assetTokenInfo = useMemo(() => {
    if (!assetTokenName || !assetTokenSymbol || !assetInfoData) return null;

    const [, assetType, , , isActive] = assetInfoData as [
      string,
      string,
      bigint,
      bigint,
      boolean
    ];

    return {
      name: assetTokenName as string,
      symbol: assetTokenSymbol as string,
      assetType: assetType as string,
      isActive: isActive as boolean,
    };
  }, [assetTokenName, assetTokenSymbol, assetInfoData]);

  // Validation functions
  const hasEnoughAssetTokens = useCallback(
    (amount: string): boolean => {
      if (!assetTokenBalance || !assetTokenDecimals) return false;
      try {
        const amountBigInt = parseUnits(amount, assetTokenDecimals);
        return assetTokenBalance >= amountBigInt;
      } catch {
        return false;
      }
    },
    [assetTokenBalance, assetTokenDecimals]
  );

  // Estimation functions
  const estimateSellValue = useCallback(
    async (tokenAmount: string): Promise<TradeEstimation> => {
      if (
        !config ||
        !assetTokenAddress ||
        !assetTokenDecimals ||
        !usdtDecimals
      ) {
        throw new Error("Missing required data for estimation");
      }

      try {
        const tokenAmountBigInt = parseUnits(tokenAmount, assetTokenDecimals);
        const usdValue = await readContract(config, {
          address: assetTokenAddress,
          abi: ASSET_TOKEN_ABI,
          functionName: "getUSDValue",
          args: [tokenAmountBigInt],
        });

        // Format the USD value from the contract
        const estimatedValueFormatted = formatUnits(
          usdValue as bigint,
          usdtDecimals
        );

        // Calculate fee (you may need to adjust this based on your contract's fee structure)
        // This example assumes a 0.5% fee, but you should get this from your contract
        const feePercentage = 0.005; // 0.5%
        const feeAmount = (
          parseFloat(estimatedValueFormatted) * feePercentage
        ).toString();

        // Net amount after fee
        const netAmount = (
          parseFloat(estimatedValueFormatted) - parseFloat(feeAmount)
        ).toString();

        return {
          estimatedTokens: tokenAmount, // The tokens being sold
          estimatedValue: estimatedValueFormatted, // Total USD value before fees
          fee: feeAmount, // Fee amount in USD
          netAmount: netAmount, // Net USD amount after fees
        };
      } catch (error) {
        console.error("Error estimating sell value:", error);
        throw error;
      }
    },
    [config, assetTokenAddress, assetTokenDecimals, usdtDecimals]
  );

  // Transaction functions
  const sellAssetTokens = useCallback(
    async (params: AssetSaleParams) => {
      if (!address || !assetTokenDecimals)
        throw new Error("Missing required data");
      if (!hasEnoughAssetTokens(params.tokenAmount || "0"))
        throw new Error("Insufficient asset tokens");

      setIsTransactionPending(true);
      try {
        const tokenAmountBigInt = parseUnits(
          params.tokenAmount || "0",
          assetTokenDecimals
        );
        await writeContract({
          address: PURCHASE_MANAGER_ADDRESS,
          abi: PURCHASE_MANAGER_ABI,
          functionName: "sellAssetToken",
          args: [params.assetTokenAddress, USDT_ADDRESS, tokenAmountBigInt],
        });
      } catch (error) {
        setIsTransactionPending(false);
        throw error;
      }
    },
    [address, assetTokenDecimals, writeContract, hasEnoughAssetTokens]
  );

  // Utility functions
  const refreshBalances = useCallback(() => {
    refetchUSDTBalance();
    refetchAssetBalance();
  }, [refetchUSDTBalance, refetchAssetBalance]);

  const resetTransaction = useCallback(() => {
    setIsTransactionPending(false);
  }, []);

  // Handle transaction completion
  const handleTransactionComplete = useCallback(() => {
    setIsTransactionPending(false);
    refreshBalances();
  }, [refreshBalances]);

  // Auto refresh balances on transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      handleTransactionComplete();
    }
  }, [isConfirmed, handleTransactionComplete]);

  return {
    // Loading and error states
    loading,
    error: error || writeError || receiptError,

    // Balance data
    usdtBalance: formattedUSDTBalance,
    usdtBalanceRaw: usdtBalance,
    usdtDecimals,

    // Asset token data
    assetTokenBalance: formattedAssetBalance,
    assetTokenBalanceRaw: assetTokenBalance,
    assetTokenDecimals,
    assetTokenPrice: formattedAssetPrice,
    assetTokenInfo,

    // Transaction states
    isTransactionPending:
      isTransactionPending || isWritePending || isConfirming,
    isConfirmed,
    transactionHash: hash,

    // Validation functions
    hasEnoughAssetTokens,
    isAssetTokenSupported: !!isAssetSupported,

    // Estimation functions
    estimateSellValue,

    // Transaction functions
    sellAssetTokens,

    // Utility functions
    refreshBalances,
    resetTransaction,
  };
};
