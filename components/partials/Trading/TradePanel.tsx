"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Hash,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Wallet,
  Info,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import type { UseAssetTradingReturn } from "@/hooks/contracts/useAssetTrading";

interface TradePanelProps {
  asset: {
    symbol: string;
    name: string;
    priceNumber: number;
    price: string;
    tokenAddress: string;
  };
  tradingHook: UseAssetTradingReturn;
  onTradeComplete?: () => void;
  className?: string;
}

export const TradePanel: React.FC<TradePanelProps> = ({
  asset,
  tradingHook,
  onTradeComplete,
  className,
}) => {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [inputMode, setInputMode] = useState<"USD" | "QTY">("USD");
  const [usdAmount, setUsdAmount] = useState<string>("");
  const [qtyAmount, setQtyAmount] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [tradeStep, setTradeStep] = useState<"idle" | "approving" | "trading">(
    "idle"
  );
  const [pendingTradeData, setPendingTradeData] = useState<any>(null);
  const [lastProcessedConfirmation, setLastProcessedConfirmation] = useState<
    string | null
  >(null);

  const {
    usdtBalance,
    assetTokenBalance,
    assetTokenPrice,
    isTransactionPending,
    isConfirmed,
    error,
    loading,
    hasEnoughUSDTBalance,
    hasEnoughUSDTAllowance,
    hasEnoughAssetTokens,
    isAssetTokenSupported,
    approveUSDT,
    buyAssetTokens,
    sellAssetTokens,
    refreshBalances,
    resetTransaction,
    transactionHash,
  } = tradingHook;

  const currentPrice =
    parseFloat(assetTokenPrice) || asset.priceNumber / 1000000;

  useEffect(() => {
    if (inputMode === "USD" && usdAmount && currentPrice > 0) {
      const qty = parseFloat(usdAmount) / currentPrice;
      setQtyAmount(qty.toFixed(6));
    } else if (inputMode === "QTY" && qtyAmount && currentPrice > 0) {
      const usd = parseFloat(qtyAmount) * currentPrice;
      setUsdAmount(usd.toFixed(2));
    }
  }, [usdAmount, qtyAmount, inputMode, currentPrice]);

  useEffect(() => {
    if (
      isConfirmed &&
      transactionHash &&
      lastProcessedConfirmation !== transactionHash
    ) {
      setLastProcessedConfirmation(transactionHash);

      setUsdAmount("");
      setQtyAmount("");
      setTradeStep("idle");
      setPendingTradeData(null);
      onTradeComplete?.();

      setTimeout(() => {
        refreshBalances();
      }, 2000);
    }
  }, [isConfirmed]);

  useEffect(() => {
    const handleSeamlessFlow = async () => {
      if (isConfirmed && tradeStep === "approving" && pendingTradeData) {
        try {
          setTradeStep("trading");

          await new Promise((resolve) => setTimeout(resolve, 1000));

          await buyAssetTokens(pendingTradeData);
        } catch (err) {
          console.error("Seamless buy execution error:", err);
          setTradeStep("idle");
          setPendingTradeData(null);
        }
      }
    };

    handleSeamlessFlow();
  }, [isConfirmed, tradeStep, pendingTradeData, buyAssetTokens]);

  const canTrade = useCallback(() => {
    if (!usdAmount && !qtyAmount) return false;
    if (!isAssetTokenSupported) return false;

    if (tradeType === "buy") {
      const amount = parseFloat(usdAmount || "0");
      return amount > 0 && hasEnoughUSDTBalance(usdAmount);
    } else {
      const quantity = parseFloat(qtyAmount || "0");
      return quantity > 0 && hasEnoughAssetTokens(qtyAmount);
    }
  }, [
    usdAmount,
    qtyAmount,
    tradeType,
    isAssetTokenSupported,
    hasEnoughUSDTBalance,
    hasEnoughAssetTokens,
  ]);

  const needsApproval = useCallback(() => {
    if (tradeType !== "buy" || !usdAmount) return false;
    return !hasEnoughUSDTAllowance(usdAmount);
  }, [tradeType, usdAmount, hasEnoughUSDTAllowance]);

  const handleTrade = async () => {
    if (!canTrade()) return;

    try {
      resetTransaction();

      if (tradeType === "buy") {
        if (needsApproval()) {
          setTradeStep("approving");
          setPendingTradeData({
            assetTokenAddress: asset.tokenAddress as `0x${string}`,
            paymentAmount: usdAmount,
          });

          await approveUSDT(usdAmount);

          return;
        }

        setTradeStep("trading");
        await buyAssetTokens({
          assetTokenAddress: asset.tokenAddress as `0x${string}`,
          paymentAmount: usdAmount,
        });
      } else {
        setTradeStep("trading");
        await sellAssetTokens({
          assetTokenAddress: asset.tokenAddress as `0x${string}`,
          tokenAmount: qtyAmount,
        });
      }
    } catch (err) {
      console.error("Trade execution error:", err);
      setTradeStep("idle");
      setPendingTradeData(null);
    }
  };

  const getStepMessage = () => {
    if (tradeStep === "approving") {
      return "Step 1/2: Approving USDT spending...";
    }
    if (tradeStep === "trading") {
      return needsApproval() && pendingTradeData
        ? "Step 2/2: Executing buy order..."
        : "Processing transaction...";
    }
    return null;
  };

  const isInProgress = tradeStep !== "idle" || isTransactionPending;

  const quickAmounts =
    inputMode === "USD" ? ["10", "50", "100", "500"] : ["0.1", "0.5", "1", "5"];

  const formatBalance = (balance: string, decimals: number = 2) => {
    const num = parseFloat(balance);
    if (num === 0) return "0";
    if (num < 0.01) return "< 0.01";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <Card variant="default" theme="dark" className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle size="md">Trade {asset.symbol}</CardTitle>
          <div className="flex items-center space-x-2">
            {/* Input Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setInputMode("USD")}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  inputMode === "USD"
                    ? "bg-[#F77A0E] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setInputMode("QTY")}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  inputMode === "QTY"
                    ? "bg-[#F77A0E] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                QTY
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshBalances}
              disabled={loading || isInProgress}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Refresh balances"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Asset Support Check */}
        {!isAssetTokenSupported && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center text-yellow-400 text-sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              This asset is not currently supported for trading
            </div>
          </div>
        )}

        {/* Enhanced Transaction Status */}
        {isInProgress && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center text-blue-400 text-sm">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              <div>
                <div>{getStepMessage()}</div>
                {tradeStep === "approving" && (
                  <div className="text-xs text-blue-300 mt-1">
                    After approval completes, your buy order will execute
                    automatically
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isConfirmed && tradeStep === "idle" && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Transaction completed successfully!
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error.message}</span>
            </div>
          </div>
        )}

        {/* Balance Display */}
        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center">
              <Wallet className="w-4 h-4 mr-1" />
              Your Balance
            </span>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-300">USDT:</span>
              <span className="text-white font-medium">
                ${formatBalance(usdtBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">{asset.symbol}:</span>
              <span className="text-white font-medium">
                {formatBalance(assetTokenBalance, 6)}
              </span>
            </div>
          </div>

          {showAdvanced && (
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Current Price:</span>
                <span>${formatBalance(currentPrice.toString())}</span>
              </div>
            </div>
          )}
        </div>

        {/* Buy/Sell Toggle */}
        <div className="flex mb-4 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setTradeType("buy")}
            disabled={isInProgress}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
              tradeType === "buy"
                ? "bg-green-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            } ${isInProgress ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Buy
          </button>
          <button
            onClick={() => setTradeType("sell")}
            disabled={isInProgress}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
              tradeType === "sell"
                ? "bg-red-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            } ${isInProgress ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <TrendingDown className="w-4 h-4 mr-1" />
            Sell
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">
            {inputMode === "USD"
              ? "Amount (USD)"
              : `Quantity (${asset.symbol})`}
          </label>
          <div className="relative">
            {inputMode === "USD" ? (
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            ) : (
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            )}
            <input
              type="number"
              placeholder="0.00"
              value={inputMode === "USD" ? usdAmount : qtyAmount}
              onChange={(e) =>
                inputMode === "USD"
                  ? setUsdAmount(e.target.value)
                  : setQtyAmount(e.target.value)
              }
              disabled={isInProgress}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E] ${
                isInProgress ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() =>
                  inputMode === "USD"
                    ? setUsdAmount(amount)
                    : setQtyAmount(amount)
                }
                disabled={isInProgress}
                className={`px-3 py-1 text-xs bg-white/10 text-gray-300 rounded hover:bg-white/20 hover:text-white transition-colors ${
                  isInProgress ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {inputMode === "USD" ? `$${amount}` : amount}
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Amount Display */}
        {(usdAmount || qtyAmount) && currentPrice > 0 && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                {inputMode === "USD" ? `You'll get` : `Total cost`}:
              </span>
              <span className="text-white font-medium">
                {inputMode === "USD"
                  ? `${qtyAmount} ${asset.symbol}`
                  : `$${usdAmount}`}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Price per {asset.symbol}:</span>
              <span>${formatBalance(currentPrice.toString())}</span>
            </div>
          </div>
        )}

        {/* Enhanced Trade Button */}
        <Button
          variant={tradeType === "buy" ? "success" : "danger"}
          size="lg"
          fullWidth
          loading={isInProgress}
          disabled={!canTrade() || !isAssetTokenSupported}
          onClick={handleTrade}
          icon={
            isInProgress ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : tradeType === "buy" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )
          }
          iconPosition="left"
        >
          {isInProgress
            ? tradeStep === "approving"
              ? "Approving & Buying..."
              : "Processing..."
            : needsApproval()
            ? `Approve & Buy ${asset.symbol}`
            : tradeType === "buy"
            ? `Buy ${asset.symbol}`
            : `Sell ${asset.symbol}`}
        </Button>

        {/* Enhanced Info Messages */}
        {needsApproval() && !isInProgress && (
          <div className="mt-2 text-xs text-blue-400 bg-blue-500/10 p-2 rounded">
            This will require approval first, then automatically execute your
            buy order
          </div>
        )}

        {/* Validation Messages */}
        {!canTrade() && (usdAmount || qtyAmount) && (
          <div className="mt-2 text-xs text-gray-400">
            {tradeType === "buy" && !hasEnoughUSDTBalance(usdAmount) && (
              <span className="text-red-400">Insufficient USDT balance</span>
            )}
            {tradeType === "sell" && !hasEnoughAssetTokens(qtyAmount) && (
              <span className="text-red-400">
                Insufficient {asset.symbol} balance
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
