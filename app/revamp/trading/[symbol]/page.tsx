"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PrimaryLayout } from "@/components/revamp/layout/PrimaryLayout";
import { Header } from "@/components/revamp/layout/Header";
import { Footer } from "@/components/revamp/layout/Footer";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, DollarSign, Users, Building2, Calendar, Globe, MapPin, Activity } from "lucide-react";

// Mock data yang sama dengan trading page
const mockTradingAssets = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: "$1.906.551.118",
    priceNumber: 1906551118,
    change24h: -0.80,
    change7d: 1.00,
    change1m: -0.41,
    change1y: 110.43,
    marketCap: "$37.964 Trilliun",
    marketCapNumber: 37964000000000,
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    color: "bg-orange-500",
    category: "Cryptocurrency",
    type: "CRYPTO",
    description: "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.",
    volume24h: "$25.123 Trilliun",
    high24h: "$1.950.000.000",
    low24h: "$1.880.000.000"
  },
  {
    id: 3,
    name: "Apple Inc.",
    symbol: "AAPL",
    price: "$3.456.789",
    priceNumber: 3456789,
    change24h: 2.45,
    change7d: -1.23,
    change1m: 15.67,
    change1y: 234.56,
    marketCap: "$52.123 Trilliun",
    marketCapNumber: 52123000000000,
    icon: "https://logo.clearbit.com/apple.com",
    color: "bg-gray-800",
    category: "Technology Stock",
    type: "STOCK",
    description: "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
    volume24h: "$1.234 Trilliun",
    high24h: "$3.500.000",
    low24h: "$3.400.000",
    sector: "Technology",
    industry: "Consumer Electronics",
    country: "United States",
    exchange: "NASDAQ",
    website: "https://www.apple.com",
    employees: "164,000",
    founded: "1976",
    ceo: "Tim Cook"
  },
  {
    id: 4,
    name: "Microsoft Corp",
    symbol: "MSFT",
    price: "$6.789.012",
    priceNumber: 6789012,
    change24h: 1.25,
    change7d: 3.45,
    change1m: 8.90,
    change1y: 189.34,
    marketCap: "$45.678 Trilliun",
    marketCapNumber: 45678000000000,
    icon: "https://logo.clearbit.com/microsoft.com",
    color: "bg-blue-600",
    category: "Technology Stock",
    type: "STOCK",
    description: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.",
    volume24h: "$987 Miliar",
    high24h: "$6.850.000",
    low24h: "$6.720.000",
    sector: "Technology",
    industry: "Software",
    country: "United States",
    exchange: "NASDAQ",
    website: "https://www.microsoft.com",
    employees: "221,000",
    founded: "1975",
    ceo: "Satya Nadella"
  },
  {
    id: 5,
    name: "Tesla Inc.",
    symbol: "TSLA",
    price: "$4.123.456",
    priceNumber: 4123456,
    change24h: -2.15,
    change7d: 8.76,
    change1m: -5.43,
    change1y: 67.23,
    marketCap: "$23.456 Trilliun",
    marketCapNumber: 23456000000000,
    icon: "https://logo.clearbit.com/tesla.com",
    color: "bg-red-600",
    category: "Automotive Stock",
    type: "STOCK",
    description: "Tesla, Inc. is an American electric vehicle and clean energy company based in Austin, Texas.",
    volume24h: "$2.456 Trilliun",
    high24h: "$4.200.000",
    low24h: "$4.050.000"
  }
];

const PriceChange: React.FC<{ value: number; showIcon?: boolean }> = ({ value, showIcon = true }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <div className={`flex items-center ${
      isNeutral ? 'text-gray-500' : isPositive ? 'text-green-400' : 'text-red-400'
    }`}>
      {showIcon && !isNeutral && (
        isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />
      )}
      <span className="font-medium text-lg">
        {isPositive ? '+' : ''}{value.toFixed(2)}%
      </span>
    </div>
  );
};

const AssetDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1D");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const symbol = params.symbol as string;
    // Find asset by symbol (handle both with and without 't' prefix)
    const foundAsset = mockTradingAssets.find(a => 
      a.symbol === symbol || 
      a.symbol === `t${symbol}` ||
      a.symbol.replace('t', '') === symbol
    );
    
    setAsset(foundAsset || null);
    setIsLoading(false);
  }, [params.symbol]);

  // TradingView Widget Effect
  useEffect(() => {
    if (asset && !chartReady) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: asset.type === 'CRYPTO' ? `BINANCE:${asset.symbol}USDT` : `NASDAQ:${asset.symbol.replace('t', '')}`,
        interval: timeframe === '1D' ? 'D' : timeframe === '1W' ? 'W' : timeframe === '1M' ? 'M' : 'D',
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1a1a1a",
        enable_publishing: false,
        backgroundColor: "rgba(0, 0, 0, 0)",
        gridColor: "rgba(255, 255, 255, 0.06)",
        hide_top_toolbar: false,
        hide_legend: true,
        save_image: false,
        container_id: "tradingview_chart",
        studies: [
          "Volume@tv-basicstudies"
        ],
        overrides: {
          "paneProperties.background": "rgba(0, 0, 0, 0)",
          "paneProperties.backgroundType": "solid",
          "paneProperties.backgroundGradientStartColor": "rgba(0, 0, 0, 0)",
          "paneProperties.backgroundGradientEndColor": "rgba(0, 0, 0, 0)",
          "mainSeriesProperties.candleStyle.upColor": "#00ff88",
          "mainSeriesProperties.candleStyle.downColor": "#ff4757",
          "mainSeriesProperties.candleStyle.borderUpColor": "#00ff88",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ff4757",
          "mainSeriesProperties.candleStyle.wickUpColor": "#00ff88",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ff4757",
          "volumePaneSize": "medium"
        }
      });
      
      const container = document.getElementById('tradingview_chart');
      if (container) {
        container.innerHTML = '';
        container.appendChild(script);
        setChartReady(true);
      }
    }
  }, [asset, timeframe, chartReady]);

  if (isLoading) {
    return (
      <PrimaryLayout theme="dark">
        <Header theme="dark" />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-white">Loading...</div>
        </div>
        <Footer theme="dark" />
      </PrimaryLayout>
    );
  }

  if (!asset) {
    return (
      <PrimaryLayout theme="dark">
        <Header theme="dark" />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Asset Not Found</h1>
            <ActionButton 
              variant="secondary" 
              size="md" 
              theme="dark"
              onClick={() => router.push('/revamp/trading')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trading
            </ActionButton>
          </div>
        </div>
        <Footer theme="dark" />
      </PrimaryLayout>
    );
  }

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    setChartReady(false); // Trigger chart re-render
  };

  const timeframes = ["1D", "1W", "1M", "3M", "1Y"];

  return (
    <AuthWrapper requireAuth={true}>
      <PrimaryLayout theme="dark">
        <Header theme="dark" />
        
        <div className="container mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Back to Markets Button */}
          <ActionButton 
            variant="ghost" 
            size="sm" 
            theme="dark"
            onClick={() => router.push('/revamp/trading')}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Markets
          </ActionButton>
          
          {/* Asset Info Container */}
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm">
            {/* Left Side - Asset Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-400 to-green-600">
                <img 
                  src={asset.icon} 
                  alt={asset.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.textContent = asset.symbol.charAt(0);
                  }}
                />
                <span className="hidden text-white font-bold text-2xl"></span>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-gray-300 font-medium">{asset.symbol}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    asset.type === 'CRYPTO' ? 'bg-orange-500/20 text-orange-400' :
                    asset.type === 'STOCK' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {asset.type === 'STOCK' ? 'STOCK_SP500' : asset.type}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    Active
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    Live Data
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Price Info */}
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{asset.price}</div>
              <div className="flex items-center justify-end space-x-2 mt-1">
                <span className="text-gray-400 text-sm">Market Cap: {asset.marketCap}</span>
              </div>
              <div className="text-gray-400 text-sm mt-1">Updated from smart contract</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Price Chart */}
            <GlassCard theme="dark" variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Price Chart - {asset.symbol}
                </h2>
                <div className="flex gap-1">
                  {timeframes.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => handleTimeframeChange(tf)}
                      className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                        timeframe === tf
                          ? 'bg-[#F77A0E] text-white'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* TradingView Chart */}
              <div className="h-96 rounded-lg border border-white/10 overflow-hidden">
                <div id="tradingview_chart" className="w-full h-full bg-gray-900/50"></div>
              </div>
            </GlassCard>

            {/* Market Information */}
            <GlassCard theme="dark" variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Market Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-gray-400 text-sm">Open</div>
                  <div className="text-white font-medium">{asset.price}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Day High</div>
                  <div className="text-green-400 font-medium">{asset.high24h}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Day Low</div>
                  <div className="text-red-400 font-medium">{asset.low24h}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Market Cap</div>
                  <div className="text-white font-medium">{asset.marketCap}</div>
                </div>
              </div>
            </GlassCard>

            {/* Stock Details */}
            <GlassCard theme="dark" variant="default" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Stock Details</h3>
                <span className="text-[#F77A0E] text-sm">Company Info</span>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Price</span>
                    <span className="text-white font-medium">{asset.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Change</span>
                    <PriceChange value={asset.change24h} showIcon={false} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Day High</span>
                    <span className="text-green-400 font-medium">{asset.high24h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Day Low</span>
                    <span className="text-red-400 font-medium">{asset.low24h}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Previous Close</span>
                    <span className="text-white font-medium">{asset.low24h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">52 Week High</span>
                    <span className="text-green-400 font-medium">{asset.high24h}</span>
                  </div>
                </div>

                {/* Company Profile Section */}
                {asset.sector && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-md font-semibold text-white mb-4 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Company Profile
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><Building2 className="w-3 h-3 mr-1" />Company Name</span>
                        <span className="text-white font-medium">{asset.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><Activity className="w-3 h-3 mr-1" />Industry</span>
                        <span className="text-white font-medium">{asset.industry || asset.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><Globe className="w-3 h-3 mr-1" />Exchange</span>
                        <span className="text-white font-medium">{asset.exchange || 'NASDAQ'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><MapPin className="w-3 h-3 mr-1" />Country</span>
                        <span className="text-white font-medium">{asset.country || 'United States'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><Users className="w-3 h-3 mr-1" />Market Cap</span>
                        <span className="text-white font-medium">{asset.marketCap}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><Calendar className="w-3 h-3 mr-1" />Last Updated</span>
                        <span className="text-white font-medium">8/2/2025</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Trade Panel */}
            <GlassCard theme="dark" variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trade {asset.symbol}</h3>
              
              {/* Buy/Sell Tabs */}
              <div className="flex mb-4 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setTradeType("buy")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    tradeType === "buy"
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  Buy
                </button>
                <button
                  onClick={() => setTradeType("sell")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    tradeType === "sell"
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Sell
                </button>
              </div>
              
              {/* Balance Info */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">USDT Balance:</span>
                  <span className="text-white font-medium">$100,000,000,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Allowance:</span>
                  <span className="text-green-400 font-medium">$0</span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Amount (USDT)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    placeholder="0.00"
                    defaultValue="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E]"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Quantity ({asset.symbol})</label>
                <input
                  type="number"
                  placeholder="0.00"
                  defaultValue="0.00"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E]"
                />
              </div>

              {/* Action Button */}
              <ActionButton 
                variant="ghost" 
                size="lg" 
                theme="dark" 
                className={`w-full text-white flex items-center justify-center ${
                  tradeType === "buy" 
                    ? 'bg-green-600 hover:bg-green-700 border-green-600 focus:ring-green-500' 
                    : 'bg-red-600 hover:bg-red-700 border-red-600 focus:ring-red-500'
                } !bg-opacity-100 !important`}
              >
                {tradeType === "buy" ? (
                  <TrendingUp className="w-5 h-5 mr-2" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-2" />
                )}
                {tradeType === "buy" ? `Buy ${asset.symbol}` : `Sell ${asset.symbol}`}
              </ActionButton>
            </GlassCard>

            {/* Your Holdings */}
            <GlassCard theme="dark" variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Holdings</h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">No Holdings yet</p>
                <p className="text-gray-500 text-xs mt-1">Start trading to build your portfolio</p>
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

export default AssetDetailPage;
