"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outline" | "glass";
  theme?: "light" | "dark";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  theme = "dark",
  padding = "md",
}) => {
  const themeClasses = {
    light: {
      default: "bg-white border-gray-200 text-gray-900",
      elevated: "bg-white border-gray-200 shadow-lg text-gray-900",
      outline: "bg-transparent border-gray-300 text-gray-900",
      glass: "bg-white/80 border-gray-200/50 backdrop-blur-sm text-gray-900",
    },
    dark: {
      default: "bg-gray-900/80 border-white/10 text-white",
      elevated: "bg-gray-900/90 border-white/20 shadow-2xl text-white",
      outline: "bg-transparent border-white/20 text-white",
      glass: "bg-gray-900/50 border-white/10 backdrop-blur-sm text-white",
    },
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-200",
        themeClasses[theme][variant],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <h3
      className={cn(
        "font-semibold leading-none tracking-tight text-white",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return <div className={cn("", className)}>{children}</div>;
};
