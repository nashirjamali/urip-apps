"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Hash,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";

interface TradePanelProps {
  asset: {
    symbol: string;
    name: string;
    priceNumber: number;
  };
  className?: string;
}

export const TradePanel: React.FC<TradePanelProps> = ({ asset, className }) => {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [inputMode, setInputMode] = useState<"USD" | "QTY">("USD");
  const [usdAmount, setUsdAmount] = useState<string>("");
  const [qtyAmount, setQtyAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock price calculation (in real app, get from smart contract)
  const mockPrice = asset.priceNumber / 1000000; // Simplified price conversion

  // Calculate the other amount when one changes
  useEffect(() => {
    if (inputMode === "USD" && usdAmount) {
      const qty = parseFloat(usdAmount) / mockPrice;
      setQtyAmount(qty.toFixed(6));
    } else if (inputMode === "QTY" && qtyAmount) {
      const usd = parseFloat(qtyAmount) * mockPrice;
      setUsdAmount(usd.toFixed(2));
    }
  }, [usdAmount, qtyAmount, inputMode, mockPrice]);

  const handleTrade = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // Reset form
    setUsdAmount("");
    setQtyAmount("");
  };

  const quickAmounts =
    inputMode === "USD" ? ["10", "50", "100", "500"] : ["0.1", "0.5", "1", "5"];

  return (
    <Card variant="default" theme="dark" className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle size="md">Trade {asset.symbol}</CardTitle>
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
        </div>
      </CardHeader>

      <CardContent>
        {/* Buy/Sell Toggle */}
        <div className="flex mb-4 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setTradeType("buy")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
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
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
              tradeType === "sell"
                ? "bg-red-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
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
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E]"
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
                className="px-3 py-1 text-xs bg-white/10 text-gray-300 rounded hover:bg-white/20 hover:text-white transition-colors"
              >
                {inputMode === "USD" ? `$${amount}` : amount}
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Amount Display */}
        {(usdAmount || qtyAmount) && (
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
              <span>${mockPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Trade Button */}
        <Button
          variant={tradeType === "buy" ? "success" : "danger"}
          size="lg"
          fullWidth
          loading={isProcessing}
          disabled={!usdAmount && !qtyAmount}
          onClick={handleTrade}
          icon={
            isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : tradeType === "buy" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )
          }
          iconPosition="left"
        >
          {isProcessing
            ? "Processing..."
            : tradeType === "buy"
            ? `Buy ${asset.symbol}`
            : `Sell ${asset.symbol}`}
        </Button>
      </CardContent>
    </Card>
  );
};
