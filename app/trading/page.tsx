"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/ui/Layout";
import { TopMovers } from "@/components/partials/Trading/TopMovers";
import { CategoryFilter } from "@/components/partials/Trading/CategoryFilter";
import { TradingTable } from "@/components/partials/Trading/TradingTable";
import { useIntegratedTradingData } from "./hooks/useIntegratedTradingData";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { LoadingState } from "@/components/ui/States/LoadingState";
import { ErrorState } from "@/components/ui/States/ErrorState";
import { EmptyState } from "@/components/ui/States/EmptyState";
import { ValueChange } from "@/components/ui/ValueChange/ValueChange";
import { TableColumn } from "@/components/ui/DataTable/DataTable";
import MutualFundTradingMenu from "@/components/partials/Trading/MutualFundTradingMenu";

const TradingPage: React.FC = () => {
  const router = useRouter();

  const {
    allAssets,
    filteredAssets,
    availableCategories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortField,
    sortDirection,
    handleSort,
    isLoading,
    error,
    totalAssets,
    refreshData,
  } = useIntegratedTradingData();

  const handleAssetClick = (symbol: string) => {
    router.push(`/trading/${symbol}`);
  };

  const handleTradeClick = (symbol: string) => {
    router.push(`/trading/${symbol}`);
  };

  const columns: TableColumn[] = [
    {
      key: "name",
      label: "Asset",
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center">
          <img src={item.icon} className="w-8 h-8 mr-2" />
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-400">{item.symbol}</div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      align: "right",
      sortable: true,
    },
    {
      key: "change24h",
      label: "24h Change",
      align: "right",
      sortable: true,
      render: (value: number) => <ValueChange value={value} />,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <PageHeader
          title="Trading Hub - All Assets"
          subtitle="Trade crypto, stocks, commodities, and tokenized assets"
          search={{
            placeholder: "Search assets on URIP",
            value: searchTerm,
            onChange: setSearchTerm,
          }}
          stats={[
            {
              label: "Assets available",
              value: totalAssets,
              loading: isLoading,
            },
            {
              label: "Categories",
              value: availableCategories.length.toString(),
            },
          ]}
          actions={[
            {
              label: "Refresh",
              onClick: refreshData,
              variant: "secondary",
              disabled: isLoading,
            },
          ]}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Trading Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Movers Section */}
            <TopMovers
              onAssetClick={handleAssetClick}
              mode="volume"
              showModeSelector={true}
              showCategoryFilter={false}
              size="md"
              assets={allAssets}
            />

            {/* Category Filter */}
            {availableCategories.length > 1 && (
              <CategoryFilter
                categories={availableCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                resultCount={filteredAssets.length}
              />
            )}

            {/* Loading State */}
            {isLoading && (
              <LoadingState message="Loading trading data..." size="lg" />
            )}

            {/* Error State */}
            {error && !isLoading && (
              <ErrorState
                type="generic"
                title="Failed to load trading data"
                message={error}
                actions={[
                  {
                    label: "Retry",
                    onClick: refreshData,
                  },
                ]}
              />
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredAssets.length === 0 && (
              <EmptyState
                icon="🔍"
                title="No assets found"
                description={
                  searchTerm
                    ? `No assets match your search "${searchTerm}"`
                    : selectedCategory !== "all"
                    ? `No assets found in "${selectedCategory}" category`
                    : "No trading assets available"
                }
                action={
                  searchTerm || selectedCategory !== "all"
                    ? {
                        label: "Clear filters",
                        onClick: () => {
                          setSearchTerm("");
                          setSelectedCategory("all");
                        },
                      }
                    : undefined
                }
              />
            )}

            {/* Trading Table */}
            {!isLoading && !error && filteredAssets.length > 0 && (
              <TradingTable
                assets={filteredAssets}
                onAssetClick={handleAssetClick}
                onTradeClick={handleTradeClick}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}

            {/* Mutual Fund Trading Menu */}
            <MutualFundTradingMenu className="mb-6" />
          </div>

          {/* Right Sidebar - Additional Information */}
          <div className="space-y-6">
            {/* Market Overview Card */}
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Market Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Assets</span>
                  <span className="text-white font-medium">{totalAssets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Categories</span>
                  <span className="text-white font-medium">
                    {availableCategories.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Filters</span>
                  <span className="text-white font-medium">
                    {selectedCategory !== "all" ? 1 : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/portfolio")}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="text-white font-medium">View Portfolio</div>
                  <div className="text-sm text-gray-400">
                    Check your investments
                  </div>
                </button>
                <button
                  onClick={() => router.push("/trading/URIP")}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="text-white font-medium">
                    URIP Fund Details
                  </div>
                  <div className="text-sm text-gray-400">
                    View fund information
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TradingPage;
