"use client";

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Wallet,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { MutualFundInfo } from "@/types/mutualFunds";

interface MutualFundTradePanelProps {
  fundInfo: MutualFundInfo | null;
  isLoading: boolean;
}

type TradeType = "buy" | "sell";

export const MutualFundTradePanel: React.FC<MutualFundTradePanelProps> = ({
  fundInfo,
  isLoading,
}) => {
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [userBalance] = useState("1000.00"); // Mock user balance
  const [userURIPBalance] = useState("50.25"); // Mock URIP balance

  // Calculate trade estimates
  const tradeEstimate = useMemo(() => {
    if (!amount || !fundInfo?.nav) return null;

    const amountNum = parseFloat(amount);
    const navPrice = parseFloat(fundInfo.nav);

    if (tradeType === "buy") {
      const tokensToReceive = amountNum / navPrice;
      const fee = amountNum * 0.005; // 0.5% fee
      const netAmount = amountNum - fee;

      return {
        tokensToReceive: tokensToReceive.toFixed(4),
        fee: fee.toFixed(2),
        netAmount: netAmount.toFixed(2),
        total: amountNum.toFixed(2),
      };
    } else {
      const usdToReceive = amountNum * navPrice;
      const fee = usdToReceive * 0.005; // 0.5% fee
      const netAmount = usdToReceive - fee;

      return {
        usdToReceive: usdToReceive.toFixed(2),
        fee: fee.toFixed(2),
        netAmount: netAmount.toFixed(2),
        total: amountNum.toFixed(4),
      };
    }
  }, [amount, fundInfo?.nav, tradeType]);

  const handleTrade = async () => {
    if (!tradeEstimate || !amount) return;

    setIsProcessing(true);

    // Simulate trade processing
    setTimeout(() => {
      setIsProcessing(false);
      setAmount("");
      // Here you would integrate with actual trading hooks
    }, 2000);
  };

  const isValidAmount = useMemo(() => {
    if (!amount) return false;
    const amountNum = parseFloat(amount);

    if (tradeType === "buy") {
      return amountNum > 0 && amountNum <= parseFloat(userBalance);
    } else {
      return amountNum > 0 && amountNum <= parseFloat(userURIPBalance);
    }
  }, [amount, tradeType, userBalance, userURIPBalance]);

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Trade URIP Fund</h3>
        <div className="text-right">
          <div className="text-sm text-gray-400">Current NAV</div>
          <div className="text-lg font-bold text-[#F77A0E]">
            ${fundInfo?.nav || "1.00"}
          </div>
        </div>
      </div>

      {/* Trade Type Toggle */}
      <div className="flex bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setTradeType("buy")}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            tradeType === "buy"
              ? "bg-green-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <ArrowUpRight className="w-4 h-4 mr-1" />
          Buy
        </button>
        <button
          onClick={() => setTradeType("sell")}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            tradeType === "sell"
              ? "bg-red-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <ArrowDownRight className="w-4 h-4 mr-1" />
          Sell
        </button>
      </div>

      {/* Balance Display */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-sm">
            <Wallet className="w-4 h-4 mr-1" />
            Available Balance
          </div>
          <div className="text-white font-medium">
            {tradeType === "buy"
              ? `$${userBalance} USD`
              : `${userURIPBalance} URIP`}
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          {tradeType === "buy"
            ? "Amount to Invest (USD)"
            : "URIP Tokens to Sell"}
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={tradeType === "buy" ? "0.00" : "0.0000"}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E] focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            {tradeType === "buy" ? "USD" : "URIP"}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex space-x-2">
          {tradeType === "buy" ? (
            <>
              <button
                onClick={() => setAmount("100")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
              >
                $100
              </button>
              <button
                onClick={() => setAmount("500")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
              >
                $500
              </button>
              <button
                onClick={() => setAmount(userBalance)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
              >
                Max
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAmount("10")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
              >
                10 URIP
              </button>
              <button
                onClick={() => setAmount("25")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
              >
                25 URIP
              </button>
              <button
                onClick={() => setAmount(userURIPBalance)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
              >
                All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Trade Estimate */}
      {tradeEstimate && (
        <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center text-gray-300 text-sm mb-2">
            <Calculator className="w-4 h-4 mr-1" />
            Trade Estimate
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">
                {tradeType === "buy" ? "URIP Tokens" : "USD Amount"}
              </span>
              <span className="text-white font-medium">
                {tradeType === "buy"
                  ? `${tradeEstimate.tokensToReceive} URIP`
                  : `$${tradeEstimate.usdToReceive}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Trading Fee (0.5%)</span>
              <span className="text-red-300">-$${tradeEstimate.fee}</span>
            </div>

            <div className="border-t border-gray-600 pt-2 flex justify-between font-medium">
              <span className="text-gray-300">You Receive</span>
              <span className="text-green-400">
                {tradeType === "buy"
                  ? `${tradeEstimate.tokensToReceive} URIP`
                  : `$${tradeEstimate.netAmount}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Fund Info */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <div className="font-medium mb-1">Fund Information</div>
            <div className="text-blue-300/80 space-y-1">
              <div>
                • Management Fee:{" "}
                {fundInfo?.managementFee
                  ? (fundInfo.managementFee / 100).toFixed(2)
                  : "0.00"}
                % annually
              </div>
              <div>• Total Assets: {fundInfo?.totalAssetValue || "0"} USD</div>
              <div>• Status: {fundInfo?.isActive ? "Active" : "Inactive"}</div>
              <div>• 24/7 trading available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Button */}
      <button
        onClick={handleTrade}
        disabled={!isValidAmount || isProcessing || !fundInfo?.isActive}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
          isValidAmount && !isProcessing && fundInfo?.isActive
            ? tradeType === "buy"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            {tradeType === "buy" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {tradeType === "buy" ? "Buy URIP Fund" : "Sell URIP Fund"}
            </span>
          </>
        )}
      </button>

      {/* Validation Messages */}
      {amount && !isValidAmount && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>
            {tradeType === "buy"
              ? "Insufficient USD balance"
              : "Insufficient URIP balance"}
          </span>
        </div>
      )}

      {!fundInfo?.isActive && (
        <div className="flex items-center space-x-2 text-yellow-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Fund is currently inactive</span>
        </div>
      )}
    </div>
  );
};
