"use client";

import type React from "react";
import { useState } from "react";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";
import { Layout } from "@/components/ui/Layout";

import { PortfolioHeader } from "@/components/partials/Portfolio/PortfolioHeader";
import { PortfolioOverviewCards } from "@/components/partials/Portfolio/PortfolioOverviewCards";
import { IndividualAssetsSection } from "@/components/partials/Portfolio/IndividualAssetsSection";
import { MutualFundCard } from "@/components/partials/Portfolio/MutualFundCard";
import { PerformanceChart } from "@/components/partials/Portfolio/PerformanceChart";

import type { Asset, MutualFund } from "@/types";
import {
  calculateTotalInvestmentValue,
  calculateTotalPnL,
} from "@/lib/portfolioCalculation";

// Mock data - could be moved to a separate file or fetched from API
const mockPortfolioAssets: Asset[] = [
  {
    tokenAddress: "0x7a346368cb82bca986e16d91fa1846f3e2f2f081",
    name: "Apple Inc.",
    symbol: "tAAPL",
    assetType: "STOCK",
    icon: "🍎",
    investmentValueAsset: "2.5 tAAPL",
    investmentValueUSD: "$3,080.00",
    pnl: "+8.2%",
    pnlAmount: "+$233.60",
    isProfitable: true,
  },
  {
    tokenAddress: "0xdf1a0e84ad813a178cdcf6fdfec1876f78bb471d",
    name: "Microsoft Corp",
    symbol: "tMSFT",
    assetType: "STOCK",
    icon: "🏢",
    investmentValueAsset: "5.0 tMSFT",
    investmentValueUSD: "$2,140.00",
    pnl: "-2.1%",
    pnlAmount: "-$45.92",
    isProfitable: false,
  },
  {
    tokenAddress: "0x8049cd4055b32e810efad90e998bbe82a58d5ab9",
    name: "Bitcoin",
    symbol: "tBTC",
    assetType: "CRYPTO",
    icon: "₿",
    investmentValueAsset: "0.1 tBTC",
    investmentValueUSD: "$6,750.00",
    pnl: "+15.4%",
    pnlAmount: "+$900.25",
    isProfitable: true,
  },
  {
    tokenAddress: "0xf80567a323c99c99086d0d6884d7b03aff5c8903",
    name: "Gold",
    symbol: "tXAU",
    assetType: "COMMODITY",
    icon: "🥇",
    investmentValueAsset: "3.2 tXAU",
    investmentValueUSD: "$7,680.00",
    pnl: "+3.7%",
    pnlAmount: "+$275.40",
    isProfitable: true,
  },
];

const mockMutualFund: MutualFund = {
  investmentValueURIP: "12.5 URIP",
  investmentValueUSD: "$1,562.50",
  pnl: "+6.8%",
  pnlAmount: "+$99.75",
  isProfitable: true,
};

const PortfolioPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Calculate totals using utility functions
  const totalInvestmentValue = calculateTotalInvestmentValue(
    mockPortfolioAssets,
    mockMutualFund
  );

  const totalPnL = calculateTotalPnL(mockPortfolioAssets, mockMutualFund);

  const assetCount = mockPortfolioAssets.length + 1; // +1 for mutual fund

  // Event handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert("Portfolio data refreshed!");
    }, 2000);
  };

  const handleSettings = () => {
    alert("Portfolio settings");
  };

  const handleViewDetails = (assetName: string) => {
    alert(`Viewing details for ${assetName}`);
  };

  const handleViewMutualFund = () => {
    alert("Viewing mutual fund details");
  };

  return (
    <AuthWrapper requireAuth={true}>
      <Layout>
        <div className="container mx-auto px-6 py-8">
          {/* Portfolio Header */}
          <PortfolioHeader
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            onSettings={handleSettings}
          />

          {/* Portfolio Overview Cards */}
          <PortfolioOverviewCards
            totalInvestmentValue={totalInvestmentValue}
            totalPnL={totalPnL}
            assetCount={assetCount}
            className="mb-8"
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Individual Assets Section */}
            <IndividualAssetsSection
              assets={mockPortfolioAssets}
              onViewDetails={handleViewDetails}
            />

            {/* Right Column: Mutual Fund and Performance Chart */}
            <div className="space-y-6">
              {/* Mutual Fund Card */}
              <MutualFundCard
                mutualFund={mockMutualFund}
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
