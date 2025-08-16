import type React from "react";
import { cn } from "@/lib/utils";
import Aurora from "./Aurora/Aurora";
import AppHeader from "./Header/AppHeader";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div
      className={cn(
        "flex flex-col min-h-screen bg-black text-white",
        className
      )}
    >
      <AppHeader />
      <div className="pt-32 px-16">
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};
