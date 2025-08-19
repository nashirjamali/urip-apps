"use client";

import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@xellar/kit";
import { GlassCard } from "../ui/GlassCard";
import { ActionButton } from "../ui/ActionButton";
import { Lock, Wallet, ArrowRight } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/login"
}) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  // If auth is not required, render children directly
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If wallet is connected, render children
  if (isConnected && address) {
    return <>{children}</>;
  }

  // Otherwise show login required screen
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <GlassCard theme="dark" variant="elevated" className="p-8 text-center">
          {/* Lock Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3">
            Wallet Connection Required
          </h2>

          {/* Description */}
          <p className="text-gray-400 mb-8">
            You need to connect your wallet to access this page. Connect your wallet to continue using URIP platform features.
          </p>

          {/* Connect Wallet Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <Wallet className="w-4 h-4" />
              <span>Supported wallets: MetaMask, WalletConnect, and more</span>
            </div>

            {/* Connect Button */}
            {/* <div className="flex justify-center mb-6">
              <ConnectButton />
            </div> */}

            {/* Go to Login Page Button */}
            <div className="border-t border-white/10 pt-6">
              <ActionButton
                variant="secondary"
                size="md"
                theme="dark"
                className="w-full flex items-center justify-center"
                onClick={() => router.push(redirectTo)}
              >
                <span>Go to Login Page</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </ActionButton>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300">
              🔒 Your wallet connection is secure and encrypted. We never store your private keys.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
