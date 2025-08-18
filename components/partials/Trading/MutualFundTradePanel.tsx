"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { useBuyMutualFund } from "@/hooks/contracts/useBuyMutualFund";
import { useSellMutualFund } from "@/hooks/contracts/useSellMutualFund";
import {
  MutualFundPurchaseParams,
  MutualFundSaleParams,
  MutualFundEstimation,
} from "@/types";

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
  const [tradeEstimate, setTradeEstimate] =
    useState<MutualFundEstimation | null>(null);
  const [estimationLoading, setEstimationLoading] = useState(false);
  const [estimationError, setEstimationError] = useState<string | null>(null);

  // Trading step management
  const [tradeStep, setTradeStep] = useState<"idle" | "approving" | "trading">(
    "idle"
  );
  const [pendingTradeData, setPendingTradeData] =
    useState<MutualFundPurchaseParams | null>(null);
  const [lastProcessedConfirmation, setLastProcessedConfirmation] = useState<
    string | null
  >(null);

  // Buy hook
  const {
    usdtBalance,
    usdtAllowance,
    uripBalance,
    hasEnoughUSDTBalance,
    hasEnoughUSDTAllowance,
    isFundActive: buyFundActive,
    estimateBuyTokens,
    approveUSDT,
    buyMutualFund,
    isTransactionPending: buyPending,
    isConfirmed: buyConfirmed,
    transactionHash: buyTxHash,
    error: buyError,
    refreshBalances: refreshBuyBalances,
    resetTransaction: resetBuyTransaction,
  } = useBuyMutualFund();

  // Sell hook
  const {
    uripBalance: sellUripBalance,
    hasEnoughURIPTokens,
    isFundActive: sellFundActive,
    estimateSellValue,
    sellMutualFund,
    isTransactionPending: sellPending,
    isConfirmed: sellConfirmed,
    transactionHash: sellTxHash,
    error: sellError,
    refreshBalances: refreshSellBalances,
    resetTransaction: resetSellTransaction,
  } = useSellMutualFund();

  // Derived states
  const isProcessing = buyPending || sellPending || tradeStep !== "idle";
  const isConfirmed = buyConfirmed || sellConfirmed;
  const currentError = buyError || sellError;
  const activeUripBalance = tradeType === "buy" ? uripBalance : sellUripBalance;
  const isFundActive = tradeType === "buy" ? buyFundActive : sellFundActive;
  const transactionHash = tradeType === "buy" ? buyTxHash : sellTxHash;

  // Validation logic
  const isValidAmount = useMemo(() => {
    if (!amount) return false;
    const amountNum = parseFloat(amount);
    if (amountNum <= 0) return false;

    if (tradeType === "buy") {
      return hasEnoughUSDTBalance(amount);
    } else {
      return hasEnoughURIPTokens(amount);
    }
  }, [amount, tradeType, hasEnoughUSDTBalance, hasEnoughURIPTokens]);

  const needsApproval = useMemo(() => {
    if (tradeType !== "buy" || !amount) return false;
    return !hasEnoughUSDTAllowance(amount);
  }, [tradeType, amount, hasEnoughUSDTAllowance]);

  // Estimate trade when amount changes
  useEffect(() => {
    const estimateTrade = async () => {
      if (!amount || !isFundActive) {
        setTradeEstimate(null);
        return;
      }

      setEstimationLoading(true);
      setEstimationError(null);

      try {
        let estimate: MutualFundEstimation;

        if (tradeType === "buy") {
          estimate = await estimateBuyTokens(amount);
        } else {
          estimate = await estimateSellValue(amount);
        }

        setTradeEstimate(estimate);
      } catch (error) {
        console.error("Error estimating trade:", error);
        setEstimationError(
          error instanceof Error ? error.message : "Failed to estimate trade"
        );
        setTradeEstimate(null);
      } finally {
        setEstimationLoading(false);
      }
    };

    const debounceTimer = setTimeout(estimateTrade, 500);
    return () => clearTimeout(debounceTimer);
  }, [amount, tradeType, estimateBuyTokens, estimateSellValue, isFundActive]);

  // Handle trade execution with approval flow
  const handleTrade = async () => {
    if (!isValidAmount || !amount || !isFundActive) return;

    try {
      resetBuyTransaction();
      resetSellTransaction();

      if (tradeType === "buy") {
        // Handle approval flow for buy transactions
        if (needsApproval) {
          setTradeStep("approving");
          setPendingTradeData({
            paymentAmount: amount,
          });

          await approveUSDT(amount);
          return; // Wait for approval confirmation
        }

        // Direct buy if approval not needed
        setTradeStep("trading");
        const params: MutualFundPurchaseParams = {
          paymentAmount: amount,
        };
        await buyMutualFund(params);
      } else {
        // Sell flow
        setTradeStep("trading");
        const params: MutualFundSaleParams = {
          tokenAmount: amount,
        };
        await sellMutualFund(params);
      }
    } catch (error) {
      console.error("Trade execution error:", error);
      setTradeStep("idle");
      setPendingTradeData(null);
    }
  };

  // Handle seamless flow after approval
  useEffect(() => {
    const handleSeamlessFlow = async () => {
      if (isConfirmed && tradeStep === "approving" && pendingTradeData) {
        try {
          setTradeStep("trading");

          // Small delay before executing the buy
          await new Promise((resolve) => setTimeout(resolve, 1000));

          await buyMutualFund(pendingTradeData);
        } catch (err) {
          console.error("Seamless buy execution error:", err);
          setTradeStep("idle");
          setPendingTradeData(null);
        }
      }
    };

    handleSeamlessFlow();
  }, [isConfirmed, tradeStep, pendingTradeData, buyMutualFund]);

  // Handle successful transactions
  useEffect(() => {
    if (
      isConfirmed &&
      transactionHash &&
      lastProcessedConfirmation !== transactionHash
    ) {
      setLastProcessedConfirmation(transactionHash);

      setAmount("");
      setTradeEstimate(null);
      setTradeStep("idle");
      setPendingTradeData(null);

      // Refresh balances
      if (tradeType === "buy") {
        refreshBuyBalances();
      } else {
        refreshSellBalances();
      }

      // Reset transaction states after a delay
      setTimeout(() => {
        resetBuyTransaction();
        resetSellTransaction();
      }, 3000);
    }
  }, [
    isConfirmed,
    transactionHash,
    lastProcessedConfirmation,
    tradeType,
    refreshBuyBalances,
    refreshSellBalances,
    resetBuyTransaction,
    resetSellTransaction,
  ]);

  // Helper function to get step message
  const getStepMessage = () => {
    if (tradeStep === "approving") {
      return "Step 1/2: Approving USDT spending...";
    }
    if (tradeStep === "trading") {
      return needsApproval && pendingTradeData
        ? "Step 2/2: Executing buy order..."
        : "Processing transaction...";
    }
    return null;
  };
  const getQuickAmounts = () => {
    if (tradeType === "buy") {
      const balance = parseFloat(usdtBalance);
      return [
        { label: "25%", value: (balance * 0.25).toFixed(2) },
        { label: "50%", value: (balance * 0.5).toFixed(2) },
        { label: "75%", value: (balance * 0.75).toFixed(2) },
        { label: "Max", value: balance.toFixed(2) },
      ];
    } else {
      const balance = parseFloat(activeUripBalance);
      return [
        { label: "25%", value: (balance * 0.25).toFixed(4) },
        { label: "50%", value: (balance * 0.5).toFixed(4) },
        { label: "75%", value: (balance * 0.75).toFixed(4) },
        { label: "Max", value: balance.toFixed(4) },
      ];
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-[#F77A0E]" />
          Trade URIP Fund
        </h3>
        <div className="flex items-center space-x-1 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>

      {/* Trade Type Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTradeType("buy")}
          className={`p-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
            tradeType === "buy"
              ? "bg-green-600/20 border-green-500 text-green-300"
              : "bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500"
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Buy URIP</span>
        </button>
        <button
          onClick={() => setTradeType("sell")}
          className={`p-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
            tradeType === "sell"
              ? "bg-red-600/20 border-red-500 text-red-300"
              : "bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500"
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          <span>Sell URIP</span>
        </button>
      </div>

      {/* User Balance Display */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Available Balance</span>
          </div>
          <div className="text-right">
            <div className="text-white font-medium">
              {tradeType === "buy"
                ? `$${parseFloat(usdtBalance).toFixed(2)} USDT`
                : `${parseFloat(activeUripBalance).toFixed(4)} URIP`}
            </div>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          {tradeType === "buy"
            ? "Amount to Invest (USDT)"
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
            {tradeType === "buy" ? "USDT" : "URIP"}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex space-x-2">
          {getQuickAmounts().map((quickAmount) => (
            <button
              key={quickAmount.label}
              onClick={() => setAmount(quickAmount.value)}
              className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-sm text-gray-300 transition-colors"
            >
              {quickAmount.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Estimation */}
      {amount && (
        <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
          <div className="text-sm font-medium text-gray-300 mb-2">
            Trade Summary
          </div>

          {estimationLoading ? (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F77A0E]"></div>
              <span>Calculating...</span>
            </div>
          ) : estimationError ? (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{estimationError}</span>
            </div>
          ) : tradeEstimate ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {tradeType === "buy" ? "URIP Tokens" : "USD Amount"}
                </span>
                <span className="text-white font-medium">
                  {tradeType === "buy"
                    ? `${tradeEstimate.estimatedTokens} URIP`
                    : `$${tradeEstimate.estimatedValue}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Trading Fee</span>
                <span className="text-red-300">-$${tradeEstimate.fee}</span>
              </div>

              <div className="border-t border-gray-600 pt-2 flex justify-between font-medium">
                <span className="text-gray-300">You Receive</span>
                <span className="text-green-400">
                  {tradeType === "buy"
                    ? `${tradeEstimate.estimatedTokens} URIP`
                    : `$${tradeEstimate.netAmount}`}
                </span>
              </div>
            </div>
          ) : null}
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
              <div>• Total Assets: ${fundInfo?.totalAssetValue || "0"}</div>
              <div>• Status: {fundInfo?.isActive ? "Active" : "Inactive"}</div>
              <div>• 24/7 trading available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Info Messages */}
      {needsApproval && !isProcessing && tradeType === "buy" && (
        <div className="bg-blue-500/10 border border-blue-700/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-200">
              This will require approval first, then automatically execute your
              buy order
            </div>
          </div>
        </div>
      )}

      {/* Step Progress Message */}
      {getStepMessage() && (
        <div className="bg-[#F77A0E]/10 border border-[#F77A0E]/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F77A0E]"></div>
            <span className="text-[#F77A0E] text-sm font-medium">
              {getStepMessage()}
            </span>
          </div>
        </div>
      )}
      {currentError && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-200">
              <div className="font-medium mb-1">Transaction Error</div>
              <div className="text-red-300/80">
                {currentError.message ||
                  "An error occurred during the transaction"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isConfirmed && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-200">
              <div className="font-medium mb-1">Transaction Successful</div>
              <div className="text-green-300/80">
                Your {tradeType} order has been confirmed and processed.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trade Button */}
      <button
        onClick={handleTrade}
        disabled={!isValidAmount || isProcessing || !isFundActive}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
          isValidAmount && !isProcessing && isFundActive
            ? tradeType === "buy"
              ? needsApproval
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>
              {tradeStep === "approving"
                ? "Approving & Buying..."
                : "Processing..."}
            </span>
          </>
        ) : (
          <>
            {tradeType === "buy" ? (
              needsApproval ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Buy URIP</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Buy URIP Fund</span>
                </>
              )
            ) : (
              <>
                <TrendingDown className="w-4 h-4" />
                <span>Sell URIP Fund</span>
              </>
            )}
          </>
        )}
      </button>

      {/* Validation Messages */}
      {amount && !isValidAmount && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>
            {tradeType === "buy"
              ? "Insufficient USDT balance"
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
