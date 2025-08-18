"use client";

import type React from "react";
import { useEffect, useMemo } from "react";
import { RefreshCw, Settings } from "lucide-react";
import { Layout } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { LoadingState } from "@/components/ui/States/LoadingState";
import { ErrorState } from "@/components/ui/States/ErrorState";
import { EmptyState } from "@/components/ui/States/EmptyState";
import { PortfolioOverviewCards } from "@/components/partials/Portfolio/PortfolioOverviewCards";
import { IndividualAssetsSection } from "@/components/partials/Portfolio/IndividualAssetsSection";
import { MutualFundCard } from "@/components/partials/Portfolio/MutualFundCard";
import { PerformanceChart } from "@/components/partials/Portfolio/PerformanceChart";
import type { Asset, MutualFund } from "@/types";
import { useUserPortfolio } from "@/hooks/contracts/useUserPortfolio";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const PortfolioPage: React.FC = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();

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

  const totalInvestmentValue = useMemo(() => {
    return portfolioData?.summary.totalInvestmentValueUSD || "$0.00";
  }, [portfolioData?.summary.totalInvestmentValueUSD]);

  const totalPnL = useMemo(() => {
    if (!portfolioData?.summary.totalPnL) return "$0.00";
    const pnl = portfolioData.summary.totalPnL;
    return `${pnl.isPositive ? "+" : ""}${pnl.amount}`;
  }, [portfolioData?.summary.totalPnL]);

  const assetCount = useMemo(() => {
    const directAssets = portfolioData?.directAssets?.length || 0;
    const fundAssets = portfolioData?.uripFundAsset ? 1 : 0;
    return directAssets + fundAssets;
  }, [portfolioData?.directAssets, portfolioData?.uripFundAsset]);

  const getDefaultIcon = (assetType: string) => {
    switch (assetType.toLowerCase()) {
      case "stock":
        return "📈";
      case "crypto":
        return "₿";
      case "commodity":
        return "🥇";
      case "bond":
        return "🏦";
      default:
        return "💼";
    }
  };

  const handleRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error("Failed to refresh portfolio:", error);
    }
  };

  const handleRefreshAll = async () => {
    try {
      await refreshAll();
    } catch (error) {
      console.error("Failed to refresh all portfolio data:", error);
    }
  };

  const handleViewDetails = (asset: Asset) => {
    router.push(`/trading/${asset.symbol}`);
  };

  const handleViewMutualFund = () => {
    console.log("View mutual fund details");
  };

  const formatLastFetched = () => {
    if (!lastFetched) return "Never";
    return new Date(lastFetched).toLocaleTimeString();
  };

  if (!isConnected) {
    return (
      <Layout>
        <PageHeader
          title="Portfolio"
          subtitle="Connect your wallet to view your portfolio"
          theme="dark"
        />
        <EmptyState
          icon="alert"
          title="Wallet Not Connected"
          description="Please connect your wallet to view your portfolio and track your investments."
          action={{
            label: "Connect Wallet",
            onClick: () => {
              console.log("Connect wallet");
            },
          }}
        />
      </Layout>
    );
  }

  if (isLoading && !portfolioData) {
    return (
      <Layout>
        <PageHeader
          title="Portfolio"
          subtitle="Loading your investment data..."
          theme="dark"
          isLoading={true}
        />
        <LoadingState
          message="Fetching portfolio data from blockchain..."
          size="lg"
        />
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <PageHeader
          title="Portfolio"
          subtitle="Error loading portfolio data"
          theme="dark"
        />
        <ErrorState
          type="generic"
          title="Failed to Load Portfolio"
          message={
            errorMessage ||
            "An error occurred while loading your portfolio data."
          }
          actions={[
            {
              label: "Try Again",
              onClick: handleRefresh,
              variant: "primary",
              icon: <RefreshCw className="h-4 w-4" />,
            },
            {
              label: "Refresh All",
              onClick: handleRefreshAll,
              variant: "secondary",
              icon: <RefreshCw className="h-4 w-4" />,
            },
          ]}
        />
      </Layout>
    );
  }

  if (portfolioData && assetCount === 0) {
    return (
      <Layout>
        <PageHeader
          title="Portfolio"
          subtitle="Your investment dashboard"
          theme="dark"
          stats={[
            {
              label: "Total Value",
              value: "$0.00",
            },
            {
              label: "Assets",
              value: "0",
            },
            {
              label: "Last Updated",
              value: formatLastFetched(),
            },
          ]}
          actions={[
            {
              label: "Refresh",
              onClick: handleRefresh,
              variant: "secondary",
              icon: <RefreshCw className="h-4 w-4" />,
              disabled: isLoading,
            },
          ]}
        />
        <EmptyState
          icon="package"
          title="No Investments Yet"
          description="Start building your portfolio by investing in tokenized assets, stocks, crypto, and mutual funds."
          action={{
            label: "Start Trading",
            onClick: () => {
              window.location.href = "/trading";
            },
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Header with Stats */}
        <PageHeader
          title="Portfolio"
          subtitle="Track your investments and performance"
          theme="dark"
          stats={[
            {
              label: "Total Value",
              value: totalInvestmentValue,
              loading: isLoading,
            },
            {
              label: "Total P&L",
              value: totalPnL,
              loading: isLoading,
            },
            {
              label: "Assets",
              value: assetCount.toString(),
              loading: isLoading,
            },
            {
              label: "Last Updated",
              value: formatLastFetched(),
            },
          ]}
          actions={[
            {
              label: isLoading ? "Refreshing..." : "Refresh",
              onClick: handleRefresh,
              variant: "secondary",
              icon: (
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              ),
              disabled: isLoading,
            },
          ]}
        />

        {/* Portfolio Overview Cards */}
        <PortfolioOverviewCards
          totalInvestmentValue={parseFloat(
            totalInvestmentValue.replace(/[$,]/g, "")
          )}
          totalPnL={parseFloat(totalPnL.replace(/[+$,]/g, ""))}
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
  );
};

export default PortfolioPage;
