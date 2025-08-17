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
          ]}
        />

        {/* Loading State */}
        {isLoading && (
          <LoadingState message="Loading supported assets from blockchain..." />
        )}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            message={error}
            actions={[
              {
                label: "Try again",
                onClick: refreshData,
              },
            ]}
          />
        )}

        {/* Main Content - Only show when data is loaded and no error */}
        {!isLoading && !error && (
          <>
            {/* Show Top Movers only if we have assets */}
            {allAssets.length > 0 && (
              <TopMovers assets={allAssets} onAssetClick={handleAssetClick} />
            )}

            {/* Show Category Filter only if we have categories */}
            {availableCategories.length > 0 && (
              <CategoryFilter
                categories={availableCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                resultCount={filteredAssets.length}
              />
            )}

            {/* Trading Table or Empty State */}
            {filteredAssets.length > 0 ? (
              <TradingTable
                assets={filteredAssets}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onAssetClick={handleAssetClick}
                onTradeClick={handleTradeClick}
              />
            ) : allAssets.length > 0 ? (
              // Show filtered empty state when assets exist but filter results are empty
              <EmptyState
                title={
                  searchTerm ? "No assets found" : "No assets in this category"
                }
                description={
                  searchTerm
                    ? `No assets match "${searchTerm}". Try different keywords.`
                    : `No assets found in "${selectedCategory}" category.`
                }
              />
            ) : (
              <EmptyState
                title="No supported assets"
                description="No assets are currently available for trading. Please check back later."
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default TradingPage;
