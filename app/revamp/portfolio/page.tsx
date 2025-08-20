"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryLayout } from "@/components/revamp/layout/PrimaryLayout";
import { Header } from "@/components/revamp/layout/Header";
import { Footer } from "@/components/revamp/layout/Footer";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";
import { TrendingUp, DollarSign, PieChart, Eye, ArrowUpRight, ArrowDownRight, Settings, RefreshCw } from "lucide-react";

// Mock portfolio data berdasarkan screenshot
const mockPortfolioAssets = [
  {
    tokenAddress: "0x7a346368cb82bca986e16d91fa1846f3e2f2f081",
    name: "Apple Inc.",
    symbol: "tAAPL",
    assetType: "STOCK",
    icon: "🍎",
    investmentValueAsset: "2.5 tAAPL",
    investmentValueUSD: "$3,080.00",
    pnl: "+8.2%",
    pnlAmount: "+$233.60",
    isProfitable: true
  },
  {
    tokenAddress: "0xdf1a0e84ad813a178cdcf6fdfec1876f78bb471d",
    name: "Microsoft Corp",
    symbol: "tMSFT",
    assetType: "STOCK",
    icon: "🏢",
    investmentValueAsset: "5.0 tMSFT",
    investmentValueUSD: "$2,140.00",
    pnl: "-2.1%",
    pnlAmount: "-$45.92",
    isProfitable: false
  },
  {
    tokenAddress: "0x8049cd4055b32e810efad90e998bbe82a58d5ab9",
    name: "Bitcoin",
    symbol: "tBTC",
    assetType: "CRYPTO",
    icon: "₿",
    investmentValueAsset: "0.1 tBTC",
    investmentValueUSD: "$6,750.00",
    pnl: "+15.4%",
    pnlAmount: "+$900.25",
    isProfitable: true
  },
  {
    tokenAddress: "0xf80567a323c99c99086d0d6884d7b03aff5c8903",
    name: "Gold",
    symbol: "tXAU",
    assetType: "COMMODITY",
    icon: "🥇",
    investmentValueAsset: "3.2 tXAU",
    investmentValueUSD: "$7,680.00",
    pnl: "+3.7%",
    pnlAmount: "+$275.40",
    isProfitable: true
  }
];

const mockMutualFund = {
  investmentValueURIP: "12.5 URIP",
  investmentValueUSD: "$1,562.50",
  pnl: "+6.8%",
  pnlAmount: "+$99.75",
  isProfitable: true
};

const PortfolioPage: React.FC = () => {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1M");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const totalInvestmentValue = mockPortfolioAssets.reduce((sum, asset) => 
    sum + parseFloat(asset.investmentValueUSD.replace(/[$,]/g, '')), 0
  ) + parseFloat(mockMutualFund.investmentValueUSD.replace(/[$,]/g, ''));

  const totalPnL = mockPortfolioAssets.reduce((sum, asset) => 
    sum + parseFloat(asset.pnlAmount.replace(/[+$,]/g, '')) * (asset.isProfitable ? 1 : -1), 0
  ) + parseFloat(mockMutualFund.pnlAmount.replace(/[+$,]/g, ''));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert("Portfolio data refreshed!");
    }, 2000);
  };

  const handleViewDetails = (assetName: string) => {
    alert(`Viewing details for ${assetName}`);
  };

  const handleViewMutualFund = () => {
    router.push("/trading/mutual-fund");
  };

  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

  return (
    <AuthWrapper requireAuth={true}>
      <PrimaryLayout theme="dark">
        <Header theme="dark" />
        
        <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
              <p className="text-gray-400">Track your investments and performance</p>
            </div>
            <div className="flex gap-2">
              <ActionButton 
                variant="secondary" 
                size="sm" 
                theme="dark"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={isRefreshing ? 'opacity-50' : ''}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </ActionButton>
              <ActionButton 
                variant="secondary" 
                size="sm" 
                theme="dark"
                onClick={() => alert("Portfolio settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </ActionButton>
            </div>
          </div>
        </div>
        
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard theme="dark" variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Value</h3>
              <DollarSign className="w-6 h-6 text-[#F77A0E]" />
            </div>
            <p className="text-3xl font-bold text-white">${totalInvestmentValue.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Total investment value (USD)</p>
          </GlassCard>
          
          <GlassCard theme="dark" variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total P&L</h3>
              {totalPnL >= 0 ? (
                <ArrowUpRight className="w-6 h-6 text-green-400" />
              ) : (
                <ArrowDownRight className="w-6 h-6 text-red-400" />
              )}
            </div>
            <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {((totalPnL / (totalInvestmentValue - totalPnL)) * 100).toFixed(2)}% overall return
            </p>
          </GlassCard>
          
          <GlassCard theme="dark" variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Assets</h3>
              <PieChart className="w-6 h-6 text-[#F77A0E]" />
            </div>
            <p className="text-3xl font-bold text-white">{mockPortfolioAssets.length + 1}</p>
            <p className="text-sm text-gray-400 mt-2">Individual investments</p>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Individual Assets */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Individual Assets</h2>
            
            <div className="space-y-4">
              {mockPortfolioAssets.map((asset) => (
                <GlassCard key={asset.tokenAddress} theme="dark" variant="bordered" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-xl flex items-center justify-center text-2xl">
                        {asset.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{asset.name}</h3>
                        <p className="text-sm text-gray-400">{asset.symbol} • {asset.assetType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{asset.investmentValueUSD}</p>
                      <p className="text-sm text-gray-400">{asset.investmentValueAsset}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400">P&L</p>
                      <p className={`font-semibold ${asset.isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.pnlAmount} ({asset.pnl})
                      </p>
                    </div>
                    <ActionButton 
                      variant="secondary" 
                      size="sm" 
                      theme="dark"
                      onClick={() => handleViewDetails(asset.name)}
                      className="flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="flex items-center">View Details</span>
                    </ActionButton>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Token Address: {asset.tokenAddress}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
          
          {/* Mutual Fund */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Mutual Fund</h2>
            
            <GlassCard theme="dark" variant="elevated" className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">U</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">URIP Fund</h3>
                    <p className="text-sm text-gray-400">Diversified tokenized assets</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Investment Value (URIP)</p>
                    <p className="text-lg font-bold text-white">{mockMutualFund.investmentValueURIP}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Investment Value (USD)</p>
                    <p className="text-lg font-bold text-white">{mockMutualFund.investmentValueUSD}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">P&L</p>
                  <div className="flex items-center space-x-4">
                    <p className={`text-xl font-bold ${mockMutualFund.isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                      {mockMutualFund.pnlAmount}
                    </p>
                    <p className={`font-semibold ${mockMutualFund.isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                      {mockMutualFund.pnl}
                    </p>
                  </div>
                </div>
              </div>
              
              <ActionButton 
                variant="primary" 
                size="md" 
                theme="dark" 
                className="w-full flex items-center justify-center"
                onClick={handleViewMutualFund}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="flex items-center">View Mutual Fund Details</span>
              </ActionButton>
            </GlassCard>
            
            {/* Performance Chart Placeholder */}
            <GlassCard theme="light" variant="default" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-black">Portfolio Performance</h4>
                <div className="flex gap-1">
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 text-xs rounded transition-all duration-200 ${
                        selectedTimeframe === timeframe
                          ? 'bg-[#F77A0E] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-[#F77A0E]/10 to-[#E6690D]/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-[#F77A0E] mx-auto mb-2" />
                  <p className="text-gray-600">Performance chart for {selectedTimeframe} will be displayed here</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      <Footer theme="dark" />
    </PrimaryLayout>
    </AuthWrapper>
  );
};

export default PortfolioPage;
