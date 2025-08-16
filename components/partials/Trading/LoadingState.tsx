"use client";

import type React from "react";
import { RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading assets...",
  className = "",
}) => {
  return (
    <GlassCard
      theme="dark"
      variant="default"
      className={`p-12 text-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center">
        <RefreshCw className="w-12 h-12 text-[#F77A0E] animate-spin mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">{message}</h3>
        <p className="text-gray-400 text-sm">
          Fetching latest data from the blockchain...
        </p>
      </div>
    </GlassCard>
  );
};
