"use client";

import type React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className = "",
}) => {
  return (
    <GlassCard
      theme="dark"
      variant="default"
      className={`p-12 text-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">
          Failed to Load Assets
        </h3>
        <p className="text-gray-400 text-sm mb-6 max-w-md">
          {error ||
            "An error occurred while fetching data from the blockchain. Please try again."}
        </p>
        {onRetry && (
          <ActionButton
            variant="primary"
            theme="dark"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </ActionButton>
        )}
      </div>
    </GlassCard>
  );
};
