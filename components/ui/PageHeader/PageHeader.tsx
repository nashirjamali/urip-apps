"use client";

import type React from "react";
import { Search, ArrowLeft, RefreshCw, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderStats {
  label: string;
  value: string | number;
  loading?: boolean;
}

interface SearchConfig {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface PageHeaderProps {
  // Basic props
  title: string;
  subtitle?: string;
  className?: string;

  // Navigation
  breadcrumbs?: PageHeaderBreadcrumb[];
  showBackButton?: boolean;
  onBackClick?: () => void;

  // Search functionality
  search?: SearchConfig;

  // Stats/Info display
  stats?: PageHeaderStats[];

  // Actions
  actions?: PageHeaderAction[];
  primaryAction?: PageHeaderAction;

  // Loading state
  isLoading?: boolean;

  // Layout options
  layout?: "default" | "centered" | "split";
  size?: "sm" | "md" | "lg";

  // Theme
  theme?: "light" | "dark";
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  className,
  breadcrumbs,
  showBackButton = false,
  onBackClick,
  search,
  stats,
  actions,
  primaryAction,
  isLoading = false,
  layout = "default",
  size = "md",
  theme = "dark",
}) => {
  const sizeClasses = {
    sm: {
      container: "mb-4",
      title: "text-2xl",
      subtitle: "text-sm",
      spacing: "space-y-2",
    },
    md: {
      container: "mb-6",
      title: "text-3xl",
      subtitle: "text-base",
      spacing: "space-y-3",
    },
    lg: {
      container: "mb-8",
      title: "text-4xl",
      subtitle: "text-lg",
      spacing: "space-y-4",
    },
  };

  const themeClasses = {
    light: {
      title: "text-gray-900",
      subtitle: "text-gray-600",
      breadcrumb: "text-gray-500 hover:text-gray-700",
      button: "text-gray-600 hover:text-gray-800",
      search: "bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500",
      stats: "text-gray-600",
    },
    dark: {
      title: "text-white",
      subtitle: "text-gray-300",
      breadcrumb: "text-gray-400 hover:text-gray-200",
      button: "text-gray-400 hover:text-gray-200",
      search: "bg-white/10 border-white/20 text-white placeholder-gray-400",
      stats: "text-gray-400",
    },
  };

  const renderBreadcrumbs = () => {
    if (!breadcrumbs?.length) return null;

    return (
      <nav className="flex items-center space-x-2 mb-2" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <span className={themeClasses[theme].breadcrumb}>/</span>
            )}
            {crumb.href || crumb.onClick ? (
              <button
                onClick={
                  crumb.onClick || (() => (window.location.href = crumb.href!))
                }
                className={cn(
                  "text-sm transition-colors",
                  themeClasses[theme].breadcrumb
                )}
              >
                {crumb.label}
              </button>
            ) : (
              <span className={cn("text-sm", themeClasses[theme].breadcrumb)}>
                {crumb.label}
              </span>
            )}
          </Fragment>
        ))}
      </nav>
    );
  };

  const renderSearch = () => {
    if (!search) return null;

    return (
      <div className="relative">
        <Search
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
            themeClasses[theme].button
          )}
        />
        <input
          type="text"
          placeholder={search.placeholder || "Search..."}
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          className={cn(
            "pl-10 pr-4 py-2 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E] w-64 transition-all duration-200",
            themeClasses[theme].search,
            search.className
          )}
        />
        {search.value && (
          <button
            onClick={() => search.onChange("")}
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors",
              themeClasses[theme].button
            )}
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  const renderStats = () => {
    if (!stats?.length) return null;

    return (
      <div className="flex items-center space-x-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-sm">
            <span className={themeClasses[theme].stats}>{stat.label}: </span>
            <span className={themeClasses[theme].title}>
              {stat.loading ? "Loading..." : stat.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderActions = () => {
    const allActions = [...(actions || [])];
    if (primaryAction) allActions.push(primaryAction);

    if (!allActions.length) return null;

    return (
      <div className="flex items-center space-x-3">
        {allActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
              {
                "bg-gradient-to-r from-[#F77A0E] to-[#E6690D] text-white hover:shadow-lg hover:shadow-[#F77A0E]/25":
                  action.variant === "primary" || action === primaryAction,
                "bg-secondary text-secondary-foreground hover:bg-secondary/80":
                  action.variant === "secondary",
                "hover:bg-white/10 text-gray-400 hover:text-white":
                  action.variant === "ghost" && theme === "dark",
                "hover:bg-gray-100 text-gray-600 hover:text-gray-800":
                  action.variant === "ghost" && theme === "light",
              }
            )}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderBackButton = () => {
    if (!showBackButton) return null;

    return (
      <button
        onClick={onBackClick || (() => window.history.back())}
        className={cn(
          "flex items-center space-x-2 mb-4 text-sm transition-colors",
          themeClasses[theme].button
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>
    );
  };

  if (layout === "centered") {
    return (
      <div className={cn(sizeClasses[size].container, className)}>
        {renderBackButton()}
        {renderBreadcrumbs()}
        <div className="text-center">
          <h1
            className={cn(
              "font-bold mb-2",
              sizeClasses[size].title,
              themeClasses[theme].title
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                themeClasses[theme].subtitle,
                sizeClasses[size].subtitle
              )}
            >
              {subtitle}
            </p>
          )}
          {stats && (
            <div className="mt-4 flex justify-center">{renderStats()}</div>
          )}
          {(search || actions || primaryAction) && (
            <div className="mt-6 flex justify-center items-center space-x-4">
              {renderSearch()}
              {renderActions()}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (layout === "split") {
    return (
      <div className={cn(sizeClasses[size].container, className)}>
        {renderBackButton()}
        {renderBreadcrumbs()}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1
              className={cn(
                "font-bold mb-2",
                sizeClasses[size].title,
                themeClasses[theme].title
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  themeClasses[theme].subtitle,
                  sizeClasses[size].subtitle
                )}
              >
                {subtitle}
              </p>
            )}
            {stats && <div className="mt-3">{renderStats()}</div>}
          </div>
          <div className="flex items-center space-x-4 ml-6">
            {renderSearch()}
            {renderActions()}
          </div>
        </div>
      </div>
    );
  }

  // Default layout
  return (
    <div className={cn(sizeClasses[size].container, className)}>
      {renderBackButton()}
      {renderBreadcrumbs()}
      <div className={sizeClasses[size].spacing}>
        <h1
          className={cn(
            "font-bold",
            sizeClasses[size].title,
            themeClasses[theme].title
          )}
        >
          {title}
        </h1>

        <div className="flex items-center justify-between">
          <div>
            {subtitle && (
              <p
                className={cn(
                  themeClasses[theme].subtitle,
                  sizeClasses[size].subtitle
                )}
              >
                {subtitle}
              </p>
            )}
            {stats && <div className="mt-2">{renderStats()}</div>}
          </div>

          <div className="flex items-center space-x-4">
            {renderSearch()}
            {renderActions()}
          </div>
        </div>
      </div>
    </div>
  );
};
