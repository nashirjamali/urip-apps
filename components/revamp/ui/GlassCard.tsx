import type React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  theme?: "dark" | "light";
  variant?: "default" | "bordered" | "elevated";
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "",
  theme = "dark",
  variant = "default"
}) => {
  const isDark = theme === "dark";
  
  const baseClasses = "rounded-2xl backdrop-blur-sm transition-all duration-300";
  
  const themeClasses = isDark 
    ? "bg-white/10 border-white/20 text-white" 
    : "bg-black/5 border-black/10 text-black";
    
  const variantClasses = {
    default: "border",
    bordered: `border-2 ${isDark ? "border-[#F77A0E]/30" : "border-[#F77A0E]/20"}`,
    elevated: `border shadow-lg ${isDark ? "shadow-[#F77A0E]/10" : "shadow-[#F77A0E]/5"}`
  };
  
  const hoverClasses = isDark 
    ? "hover:bg-white/20 hover:border-[#F77A0E]/40" 
    : "hover:bg-black/10 hover:border-[#F77A0E]/30";
  
  return (
    <div className={cn(
      baseClasses,
      themeClasses,
      variantClasses[variant],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
};
