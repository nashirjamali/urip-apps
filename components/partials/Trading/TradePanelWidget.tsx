"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface TradePanelWidgetProps {
  asset: {
    symbol: string;
    name: string;
  };
  balance?: {
    usdt: string;
    allowance: string;
  };
  isTransactionPending?: boolean;
  hasEnoughBalance?: (amount: string) => boolean;
  hasEnoughAllowance?: (amount: string) => boolean;
  needsApproval?: boolean;
  onApproveUSDT?: (amount: string) => Promise<void>;
  onTradeExecute?: (
    type: "buy" | "sell",
    amount: number,
    quantity: number
  ) => void;
  className?: string;
}

export const TradePanelWidget: React.FC<TradePanelWidgetProps> = ({
  asset,
  balance = {
    usdt: "$0.00",
    allowance: "$0.00",
  },
  isTransactionPending = false,
  hasEnoughBalance,
  hasEnoughAllowance,
  needsApproval = false,
  onApproveUSDT,
  onTradeExecute,
  className = "",
}) => {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [isApproving, setIsApproving] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  // Validation logic
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setValidationError("");
      return;
    }

    if (tradeType === "buy") {
      if (hasEnoughBalance && !hasEnoughBalance(amount)) {
        setValidationError("Insufficient USDT balance");
        return;
      }
      if (hasEnoughAllowance && !hasEnoughAllowance(amount)) {
        setValidationError("Approval required");
        return;
      }
    }

    setValidationError("");
  }, [amount, tradeType, hasEnoughBalance, hasEnoughAllowance]);

  // Handle USDT approval
  const handleApproval = async () => {
    if (!onApproveUSDT || !amount) return;

    setIsApproving(true);
    try {
      await onApproveUSDT(amount);
      setValidationError(""); // Clear validation error after approval
    } catch (error) {
      console.error("Approval failed:", error);
      setValidationError("Approval failed. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle trade execution
  const handleTradeExecute = () => {
    if (onTradeExecute && !validationError && amount && quantity) {
      onTradeExecute(tradeType, parseFloat(amount), parseFloat(quantity));
    }
  };

  // Quick amount buttons
  const quickAmounts = ["10", "50", "100", "500"];

  const handleQuickAmount = (quickAmount: string) => {
    setAmount(quickAmount);
  };

  // Clear form
  const clearForm = () => {
    setAmount("");
    setQuantity("");
    setValidationError("");
  };

  // Determine if approval button should be shown
  const showApprovalButton =
    tradeType === "buy" &&
    needsApproval &&
    amount &&
    parseFloat(amount) > 0 &&
    validationError === "Approval required";

  // Determine if trade button should be disabled
  const isTradeDisabled =
    isTransactionPending ||
    isApproving ||
    !amount ||
    parseFloat(amount) <= 0 ||
    !quantity ||
    parseFloat(quantity) <= 0 ||
    (!!validationError && validationError !== "Approval required");

  return (
    <GlassCard variant="default" className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Trade {asset.symbol}
        </h3>
        {(amount || quantity) && (
          <button
            onClick={clearForm}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Buy/Sell Tabs */}
      <div className="flex mb-4 bg-white/10 rounded-lg p-1">
        <button
          onClick={() => setTradeType("buy")}
          disabled={isTransactionPending || isApproving}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 ${
            tradeType === "buy"
              ? "bg-green-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Buy
        </button>
        <button
          onClick={() => setTradeType("sell")}
          disabled={isTransactionPending || isApproving}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 ${
            tradeType === "sell"
              ? "bg-red-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <TrendingDown className="w-4 h-4 mr-1" />
          Sell
        </button>
      </div>

      {/* Balance Info */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">USDT Balance:</span>
          <span className="text-white font-medium">{balance.usdt}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Allowance:</span>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-medium">
              {balance.allowance}
            </span>
            {parseFloat(balance.allowance.replace(/[^\d.-]/g, "")) > 0 && (
              <CheckCircle className="w-3 h-3 text-green-400" />
            )}
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="text-gray-400 text-sm mb-2 block">
          Amount (USDT)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isTransactionPending || isApproving}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E] disabled:opacity-50"
          />
          {validationError && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2 mt-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleQuickAmount(quickAmount)}
              disabled={isTransactionPending || isApproving}
              className="px-3 py-1 text-xs bg-white/10 text-gray-300 rounded hover:bg-white/20 hover:text-white transition-colors disabled:opacity-50"
            >
              ${quickAmount}
            </button>
          ))}
        </div>

        {validationError && (
          <p className="text-red-400 text-xs mt-1 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {validationError}
          </p>
        )}
      </div>

      {/* Quantity Input */}
      <div className="mb-6">
        <label className="text-gray-400 text-sm mb-2 block">
          Quantity ({asset.symbol})
        </label>
        <input
          type="number"
          placeholder="0.00"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={isTransactionPending || isApproving}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E] disabled:opacity-50"
        />
        <p className="text-gray-500 text-xs mt-1">
          Number of {asset.symbol} tokens to {tradeType}
        </p>
      </div>

      {/* Approval Button (for buy trades when approval is needed) */}
      {showApprovalButton && (
        <Button
          variant="secondary"
          size="lg"
          onClick={handleApproval}
          disabled={isApproving || isTransactionPending}
          className="w-full mb-3 text-white bg-blue-600 hover:bg-blue-700 border-blue-600 focus:ring-blue-500"
        >
          {isApproving ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Approving USDT...
            </div>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Approve ${amount} USDT
            </>
          )}
        </Button>
      )}

      {/* Trade Execution Button */}
      <Button
        variant="ghost"
        size="lg"
        onClick={handleTradeExecute}
        disabled={isTradeDisabled || showApprovalButton || false}
        className={`w-full text-white flex items-center justify-center ${
          tradeType === "buy"
            ? "bg-green-600 hover:bg-green-700 border-green-600 focus:ring-green-500"
            : "bg-red-600 hover:bg-red-700 border-red-600 focus:ring-red-500"
        } !bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isTransactionPending ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing Transaction...
          </div>
        ) : (
          <>
            {tradeType === "buy" ? (
              <TrendingUp className="w-5 h-5 mr-2" />
            ) : (
              <TrendingDown className="w-5 h-5 mr-2" />
            )}
            {tradeType === "buy"
              ? `Buy ${asset.symbol}`
              : `Sell ${asset.symbol}`}
          </>
        )}
      </Button>

      {/* Transaction Status Messages */}
      {isTransactionPending && (
        <div className="mt-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-400 text-sm font-medium">
              Transaction pending on blockchain...
            </span>
          </div>
          <p className="text-blue-300 text-xs mt-1">
            This may take a few moments to complete.
          </p>
        </div>
      )}

      {/* Trade Summary */}
      {amount && quantity && !validationError && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Trade Summary</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span
                className={
                  tradeType === "buy" ? "text-green-400" : "text-red-400"
                }
              >
                {tradeType.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white">${amount} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Quantity:</span>
              <span className="text-white">
                {quantity} {asset.symbol}
              </span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
