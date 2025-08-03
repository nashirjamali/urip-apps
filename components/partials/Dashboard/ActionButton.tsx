"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return `
          bg-gradient-to-r from-[#F77A0E] to-[#E6690D] text-white
          hover:from-[#E6690D] hover:to-[#D55C0D] 
          shadow-lg hover:shadow-xl hover:shadow-[#F77A0E]/30
          border border-[#F77A0E]/20
        `;
      case "secondary":
        return `
          bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300
          hover:from-gray-700 hover:to-gray-600
          shadow-md hover:shadow-lg
          border border-gray-600/20
        `;
      case "ghost":
        return `
          bg-gray-800/50 text-gray-300 backdrop-blur-sm
          hover:bg-gray-700/70
          border border-gray-700/20
        `;
      default:
        return "";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 text-sm";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2.5";
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-lg font-medium transition-all duration-200
        transform hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </Button>
  );
};
