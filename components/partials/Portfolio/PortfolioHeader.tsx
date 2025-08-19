"use client";

import type React from "react";
import { RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortfolioHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onSettings: () => void;
  className?: string;
}

export const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  isRefreshing,
  onRefresh,
  onSettings,
  className = "",
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-gray-400">
            Track your investments and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? "opacity-50" : ""}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onSettings}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
