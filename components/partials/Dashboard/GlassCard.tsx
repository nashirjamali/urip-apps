"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "",
  hover = true,
  gradient = false 
}) => {
  const baseClasses = `
    backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-lg
    transition-all duration-300 relative overflow-hidden
  `;
  
  const backgroundClasses = gradient 
    ? "bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/70"
    : "bg-gray-900/80";
    
  const hoverClasses = hover 
    ? "hover:bg-gray-800/90 hover:shadow-xl hover:shadow-[#F77A0E]/20 hover:scale-[1.02] hover:border-[#F77A0E]/30"
    : "";

  return (
    <Card className={`${baseClasses} ${backgroundClasses} ${hoverClasses} ${className}`}>
      {/* Subtle gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F77A0E]/10 via-transparent to-transparent rounded-bl-full" />
      
      {children}
    </Card>
  );
};
