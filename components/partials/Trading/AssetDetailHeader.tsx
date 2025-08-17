"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { ArrowLeft } from "lucide-react";

interface AssetDetailHeaderProps {
  asset: {
    name: string;
    symbol: string;
    price: string;
    marketCap: string;
    icon: string;
    type: string;
  };
  onBackClick?: () => void;
  className?: string;
}

export const AssetDetailHeader: React.FC<AssetDetailHeaderProps> = ({
  asset,
  onBackClick,
  className = "",
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.push("/revamp/trading");
    }
  };

  const getAssetTypeConfig = (type: string) => {
    switch (type) {
      case "CRYPTO":
        return {
          bgColor: "bg-orange-500/20",
          textColor: "text-orange-400",
          label: "CRYPTO",
        };
      case "STOCK":
        return {
          bgColor: "bg-blue-500/20",
          textColor: "text-blue-400",
          label: "STOCK_SP500",
        };
      default:
        return {
          bgColor: "bg-green-500/20",
          textColor: "text-green-400",
          label: type,
        };
    }
  };

  const typeConfig = getAssetTypeConfig(asset.type);

  return (
    <div className={`mb-6 ${className}`}>
      {/* Back to Markets Button */}
      <ActionButton
        variant="ghost"
        size="sm"
        theme="dark"
        onClick={handleBackClick}
        className="mb-4 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Markets
      </ActionButton>

      {/* Asset Info Container */}
      <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm">
        {/* Left Side - Asset Info */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-400 to-green-600">
            <img
              src={asset.icon}
              alt={asset.name}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const span = target.nextElementSibling as HTMLElement;
                if (span) {
                  span.textContent = asset.symbol.charAt(0);
                  span.classList.remove("hidden");
                }
              }}
            />
            <span className="hidden text-white font-bold text-2xl"></span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-gray-300 font-medium">{asset.symbol}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}
              >
                {typeConfig.label}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                Active
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                Live Data
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Price Info */}
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{asset.price}</div>
          <div className="flex items-center justify-end space-x-2 mt-1">
            <span className="text-gray-400 text-sm">
              Market Cap: {asset.marketCap}
            </span>
          </div>
          <div className="text-gray-400 text-sm mt-1">
            Updated from smart contract
          </div>
        </div>
      </div>
    </div>
  );
};
