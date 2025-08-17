"use client";

import type React from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";

import { AssetDetailHeader } from "@/components/partials/Trading/AssetDetailHeader";
import { PriceChartWidget } from "@/components/partials/Trading/PriceChartWidget";
import { MarketInformationPanel } from "@/components/partials/Trading/MarketInformationPanel";
import { StockDetailsPanel } from "@/components/partials/Trading/StockDetailsPanel";
import { TradePanelWidget } from "@/components/partials/Trading/TradePanelWidget";
import { HoldingsPanel } from "@/components/partials/Trading/HoldingsPanel";
import { Layout } from "@/components/ui/Layout";

import { useAssetDetail } from "@/hooks/contracts/useAssetDetail";
import { useAssetTrading } from "@/hooks/contracts/useAssetTrading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAccount } from "wagmi";

// Loading and Error Components
const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="mb-6">
      <div className="h-4 bg-gray-700 rounded w-32 mb-4"></div>
      <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
          <div>
            <div className="h-6 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-8 bg-gray-700 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="h-96 bg-gray-900/50 rounded-lg border border-white/10"></div>
        <div className="h-40 bg-gray-900/50 rounded-lg border border-white/10"></div>
        <div className="h-60 bg-gray-900/50 rounded-lg border border-white/10"></div>
      </div>
      <div className="space-y-6">
        <div className="h-80 bg-gray-900/50 rounded-lg border border-white/10"></div>
        <div className="h-40 bg-gray-900/50 rounded-lg border border-white/10"></div>
      </div>
    </div>
  </div>
);

const ErrorDisplay: React.FC<{
  error: string;
  onRetry: () => void;
  onBack: () => void;
}> = ({ error, onRetry, onBack }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-red-400 text-2xl">⚠</span>
    </div>
    <h2 className="text-xl font-bold text-white mb-2">Asset Not Found</h2>
    <p className="text-gray-400 mb-6">{error}</p>
    <div className="flex gap-4 justify-center">
      <Button variant="secondary" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Trading
      </Button>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  </div>
);

const AssetDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();

  const symbol = params.symbol as string;

  // Use the asset detail hook for basic asset information
  const {
    asset,
    isLoading: isAssetLoading,
    error: assetError,
    refreshAssetData,
  } = useAssetDetail(symbol);

  // Use the trading hook for contract interactions
  const tradingHook = useAssetTrading(asset?.tokenAddress);

  // Combine loading states
  const isLoading = isAssetLoading || tradingHook.loading;
  const error = assetError || tradingHook.error?.message;

  // Handle trade execution
  const handleTradeExecute = async (
    type: "buy" | "sell",
    amount: number,
    quantity: number
  ) => {
    if (!isConnected) {
      alert("Please connect your wallet to trade");
      return;
    }

    if (!asset?.tokenAddress) {
      alert("Asset information not available");
      return;
    }

    try {
      if (type === "buy") {
        await tradingHook.buyAssetTokens({
          assetTokenAddress: asset.tokenAddress,
          paymentAmount: amount.toString(),
        });
      } else {
        await tradingHook.sellAssetTokens({
          assetTokenAddress: asset.tokenAddress,
          tokenAmount: quantity.toString(),
        });
      }

      // Show success notification
      alert(`${type === "buy" ? "Purchase" : "Sale"} completed successfully!`);
    } catch (error) {
      console.error(`Error executing ${type} trade:`, error);
      alert(`Failed to execute ${type} trade. Please try again.`);
    }
  };

  // Navigation handlers
  const handleBackClick = () => {
    router.push("/revamp/trading");
  };

  const handleRetry = () => {
    refreshAssetData();
    tradingHook.refreshBalances();
  };

  // Calculate if approval is needed
  const needsApproval =
    isConnected &&
    parseFloat(tradingHook.usdtAllowance.replace(/[^\d.-]/g, "")) === 0;

  return (
    <AuthWrapper requireAuth={true}>
      <Layout>
        <div className="container mx-auto px-6 py-6">
          {/* Loading State */}
          {isLoading && <LoadingSkeleton />}

          {/* Error State */}
          {error && !isLoading && (
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              onBack={handleBackClick}
            />
          )}

          {/* Main Content */}
          {asset && !isLoading && !error && (
            <>
              {/* Asset Header */}
              <AssetDetailHeader
                asset={{
                  name: asset.name,
                  symbol: asset.symbol,
                  price: asset.price,
                  marketCap: asset.marketCapNumber?.toString() || "N/A",
                  icon: asset.assetIcon,
                  type: asset.assetType,
                }}
                onBackClick={handleBackClick}
              />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Chart Section */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Price Chart */}
                  <PriceChartWidget
                    asset={{
                      symbol: asset.symbol,
                      type: asset.assetType,
                    }}
                  />

                  {/* Market Information */}
                  <MarketInformationPanel
                    asset={{
                      price: asset.price,
                      high24h: asset.high24h || asset.price,
                      low24h: asset.low24h || asset.price,
                      marketCap: asset.marketCapNumber?.toString() || "N/A",
                      volume24h: asset.volume24h,
                    }}
                  />

                  {/* Stock Details (only for stocks) */}
                  {asset.assetType === "STOCK" && (
                    <StockDetailsPanel
                      asset={{
                        name: asset.name,
                        symbol: asset.symbol,
                        price: asset.price,
                        change24h: asset.change24h || 0,
                        high24h: asset.high24h || asset.price,
                        low24h: asset.low24h || asset.price,
                        marketCap: asset.marketCapNumber?.toString() || "N/A",
                        sector: asset.sector,
                        industry: asset.industry,
                        category: asset.category,
                        exchange: asset.exchange,
                        country: asset.country,
                        employees: asset.employees,
                        founded: asset.founded,
                        ceo: asset.ceo,
                        website: asset.website,
                      }}
                    />
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Trade Panel */}
                  <TradePanelWidget
                    asset={{
                      symbol: asset.symbol,
                      name: asset.name,
                    }}
                    balance={{
                      usdt: tradingHook.usdtBalance,
                      allowance: tradingHook.usdtAllowance,
                    }}
                    isTransactionPending={tradingHook.isTransactionPending}
                    hasEnoughBalance={tradingHook.hasEnoughUSDTBalance}
                    hasEnoughAllowance={tradingHook.hasEnoughUSDTAllowance}
                    needsApproval={needsApproval}
                    onApproveUSDT={tradingHook.approveUSDT}
                    onTradeExecute={handleTradeExecute}
                  />

                  {/* Your Holdings */}
                  <HoldingsPanel
                    holdings={tradingHook.userHoldings}
                    className={
                      tradingHook.isHoldingsLoading ? "opacity-50" : ""
                    }
                  />

                  {/* Status Cards */}
                  <div className="space-y-3">
                    {/* Transaction Status */}
                    {tradingHook.isTransactionPending && (
                      <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-blue-400 text-sm font-medium">
                            Transaction Pending...
                          </span>
                        </div>
                        <p className="text-blue-300 text-xs mt-1">
                          Please wait for the blockchain transaction to
                          complete.
                        </p>
                      </div>
                    )}

                    {/* Transaction Success */}
                    {tradingHook.isConfirmed && (
                      <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-sm font-medium">
                            ✅ Transaction Confirmed
                          </span>
                        </div>
                        <p className="text-green-300 text-xs mt-1">
                          Your trade has been successfully executed.
                        </p>
                      </div>
                    )}

                    {/* Connection Status */}
                    {!isConnected && (
                      <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 text-sm font-medium">
                            Wallet Not Connected
                          </span>
                        </div>
                        <p className="text-yellow-300 text-xs mt-1">
                          Connect your wallet to trade and view your holdings.
                        </p>
                      </div>
                    )}

                    {/* Asset Support Status */}
                    {asset && !tradingHook.isAssetTokenSupported && (
                      <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-400 text-sm font-medium">
                            Asset Not Tradeable
                          </span>
                        </div>
                        <p className="text-red-300 text-xs mt-1">
                          This asset is currently not available for trading.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Layout>
    </AuthWrapper>
  );
};

export default AssetDetailPage;
