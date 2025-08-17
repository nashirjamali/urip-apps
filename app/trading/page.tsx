"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/ui/Layout";

import { TradingPageHeader } from "@/components/partials/Trading/TradingPageHeader";
import { TopMovers } from "@/components/partials/Trading/TopMovers";
import { CategoryFilter } from "@/components/partials/Trading/CategoryFilter";
import { TradingTable } from "@/components/partials/Trading/TradingTable";
import { useIntegratedTradingData } from "./hooks/useIntegratedTradingData";
import { EmptyState } from "@/components/partials/Trading/EmptyState";
import { LoadingState } from "@/components/partials/Trading/LoadingState";
import { ErrorState } from "@/components/partials/Trading/ErrorState";

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

  // Handle asset click - navigate to detail page
  const handleAssetClick = (symbol: string) => {
    router.push(`/trading/${symbol}`);
  };

  // Handle trade button click
  const handleTradeClick = (symbol: string) => {
    router.push(`/trading/${symbol}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <TradingPageHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalAssets={totalAssets}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <LoadingState message="Loading supported assets from blockchain..." />
        )}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState error={error} onRetry={refreshData} />
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
                type={searchTerm ? "search" : "category"}
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
              // Show general empty state when no assets at all
              <EmptyState
                type="general"
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
