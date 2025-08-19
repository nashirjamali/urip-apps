"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { ValueChange } from "@/components/ui/ValueChange/ValueChange";

export interface TopItem {
  id: string;
  title: string;
  subtitle?: string;
  value?: string;
  change?: number;
  icon?: string | React.ReactNode;
  image?: string;
  color?: string;
  onClick?: () => void;
}

export interface TopItemsProps {
  title: string;
  items: TopItem[];
  columns?: 2 | 3 | 4 | 6;
  onItemClick?: (item: TopItem) => void;
  className?: string;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showChange?: boolean;
}

export const TopItems: React.FC<TopItemsProps> = ({
  title,
  items,
  columns = 6,
  onItemClick,
  className,
  theme = "dark",
  size = "md",
  showChange = true,
}) => {
  const gridClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  const sizeClasses = {
    sm: {
      container: "p-3",
      title: "text-lg",
      icon: "w-8 h-8",
      itemTitle: "text-xs",
      itemSubtitle: "text-xs",
    },
    md: {
      container: "p-4",
      title: "text-xl",
      icon: "w-10 h-10",
      itemTitle: "text-sm",
      itemSubtitle: "text-xs",
    },
    lg: {
      container: "p-6",
      title: "text-2xl",
      icon: "w-12 h-12",
      itemTitle: "text-base",
      itemSubtitle: "text-sm",
    },
  };

  const themeClasses = {
    light: {
      title: "text-gray-900",
      card: "bg-white/80 border-gray-200 hover:bg-white",
      cardText: "text-gray-900",
      cardSubtext: "text-gray-600",
    },
    dark: {
      title: "text-white",
      card: "bg-white/10 border-white/20 hover:bg-[#F77A0E]/10 hover:border-[#F77A0E]/50",
      cardText: "text-white group-hover:text-[#F77A0E]",
      cardSubtext: "text-gray-400 group-hover:text-gray-300",
    },
  };

  const renderIcon = (item: TopItem) => {
    if (item.image) {
      return (
        <img
          src={item.image}
          alt={item.title}
          className={cn("object-contain bg-white rounded", sizeClasses[size].icon)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.textContent = item.title.charAt(0);
              fallback.classList.remove("hidden");
            }
          }}
        />
      );
    }

    if (typeof item.icon === "string") {
      return <span className="text-2xl">{item.icon}</span>;
    }

    return item.icon;
  };

  return (
    <div className={cn("mb-8", className)}>
      <h2
        className={cn(
          "font-semibold mb-4 flex items-center",
          sizeClasses[size].title,
          themeClasses[theme].title
        )}
      >
        {title}
      </h2>
      <div className={cn("grid gap-4", gridClasses[columns])}>
        {items.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer hover:scale-105 transition-all duration-200 group"
            onClick={() => {
              item.onClick?.();
              onItemClick?.(item);
            }}
          >
            <div
              className={cn(
                "text-center border rounded-lg backdrop-blur-sm transition-all duration-200 h-40 flex flex-col justify-between p-3",
                themeClasses[theme].card
              )}
            >
              <div className="flex-1 flex flex-col justify-center">
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden bg-white/10 group-hover:bg-[#F77A0E]/20 group-hover:scale-110 transition-all duration-200",
                    sizeClasses[size].icon
                  )}
                >
                  {renderIcon(item)}
                  <span className="hidden font-bold"></span>
                </div>
                <h3
                  className={cn(
                    "font-semibold transition-colors duration-200",
                    sizeClasses[size].itemTitle,
                    themeClasses[theme].cardText
                  )}
                >
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p
                    className={cn(
                      "mb-1 transition-colors duration-200",
                      sizeClasses[size].itemSubtitle,
                      themeClasses[theme].cardSubtext
                    )}
                  >
                    {item.subtitle}
                  </p>
                )}
                {item.value && (
                  <p
                    className={cn(
                      "mb-1 transition-colors duration-200",
                      sizeClasses[size].itemSubtitle,
                      themeClasses[theme].cardSubtext
                    )}
                  >
                    {item.value}
                  </p>
                )}
              </div>
              {showChange && item.change !== undefined && (
                <div className="mt-auto">
                  <ValueChange value={item.change} showIcon={false} size="sm" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
