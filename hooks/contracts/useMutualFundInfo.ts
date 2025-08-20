"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { Address, formatUnits } from "viem";
import { config } from "@/config/xellarConfig";
import deployments from "@/contracts/deployments/sepolia.json";

import URIP_TOKEN_ABI from "@/contracts/abis/URIPToken.json";
import ASSET_TOKEN_ABI from "@/contracts/abis/AssetToken.json";
import {
  AssetAllocation,
  MutualFundInfo,
  UseMutualFundInfoReturn,
} from "@/types";
import { getAssetIcon } from "@/lib/assetMapping";

const URIP_TOKEN_ADDRESS = deployments.URIPToken as Address;

const formatLastUpdated = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
};

/**
 * Hook for fetching URIP mutual fund information
 * Returns: Token price per URIP, asset allocations with detailed information
 */
export const useMutualFundInfo = (): UseMutualFundInfoReturn => {
  const { address } = useAccount();
  
  // Use ref to prevent multiple simultaneous calls
  const isFetchingRef = useRef(false);

  const [mutualFundInfo, setMutualFundInfo] = useState<MutualFundInfo | null>(
    null
  );
  const [assetAllocations, setAssetAllocations] = useState<AssetAllocation[]>(
    []
  );
  const [isLoadingFund, setIsLoadingFund] = useState(false);
  const [isLoadingAllocations, setIsLoadingAllocations] = useState(false);
  const [fundError, setFundError] = useState<string | null>(null);
  const [allocationsError, setAllocationsError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // ✅ Fixed: Remove dependencies that cause circular updates
  const fetchFundInfo = useCallback(async () => {
    setIsLoadingFund(true);
    setFundError(null);

    try {
      const [fundInfoResult, navResult, fundStatsResult, totalSupplyResult] =
        await Promise.all([
          readContract(config as any, {
            address: URIP_TOKEN_ADDRESS,
            abi: URIP_TOKEN_ABI,
            functionName: "fundInfo",
          }),
          readContract(config as any, {
            address: URIP_TOKEN_ADDRESS,
            abi: URIP_TOKEN_ABI,
            functionName: "getCurrentNAV",
          }),
          readContract(config as any, {
            address: URIP_TOKEN_ADDRESS,
            abi: URIP_TOKEN_ABI,
            functionName: "getFundStats",
          }),
          readContract(config as any, {
            address: URIP_TOKEN_ADDRESS,
            abi: URIP_TOKEN_ABI,
            functionName: "totalSupply",
          }),
        ]);

      const [
        totalAssetValue,
        navPerToken,
        lastNavUpdate,
        managementFee,
        isActive,
      ] = fundInfoResult as [bigint, bigint, bigint, bigint, boolean];
      const [currentNAV] = navResult as [bigint, bigint];
      const totalSupply = totalSupplyResult as bigint;

      const basicFundInfo: Omit<
        MutualFundInfo,
        "assetAllocations" | "totalAllocationPercentage"
      > = {
        tokenPricePerURIP: formatUnits(navPerToken, 18),
        nav: formatUnits(currentNAV, 18),
        totalAssetValue: formatUnits(totalAssetValue, 8),
        totalTokens: formatUnits(totalSupply, 8),
        managementFee: Number(managementFee),
        lastNavUpdate: formatLastUpdated(lastNavUpdate),
        isActive,
      };

      return basicFundInfo;
    } catch (error) {
      console.error("Error fetching fund info:", error);
      setFundError(
        error instanceof Error ? error.message : "Failed to fetch fund info"
      );
      return null;
    } finally {
      setIsLoadingFund(false);
    }
  }, []); // ✅ Fixed: No dependencies

  const fetchAssetAllocations = useCallback(async () => {
    setIsLoadingAllocations(true);
    setAllocationsError(null);

    try {
      const allocationsResult = (await readContract(config as any, {
        address: URIP_TOKEN_ADDRESS,
        abi: URIP_TOKEN_ABI,
        functionName: "getAllAssetAllocations",
      })) as [Address[], bigint[]];

      const [assetAddresses, allocations] = allocationsResult;

      if (!assetAddresses || assetAddresses.length === 0) {
        setAssetAllocations([]);
        return [];
      }

      const assetDetailsPromises = assetAddresses.map(
        async (assetAddress, index) => {
          if (
            !assetAddress ||
            assetAddress === "0x0000000000000000000000000000000000000000"
          ) {
            return null;
          }

          try {
            const [nameResult, symbolResult, priceResult, assetInfoResult] =
              await Promise.all([
                readContract(config as any, {
                  address: assetAddress,
                  abi: ASSET_TOKEN_ABI,
                  functionName: "name",
                }),
                readContract(config as any, {
                  address: assetAddress,
                  abi: ASSET_TOKEN_ABI,
                  functionName: "symbol",
                }),
                readContract(config as any, {
                  address: assetAddress,
                  abi: ASSET_TOKEN_ABI,
                  functionName: "getCurrentPrice",
                }),
                readContract(config as any, {
                  address: assetAddress,
                  abi: ASSET_TOKEN_ABI,
                  functionName: "assetInfo",
                }),
              ]);

            const [currentPrice, lastPriceUpdate] = priceResult as [bigint, bigint];
            const [
              assetSymbol,
              assetType,
              description,
              isActive,
              lastInfoUpdate,
            ] = assetInfoResult as [string, string, string, boolean, bigint];

            const allocation = Number(allocations[index]);
            const percentage = (allocation / 10000) * 100;
            const allocationBasisPoints = allocation;

            const assetAllocation: AssetAllocation = {
              tokenAddress: assetAddress,
              assetSymbol: symbolResult as string,
              assetName: nameResult as string,
              assetType,
              assetPrice: formatUnits(currentPrice, 8),
              lastUpdated: formatLastUpdated(lastPriceUpdate),
              percentage,
              allocationBasisPoints,
              isActive,
              assetIcon: getAssetIcon(symbolResult as string, assetType),
            };

            return assetAllocation;
          } catch (error) {
            console.error(`Error fetching details for asset ${assetAddress}:`, error);
            return null;
          }
        }
      );

      const assetAllocationsResolved = await Promise.all(assetDetailsPromises);
      const validAllocations = assetAllocationsResolved.filter(
        (allocation): allocation is AssetAllocation => allocation !== null
      );

      setAssetAllocations(validAllocations);
      return validAllocations;
    } catch (error) {
      console.error("Error fetching asset allocations:", error);
      setAllocationsError(
        error instanceof Error
          ? error.message
          : "Failed to fetch asset allocations"
      );
      return [];
    } finally {
      setIsLoadingAllocations(false);
    }
  }, []); // ✅ Fixed: No dependencies

  // ✅ Fixed: Separate function to update fund info without circular dependencies
  const updateMutualFundInfo = useCallback(
    (basicInfo: any, allocations: AssetAllocation[]) => {
      if (!basicInfo) return;

      const totalAllocationPercentage = allocations.reduce(
        (total, allocation) => total + allocation.percentage,
        0
      );

      const completeFundInfo: MutualFundInfo = {
        ...basicInfo,
        assetAllocations: allocations,
        totalAllocationPercentage,
      };

      setMutualFundInfo(completeFundInfo);
    },
    []
  );

  // ✅ Fixed: Remove state dependencies to prevent circular updates
  const refreshFund = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    const basicInfo = await fetchFundInfo();
    if (basicInfo) {
      // Get current allocations from state instead of depending on it
      setMutualFundInfo(prev => {
        if (!prev) return null;
        return { ...prev, ...basicInfo };
      });
    }
  }, [fetchFundInfo]);

  const refreshAllocations = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    const allocations = await fetchAssetAllocations();
    if (allocations.length > 0) {
      // Update allocations and recalculate fund info
      setMutualFundInfo(prev => {
        if (!prev) return null;
        
        const totalAllocationPercentage = allocations.reduce(
          (total, allocation) => total + allocation.percentage,
          0
        );

        return {
          ...prev,
          assetAllocations: allocations,
          totalAllocationPercentage,
        };
      });
    }
  }, [fetchAssetAllocations]);

  // ✅ Fixed: Main refresh function with proper race condition handling
  const refreshAll = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    
    try {
      const [basicInfo, allocations] = await Promise.all([
        fetchFundInfo(),
        fetchAssetAllocations(),
      ]);

      if (basicInfo) {
        updateMutualFundInfo(basicInfo, allocations);
        setLastFetched(new Date());
      }
    } catch (error) {
      console.error("Error in refreshAll:", error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [fetchFundInfo, fetchAssetAllocations, updateMutualFundInfo]);

  // ✅ Fixed: Only run once on mount, no dependencies on refreshAll
  useEffect(() => {
    let mounted = true;
    
    const initialLoad = async () => {
      if (isFetchingRef.current) return;
      
      isFetchingRef.current = true;
      
      try {
        const [basicInfo, allocations] = await Promise.all([
          fetchFundInfo(),
          fetchAssetAllocations(),
        ]);

        if (mounted && basicInfo) {
          updateMutualFundInfo(basicInfo, allocations);
          setLastFetched(new Date());
        }
      } catch (error) {
        console.error("Error in initial load:", error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    initialLoad();

    return () => {
      mounted = false;
    };
  }, []); // ✅ Fixed: Empty dependency array

  const totalAssets = useMemo(
    () => assetAllocations.length,
    [assetAllocations]
  );

  const getAssetBySymbol = useCallback(
    (symbol: string): AssetAllocation | undefined => {
      return assetAllocations.find((asset) => asset.assetSymbol === symbol);
    },
    [assetAllocations]
  );

  const getAssetByAddress = useCallback(
    (address: Address): AssetAllocation | undefined => {
      return assetAllocations.find(
        (asset) => asset.tokenAddress.toLowerCase() === address.toLowerCase()
      );
    },
    [assetAllocations]
  );

  const getActiveAssets = useCallback((): AssetAllocation[] => {
    return assetAllocations.filter((asset) => asset.isActive);
  }, [assetAllocations]);

  const getAssetsByType = useCallback(
    (type: string): AssetAllocation[] => {
      return assetAllocations.filter((asset) => asset.assetType === type);
    },
    [assetAllocations]
  );

  const getStockAssets = useCallback((): AssetAllocation[] => {
    return getAssetsByType("STOCK");
  }, [getAssetsByType]);

  const getCommodityAssets = useCallback((): AssetAllocation[] => {
    return getAssetsByType("COMMODITY");
  }, [getAssetsByType]);

  return {
    mutualFundInfo,
    assetAllocations,

    isLoadingFund,
    isLoadingAllocations,

    fundError,
    allocationsError,

    lastFetched,
    totalAssets,

    getAssetBySymbol,
    getAssetByAddress,
    getActiveAssets,
    getAssetsByType,
    getStockAssets,
    getCommodityAssets,

    refreshFund,
    refreshAllocations,
    refreshAll,
  };
};