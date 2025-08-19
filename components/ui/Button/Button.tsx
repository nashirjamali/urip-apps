"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "success"
    | "danger"
    | "warning";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  icon,
  iconPosition = "left",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-[#F77A0E] hover:bg-[#E6690D] text-white focus:ring-[#F77A0E]/50",
    secondary:
      "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500/50",
    ghost:
      "bg-transparent hover:bg-white/10 text-gray-400 hover:text-white border border-white/20",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500/50",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50",
    warning:
      "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500/50",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className={children ? "mr-2" : ""}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className={children ? "ml-2" : ""}>{icon}</span>
          )}
        </>
      )}
    </button>
  );
};
