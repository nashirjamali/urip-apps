import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { Abi, Address, formatUnits } from "viem";
import {
  PortfolioAsset,
  PortfolioSummary,
  UserPortfolioData,
  UseUserPortfolioReturn,
  PnLData,
  UserInvestmentData,
} from "@/types";
import { useSupportedAssets } from "./useSupportedAssets";
// import { useMutualFundInfo } from "./useMutualFundInfo";

import URIP_TOKEN_ABI from "@/contracts/abis/URIPToken.json";
import ASSET_TOKEN_ABI from "@/contracts/abis/AssetToken.json";
import deployments from "@/contracts/deployments/sepolia.json";

type UserInvestmentInfo = readonly [bigint, bigint, bigint, bigint, bigint];

const URIP_TOKEN_ADDRESS = deployments.URIPToken as Address;

/**
 * Hook for fetching and managing user portfolio data
 * Combines direct asset holdings and URIP fund investments
 */
export const useUserPortfolio = (): UseUserPortfolioReturn => {
  const { address, isConnected } = useAccount();

  // State management
  const [portfolioData, setPortfolioData] = useState<UserPortfolioData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Hook dependencies
  const { assetsList, isLoadingList, listError, refreshList } =
    useSupportedAssets();

  // const {
  //   mutualFundInfo,
  //   assetAllocations,
  //   isLoadingFund,
  //   fundError,
  //   refreshAll: refreshMutualFund,
  // } = useMutualFundInfo();

  // URIP Fund contract reads
  const {
    data: uripBalance,
    isLoading: isLoadingURIPBalance,
    error: uripBalanceError,
    refetch: refetchURIPBalance,
  } = useReadContract({
    address: URIP_TOKEN_ADDRESS,
    abi: URIP_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const {
    data: userInvestmentInfo,
    isLoading: isLoadingInvestmentInfo,
    error: investmentInfoError,
    refetch: refetchInvestmentInfo,
  } = useReadContract({
    address: URIP_TOKEN_ADDRESS,
    abi: URIP_TOKEN_ABI,
    functionName: "getUserInvestmentInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  }) as {
    data: UserInvestmentInfo | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };

  const {
    data: fundStats,
    isLoading: isLoadingFundStats,
    error: fundStatsError,
    refetch: refetchFundStats,
  } = useReadContract({
    address: URIP_TOKEN_ADDRESS,
    abi: URIP_TOKEN_ABI,
    functionName: "getFundStats",
    query: {
      enabled: !!URIP_TOKEN_ADDRESS,
    },
  });

  const {
    data: currentNAV,
    isLoading: isLoadingNAV,
    error: navError,
    refetch: refetchNAV,
  } = useReadContract({
    address: URIP_TOKEN_ADDRESS,
    abi: URIP_TOKEN_ABI,
    functionName: "getCurrentNAV",
    query: {
      enabled: !!URIP_TOKEN_ADDRESS,
    },
  });

  const assetContracts = useMemo(() => {
    if (!address || !assetsList || assetsList.length === 0) return [];

    return assetsList.map((asset) => ({
      address: asset.tokenAddress,
      abi: ASSET_TOKEN_ABI as Abi,
      functionName: "balanceOf" as const,
      args: [address],
    }));
  }, [address, assetsList]);

  const {
    data: assetBalances,
    isLoading: isLoadingAssetBalances,
    error: assetBalancesError,
    refetch: refetchAssetBalances,
  } = useReadContracts({
    contracts: assetContracts,
    query: {
      enabled: assetContracts.length > 0,
    },
  });

  // Helper function to calculate PnL
  const calculatePnL = useCallback(
    (currentValue: number, investedAmount: number): PnLData => {
      const pnlAmount = currentValue - investedAmount;
      const pnlPercentage =
        investedAmount > 0 ? (pnlAmount / investedAmount) * 100 : 0;

      return {
        amount: pnlAmount.toFixed(2),
        percentage: pnlPercentage.toFixed(2),
        isPositive: pnlAmount >= 0,
      };
    },
    []
  );

  // Helper function to get asset icon URL
  const getAssetIcon = useCallback(
    (symbol: string, assetType: string): string => {
      // Default icons based on asset type
      const defaultIcons = {
        STOCK: "/icons/stock-default.svg",
        COMMODITY: "/icons/commodity-default.svg",
        CRYPTO: "/icons/crypto-default.svg",
        FUND: "/icons/fund-default.svg",
        OTHER: "/icons/asset-default.svg",
      };

      // Try to get specific icon, fallback to type default
      return (
        `/icons/${symbol.toLowerCase()}.svg` ||
        defaultIcons[assetType as keyof typeof defaultIcons] ||
        defaultIcons.OTHER
      );
    },
    []
  );

  // Fetch additional asset price data (mock for now - in real implementation, this would come from oracles)
  const fetchAssetPrices = useCallback(
    async (assetAddresses: Address[]): Promise<Record<string, string>> => {
      // Mock price data - in real implementation, fetch from price oracle
      const mockPrices: Record<string, string> = {
        tAAPL: "150.25",
        tMSFT: "380.75",
        tGOOG: "2500.00",
        tTSLA: "180.50",
        tXAU: "2000.00",
        tXAG: "25.50",
        tBTC: "45000.00",
      };

      return assetAddresses.reduce((acc, address) => {
        // Find asset by address and get mock price
        const asset = assetsList?.find(
          (a) => a.tokenAddress.toLowerCase() === address.toLowerCase()
        );
        if (asset) {
          acc[address.toLowerCase()] = mockPrices[asset.symbol] || "1.00";
        }
        return acc;
      }, {} as Record<string, string>);
    },
    [assetsList]
  );

  // Process direct asset holdings
  const processDirectAssets = useCallback(async (): Promise<
    PortfolioAsset[]
  > => {
    if (
      !assetsList ||
      !assetBalances ||
      assetsList.length !== assetBalances.length
    ) {
      return [];
    }

    const assetAddresses = assetsList.map((asset) => asset.tokenAddress);
    const assetPrices = await fetchAssetPrices(assetAddresses);

    const directAssets: PortfolioAsset[] = [];

    assetsList.forEach((asset, index) => {
      const balanceResult = assetBalances[index];

      if (balanceResult.status !== "success" || !balanceResult.result) {
        return;
      }

      const balance = balanceResult.result as bigint;
      const tokenAmount = parseFloat(formatUnits(balance, 18)); // Assuming 18 decimals

      if (tokenAmount === 0) return;

      const currentPrice = parseFloat(
        assetPrices[asset.tokenAddress.toLowerCase()] || "0"
      );
      const usdValue = currentPrice * tokenAmount;

      // For now, assume invested amount equals current value (no PnL tracking for direct assets yet)
      // In real implementation, this would come from transaction history
      const investedAmount = usdValue;
      const pnl = calculatePnL(usdValue, investedAmount);

      directAssets.push({
        tokenAddress: asset.tokenAddress,
        name: asset.name,
        symbol: asset.symbol,
        assetType: (asset.assetType?.toUpperCase() ||
          "OTHER") as PortfolioAsset["assetType"],
        assetIcon: getAssetIcon(asset.symbol, asset.assetType || "OTHER"),
        investmentValueAmount: tokenAmount.toFixed(6),
        investmentValueUSD: usdValue.toFixed(2),
        currentPrice: currentPrice.toFixed(4),
        pnl,
        allocationPercentage: 0, // Will be calculated later
        lastUpdated: new Date(),
        isActive: true,
      });
    });

    return directAssets.filter(
      (asset) => parseFloat(asset.investmentValueUSD) > 0
    );
  }, [assetsList, assetBalances, fetchAssetPrices, calculatePnL, getAssetIcon]);

  // Process URIP fund holdings
  const processURIPFundAsset = useCallback((): PortfolioAsset | undefined => {
    if (!uripBalance || !userInvestmentInfo || !currentNAV) return undefined;

    const tokenBalance = userInvestmentInfo[0] as bigint; // tokenBalance
    const currentValue = userInvestmentInfo[1] as bigint; // currentValue
    const totalInvestedAmount = userInvestmentInfo[2] as bigint; // totalInvestedAmount
    const profitLoss = userInvestmentInfo[3] as bigint; // profitLoss (signed)

    const tokenAmount = parseFloat(formatUnits(tokenBalance, 18));
    const usdValue = parseFloat(formatUnits(currentValue, 8)); // Assuming USD has 8 decimals
    const investedAmount = parseFloat(formatUnits(totalInvestedAmount, 8));

    if (tokenAmount === 0) return undefined;

    const nav = currentNAV as [bigint, bigint];
    const navPerToken = parseFloat(formatUnits(nav[0], 8)); // Current NAV

    // Calculate PnL from contract data
    const pnlAmount = parseFloat(formatUnits(profitLoss, 8));
    const pnlPercentage =
      investedAmount > 0 ? (pnlAmount / investedAmount) * 100 : 0;

    const pnl: PnLData = {
      amount: pnlAmount.toFixed(2),
      percentage: pnlPercentage.toFixed(2),
      isPositive: pnlAmount >= 0,
    };

    return {
      tokenAddress: URIP_TOKEN_ADDRESS,
      name: "URIP Mutual Fund",
      symbol: "URIP",
      assetType: "FUND",
      assetIcon: getAssetIcon("URIP", "FUND"),
      investmentValueAmount: tokenAmount.toFixed(6),
      investmentValueUSD: usdValue.toFixed(2),
      currentPrice: navPerToken.toFixed(4),
      pnl,
      allocationPercentage: 0, // Will be calculated later
      lastUpdated: new Date(),
      isActive: true,
    };
  }, [uripBalance, userInvestmentInfo, currentNAV, getAssetIcon]);

  // Calculate portfolio allocation percentages
  const calculateAllocationPercentages = useCallback(
    (assets: PortfolioAsset[], totalValue: number): PortfolioAsset[] => {
      return assets.map((asset) => ({
        ...asset,
        allocationPercentage:
          totalValue > 0
            ? (parseFloat(asset.investmentValueUSD) / totalValue) * 100
            : 0,
      }));
    },
    []
  );

  // Calculate portfolio summary
  const calculatePortfolioSummary = useCallback(
    (assets: PortfolioAsset[]): PortfolioSummary => {
      const totalValue = assets.reduce(
        (sum, asset) => sum + parseFloat(asset.investmentValueUSD),
        0
      );

      const totalPnLAmount = assets.reduce(
        (sum, asset) => sum + parseFloat(asset.pnl.amount),
        0
      );

      const totalInvested = totalValue - totalPnLAmount;
      const totalPnLPercentage =
        totalInvested > 0 ? (totalPnLAmount / totalInvested) * 100 : 0;

      return {
        totalInvestmentValueUSD: totalValue.toFixed(2),
        totalAssetsCount: assets.length,
        totalPnL: {
          amount: totalPnLAmount.toFixed(2),
          percentage: totalPnLPercentage.toFixed(2),
          isPositive: totalPnLAmount >= 0,
        },
        lastUpdated: new Date(),
      };
    },
    []
  );

  // Main data processing function
  const processPortfolioData =
    useCallback(async (): Promise<UserPortfolioData | null> => {
      if (!isConnected || !address) return null;

      try {
        const directAssets = await processDirectAssets();
        const uripFundAsset = processURIPFundAsset();

        const allAssets = [
          ...directAssets,
          ...(uripFundAsset ? [uripFundAsset] : []),
        ];

        if (allAssets.length === 0) {
          return {
            summary: {
              totalInvestmentValueUSD: "0.00",
              totalAssetsCount: 0,
              totalPnL: {
                amount: "0.00",
                percentage: "0.00",
                isPositive: true,
              },
              lastUpdated: new Date(),
            },
            assets: [],
            directAssets: [],
            uripFundAsset: undefined,
          };
        }

        const summary = calculatePortfolioSummary(allAssets);
        const totalValue = parseFloat(summary.totalInvestmentValueUSD);

        const assetsWithAllocation = calculateAllocationPercentages(
          allAssets,
          totalValue
        );

        return {
          summary,
          assets: assetsWithAllocation,
          directAssets: assetsWithAllocation.filter(
            (asset) => asset.assetType !== "FUND"
          ),
          uripFundAsset: uripFundAsset
            ? {
                ...uripFundAsset,
                allocationPercentage:
                  totalValue > 0
                    ? (parseFloat(uripFundAsset.investmentValueUSD) /
                        totalValue) *
                      100
                    : 0,
              }
            : undefined,
        };
      } catch (error) {
        console.error("Error processing portfolio data:", error);
        throw error;
      }
    }, [
      isConnected,
      address,
      processDirectAssets,
      processURIPFundAsset,
      calculatePortfolioSummary,
      calculateAllocationPercentages,
    ]);

  // Load portfolio data
  const loadPortfolioData = useCallback(async () => {
    if (!isConnected || !address) {
      setPortfolioData(null);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const data = await processPortfolioData();
      setPortfolioData(data);
      setLastFetched(new Date());
    } catch (error) {
      setIsError(true);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load portfolio data"
      );
      console.error("Portfolio loading error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, processPortfolioData]);

  // Helper functions
  const getAssetBySymbol = useCallback(
    (symbol: string): PortfolioAsset | undefined => {
      return portfolioData?.assets.find((asset) => asset.symbol === symbol);
    },
    [portfolioData]
  );

  const getAssetByAddress = useCallback(
    (address: Address): PortfolioAsset | undefined => {
      return portfolioData?.assets.find(
        (asset) => asset.tokenAddress.toLowerCase() === address.toLowerCase()
      );
    },
    [portfolioData]
  );

  const getAssetsByType = useCallback(
    (type: string): PortfolioAsset[] => {
      return (
        portfolioData?.assets.filter((asset) => asset.assetType === type) || []
      );
    },
    [portfolioData]
  );

  const getActiveAssets = useCallback((): PortfolioAsset[] => {
    return portfolioData?.assets.filter((asset) => asset.isActive) || [];
  }, [portfolioData]);

  const getTotalValue = useCallback((): number => {
    return parseFloat(portfolioData?.summary.totalInvestmentValueUSD || "0");
  }, [portfolioData]);

  // Actions
  const refresh = useCallback(async () => {
    await loadPortfolioData();
  }, [loadPortfolioData]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refetchURIPBalance(),
      refetchInvestmentInfo(),
      refetchFundStats(),
      refetchNAV(),
      refetchAssetBalances(),
      // refreshMutualFund(),
      refreshList(),
    ]);
    await loadPortfolioData();
  }, [
    // refetchURIPBalance,
    // refetchInvestmentInfo,
    // refetchFundStats,
    // refetchNAV,
    // refetchAssetBalances,
    // refreshMutualFund,
    // refreshList,
    // loadPortfolioData,
  ]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadPortfolioData();
  }, [
    isConnected,
    address,
    assetsList,
    assetBalances,
    uripBalance,
    userInvestmentInfo,
    currentNAV,
    loadPortfolioData,
  ]);

  // Combine loading states
  const combinedIsLoading =
    isLoading ||
    isLoadingList ||
    // isLoadingFund ||
    isLoadingURIPBalance ||
    isLoadingInvestmentInfo ||
    isLoadingFundStats ||
    isLoadingNAV ||
    isLoadingAssetBalances;

  // Combine error states
  const combinedIsError =
    isError ||
    !!listError ||
    // !!fundError ||
    !!uripBalanceError ||
    !!investmentInfoError ||
    !!fundStatsError ||
    !!navError ||
    !!assetBalancesError;

  const combinedErrorMessage =
    errorMessage ||
    listError ||
    // fundError ||
    uripBalanceError?.message ||
    investmentInfoError?.message ||
    fundStatsError?.message ||
    navError?.message ||
    assetBalancesError?.message ||
    "";

  return {
    portfolioData,
    isLoading: combinedIsLoading,
    isError: combinedIsError,
    errorMessage: combinedErrorMessage,
    lastFetched,

    // Helper functions
    getAssetBySymbol,
    getAssetByAddress,
    getAssetsByType,
    getActiveAssets,
    getTotalValue,

    // Actions
    refresh,
    refreshAll,
  };
};
