import type React from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  theme?: "dark" | "light";
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  className = "",
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  theme = "dark"
}) => {
  const baseClasses = "font-medium rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-[#F77A0E] to-[#E6690D] text-white hover:from-[#E06A00] hover:to-[#D55A00] shadow-lg shadow-[#F77A0E]/25",
    secondary: theme === "dark" 
      ? "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-[#F77A0E]/40"
      : "bg-black/5 text-black border border-black/10 hover:bg-black/10 hover:border-[#F77A0E]/40",
    ghost: theme === "dark"
      ? "text-white hover:bg-white/10"
      : "text-black hover:bg-black/5"
  };
  
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed transform-none hover:scale-100" 
    : "";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabledClasses,
        className
      )}
    >
      {children}
    </button>
  );
};
