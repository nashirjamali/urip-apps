"use client";

import type React from "react";
import { IndividualAssetCard } from "./IndividualAssetCard";

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

interface IndividualAssetsSectionProps {
  assets: Asset[];
  onViewDetails: (assetName: string) => void;
  className?: string;
}

export const IndividualAssetsSection: React.FC<
  IndividualAssetsSectionProps
> = ({ assets, onViewDetails, className = "" }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-white">Individual Assets</h2>

      <div className="space-y-4">
        {assets.map((asset) => (
          <IndividualAssetCard
            key={asset.tokenAddress}
            asset={asset}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};
