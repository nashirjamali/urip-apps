"use client";

import type React from "react";
import { Globe } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card/Card";
import { PriceChange } from "@/components/ui/PriceChange/PriceChange";

interface MarketStatsProps {
  asset: {
    marketCap: string;
    volume24h: string;
    change24h: number;
    change7d: number;
    change1m: number;
    change1y: number;
    website?: string;
    ceo?: string;
    type: string;
  };
  className?: string;
}

export const MarketStats: React.FC<MarketStatsProps> = ({
  asset,
  className,
}) => {
  return (
    <div className="space-y-6">
      {/* Market Statistics */}
      <Card variant="elevated" theme="dark" className={className}>
        <CardHeader>
          <CardTitle size="md">Market Statistics</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap</span>
              <span className="text-white font-medium">{asset.marketCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Volume</span>
              <span className="text-white font-medium">{asset.volume24h}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Change</span>
              <PriceChange value={asset.change24h} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">7d Change</span>
              <PriceChange value={asset.change7d} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">1m Change</span>
              <PriceChange value={asset.change1m} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">1y Change</span>
              <PriceChange value={asset.change1y} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Panel for Stocks */}
      {asset.type === "STOCK" && asset.website && (
        <Card variant="elevated" theme="dark">
          <CardHeader>
            <CardTitle size="md">Company Links</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <a
                href={asset.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-white flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Official Website
                </span>
                <span className="text-gray-400">→</span>
              </a>
              {asset.ceo && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-400">CEO</span>
                    <span className="text-white font-medium">{asset.ceo}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
