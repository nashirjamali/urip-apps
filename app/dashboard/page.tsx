"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Wallet,
  Vote,
  ArrowRight,
  Newspaper,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { StockNews } from "@/components/features/StockNews";

// Import partial components
import { DashboardLayout } from "@/components/partials/Dashboard/DashboardLayout";
import { ActionButton } from "@/components/partials/Dashboard/ActionButton";
import { GlassCard } from "@/components/partials/Dashboard/GlassCard";
import { AssetTable } from "@/components/partials/Dashboard/AssetTable";
import { PortfolioOverview } from "@/components/partials/Dashboard/PortfolioOverview";
import { QuickActions } from "@/components/partials/Dashboard/QuickActions";
import { useAssetTokens } from "@/hooks/useAssetTokens";

// Import TradingView widget dynamically to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import("../../components/TradingViewWidget"),
  { ssr: false }
);

// Mock data for demonstration
const mockPortfolioData = {
  totalValue: 26960.98,
  totalChange: 21,
  totalPnL: 5430.45,
  pnlChange: 16.8,
};

// Tokenized Assets - matching HeroSection data with logos
const mockAssets = [
  {
    id: "tmsft",
    name: "Microsoft Corp.",
    symbol: "tMSFT",
    price: 415.23,
    change: 1.2,
    volume: "22.1M",
    marketCap: "3.07T",
    sector: "Technology",
    address: "0x7a346368cb82bca986e16d91fa1846f3e2f2f081",
    logo: "https://logo.clearbit.com/microsoft.com",
  },
  {
    id: "taapl",
    name: "Apple Inc.",
    symbol: "tAAPL",
    price: 230.45,
    change: 0.8,
    volume: "45.2M",
    marketCap: "3.52T",
    sector: "Technology",
    address: "0xdf1a0e84ad813a178cdcf6fdfec1876f78bb471d",
    logo: "https://logo.clearbit.com/apple.com",
  },
  {
    id: "tgoog",
    name: "Alphabet Inc.",
    symbol: "tGOOG",
    price: 175.32,
    change: -0.5,
    volume: "28.3M",
    marketCap: "2.15T",
    sector: "Technology",
    address: "0x067556d409d112376a5c68cde223fdae3a4bd62b",
    logo: "https://logo.clearbit.com/google.com",
  },
  {
    id: "td05",
    name: "DBS Group Holdings Ltd",
    symbol: "tD05",
    price: 35.67,
    change: 1.5,
    volume: "8.4M",
    marketCap: "98.2B",
    sector: "Financial Services",
    address: "0x2ba5a6aa9fd6cf52b30ccb2fddefd505b34f0eb9",
    logo: "https://companieslogo.com/img/orig/D05.SI-edfcd000.png?t=1720244491",
  },
  {
    id: "tbren",
    name: "Barito Renewables Energy",
    symbol: "tBREN",
    price: 0.28,
    change: 2.8,
    volume: "125.6M",
    marketCap: "1.2B",
    sector: "Energy",
    address: "0x751d67bcbfa63acc27e6a6514fbeb27365d3dd38",
    logo: "https://www.barito-pacific.com/fe/assets/icons/favicon_barito1.png",
  },
  {
    id: "tdelta",
    name: "Delta Electronics Thailand PCL",
    symbol: "tDELTA",
    price: 2.45,
    change: -1.2,
    volume: "15.8M",
    marketCap: "650M",
    sector: "Electronics",
    address: "0x616a76c281f2f805499ae46a6c7c3a6a3a62cdc0",
    logo: "https://www.deltathailand.com/imgadmins/news/news_cover/DELTA_news_photo2019-02-27_15-17-12.jpg",
  },
  {
    id: "tmaybank",
    name: "Maybank",
    symbol: "tMAYBANK",
    price: 6.23,
    change: 0.9,
    volume: "42.3M",
    marketCap: "45.8B",
    sector: "Banking",
    address: "0x04d1edf5252c35d3c1f7e6a5f934b6ab12f66220",
    logo: "https://w7.pngwing.com/pngs/280/197/png-transparent-maybank-finance-money-permodalan-nasional-berhad-interior-design-logo-saving-food-text.png",
  },
  {
    id: "txau",
    name: "Gold",
    symbol: "tXAU",
    price: 2654.8,
    change: 0.3,
    volume: "125.7K",
    marketCap: "-",
    sector: "Precious Metals",
    address: "0xf80567a323c99c99086d0d6884d7b03aff5c8903",
    logo: "https://cdn-icons-png.flaticon.com/512/2583/2583963.png",
  },
  {
    id: "txag",
    name: "Silver",
    symbol: "tXAG",
    price: 30.85,
    change: -0.8,
    volume: "89.2K",
    marketCap: "-",
    sector: "Precious Metals",
    address: "0xa2f75a99ea1133f72673ddbbbe01a0080e5c6e52",
    logo: "https://cdn-icons-png.flaticon.com/512/2583/2583967.png",
  },
  {
    id: "tbtc",
    name: "Bitcoin",
    symbol: "tBTC",
    price: 67420.0,
    change: 2.1,
    volume: "1.2B",
    marketCap: "1.33T",
    sector: "Cryptocurrency",
    address: "0x8049cd4055b32e810efad90e998bbe82a58d5ab9",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968260.png",
  },
];

// Market Overview - Mix of crypto and tokenized assets
const marketOverview = [
  {
    symbol: "tBTC",
    name: "Bitcoin",
    price: 67420.0,
    change: 2.1,
    isPositive: true,
  },
  {
    symbol: "tXAU",
    name: "Gold",
    price: 2654.8,
    change: 0.3,
    isPositive: true,
  },
  {
    symbol: "tMSFT",
    name: "Microsoft",
    price: 415.23,
    change: 1.2,
    isPositive: true,
  },
  {
    symbol: "tAAPL",
    name: "Apple",
    price: 230.45,
    change: 0.8,
    isPositive: true,
  },
  {
    symbol: "tXAG",
    name: "Silver",
    price: 30.85,
    change: -0.8,
    isPositive: false,
  },
];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "change">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(false);

  // Use real asset data from hooks
  const {
    assetTokens,
    totalPortfolioValue: assetPortfolioValue,
    userHoldings,
    tokenAllocation,
    isLoading: assetsLoading,
    refetch,
  } = useAssetTokens();

  // Filter and sort assets using real data
  const filteredAssets = assetTokens
    .filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      switch (sortBy) {
        case "name":
          return multiplier * a.name.localeCompare(b.name);
        case "price":
          return (
            multiplier *
            (parseFloat(a.currentPrice) - parseFloat(b.currentPrice))
          );
        case "change":
          return multiplier * (a.lastUpdate - b.lastUpdate);
        default:
          return 0;
      }
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field as "name" | "price" | "change");
      setSortOrder("asc");
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Refetch real data
    refetch().finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout className="min-h-screen bg-black text-white">
        <Navigation />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Portfolio Dashboard
              </h1>
              <p className="text-gray-400">
                Monitor your investments and discover new opportunities
              </p>
            </div>

            <div className="flex gap-3">
              <ActionButton
                variant="ghost"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </ActionButton>

              <ActionButton
                variant="secondary"
                className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </ActionButton>

              <ActionButton className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] hover:from-[#E6690D] hover:to-[#D55C0D] border-[#F77A0E]/20">
                <Link href="/trade" className="flex items-center">
                  Trade Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </ActionButton>
            </div>
          </div>

          {/* Portfolio Overview */}
          <PortfolioOverview
            data={{
              totalValue: assetPortfolioValue || mockPortfolioData.totalValue,
              totalChange: mockPortfolioData.totalChange,
              totalPnL: mockPortfolioData.totalPnL,
              pnlChange: mockPortfolioData.pnlChange,
            }}
          />

          {/* Quick Actions */}
          <GlassCard className="p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-xl font-semibold text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Start Trading",
                    description: "Buy and sell tokenized assets directly",
                    icon: TrendingUp,
                    color: "from-[#F77A0E] to-[#E6690D]",
                    href: "/trade",
                  },
                  {
                    title: "View Portfolio",
                    description: "Track your investment performance",
                    icon: BarChart3,
                    color: "from-green-500 to-green-600",
                    href: "/portfolio",
                  },
                  {
                    title: "Connect Wallet",
                    description: "Link your crypto wallet securely",
                    icon: Wallet,
                    color: "from-purple-500 to-purple-600",
                    href: "#",
                  },
                  {
                    title: "DAO Governance",
                    description: "Participate in fund management decisions",
                    icon: Vote,
                    color: "from-blue-500 to-blue-600",
                    href: "/dao",
                  },
                ].map((action, index) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={index}
                      className="group relative p-4 rounded-lg bg-gradient-to-br from-gray-800/70 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:from-gray-700/80 hover:to-gray-800/70 hover:border-[#F77A0E]/30 transition-all duration-200 hover:scale-[1.02] text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#F77A0E] transition-colors" />
                      </div>

                      <h3 className="font-medium text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {action.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </GlassCard>

          {/* Market Overview */}
          <GlassCard className="p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#F77A0E]" />
                Market Overview
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {marketOverview.map((asset, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:from-gray-700/80 hover:to-gray-800/70 hover:border-[#F77A0E]/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {asset.symbol}
                        </span>
                        <span className="text-xs text-gray-400">
                          {asset.name}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          asset.isPositive
                            ? "text-green-400 bg-green-500/20"
                            : "text-red-400 bg-red-500/20"
                        }
                      >
                        {asset.change > 0 ? "+" : ""}
                        {asset.change}%
                      </Badge>
                    </div>
                    <div className="text-lg font-bold text-white">
                      ${asset.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          {/* Assets Table and TradingView Widget */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Assets Table */}
            <div className="xl:col-span-2">
              <GlassCard className="p-6">
                <CardHeader className="px-0 pb-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-white">
                      Available Assets
                    </CardTitle>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search assets..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70"
                        />
                      </div>

                      <ActionButton variant="ghost" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </ActionButton>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700/50">
                          <th className="text-left py-3 px-4 font-medium text-gray-400">
                            <button
                              onClick={() => handleSort("name")}
                              className="flex items-center gap-1 hover:text-white"
                            >
                              Asset
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-400">
                            <button
                              onClick={() => handleSort("price")}
                              className="flex items-center gap-1 hover:text-white"
                            >
                              Price
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-400">
                            <button
                              onClick={() => handleSort("change")}
                              className="flex items-center gap-1 hover:text-white"
                            >
                              24h Change
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-gray-400">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetsLoading ? (
                          // Loading skeleton
                          Array.from({ length: 5 }).map((_, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-800/50"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-700/50 rounded-full animate-pulse"></div>
                                  <div>
                                    <div className="w-24 h-4 bg-gray-700/50 rounded animate-pulse mb-1"></div>
                                    <div className="w-16 h-3 bg-gray-600/50 rounded animate-pulse"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-4 px-4">
                                <div className="w-20 h-4 bg-gray-700/50 rounded animate-pulse ml-auto"></div>
                              </td>
                              <td className="text-right py-4 px-4">
                                <div className="w-16 h-4 bg-gray-700/50 rounded animate-pulse ml-auto"></div>
                              </td>
                              <td className="text-center py-4 px-4">
                                <div className="w-16 h-8 bg-gray-700/50 rounded animate-pulse mx-auto"></div>
                              </td>
                            </tr>
                          ))
                        ) : filteredAssets.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center py-8 text-gray-400"
                            >
                              No tokenized assets found matching your criteria
                            </td>
                          </tr>
                        ) : (
                          filteredAssets.map((asset) => (
                            <tr
                              key={asset.info?.address || asset.symbol}
                              className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors group"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    <img
                                      src={
                                        mockAssets.find(
                                          (mock) => mock.symbol === asset.symbol
                                        )?.logo || "/placeholder.svg"
                                      }
                                      alt={asset.name}
                                      className="w-6 h-6 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/placeholder.svg";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-white">
                                      {asset.name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {asset.symbol}
                                    </div>
                                    {asset.isActive && (
                                      <Badge className="text-xs bg-green-500/20 text-green-400 border-transparent">
                                        Live
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-4 px-4 font-medium text-white">
                                ${parseFloat(asset.currentPrice).toFixed(2)}
                              </td>
                              <td className="text-right py-4 px-4">
                                <Badge
                                  variant="secondary"
                                  className={
                                    asset.isActive
                                      ? "text-green-400 bg-green-500/20"
                                      : "text-gray-400 bg-gray-500/20"
                                  }
                                >
                                  {asset.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="text-center py-4 px-4">
                                <ActionButton
                                  size="sm"
                                  className={`${
                                    asset.isActive
                                      ? "bg-gradient-to-r from-[#F77A0E] to-[#E6690D] hover:from-[#E6690D] hover:to-[#D55C0D]"
                                      : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                                  }`}
                                  disabled={!asset.isActive}
                                >
                                  {asset.isActive ? "Trade" : "Unavailable"}
                                </ActionButton>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </GlassCard>
            </div>

            {/* TradingView Widget */}
            <div className="xl:col-span-1">
              <GlassCard className="p-6 h-fit">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#F77A0E]" />
                    Market Chart
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="h-80 rounded-lg overflow-hidden bg-gray-800/50 border border-gray-700/50">
                    <TradingViewWidget />
                  </div>
                </CardContent>
              </GlassCard>
            </div>
          </div>

          {/* Financial News */}
          <GlassCard className="p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-[#F77A0E]" />
                Financial News
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0">
              <div className="h-64 overflow-hidden bg-gray-800/30 rounded-lg border border-gray-700/50">
                <StockNews
                  symbol="MARKET"
                  companyName="Financial Markets"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </GlassCard>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 - Portfolio Analytics */}
            <GlassCard className="p-6">
              <CardHeader className="px-0 pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-white">
                  Portfolio Analytics
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <p className="text-gray-400 mb-4">
                  Advanced analytics and insights for your investment portfolio
                </p>
                <ActionButton variant="secondary" size="sm" className="w-full">
                  <Link
                    href="/portfolio"
                    className="flex items-center justify-center w-full"
                  >
                    View Analytics
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </ActionButton>
              </CardContent>
            </GlassCard>

            {/* Feature Card 2 - DAO-Managed Investment */}
            <GlassCard className="p-6">
              <CardHeader className="px-0 pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center mb-4">
                  <Vote className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-white">
                  DAO-Managed Investment
                </CardTitle>
                <Badge className="bg-[#F77A0E]/20 text-[#F77A0E] text-xs px-2 py-1 mt-2">
                  Community Governed
                </Badge>
              </CardHeader>

              <CardContent className="px-0">
                <p className="text-gray-400 mb-4">
                  Invest in diversified portfolios through $URIP tokens managed
                  by decentralized community governance with professional
                  oversight
                </p>
                <ActionButton variant="secondary" size="sm" className="w-full">
                  <Link
                    href="/dao"
                    className="flex items-center justify-center w-full"
                  >
                    Join DAO Fund
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </ActionButton>
              </CardContent>
            </GlassCard>

            {/* Feature Card 3 - Direct Asset Trading */}
            <GlassCard className="p-6">
              <CardHeader className="px-0 pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-white">
                  Direct Asset Trading
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <p className="text-gray-400 mb-4">
                  Trade individual tokenized assets directly with full ownership
                  transparency
                </p>
                <ActionButton variant="secondary" size="sm" className="w-full">
                  <Link
                    href="/trade"
                    className="flex items-center justify-center w-full"
                  >
                    Start Trading
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </ActionButton>
              </CardContent>
            </GlassCard>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Portfolio Allocation */}
            <GlassCard className="p-6">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#F77A0E]" />
                  Portfolio Allocation
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                {assetsLoading ? (
                  // Loading skeleton for portfolio allocation
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gray-700/50 rounded-full animate-pulse"></div>
                          <div className="w-24 h-4 bg-gray-700/50 rounded animate-pulse"></div>
                        </div>
                        <div className="text-right">
                          <div className="w-12 h-4 bg-gray-700/50 rounded animate-pulse mb-1"></div>
                          <div className="w-20 h-3 bg-gray-600/50 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : tokenAllocation && tokenAllocation.length > 0 ? (
                  <div className="space-y-4">
                    {tokenAllocation.map((allocation, index) => {
                      // Get sector color based on asset type
                      const getSectorColor = (assetType: string) => {
                        switch (assetType?.toUpperCase()) {
                          case "STOCK":
                          case "STOCK_SP500":
                          case "STOCK_SGX":
                          case "STOCK_IDX":
                            return "bg-[#F77A0E]";
                          case "COMMODITY":
                          case "PRECIOUS_METALS":
                            return "bg-yellow-500";
                          case "CRYPTOCURRENCY":
                            return "bg-purple-500";
                          default:
                            return "bg-blue-500";
                        }
                      };

                      const getSectorName = (assetType: string) => {
                        switch (assetType?.toUpperCase()) {
                          case "STOCK":
                          case "STOCK_SP500":
                            return "US Stocks";
                          case "STOCK_SGX":
                            return "Singapore Stocks";
                          case "STOCK_IDX":
                            return "Indonesia Stocks";
                          case "COMMODITY":
                          case "PRECIOUS_METALS":
                            return "Precious Metals";
                          case "CRYPTOCURRENCY":
                            return "Cryptocurrency";
                          default:
                            return allocation.name || assetType;
                        }
                      };

                      return (
                        <div
                          key={allocation.name + index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${getSectorColor(
                                allocation.type
                              )}`}
                            ></div>
                            <span className="text-gray-300 font-medium">
                              {getSectorName(allocation.type)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white">
                              {allocation.percentage.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-400">
                              ${allocation.value.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Show total portfolio value */}
                    <div className="pt-4 border-t border-gray-700/50">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-gray-300">Total Portfolio</span>
                        <span className="text-white">
                          ${assetPortfolioValue?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : userHoldings && userHoldings.length > 0 ? (
                  // Fallback to user holdings if tokenAllocation is empty
                  <div className="space-y-4">
                    {userHoldings.slice(0, 6).map((holding, index) => (
                      <div
                        key={holding.name + index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#F77A0E]"></div>
                          <span className="text-gray-300 font-medium">
                            {holding.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            ${holding.balance.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty state
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      No portfolio data available
                    </div>
                    <div className="text-sm text-gray-500">
                      Start trading to see your allocation
                    </div>
                  </div>
                )}
              </CardContent>
            </GlassCard>

            {/* Recent Transactions */}
            <GlassCard className="p-6">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#F77A0E]" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <div className="space-y-4">
                  {[
                    {
                      type: "BUY",
                      asset: "tBTC",
                      amount: 0.5,
                      price: 67420.0,
                      time: "3 days ago",
                    },
                  ].map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={
                            transaction.type === "BUY"
                              ? "text-green-400 bg-green-500/20"
                              : "text-red-400 bg-red-500/20"
                          }
                        >
                          {transaction.type}
                        </Badge>
                        <div>
                          <div className="font-medium text-white">
                            {transaction.asset} × {transaction.amount}
                          </div>
                          <div className="text-sm text-gray-400">
                            ${transaction.price}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          $
                          {(
                            transaction.amount * transaction.price
                          ).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {transaction.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <ActionButton variant="ghost" size="sm" className="w-full mt-4">
                  <Link href="/portfolio?tab=transactions" className="w-full">
                    View All Transactions
                  </Link>
                </ActionButton>
              </CardContent>
            </GlassCard>
          </div>

          {/* Footer Call-to-Action */}
          <GlassCard className="p-8 text-center" gradient>
            <CardContent className="px-0">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to Start Trading?
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Explore tokenized assets, join DAO-managed funds, or participate
                in governance decisions to maximize your investment potential.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ActionButton
                  size="lg"
                  className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] hover:from-[#E6690D] hover:to-[#D55C0D]"
                >
                  <Link href="/trade" className="flex items-center">
                    Start Trading
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </ActionButton>

                <ActionButton variant="secondary" size="lg">
                  <Link href="/dao" className="flex items-center">
                    Join DAO
                    <Vote className="h-5 w-5 ml-2" />
                  </Link>
                </ActionButton>
              </div>
            </CardContent>
          </GlassCard>
        </main>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
