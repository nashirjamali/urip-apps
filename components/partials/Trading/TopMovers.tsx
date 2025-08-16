// components/trading/TopMovers.tsx
"use client";

import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { PriceChange } from "./PriceChange";
import type { TradingAsset } from "@/types/trading";

interface TopMoversProps {
  assets: TradingAsset[];
  onAssetClick: (symbol: string) => void;
  className?: string;
}

export const TopMovers: React.FC<TopMoversProps> = ({
  assets,
  onAssetClick,
  className = "",
}) => {
  // Get top 6 movers based on 24h change
  const topMovers = [...assets]
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, 6);

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        🔥 Top Movers (24 Hours)
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topMovers.map((asset) => (
          <div
            key={asset.id}
            className="cursor-pointer hover:scale-105 transition-all duration-200 group"
            onClick={() => onAssetClick(asset.symbol)}
          >
            <GlassCard
              theme="dark"
              variant="default"
              className="p-4 text-center group-hover:bg-[#F77A0E]/10 group-hover:border group-hover:border-[#F77A0E]/50 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden bg-white/10 group-hover:bg-[#F77A0E]/20 group-hover:scale-110 transition-all duration-200">
                <img
                  src={asset.assetIcon}
                  alt={asset.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling!.textContent =
                      asset.symbol.charAt(0);
                    (target.nextElementSibling as HTMLElement).classList.remove(
                      "hidden"
                    );
                  }}
                />
                <span className="hidden text-white font-bold text-sm"></span>
              </div>
              <h3 className="font-semibold text-white text-sm group-hover:text-[#F77A0E] transition-colors duration-200">
                {asset.symbol}
              </h3>
              <p className="text-xs text-gray-400 mb-2 group-hover:text-gray-300 transition-colors duration-200">
                {asset.price}
              </p>
              <PriceChange value={asset.change24h} showIcon={false} />
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
};
