"use client";

import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
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
  onViewDetails: (assetName: string) => void;
  className?: string;
}

export const IndividualAssetCard: React.FC<IndividualAssetCardProps> = ({
  asset,
  onViewDetails,
  className = "",
}) => {
  return (
    <GlassCard theme="dark" variant="bordered" className={`p-6 ${className}`}>
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
          <p className="text-sm text-gray-400">{asset.investmentValueAsset}</p>
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
        <ActionButton
          variant="secondary"
          size="sm"
          theme="dark"
          onClick={() => onViewDetails(asset.name)}
          className="flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          <span className="flex items-center">View Details</span>
        </ActionButton>
      </div>

      <div className="text-xs text-gray-500 mb-2">
        Token Address: {asset.tokenAddress}
      </div>
    </GlassCard>
  );
};
