"use client";

import type React from "react";
import type { Category } from "@/types/trading";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  resultCount: number;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  resultCount,
  className = "",
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === "All"
              ? "bg-[#F77A0E] text-white shadow-lg"
              : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
          }`}
        >
          <span className="mr-2">🌟</span>
          All Assets
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onCategoryChange(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.name
                ? "bg-[#F77A0E] text-white shadow-lg transform scale-105"
                : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20 hover:scale-102"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
      {selectedCategory !== "All" && (
        <div className="mt-2 text-sm text-gray-400">
          Showing {resultCount} assets in "{selectedCategory}" category
        </div>
      )}
    </div>
  );
};
