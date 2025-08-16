"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ProfileDropdown } from "./ProfileDropdown";
import { ActionButton } from "../ui/ActionButton";
import { BarChart3, TrendingUp, Users, User } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  theme?: "dark" | "light";
}

export const Header: React.FC<HeaderProps> = ({ theme = "dark" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isDark = theme === "dark";

  const navItems = [
    {
      label: "Trading",
      href: "/revamp/trading",
      icon: TrendingUp,
    },
    {
      label: "Governance",
      href: "/revamp/governance", 
      icon: Users,
    },
    {
      label: "Portfolio",
      href: "/revamp/portfolio",
      icon: BarChart3,
    },
    {
      label: "Profile", 
      href: "/revamp/profile",
      icon: User,
    },
  ];

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className={cn(
      "w-full relative z-[9998]",
      isDark 
        ? "bg-black/50 backdrop-blur-xl border-b border-white/10" 
        : "bg-white/50 backdrop-blur-xl border-b border-black/10"
    )}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/urip.png" 
              alt="URIP Logo" 
              width={32} 
              height={32}
              className="rounded-lg"
            />
            <span className={cn(
              "text-xl font-bold",
              isDark ? "text-white" : "text-black"
            )}>
              URIP
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors",
                    isActive
                      ? isDark
                        ? "text-[#F77A0E] bg-[#F77A0E]/10"
                        : "text-[#F77A0E] bg-[#F77A0E]/10"
                      : isDark
                        ? "text-gray-300 hover:text-white hover:bg-white/10"
                        : "text-gray-700 hover:text-black hover:bg-black/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <ProfileDropdown theme={theme} />
          </div>
        </div>
      </div>
    </header>
  );
};

// Default export for compatibility
export default Header;

// Helper function if not imported
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
