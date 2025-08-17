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
import { useAssetDetail } from "@/hooks/contracts/useAssetDetail";
import { PriceChange } from "@/components/ui/PriceChange/PriceChange";
import HoldingsSummary from "@/components/partials/Trading/HoldingsSummary";

const AssetDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;

  // Use the smart contract hook for asset details
  const {
    asset,
    isLoading,
    error,
    userHoldings,
    isHoldingsLoading,
    refreshAssetData,
  } = useAssetDetail(symbol);

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
            variant: "ghost",
          },
        ]}
      />

      {/* Asset Header with Smart Contract Info */}
      <div className="container mx-auto px-6 py-4">
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {asset.assetIcon && (
                <img
                  src={asset.assetIcon}
                  alt={asset.name}
                  className="w-12 h-12 rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-gray-400 text-lg">{asset.symbol}</span>
                  {asset.exchange && (
                    <span className="text-gray-500 text-sm">
                      {asset.exchange}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">
                {asset.price}
              </div>
              {asset.change24h !== undefined && (
                <PriceChange value={asset.change24h} size="lg" />
              )}
            </div>
          </div>

          {/* Token Contract Info */}
          {asset.tokenAddress && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Token Contract:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono text-sm">
                    {asset.tokenAddress.slice(0, 6)}...
                    {asset.tokenAddress.slice(-4)}
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(asset.tokenAddress)
                    }
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Copy contract address"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6">
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
            {/* Holdings Summary */}
            <HoldingsSummary
              holdings={currentAssetHoldings}
              isLoading={isHoldingsLoading}
            />

            {/* Performance Summary */}
            <PerformanceSummary asset={assetForComponents} />

            {/* Additional Asset Details */}
            {(asset.category ||
              asset.country ||
              asset.founded ||
              asset.employees ||
              asset.ceo ||
              asset.website) && (
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Additional Details
                </h3>
                <div className="space-y-3">
                  {asset.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category</span>
                      <span className="text-white font-medium">
                        {asset.category}
                      </span>
                    </div>
                  )}
                  {asset.country && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        Country
                      </span>
                      <span className="text-white font-medium">
                        {asset.country}
                      </span>
                    </div>
                  )}
                  {asset.founded && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Founded
                      </span>
                      <span className="text-white font-medium">
                        {asset.founded}
                      </span>
                    </div>
                  )}
                  {asset.employees && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        Employees
                      </span>
                      <span className="text-white font-medium">
                        {asset.employees}
                      </span>
                    </div>
                  )}
                  {asset.ceo && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">CEO</span>
                      <span className="text-white font-medium">
                        {asset.ceo}
                      </span>
                    </div>
                  )}
                  {asset.website && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Website</span>
                      <a
                        href={asset.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                      >
                        Visit <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Asset Description */}
            {asset.description && (
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                <p className="text-gray-300 leading-relaxed">
                  {asset.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssetDetails;
