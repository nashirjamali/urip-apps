"use client";

import type React from "react";
import { useEffect, useMemo } from "react";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";
import { Layout } from "@/components/ui/Layout";

import { PortfolioHeader } from "@/components/partials/Portfolio/PortfolioHeader";
import { PortfolioOverviewCards } from "@/components/partials/Portfolio/PortfolioOverviewCards";
import { IndividualAssetsSection } from "@/components/partials/Portfolio/IndividualAssetsSection";
import { MutualFundCard } from "@/components/partials/Portfolio/MutualFundCard";
import { PerformanceChart } from "@/components/partials/Portfolio/PerformanceChart";

import type { Asset, MutualFund } from "@/types";
import { useUserPortfolio } from "@/hooks/contracts/useUserPortfolio";
import { useAccount } from "wagmi";

const PortfolioPage: React.FC = () => {
  const { isConnected } = useAccount();

  const {
    portfolioData,
    isLoading,
    isError,
    errorMessage,
    lastFetched,
    refresh,
    refreshAll,
    getActiveAssets,
    getTotalValue,
  } = useUserPortfolio();

  // Transform portfolio data to match existing component interfaces
  const transformedAssets: Asset[] = useMemo(() => {
    if (!portfolioData?.directAssets) return [];

    return portfolioData.directAssets.map((asset) => ({
      tokenAddress: asset.tokenAddress,
      name: asset.name,
      symbol: asset.symbol,
      assetType: asset.assetType,
      icon: asset.assetIcon || getDefaultIcon(asset.assetType),
      investmentValueAsset: `${asset.investmentValueAmount} ${asset.symbol}`,
      investmentValueUSD: asset.investmentValueUSD,
      pnl: asset.pnl.percentage,
      pnlAmount: `${asset.pnl.isPositive ? "+" : ""}${asset.pnl.amount}`,
      isProfitable: asset.pnl.isPositive,
    }));
  }, [portfolioData?.directAssets]);

  const transformedMutualFund: MutualFund = useMemo(() => {
    if (!portfolioData?.uripFundAsset) {
      return {
        investmentValueURIP: "0 URIP",
        investmentValueUSD: "$0.00",
        pnl: "0%",
        pnlAmount: "$0.00",
        isProfitable: true,
      };
    }

    const fundAsset = portfolioData.uripFundAsset;
    return {
      investmentValueURIP: `${fundAsset.investmentValueAmount} ${fundAsset.symbol}`,
      investmentValueUSD: fundAsset.investmentValueUSD,
      pnl: fundAsset.pnl.percentage,
      pnlAmount: `${fundAsset.pnl.isPositive ? "+" : ""}${
        fundAsset.pnl.amount
      }`,
      isProfitable: fundAsset.pnl.isPositive,
    };
  }, [portfolioData?.uripFundAsset]);

  // Calculate totals from real data
  const totalInvestmentValue = useMemo(() => {
    return portfolioData?.summary.totalInvestmentValueUSD || "$0.00";
  }, [portfolioData?.summary.totalInvestmentValueUSD]);

  const totalPnL = useMemo(() => {
    if (!portfolioData?.summary.totalPnL) return "$0.00";
    const pnl = portfolioData.summary.totalPnL;
    return `${pnl.isPositive ? "+" : ""}${pnl.amount}`;
  }, [portfolioData?.summary.totalPnL]);

  const assetCount = useMemo(() => {
    return portfolioData?.summary.totalAssetsCount || 0;
  }, [portfolioData?.summary.totalAssetsCount]);

  // Helper function to get default icons
  const getDefaultIcon = (assetType: string): string => {
    switch (assetType) {
      case "STOCK":
        return "📈";
      case "CRYPTO":
        return "₿";
      case "COMMODITY":
        return "🥇";
      case "FUND":
        return "💼";
      default:
        return "💰";
    }
  };

  // Event handlers
  const handleRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error("Failed to refresh portfolio:", error);
      // You might want to show a toast notification here
    }
  };

  const handleRefreshAll = async () => {
    try {
      await refreshAll();
    } catch (error) {
      console.error("Failed to refresh all portfolio data:", error);
      // You might want to show a toast notification here
    }
  };

  const handleSettings = () => {
    // Navigate to portfolio settings or open settings modal
    alert("Portfolio settings");
  };

  const handleViewDetails = (assetName: string) => {
    // Navigate to asset details page or open details modal
    alert(`Viewing details for ${assetName}`);
  };

  const handleViewMutualFund = () => {
    // Navigate to mutual fund details page
    alert("Viewing mutual fund details");
  };

  // Auto-refresh portfolio data periodically
  useEffect(() => {
    if (!isConnected) return;

    const intervalId = setInterval(() => {
      refresh();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [isConnected, refresh]);

  // Show loading state
  if (isLoading && !portfolioData) {
    return (
      <AuthWrapper requireAuth={true}>
        <Layout>
          <div className="container mx-auto px-6 py-8">
            <div className="animate-pulse">
              {/* Header skeleton */}
              <div className="flex justify-between items-center mb-8">
                <div className="h-8 bg-gray-300 rounded w-48"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-300 rounded w-24"></div>
                  <div className="h-10 bg-gray-300 rounded w-24"></div>
                </div>
              </div>

              {/* Overview cards skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-300 rounded-lg h-32"></div>
                ))}
              </div>

              {/* Content skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-300 rounded-lg h-96"></div>
                <div className="space-y-6">
                  <div className="bg-gray-300 rounded-lg h-48"></div>
                  <div className="bg-gray-300 rounded-lg h-48"></div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </AuthWrapper>
    );
  }

  // Show error state
  if (isError) {
    return (
      <AuthWrapper requireAuth={true}>
        <Layout>
          <div className="container mx-auto px-6 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-red-800 text-xl font-semibold mb-2">
                Failed to Load Portfolio
              </h2>
              <p className="text-red-600 mb-4">
                {errorMessage ||
                  "An error occurred while loading your portfolio data."}
              </p>
              <button
                onClick={handleRefreshAll}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </Layout>
      </AuthWrapper>
    );
  }

  // Show empty state when not connected
  if (!isConnected) {
    return (
      <AuthWrapper requireAuth={true}>
        <Layout>
          <div className="container mx-auto px-6 py-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h2 className="text-blue-800 text-xl font-semibold mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-blue-600">
                Please connect your wallet to view your portfolio.
              </p>
            </div>
          </div>
        </Layout>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper requireAuth={true}>
      <Layout>
        <div className="container mx-auto px-6 py-8">
          {/* Portfolio Header */}
          <PortfolioHeader
            isRefreshing={isLoading}
            onRefresh={handleRefresh}
            onSettings={handleSettings}
          />

          {/* Portfolio Overview Cards */}
          <PortfolioOverviewCards
            totalInvestmentValue={parseFloat(totalInvestmentValue)}
            totalPnL={parseFloat(totalPnL)}
            assetCount={assetCount}
            className="mb-8"
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Individual Assets Section */}
            <IndividualAssetsSection
              assets={transformedAssets}
              onViewDetails={handleViewDetails}
            />

            {/* Right Column: Mutual Fund and Performance Chart */}
            <div className="space-y-6">
              {/* Mutual Fund Card */}
              <MutualFundCard
                mutualFund={transformedMutualFund}
                onViewDetails={handleViewMutualFund}
              />

              {/* Performance Chart */}
              <PerformanceChart />
            </div>
          </div>
        </div>
      </Layout>
    </AuthWrapper>
  );
};

export default PortfolioPage;
