"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Building2,
  Globe,
  Calendar,
  Users,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Layout } from "@/components/ui/Layout";
import { LoadingState } from "@/components/ui/States/LoadingState";
import { ErrorState } from "@/components/ui/States/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { LineChartWidget } from "@/components/partials/Trading/LineChartWidget";
import { AssetInfo } from "@/components/partials/Trading/AssetInfo";
import { NewsSection } from "@/components/partials/Trading/NewsSection";
import { MarketStats } from "@/components/partials/Trading/MarketStats";
import { PerformanceSummary } from "@/components/partials/Trading/PerformanceSummary";
import { TradePanel } from "@/components/partials/Trading/TradePanel";
import { useAssetDetail } from "@/hooks/contracts/useAssetDetail";
import { useAssetTrading } from "@/hooks/contracts/useAssetTrading";
import { PriceChange } from "@/components/ui/PriceChange/PriceChange";
import HoldingsSummary from "@/components/partials/Trading/HoldingsSummary";

const AssetDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;

  // Use the smart contract hooks for asset details and trading
  const {
    asset,
    isLoading,
    error,
    userHoldings,
    isHoldingsLoading,
    refreshAssetData,
    buyHook,
    sellHook,
    executeTrade,
  } = useAssetDetail(symbol);

  // Enhanced trading hook for the TradePanel
  const tradingHook = useAssetTrading(asset?.tokenAddress);

  // Filter holdings for current asset
  const currentAssetHoldings = userHoldings.filter(
    (holding) =>
      holding.symbol === symbol ||
      holding.symbol === `t${symbol}` ||
      holding.symbol.replace("t", "") === symbol
  );

  const handleBackClick = () => {
    router.push("/trading");
  };

  const handleRefresh = async () => {
    await refreshAssetData();
  };

  // Loading State
  if (isLoading) {
    return (
      <Layout theme="dark">
        <PageHeader
          title="Asset Details"
          subtitle="Loading asset information from blockchain..."
          showBackButton
          onBackClick={handleBackClick}
          theme="dark"
        />
        <LoadingState
          message="Fetching asset data from smart contracts..."
          size="lg"
        />
      </Layout>
    );
  }

  // Error State
  if (error || !asset) {
    return (
      <Layout theme="dark">
        <PageHeader
          title="Asset Details"
          subtitle="Error loading asset"
          showBackButton
          onBackClick={handleBackClick}
          theme="dark"
        />
        <ErrorState
          type={!asset ? "404" : "generic"}
          title={!asset ? "Asset Not Found" : "Error Loading Asset"}
          message={
            !asset
              ? `The asset "${symbol}" was not found in our supported assets list.`
              : error || "Unable to load asset details from the blockchain."
          }
          actions={[
            {
              label: !asset ? "Browse Assets" : "Retry",
              onClick: !asset ? () => router.push("/trading") : handleRefresh,
            },
          ]}
        />
      </Layout>
    );
  }

  // Transform asset data to match component prop interfaces
  const assetForComponents = {
    // For LineChartWidget
    symbol: asset.symbol,
    type: asset.assetType || "STOCK",

    // For AssetInfo
    name: asset.name,
    description: asset.description || "No description available",
    sector: asset.sector,
    industry: asset.industry,
    exchange: asset.exchange,
    country: asset.country,
    founded: asset.founded,
    employees: asset.employees,
    tokenAddress: asset.tokenAddress,

    // For NewsSection
    // name: already defined above
    // symbol: already defined above

    // For MarketStats
    marketCap: asset.marketCapNumber || "N/A",
    volume24h: asset.volume24h || "N/A",
    change24h: asset.change24h || 0,
    change7d: asset.change7d || 0,
    change1m: asset.change1m || 0,
    change1y: asset.change1y || 0,
    website: asset.website,
    ceo: asset.ceo,
    // type: already defined above

    // For PerformanceSummary
    price: asset.price,
    priceNumber: asset.price || 0,
    high24h: asset.high24h || "N/A",
    low24h: asset.low24h || "N/A",
    // change24h: already defined above
  };

  return (
    <Layout theme="dark">
      {/* Page Header */}
      <PageHeader
        title={asset.name}
        subtitle={`${
          asset.assetType === "STOCK"
            ? "Stock"
            : asset.assetType === "CRYPTO"
            ? "Crypto"
            : "Commodity"
        }`}
        showBackButton
        onBackClick={handleBackClick}
        theme="dark"
        breadcrumbs={[
          { label: "Trading", onClick: () => router.push("/trading") },
          { label: asset.name },
        ]}
        stats={[
          {
            label: "Current Price",
            value: asset.price,
          },
          {
            label: "24h Change",
            value:
              asset.change24h !== undefined
                ? `${asset.change24h > 0 ? "+" : ""}${asset.change24h.toFixed(
                    2
                  )}%`
                : "N/A",
          },
          {
            label: "Market Cap",
            value: asset.marketCapNumber || "N/A",
          },
        ]}
        actions={[
          {
            label: "Refresh",
            onClick: handleRefresh,
            icon: <RefreshCw />,
            variant: "secondary",
          },
        ]}
      />

      {/* Price and Stats Header */}
      <div className="bg-gray-900/50 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white mr-3">
                  {asset.price}
                </h1>
                {asset.change24h !== undefined && (
                  <PriceChange value={asset.change24h} size="lg" />
                )}
              </div>
              <div className="flex space-x-4 text-sm">
                <div>
                  <span className="text-gray-400">24h High: </span>
                  <span className="text-white font-medium">
                    {asset.high24h || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">24h Low: </span>
                  <span className="text-white font-medium">
                    {asset.low24h || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Volume: </span>
                  <span className="text-white font-medium">
                    {asset.volume24h || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Token Contract Info */}
            {asset.tokenAddress && (
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Contract:</span>
                  <span className="text-white font-mono text-sm">
                    {asset.tokenAddress.slice(0, 6)}...
                    {asset.tokenAddress.slice(-4)}
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(asset.tokenAddress!)
                    }
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Copy contract address"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Asset Details */}
          {(asset.category ||
            asset.country ||
            asset.founded ||
            asset.employees ||
            asset.ceo ||
            asset.website) && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center mb-3">
                <Building2 className="w-5 h-5 mr-2 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">
                  Additional Details
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {asset.category && (
                  <div>
                    <span className="text-gray-400 text-sm">Category</span>
                    <div className="text-white font-medium">
                      {asset.category}
                    </div>
                  </div>
                )}
                {asset.country && (
                  <div>
                    <span className="text-gray-400 text-sm flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      Country
                    </span>
                    <div className="text-white font-medium">
                      {asset.country}
                    </div>
                  </div>
                )}
                {asset.founded && (
                  <div>
                    <span className="text-gray-400 text-sm flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Founded
                    </span>
                    <div className="text-white font-medium">
                      {asset.founded}
                    </div>
                  </div>
                )}
                {asset.employees && (
                  <div>
                    <span className="text-gray-400 text-sm flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      Employees
                    </span>
                    <div className="text-white font-medium">
                      {asset.employees}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Charts and Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Line Chart */}
            <LineChartWidget asset={assetForComponents} />

            {/* Asset Information */}
            <AssetInfo asset={assetForComponents} />

            {/* News Section */}
            <NewsSection asset={assetForComponents} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Trading Panel with Smart Contract Integration */}
            <TradePanel
              asset={{
                name: assetForComponents.name,
                price: assetForComponents.price,
                priceNumber: parseInt(assetForComponents.priceNumber as string),
                symbol: assetForComponents.symbol,
                tokenAddress: assetForComponents.tokenAddress,
              }}
              tradingHook={tradingHook}
              onTradeComplete={refreshAssetData}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg"
            />

            {/* Holdings Summary */}
            <HoldingsSummary
              holdings={currentAssetHoldings}
              isLoading={isHoldingsLoading}
            />

            {/* Performance Summary */}
            <PerformanceSummary asset={assetForComponents} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssetDetails;
