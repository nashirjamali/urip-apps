import type React from "react";
import { cn } from "@/lib/utils";

interface PrimaryLayoutProps {
  children: React.ReactNode;
  className?: string;
  theme?: "dark" | "light";
}

export const PrimaryLayout: React.FC<PrimaryLayoutProps> = ({ 
  children, 
  className = "",
  theme = "dark"
}) => {
  const isDark = theme === "dark";
  
  return (
    <div className={cn(
      "min-h-screen transition-all duration-500",
      isDark 
        ? "bg-black text-white" 
        : "bg-white text-black",
      className
    )}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            {/* Dark theme aurora effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F77A0E]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#E6690D]/8 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF8C42]/5 rounded-full blur-3xl animate-pulse"></div>
            
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black opacity-80"></div>
          </>
        ) : (
          <>
            {/* Light theme subtle effects */}
            <div className="absolute top-1/6 left-1/6 w-96 h-96 bg-[#F77A0E]/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/6 right-1/6 w-80 h-80 bg-[#FF8C42]/3 rounded-full blur-3xl animate-pulse"></div>
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(247,122,14,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(247,122,14,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </>
        )}
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
