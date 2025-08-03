"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { readContract } from "@wagmi/core";
import {
  ASSET_TOKENS,
  ASSET_TOKEN_ABI,
  AssetTokenInfo,
} from "@/config/contracts";
import { useAccount } from "wagmi";
import { config } from "@/config/xellarConfig";
import { useState, useEffect } from "react";
import {
  retryContractCall,
  parseContractError,
  validateAllSystemContracts,
} from "@/utils/contractValidation";

export interface AssetTokenData {
  info: AssetTokenInfo;
  balance: string;
  balanceRaw: bigint;
  currentPrice: string;
  priceRaw: bigint;
  lastUpdate: number;
  symbol: string;
  name: string;
  assetType: string;
  isActive: boolean;
  decimals: number;
  totalSupply: string;
  totalSupplyRaw: bigint;
  contractValidation?: {
    isDeployed: boolean;
    hasCode: boolean;
    error?: string;
  };
}

export interface AssetTokenError {
  type: "NETWORK" | "CONTRACT" | "METHOD" | "VALIDATION" | "RPC" | "UNKNOWN";
  message: string;
  details?: string;
  suggestions?: string[];
  address?: string;
  symbol?: string;
}

export const useAssetTokens = () => {
  const { address } = useAccount();
  const [assetTokens, setAssetTokens] = useState<AssetTokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [detailedErrors, setDetailedErrors] = useState<AssetTokenError[]>([]);
  const [systemValidation, setSystemValidation] = useState<any>(null);
  const [contractsValidated, setContractsValidated] = useState(false);

  // Enhanced contract reading function with better error handling
  const readTokenData = async (
    tokenAddress: string,
    tokenInfo: AssetTokenInfo
  ): Promise<AssetTokenData | null> => {
    console.log(
      `🔍 Reading data for token: ${tokenInfo.symbol} at ${tokenAddress}`
    );

    try {
      // Use retry mechanism for contract calls
      const basicData = await retryContractCall(async () => {
        return Promise.all([
          readContract(config as any, {
            address: tokenAddress as any,
            abi: ASSET_TOKEN_ABI,
            functionName: "name",
          }),
          readContract(config as any, {
            address: tokenAddress as any,
            abi: ASSET_TOKEN_ABI,
            functionName: "symbol",
          }),
          readContract(config as any, {
            address: tokenAddress as any,
            abi: ASSET_TOKEN_ABI,
            functionName: "decimals",
          }),
          readContract(config as any, {
            address: tokenAddress as any,
            abi: ASSET_TOKEN_ABI,
            functionName: "totalSupply",
          }),
        ]);
      });

      const [name, symbol, decimals, totalSupply] = basicData;

      // Read asset-specific info with retry
      const assetSpecificData = await retryContractCall(async () => {
        return Promise.all([
          readContract(config as any, {
            address: tokenAddress as any,
            abi: ASSET_TOKEN_ABI,
            functionName: "getCurrentPrice",
          }),
          readContract(config as any, {
            address: tokenAddress as any,
            abi: ASSET_TOKEN_ABI,
            functionName: "assetInfo",
          }),
        ]);
      });

      const [priceResult, assetInfoResult] = assetSpecificData;

      // Read user balance if connected
      let balanceRaw = BigInt(0);
      if (address) {
        try {
          balanceRaw = await retryContractCall(async () => {
            return readContract(config as any, {
              address: tokenAddress as any,
              abi: ASSET_TOKEN_ABI,
              functionName: "balanceOf",
              args: [address],
            });
          });
        } catch (balanceError) {
          const parsedError = parseContractError(balanceError);
          console.warn(
            `Failed to read balance for ${tokenInfo.symbol}:`,
            parsedError
          );
        }
      }

      const [priceRaw, lastUpdate] = priceResult as [bigint, bigint];
      const [, assetType, , , isActive] = assetInfoResult as [
        string,
        string,
        bigint,
        bigint,
        boolean
      ];

      const assetData: AssetTokenData = {
        info: tokenInfo,
        balance: formatUnits(balanceRaw, decimals as number),
        balanceRaw,
        currentPrice: formatUnits(priceRaw, 8),
        priceRaw,
        lastUpdate: Number(lastUpdate),
        symbol: symbol as string,
        name: name as string,
        assetType: assetType as string,
        isActive: isActive as boolean,
        decimals: decimals as number,
        totalSupply: formatUnits(totalSupply as bigint, decimals as number),
        totalSupplyRaw: totalSupply as bigint,
        contractValidation: {
          isDeployed: true,
          hasCode: true,
        },
      };

      console.log(`✅ Successfully loaded ${tokenInfo.symbol}:`, assetData);
      return assetData;
    } catch (error) {
      const parsedError = parseContractError(error);
      console.error(
        `❌ Failed to load data for token ${tokenInfo.symbol}:`,
        parsedError
      );

      // Add to detailed errors
      setDetailedErrors((prev) => [
        ...prev,
        {
          ...parsedError,
          address: tokenAddress,
          symbol: tokenInfo.symbol,
        },
      ]);

      return null;
    }
  };

  // Enhanced loading function with system validation
  const loadAssetTokens = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    setDetailedErrors([]);

    try {
      console.log("🚀 Starting to load asset tokens...");

      // First, validate the entire system if not already done
      if (!contractsValidated) {
        console.log("🔍 Running system validation...");
        try {
          const validation = await validateAllSystemContracts();
          setSystemValidation(validation);
          setContractsValidated(true);

          if (!validation.summary.isSystemHealthy) {
            const failedContracts = validation.assetTokens.filter(
              (t) => !t.isDeployed
            ).length;
            console.warn(
              `⚠️ System health check: ${validation.summary.deployedContracts}/${validation.summary.totalContracts} contracts deployed`
            );

            if (validation.summary.deployedContracts === 0) {
              setIsError(true);
              setErrorMessage(
                `No contracts are deployed on ${validation.network.name} (Chain ID: ${validation.network.chainId}). Please verify you're connected to the correct network.`
              );
              return;
            }
          }
        } catch (validationError) {
          console.error("❌ System validation failed:", validationError);
          const parsedError = parseContractError(validationError);
          setDetailedErrors([parsedError]);
        }
      }

      const tokenAddresses = Object.values(ASSET_TOKENS);
      const results: AssetTokenData[] = [];

      // Read tokens sequentially to avoid overwhelming the RPC
      for (const tokenInfo of tokenAddresses) {
        const tokenData = await readTokenData(tokenInfo.address, tokenInfo);
        if (tokenData) {
          results.push(tokenData);
        }
        // Small delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      console.log(
        `🎯 Loaded ${results.length} out of ${tokenAddresses.length} tokens`
      );

      if (results.length === 0) {
        setIsError(true);
        const networkName =
          systemValidation?.network?.name || "unknown network";
        const chainId = systemValidation?.network?.chainId || "unknown";
        setErrorMessage(
          `No asset tokens could be loaded from ${networkName} (Chain ID: ${chainId}). This usually means contracts are not deployed on this network.`
        );
      } else {
        setAssetTokens(results);

        // Log successful contracts
        const successfulContracts = results.map((r) => r.symbol).join(", ");
        console.log(`✅ Successfully loaded contracts: ${successfulContracts}`);

        if (results.length < tokenAddresses.length) {
          const failedCount = tokenAddresses.length - results.length;
          console.warn(
            `⚠️ ${failedCount} contracts failed to load. Check detailed errors for more information.`
          );
        }
      }
    } catch (error) {
      console.error("❌ Error loading asset tokens:", error);
      const parsedError = parseContractError(error);
      setIsError(true);
      setErrorMessage(parsedError.message);
      setDetailedErrors((prev) => [...prev, parsedError]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load tokens on mount and when address changes
  useEffect(() => {
    loadAssetTokens();
  }, [address]);

  // Helper functions
  const getAssetTokenBySymbol = (
    symbol: string
  ): AssetTokenData | undefined => {
    return assetTokens.find(
      (token) => token.symbol === symbol || token.info.symbol === symbol
    );
  };

  const getAssetTokenByAddress = (
    address: string
  ): AssetTokenData | undefined => {
    return assetTokens.find(
      (token) => token.info.address.toLowerCase() === address.toLowerCase()
    );
  };

  const getStockTokens = (): AssetTokenData[] => {
    return assetTokens.filter((token) => token.assetType === "STOCK");
  };

  const getCommodityTokens = (): AssetTokenData[] => {
    return assetTokens.filter((token) => token.assetType === "COMMODITY");
  };

  const getActiveTokens = (): AssetTokenData[] => {
    return assetTokens.filter((token) => token.isActive);
  };

  const getUserHoldings = (): AssetTokenData[] => {
    if (!address) return [];
    return assetTokens.filter((token) => parseFloat(token.balance) > 0);
  };

  const getTotalPortfolioValue = (): number => {
    if (!address) return 0;
    return assetTokens.reduce((total, token) => {
      const balance = parseFloat(token.balance);
      const price = parseFloat(token.currentPrice);
      return total + balance * price;
    }, 0);
  };

  const getTokenAllocation = (): Array<{
    symbol: string;
    name: string;
    value: number;
    percentage: number;
    type: string;
  }> => {
    if (!address) return [];

    const totalValue = getTotalPortfolioValue();
    if (totalValue === 0) return [];

    return assetTokens
      .map((token) => {
        const balance = parseFloat(token.balance);
        const price = parseFloat(token.currentPrice);
        const value = balance * price;
        const percentage = (value / totalValue) * 100;

        return {
          symbol: token.symbol,
          name: token.name,
          value,
          percentage,
          type: token.assetType,
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  return {
    // Data
    assetTokens: assetTokens,
    stockTokens: getStockTokens(),
    commodityTokens: getCommodityTokens(),
    activeTokens: getActiveTokens(),
    userHoldings: getUserHoldings(),

    // Portfolio metrics
    totalPortfolioValue: getTotalPortfolioValue(),
    tokenAllocation: getTokenAllocation(),

    // Loading and error states
    isLoading,
    isError,
    errorMessage,

    // Helper functions
    getAssetTokenBySymbol,
    getAssetTokenByAddress,

    // Actions
    refetch: loadAssetTokens,
  };
};

// Hook for a single asset token
export const useAssetToken = (symbolOrAddress: string) => {
  const { assetTokens, isLoading, isError, errorMessage, refetch } =
    useAssetTokens();

  const token = assetTokens.find(
    (t) =>
      t.symbol === symbolOrAddress ||
      t.info.symbol === symbolOrAddress ||
      t.info.address.toLowerCase() === symbolOrAddress.toLowerCase()
  );

  return {
    token,
    isLoading,
    isError,
    errorMessage,
    refetch,
  };
};
