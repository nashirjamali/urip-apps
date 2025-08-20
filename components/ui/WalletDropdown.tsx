"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@xellar/kit";
import { ChevronDown, User, Wallet, LogOut, Copy, Check, DollarSign, Gift, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUsdtBalance } from "@/hooks/useUsdtBalance";
import { useReferralCode } from "@/hooks/useReferralCode";
import { useUserPoints } from "@/hooks/useUserPoints";

interface WalletDropdownProps {
  onDisconnect?: () => void;
  className?: string;
}

export const WalletDropdown: React.FC<WalletDropdownProps> = ({ 
  onDisconnect,
  className 
}) => {
  const { address, isConnected } = useAccount();
  const { usdtBalance, isLoading: isLoadingBalance } = useUsdtBalance();
  const { referralCode, isLoading: isLoadingReferral } = useReferralCode();
  const { points, isLoading: isLoadingPoints } = useUserPoints();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Format balance for display
  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return "0.00";
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(2);
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  // Format points for display
  const formatPoints = (points: number) => {
    if (points === 0) return "0";
    if (points < 1000) return points.toString();
    if (points < 1000000) return `${(points / 1000).toFixed(1)}K`;
    return `${(points / 1000000).toFixed(1)}M`;
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  // Copy referral code to clipboard
  const copyReferralCode = async () => {
    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        setCopiedReferral(true);
        setTimeout(() => setCopiedReferral(false), 2000);
      } catch (err) {
        console.error("Failed to copy referral code:", err);
      }
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    onDisconnect?.();
    setIsOpen(false);
  };

  if (!isConnected || !address) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <button
            onClick={openConnectModal}
            className={cn(
              "border-white/40 text-gray-300 hover:bg-white/20 hover:text-white backdrop-filter backdrop-blur-sm bg-white/10 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl border-2 px-4 py-2 text-sm font-medium",
              className
            )}
          >
            Connect Wallet
          </button>
        )}
      </ConnectButton.Custom>
    );
  }

  return (
    <div className={cn("relative z-50", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 border-white/40 text-gray-300 hover:bg-white/20 hover:text-white backdrop-filter backdrop-blur-sm bg-white/10 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl border-2 px-4 py-2 text-sm font-medium"
      >
        <div className="w-6 h-6 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-full flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <span className="hidden sm:inline">{formatAddress(address)}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl border backdrop-blur-xl z-50 bg-gray-900/95 border-white/10 text-white">
          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Connected Wallet</p>
                <p className="text-sm text-gray-400">{formatAddress(address)}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* USDT Balance */}
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">USDT Balance</span>
                </div>
                {isLoadingBalance ? (
                  <div className="w-12 h-4 bg-white/10 rounded animate-pulse" />
                ) : (
                  <div>
                    <p className="text-xs text-gray-500">
                      {parseFloat(usdtBalance).toFixed(2)} USDT
                    </p>
                  </div>
                )}
              </div>

              {/* User Points */}
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Points</span>
                </div>
                {isLoadingPoints ? (
                  <div className="w-12 h-4 bg-white/10 rounded animate-pulse" />
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-yellow-400">
                      {formatPoints(points)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {points.toLocaleString()} pts
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Referral Code */}
            <div className="mb-3 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Referral Code</span>
              </div>
              {isLoadingReferral ? (
                <div className="w-24 h-4 bg-white/10 rounded animate-pulse" />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-purple-300">{referralCode}</span>
                  <button
                    onClick={copyReferralCode}
                    className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {copiedReferral ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400" />
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {/* Copy Address Button */}
            <button
              onClick={copyAddress}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors duration-200 bg-white/5 hover:bg-white/10 text-gray-300"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Address Copied!</span>
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
              className="w-full flex items-center space-x-3 py-3 px-3 rounded-lg transition-colors duration-200 hover:bg-red-500/10 text-red-400 hover:text-red-300"
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
