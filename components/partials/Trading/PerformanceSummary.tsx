"use client";

import type React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card/Card";
import { PriceChange } from "@/components/ui/PriceChange/PriceChange";

interface PerformanceSummaryProps {
  asset: {
    price: string;
    high24h: string;
    low24h: string;
    change24h: number;
  };
  className?: string;
}

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  asset,
  className,
}) => {
  return (
    <Card variant="elevated" theme="dark" className={className}>
      <CardHeader>
        <CardTitle size="md">Performance Summary</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {asset.price}
            </div>
            <div className="text-sm text-gray-400">Current Price</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-green-400 font-medium">{asset.high24h}</div>
              <div className="text-xs text-gray-400">24h High</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-red-400 font-medium">{asset.low24h}</div>
              <div className="text-xs text-gray-400">24h Low</div>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-white/10">
            <PriceChange value={asset.change24h} showIcon={true} />
            <div className="text-xs text-gray-400 mt-1">Last 24 hours</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
