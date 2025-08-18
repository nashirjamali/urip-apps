"use client";

import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Asset {
  tokenAddress: string;
  name: string;
  symbol: string;
  assetType: string;
  icon: string;
  investmentValueAsset: string;
  investmentValueUSD: string;
  pnl: string;
  pnlAmount: string;
  isProfitable: boolean;
}

interface IndividualAssetCardProps {
  asset: Asset;
  onViewDetails: (assetName: Asset) => void;
  className?: string;
}

export const IndividualAssetCard: React.FC<IndividualAssetCardProps> = ({
  asset,
  onViewDetails,
  className = "",
}) => {
  return (
    <Card className={`bg-gray-900/70 border-gray-600/50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-xl flex items-center justify-center text-2xl">
              {asset.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white">{asset.name}</h3>
              <p className="text-sm text-gray-400">
                {asset.symbol} • {asset.assetType}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">
              {asset.investmentValueUSD}
            </p>
            <p className="text-sm text-gray-400">
              {asset.investmentValueAsset}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">P&L</p>
            <p
              className={`font-semibold ${
                asset.isProfitable ? "text-green-400" : "text-red-400"
              }`}
            >
              {asset.pnlAmount} ({asset.pnl})
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(asset)}
            className="bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span>View Details</span>
          </Button>
        </div>

        <div className="text-xs text-gray-500 mb-2">
          Token Address: {asset.tokenAddress}
        </div>
      </CardContent>
    </Card>
  );
};
