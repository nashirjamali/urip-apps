"use client";

import type React from "react";
import { Search, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";

interface EmptyStateProps {
  title?: string;
  description?: string;
  type?: "search" | "category" | "general";
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  type = "general",
  className = "",
}) => {
  const getIcon = () => {
    switch (type) {
      case "search":
        return <Search className="w-12 h-12 text-gray-500 mb-4" />;
      case "category":
        return <TrendingUp className="w-12 h-12 text-gray-500 mb-4" />;
      default:
        return <TrendingUp className="w-12 h-12 text-gray-500 mb-4" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case "search":
        return {
          title: "No assets found",
          description: "Try changing your search keywords or filters",
        };
      case "category":
        return {
          title: "No assets in this category",
          description: "Try selecting a different category",
        };
      default:
        return {
          title: "No assets available",
          description: "Assets will appear here once they are loaded",
        };
    }
  };

  const defaultContent = getDefaultContent();

  return (
    <GlassCard
      theme="dark"
      variant="default"
      className={`p-12 text-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center">
        {getIcon()}
        <h3 className="text-white text-lg font-medium mb-2">
          {title || defaultContent.title}
        </h3>
        <p className="text-gray-400 text-sm">
          {description || defaultContent.description}
        </p>
      </div>
    </GlassCard>
  );
};
