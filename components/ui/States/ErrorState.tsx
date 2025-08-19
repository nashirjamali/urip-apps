import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronLeft,
  Wifi,
  ServerCrash,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  type?: "404" | "500" | "network" | "generic";
  title?: string;
  message?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
    icon?: React.ReactNode;
  }>;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = "generic",
  title,
  message,
  actions,
  size = "md",
  fullPage = false,
  className,
}) => {
  const errorConfigs = {
    "404": {
      title: "Page Not Found",
      message:
        "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
      icon: <div className="text-6xl font-bold text-[#F77A0E]">404</div>,
    },
    "500": {
      title: "Server Error",
      message:
        "Something went wrong on our end. Please try again later or contact support if the problem persists.",
      icon: <ServerCrash className="h-16 w-16 text-muted-foreground/60" />,
    },
    network: {
      title: "Connection Error",
      message:
        "Unable to connect to our servers. Please check your internet connection and try again.",
      icon: <Wifi className="h-16 w-16 text-muted-foreground/60" />,
    },
    generic: {
      title: "Something went wrong",
      message: "An unexpected error occurred. Please try again.",
      icon: <AlertTriangle className="h-16 w-16 text-muted-foreground/60" />,
    },
  };

  const config = errorConfigs[type];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  const sizeClasses = {
    sm: {
      container: "py-6",
      title: "text-base",
      message: "text-sm",
      button: "px-3 py-1.5 text-sm",
    },
    md: {
      container: "py-12",
      title: "text-lg",
      message: "text-base",
      button: "px-4 py-2 text-sm",
    },
    lg: {
      container: "py-16",
      title: "text-xl",
      message: "text-lg",
      button: "px-6 py-3 text-base",
    },
  };

  const containerClasses = fullPage
    ? "min-h-screen flex items-center justify-center bg-background"
    : "flex flex-col items-center justify-center text-center";

  const defaultActions = [
    {
      label: "Try Again",
      onClick: () => window.location.reload(),
      variant: "primary" as const,
      icon: <RefreshCw className="h-4 w-4" />,
    },
    {
      label: "Go Home",
      onClick: () => (window.location.href = "/"),
      variant: "secondary" as const,
      icon: <Home className="h-4 w-4" />,
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <div
      className={cn(containerClasses, sizeClasses[size].container, className)}
    >
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">{config.icon}</div>

        <h1
          className={cn(
            "font-bold text-foreground mb-3",
            sizeClasses[size].title
          )}
        >
          {displayTitle}
        </h1>

        <p
          className={cn(
            "text-muted-foreground mb-8",
            sizeClasses[size].message
          )}
        >
          {displayMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {displayActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={cn(
                "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2",
                sizeClasses[size].button,
                action.variant === "secondary"
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  : "bg-gradient-to-r from-[#F77A0E] to-[#E6690D] text-white hover:shadow-lg hover:shadow-[#F77A0E]/25"
              )}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
