"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
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

      setMutualFundInfo((prev) =>
        prev ? { ...prev, ...basicFundInfo } : null
      );

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
  }, []);

  const fetchAssetAllocations = useCallback(async () => {
    setIsLoadingAllocations(true);
    setAllocationsError(null);

    try {
      const allocationsResult = [[]];

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

            const assetName = nameResult as string;
            const assetSymbol = symbolResult as string;
            const [priceRaw, lastUpdate] = priceResult as [bigint, bigint];
            const [, assetType, , , isActive] = assetInfoResult as [
              string,
              string,
              bigint,
              bigint,
              boolean
            ];

            const allocationBasisPoints = Number(allocations[index]);
            const percentage = allocationBasisPoints / 100;

            const assetAllocation: AssetAllocation = {
              tokenAddress: assetAddress,
              percentage,
              assetName,
              assetSymbol,
              assetPrice: formatUnits(priceRaw, 8),
              assetIcon: getAssetIcon(assetSymbol, assetType),
              allocationBasisPoints,
              isActive,
              assetType,
              lastUpdated: formatLastUpdated(lastUpdate),
            };

            return assetAllocation;
          } catch (assetError) {
            console.error(
              `Error fetching details for asset ${index}:`,
              assetError
            );
            return null;
          }
        }
      );

      const assetDetails = (await Promise.all(assetDetailsPromises)).filter(
        (asset): asset is AssetAllocation => asset !== null
      );

      setAssetAllocations(assetDetails);
      return assetDetails;
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
  }, []);

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

  const refreshFund = useCallback(async () => {
    const basicInfo = await fetchFundInfo();
    if (basicInfo && assetAllocations.length > 0) {
      updateMutualFundInfo(basicInfo, assetAllocations);
    }
  }, [fetchFundInfo, assetAllocations, updateMutualFundInfo]);

  const refreshAllocations = useCallback(async () => {
    const allocations = await fetchAssetAllocations();
    if (mutualFundInfo && allocations.length > 0) {
      updateMutualFundInfo(mutualFundInfo, allocations);
    }
  }, [fetchAssetAllocations, mutualFundInfo, updateMutualFundInfo]);

  const refreshAll = useCallback(async () => {
    const [basicInfo, allocations] = await Promise.all([
      fetchFundInfo(),
      fetchAssetAllocations(),
    ]);

    if (basicInfo) {
      updateMutualFundInfo(basicInfo, allocations);
      setLastFetched(new Date());
    }
  }, [fetchFundInfo, fetchAssetAllocations, updateMutualFundInfo]);

  useEffect(() => {
    refreshAll();
  }, []);

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
