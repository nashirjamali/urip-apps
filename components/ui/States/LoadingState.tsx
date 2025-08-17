import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullPage?: boolean;
  spinner?: "dots" | "spinner" | "pulse";
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  size = "md",
  message = "Loading...",
  fullPage = false,
  spinner = "spinner",
  className,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const containerClasses = fullPage
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center py-8";

  const renderSpinner = () => {
    switch (spinner) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-[#F77A0E]",
                  size === "sm"
                    ? "h-2 w-2"
                    : size === "md"
                    ? "h-3 w-3"
                    : "h-4 w-4"
                )}
                style={{
                  animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            ))}
          </div>
        );
      case "pulse":
        return (
          <div
            className={cn(
              "rounded-full bg-[#F77A0E] animate-pulse",
              sizeClasses[size]
            )}
          />
        );
      default:
        return (
          <Loader2
            className={cn("animate-spin text-[#F77A0E]", sizeClasses[size])}
          />
        );
    }
  };

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-4">
        {renderSpinner()}
        {message && (
          <p
            className={cn(
              "text-muted-foreground font-medium",
              textSizeClasses[size]
            )}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
