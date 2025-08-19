"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import AppHeader from "./Header/AppHeader";
import { AuthWrapper } from "../revamp/auth/AuthWrapper";

interface LayoutProps {
  children: React.ReactNode;
  theme?: "light" | "dark";
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  theme = "dark",
  className,
  maxWidth = "xl",
  padding = "md",
}) => {
  const themeClasses = {
    light: "bg-gray-50 text-gray-900",
    dark: "bg-gray-950 text-white min-h-screen",
  };

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-7xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-2 py-2",
    md: "px-4 py-8",
    lg: "px-6 py-12",
  };

  return (
    <AuthWrapper>
      <div className={cn(themeClasses[theme], className)}>
        <AppHeader />
        <div
          className={cn(
            "container mx-auto",
            maxWidthClasses[maxWidth],
            paddingClasses[padding]
          )}
        >
          <div className="pt-24">{children}</div>
        </div>
      </div>
    </AuthWrapper>
  );
};
