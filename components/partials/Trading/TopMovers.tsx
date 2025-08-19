"use client";

import type React from "react";
import { useState } from "react";
import { TopItems, TopItem } from "@/components/ui/TopItems/TopItems";
import { CategoryFilter } from "@/components/ui/CategoryFilter/CategoryFilter";
import type { TradingAsset } from "@/types/trading";
import { cn } from "@/lib/utils";

export type TopMoversMode =
  | "movers"
  | "gainers"
  | "losers"
  | "volume"
  | "marketCap";

interface TopMoversProps {
  assets: TradingAsset[];
  onAssetClick: (symbol: string) => void;
  className?: string;
  mode?: TopMoversMode;
  showModeSelector?: boolean;
  showCategoryFilter?: boolean;
  maxItems?: number;
  columns?: 2 | 3 | 4 | 6;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

interface ModeConfig {
  title: string;
  icon: string;
  sortFn: (assets: TradingAsset[]) => TradingAsset[];
  description?: string;
}

const MODE_CONFIGS: Record<TopMoversMode, ModeConfig> = {
  movers: {
    title: "Top Movers (24h)",
    icon: "🔥",
    sortFn: (assets) =>
      [...assets].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)),
    description: "Assets with the biggest price movements",
  },
  gainers: {
    title: "Top Gainers (24h)",
    icon: "📈",
    sortFn: (assets) =>
      [...assets]
        .sort((a, b) => b.change24h - a.change24h)
        .filter((a) => a.change24h > 0),
    description: "Best performing assets today",
  },
  losers: {
    title: "Top Losers (24h)",
    icon: "📉",
    sortFn: (assets) =>
      [...assets]
        .sort((a, b) => a.change24h - b.change24h)
        .filter((a) => a.change24h < 0),
    description: "Worst performing assets today",
  },
  volume: {
    title: "Most Active",
    icon: "⚡",
    sortFn: (assets) =>
      [...assets].sort((a, b) => b.priceNumber - a.priceNumber), // Mock volume sort by price
    description: "Highest trading volume",
  },
  marketCap: {
    title: "Largest by Market Cap",
    icon: "🏆",
    sortFn: (assets) =>
      [...assets].sort((a, b) => b.marketCapNumber - a.marketCapNumber),
    description: "Biggest market capitalizations",
  },
};

export const TopMovers: React.FC<TopMoversProps> = ({
  assets,
  onAssetClick,
  className = "",
  mode = "movers",
  showModeSelector = false,
  showCategoryFilter = false,
  maxItems = 6,
  columns = 6,
  theme = "dark",
  size = "md",
}) => {
  const [selectedMode, setSelectedMode] = useState<TopMoversMode>(mode);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories from assets
  const availableCategories = Array.from(
    new Set(assets.map((asset) => asset.category))
  ).map((categoryName) => ({
    id: categoryName.toLowerCase().replace(/\s+/g, "-"),
    name: categoryName,
    icon: getCategoryIcon(categoryName),
  }));

  // Filter assets by category
  const categoryFilteredAssets =
    selectedCategory === "all"
      ? assets
      : assets.filter(
          (asset) =>
            asset.category.toLowerCase().replace(/\s+/g, "-") ===
            selectedCategory
        );

  // Apply sorting based on selected mode
  const config = MODE_CONFIGS[selectedMode];
  const sortedAssets = config.sortFn(categoryFilteredAssets).slice(0, maxItems);

  // Transform trading assets to TopItems format
  const topItems: TopItem[] = sortedAssets.map((asset) => ({
    id: asset.id,
    title: asset.symbol,
    subtitle: asset.name,
    value: asset.price,
    change: asset.change24h,
    image: asset.assetIcon,
    color: asset.color,
    onClick: () => onAssetClick(asset.symbol),
  }));

  function getCategoryIcon(categoryName: string): string {
    switch (categoryName.toLowerCase()) {
      case "technology stock":
        return "💻";
      case "cryptocurrency":
        return "🪙";
      case "precious metal":
        return "🥇";
      default:
        return "📊";
    }
  }

  const handleModeChange = (newMode: TopMoversMode) => {
    setSelectedMode(newMode);
  };

  return (
    <div className={cn("mb-8", className)}>
      {/* Mode Selector */}
      {showModeSelector && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(MODE_CONFIGS).map(([modeKey, modeConfig]) => (
              <button
                key={modeKey}
                onClick={() => handleModeChange(modeKey as TopMoversMode)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  selectedMode === modeKey
                    ? "bg-[#F77A0E] text-white shadow-lg"
                    : theme === "dark"
                    ? "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                )}
              >
                <span className="mr-1">{modeConfig.icon}</span>
                {modeConfig.title.replace(" (24h)", "")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      {showCategoryFilter && availableCategories.length > 1 && (
        <div className="mb-4">
          <CategoryFilter
            categories={availableCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showAll={true}
            allLabel="All Categories"
            allIcon="🌟"
            theme={theme}
            size="sm"
          />
        </div>
      )}

      {/* Top Items Display */}
      <TopItems
        title={`${config.icon} ${config.title}`}
        items={topItems}
        columns={columns}
        onItemClick={(item) => onAssetClick(item.title)} // item.title is the symbol
        theme={theme}
        size={size}
        showChange={true}
        className={className}
      />

      {/* Description */}
      {config.description && (
        <p
          className={cn(
            "text-sm mt-2",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}
        >
          {config.description}
        </p>
      )}
    </div>
  );
};
