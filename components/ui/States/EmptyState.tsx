import React from "react";
import { FileX, Search, Package, Inbox, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type IconType = "file" | "search" | "package" | "inbox" | "alert";

interface EmptyStateProps {
  icon?: IconType | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "package",
  title,
  description,
  action,
  size = "md",
  className,
}) => {
  const iconMap: Record<IconType, React.ComponentType<any>> = {
    file: FileX,
    search: Search,
    package: Package,
    inbox: Inbox,
    alert: AlertCircle,
  };

  const sizeClasses = {
    sm: {
      container: "py-6",
      icon: "h-8 w-8",
      title: "text-base",
      description: "text-sm",
      button: "px-3 py-1.5 text-sm",
    },
    md: {
      container: "py-12",
      icon: "h-12 w-12",
      title: "text-lg",
      description: "text-base",
      button: "px-4 py-2 text-sm",
    },
    lg: {
      container: "py-16",
      icon: "h-16 w-16",
      title: "text-xl",
      description: "text-lg",
      button: "px-6 py-3 text-base",
    },
  };

  const IconComponent =
    typeof icon === "string" ? iconMap[icon as IconType] : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeClasses[size].container,
        className
      )}
    >
      <div className="mb-4">
        {IconComponent ? (
          <IconComponent
            className={cn("text-muted-foreground/60", sizeClasses[size].icon)}
          />
        ) : (
          icon
        )}
      </div>

      <h3
        className={cn(
          "font-semibold text-foreground mb-2",
          sizeClasses[size].title
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-muted-foreground mb-6 max-w-md",
            sizeClasses[size].description
          )}
        >
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "font-medium rounded-lg transition-all duration-200",
            sizeClasses[size].button,
            action.variant === "secondary"
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : "bg-gradient-to-r from-[#F77A0E] to-[#E6690D] text-white hover:shadow-lg hover:shadow-[#F77A0E]/25"
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
