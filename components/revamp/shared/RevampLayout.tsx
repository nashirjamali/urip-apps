import type React from "react";
import { cn } from "@/lib/utils";

interface LightLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const LightLayout: React.FC<LightLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50", className)}>
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-amber-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
