"use client";

import type React from "react";
import {
  CategoryFilter as GeneralCategoryFilter,
  Category as GeneralCategory,
} from "@/components/ui/CategoryFilter/CategoryFilter";
import type { Category as TradingCategory } from "@/types/trading";

interface TradingCategoryFilterProps {
  categories: TradingCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  resultCount: number;
  className?: string;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export const CategoryFilter: React.FC<TradingCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  resultCount,
  className = "",
  theme = "dark",
  size = "md",
}) => {
  // Transform trading categories to general category format
  const generalCategories: GeneralCategory[] = categories.map(
    (category, index) => ({
      id: category.name, // Use name as ID for backwards compatibility
      name: category.name,
      icon: category.icon,
    })
  );

  // Handle category change with proper mapping
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      onCategoryChange("All");
    } else {
      onCategoryChange(categoryId);
    }
  };

  // Map selected category to match general component expectations
  const mappedSelectedCategory =
    selectedCategory === "All" ? "all" : selectedCategory;

  return (
    <GeneralCategoryFilter
      categories={generalCategories}
      selectedCategory={mappedSelectedCategory}
      onCategoryChange={handleCategoryChange}
      resultCount={resultCount}
      showAll={true}
      allLabel="All Assets"
      allIcon="🌟"
      className={className}
      theme={theme}
      size={size}
    />
  );
};
