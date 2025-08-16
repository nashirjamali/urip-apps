"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@xellar/kit";
import { ChevronDown, User, Wallet, LogOut, Copy, Check } from "lucide-react";
import { ActionButton } from "../ui/ActionButton";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  theme?: "dark" | "light";
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ 
  theme = "dark" 
}) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  if (!isConnected || !address) {
    return (
      <div className="flex items-center space-x-4">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      <ActionButton 
        variant="secondary" 
        size="sm" 
        theme={theme}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-6 h-6 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-full flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <span className="hidden sm:inline">{formatAddress(address)}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </ActionButton>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-2 w-64 rounded-xl shadow-xl border backdrop-blur-xl z-[9999]",
          isDark 
            ? "bg-gray-900/95 border-white/10 text-white" 
            : "bg-white/95 border-gray-200 text-gray-900"
        )}>
          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Connected Wallet</p>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                  {formatAddress(address)}
                </p>
              </div>
            </div>
            
            {/* Copy Address Button */}
            <button
              onClick={copyAddress}
              className={cn(
                "w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors duration-200",
                isDark 
                  ? "bg-white/5 hover:bg-white/10 text-gray-300" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy Address</span>
                </>
              )}
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={handleDisconnect}
              className={cn(
                "w-full flex items-center space-x-3 py-3 px-3 rounded-lg transition-colors duration-200",
                isDark 
                  ? "hover:bg-red-500/10 text-red-400 hover:text-red-300" 
                  : "hover:bg-red-50 text-red-600 hover:text-red-700"
              )}
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
