"use client";

import type React from "react";
import { IndividualAssetCard } from "./IndividualAssetCard";
import { EmptyState } from "@/components/ui/States/EmptyState";

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
  onViewDetails: (asset: Asset) => void;
  className?: string;
}

export const IndividualAssetsSection: React.FC<
  IndividualAssetsSectionProps
> = ({ assets, onViewDetails, className = "" }) => {
  if (assets.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <h2 className="text-2xl font-semibold text-white">Individual Assets</h2>
        <EmptyState
          icon="package"
          title="No Individual Assets"
          description="You haven't invested in any individual assets yet. Start trading to build your portfolio."
          size="sm"
          action={{
            label: "Start Trading",
            onClick: () => {
              window.location.href = "/trading";
            },
          }}
        />
      </div>
    );
  }

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
