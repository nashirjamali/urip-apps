"use client";

import type React from "react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  icon?: string | React.ReactNode;
  count?: number;
  color?: string;
}

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  resultCount?: number;
  showAll?: boolean;
  allLabel?: string;
  allIcon?: string | React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  resultCount,
  showAll = true,
  allLabel = "All",
  allIcon = "🌟",
  className,
  theme = "dark",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const themeClasses = {
    light: {
      active: "bg-[#F77A0E] text-white shadow-lg",
      inactive:
        "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200",
      result: "text-gray-600",
    },
    dark: {
      active: "bg-[#F77A0E] text-white shadow-lg",
      inactive:
        "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20",
      result: "text-gray-400",
    },
  };

  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === "string") {
      return <span className="mr-2">{icon}</span>;
    }
    return <span className="mr-2">{icon}</span>;
  };

  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-wrap gap-2">
        {showAll && (
          <button
            onClick={() => onCategoryChange("all")}
            className={cn(
              "font-medium rounded-full transition-all duration-200",
              sizeClasses[size],
              selectedCategory === "all" || selectedCategory === ""
                ? themeClasses[theme].active + " transform scale-105"
                : themeClasses[theme].inactive + " hover:scale-102"
            )}
          >
            {renderIcon(allIcon)}
            {allLabel}
          </button>
        )}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "font-medium rounded-full transition-all duration-200",
              sizeClasses[size],
              selectedCategory === category.id
                ? themeClasses[theme].active + " transform scale-105"
                : themeClasses[theme].inactive + " hover:scale-102"
            )}
          >
            {category.icon && renderIcon(category.icon)}
            {category.name}
            {category.count !== undefined && (
              <span className="ml-2 opacity-75">({category.count})</span>
            )}
          </button>
        ))}
      </div>
      {resultCount !== undefined &&
        selectedCategory !== "all" &&
        selectedCategory !== "" && (
          <div className={cn("mt-2 text-sm", themeClasses[theme].result)}>
            Showing {resultCount} results
            {selectedCategory &&
              ` in "${
                categories.find((c) => c.id === selectedCategory)?.name
              }" category`}
          </div>
        )}
    </div>
  );
};
