"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Bell, Moon, Sun, ChevronDown, Download, Upload, DollarSign, Filter, ChevronLeft, ChevronRight, BarChart3, LineChart, TrendingUp, AreaChart, Vote, Briefcase, RefreshCw, Newspaper } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { URIPFund } from '@/components/features/URIPFund'
import { ContractTestPanel } from '@/components/features/ContractTestPanel'
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useURIPContract } from '@/hooks/useURIPContract';
import { useAssetTokens, AssetTokenData } from '@/hooks/useAssetTokens';
import { StockNews } from '@/components/features/StockNews';

// Import TradingView widget dynamically to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('../../components/TradingViewWidget'),
  { ssr: false }
)

// Placeholder data for the dashboard
const dashboardData = {
  cryptoPrices: [
    { symbol: "DOGE", price: 0.178, change: -4.2, isPositive: false },
    { symbol: "BNB", price: 1985.0, change: 1.0, isPositive: true },
    { symbol: "BTC", price: 2974.0, change: 0.6, isPositive: true },
    { symbol: "USDT", price: 0.972, change: -0.9, isPositive: false },
    { symbol: "USDC", price: 0.294, change: -0.1, isPositive: false },
  ],
  currentBalance: 26960.98,
  balanceChangePercent: 21,
  totalPnL: 5430.45,
  pnlChangePercent: 16.8,
  portfolioValue: 22350,
  stocksAllocation: [
    { sector: "Technology", percentage: 45, value: 12132.44 },
    { sector: "Consumer Cyclical", percentage: 20, value: 5392.20 },
    { sector: "Healthcare", percentage: 15, value: 4044.15 },
    { sector: "Financial Services", percentage: 10, value: 2696.10 },
    { sector: "Automotive", percentage: 7, value: 1887.27 },
    { sector: "Others", percentage: 3, value: 808.83 },
  ],
  stocksData: [
    {
      id: "aapl",
      name: "Apple Inc.",
      symbol: "NASDAQ:AAPL",
      price: 187.65,
      change: 1.2,
      marketCap: "2.94T",
      country: "USA",
      sector: "Technology",
      recommended: true
    },
    {
      id: "msft",
      name: "Microsoft Corp.",
      symbol: "NASDAQ:MSFT",
      price: 412.89,
      change: 0.8,
      marketCap: "3.07T",
      country: "USA",
      sector: "Technology",
      recommended: true
    },
    {
      id: "googl",
      name: "Alphabet Inc.",
      symbol: "NASDAQ:GOOGL",
      price: 142.56,
      change: -0.5,
      marketCap: "1.79T",
      country: "USA",
      sector: "Technology",
      recommended: false
    },
    {
      id: "amzn",
      name: "Amazon.com Inc.",
      symbol: "NASDAQ:AMZN",
      price: 175.20,
      change: 2.1,
      marketCap: "1.82T",
      country: "USA",
      sector: "Consumer Cyclical",
      recommended: true
    },
    {
      id: "tsla",
      name: "Tesla Inc.",
      symbol: "NASDAQ:TSLA",
      price: 192.45,
      change: -1.3,
      marketCap: "612.8B",
      country: "USA",
      sector: "Automotive",
      recommended: false
    },
    {
      id: "nvda",
      name: "NVIDIA Corp.",
      symbol: "NASDAQ:NVDA",
      price: 824.18,
      change: 3.2,
      marketCap: "2.03T",
      country: "USA",
      sector: "Technology",
      recommended: true
    },
    {
      id: "meta",
      name: "Meta Platforms Inc.",
      symbol: "NASDAQ:META",
      price: 474.32,
      change: 1.5,
      marketCap: "1.21T",
      country: "USA",
      sector: "Technology",
      recommended: false
    },
    {
      id: "baba",
      name: "Alibaba Group Holding",
      symbol: "NYSE:BABA",
      price: 78.43,
      change: -2.1,
      marketCap: "198.7B",
      country: "China",
      sector: "Consumer Cyclical",
      recommended: false
    },
    {
      id: "tcehy",
      name: "Tencent Holdings",
      symbol: "OTC:TCEHY",
      price: 42.18,
      change: -0.8,
      marketCap: "403.2B",
      country: "China",
      sector: "Technology",
      recommended: false
    },
    {
      id: "sne",
      name: "Sony Group Corp.",
      symbol: "NYSE:SONY",
      price: 85.76,
      change: 0.4,
      marketCap: "105.8B",
      country: "Japan",
      sector: "Technology",
      recommended: true
    },
    {
      id: "tm",
      name: "Toyota Motor Corp.",
      symbol: "NYSE:TM",
      price: 178.92,
      change: -0.3,
      marketCap: "242.1B",
      country: "Japan",
      sector: "Automotive",
      recommended: false
    },
    {
      id: "sap",
      name: "SAP SE",
      symbol: "NYSE:SAP",
      price: 187.45,
      change: 1.1,
      marketCap: "230.5B",
      country: "Germany",
      sector: "Technology",
      recommended: true
    },
  ],
  portfolioItems: [
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTCUSD",
      logo: "/placeholder-logo.svg",
      logoColor: "bg-amber-500",
      trend: "up",
      totalShare: "0.0045",
      totalReturn: "5,600",
      price: 68000,
      change: 2.3,
      percentage: 45
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETHUSD",
      logo: "/placeholder-logo.svg",
      logoColor: "bg-indigo-500",
      trend: "up",
      totalShare: "0.023",
      totalReturn: "3,200",
      price: 3200,
      change: 1.5,
      percentage: 25
    },
    {
      id: 3,
      name: "Solana",
      symbol: "SOLUSD",
      logo: "/placeholder-logo.svg",
      logoColor: "bg-purple-500",
      trend: "down",
      totalShare: "1.23",
      totalReturn: "1,800",
      price: 120,
      change: -0.8,
      percentage: 15
    },
    {
      id: 4,
      name: "Cardano",
      symbol: "ADAUSD",
      logo: "/placeholder-logo.svg",
      logoColor: "bg-blue-500",
      trend: "up",
      totalShare: "45.6",
      totalReturn: "980",
      price: 0.45,
      change: 3.2,
      percentage: 8
    },
    {
      id: 5,
      name: "Polkadot",
      symbol: "DOTUSD",
      logo: "/placeholder-logo.svg",
      logoColor: "bg-pink-500",
      trend: "down",
      totalShare: "12.5",
      totalReturn: "750",
      price: 6.8,
      change: -1.2,
      percentage: 5
    },
    {
      id: 6,
      name: "Avalanche",
      symbol: "AVAXUSD",
      logo: "/placeholder-logo.svg",
      logoColor: "bg-red-500",
      trend: "up",
      totalShare: "3.4",
      totalReturn: "620",
      price: 35.2,
      change: 0.9,
      percentage: 2
    }
  ],
  favoriteTokens: [
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      price: 45678.32,
      change: 2.4,
      isPositive: true,
      chartData: [30, 40, 35, 50, 49, 60, 70, 91, 80, 85]
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      price: 3245.18,
      change: 1.2,
      isPositive: true,
      chartData: [40, 30, 45, 35, 55, 40, 65, 45, 60, 70]
    },
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL",
      price: 98.76,
      change: -0.8,
      isPositive: false,
      chartData: [60, 50, 40, 45, 35, 30, 35, 40, 30, 25]
    },
    {
      id: "ada",
      name: "Cardano",
      symbol: "ADA",
      price: 1.24,
      change: 3.2,
      isPositive: true,
      chartData: [20, 30, 40, 50, 45, 60, 70, 65, 75, 80]
    },
  ],
  marketLeaders: [
    { name: "Bitcoin", value: 10920857.0, change24h: 1249.0, progress: 80 },
    { name: "Ethereum", value: 10920857.0, change24h: 1249.0, progress: 70 },
    { name: "Binance", value: 10920857.0, change24h: 1249.0, progress: 60 },
  ],
}

function DashboardContent() {
  const [isDark, setIsDark] = useState(true) // Set to true by default for dark theme
  const [scrollPosition, setScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [windowWidth, setWindowWidth] = useState(0)
  const [selectedPortfolio, setSelectedPortfolio] = useState(dashboardData.portfolioItems[0])
  const [isChangingPortfolio, setIsChangingPortfolio] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "price" | "change" | "country" | "sector">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [filterSector, setFilterSector] = useState<string | null>(null)
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false)
  const { address } = useAccount();
  const router = useRouter();

  // URIP contract data
  const {
    uripBalance,
    currentNAV,
    usdtBalance,
    fundStats,
    isLoading: uripLoading
  } = useURIPContract();

  // Asset tokens data
  const {
    assetTokens,
    totalPortfolioValue: assetPortfolioValue,
    userHoldings,
    isLoading: assetsLoading,
    refetch
  } = useAssetTokens();
  // Get unique countries and sectors for filters
  const countries = Array.from(new Set(dashboardData.stocksData.map(stock => stock.country)));
  const sectors = Array.from(new Set(dashboardData.stocksData.map(stock => stock.sector)));

  // Filter and sort stocks
  const filteredStocks = dashboardData.stocksData
    .filter(stock => {
      // Apply search filter
      if (searchTerm && !stock.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Apply country filter
      if (filterCountry && stock.country !== filterCountry) {
        return false;
      }

      // Apply sector filter
      if (filterSector && stock.sector !== filterSector) {
        return false;
      }

      // Apply recommended filter
      if (showRecommendedOnly && !stock.recommended) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "change":
          comparison = a.change - b.change;
          break;
        case "country":
          comparison = a.country.localeCompare(b.country);
          break;
        case "sector":
          comparison = a.sector.localeCompare(b.sector);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Handle sort change
  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort column and default to ascending
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  // Handle portfolio change with animation
  const handlePortfolioChange = (item: typeof selectedPortfolio) => {
    if (item.id === selectedPortfolio.id) return;

    setIsChangingPortfolio(true);
    setTimeout(() => {
      setSelectedPortfolio(item);
      setIsChangingPortfolio(false);
    }, 300);

    // Automatically scroll to the selected card if needed
    if (scrollPosition > dashboardData.portfolioItems.indexOf(item) ||
      scrollPosition + itemsPerView <= dashboardData.portfolioItems.indexOf(item)) {
      const newPosition = Math.max(0, Math.min(
        dashboardData.portfolioItems.indexOf(item),
        totalItems - itemsPerView
      ));
      setScrollPosition(newPosition);
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(-${newPosition * cardWidth}%)`;
      }
    }
  };

  // Responsive items per view based on screen size
  const getItemsPerView = () => {
    if (windowWidth < 640) return 1 // Mobile
    if (windowWidth < 768) return 2 // Small tablet
    if (windowWidth < 1024) return 3 // Tablet
    return 4 // Desktop
  }

  // Initialize window width on mount
  useEffect(() => {
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const itemsPerView = getItemsPerView()
  const totalItems = dashboardData.portfolioItems.length
  const showNavigation = totalItems > itemsPerView
  const cardWidth = 100 / itemsPerView // percentage width of each card
  const [autoScroll, setAutoScroll] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const scrollNext = () => {
    if (carouselRef.current) {
      const maxScroll = totalItems - itemsPerView
      const nextPosition = scrollPosition >= maxScroll ? 0 : scrollPosition + 1
      setScrollPosition(nextPosition)
      carouselRef.current.style.transform = `translateX(-${nextPosition * cardWidth}%)`
    }
  }

  const scrollPrev = () => {
    if (carouselRef.current) {
      const maxScroll = totalItems - itemsPerView
      const prevPosition = scrollPosition <= 0 ? maxScroll : scrollPosition - 1
      setScrollPosition(prevPosition)
      carouselRef.current.style.transform = `translateX(-${prevPosition * cardWidth}%)`
    }
  }

  // Auto scroll effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoScroll && showNavigation) {
      interval = setInterval(() => {
        scrollNext();
      }, 3000); // Scroll every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoScroll, scrollPosition, showNavigation]);

  // Pause auto scroll on hover
  const handleMouseEnter = () => setAutoScroll(false);
  const handleMouseLeave = () => setAutoScroll(true);

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setAutoScroll(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      scrollNext()
    } else if (isRightSwipe) {
      scrollPrev()
    }

    setAutoScroll(true)
  }

  // Calculate total portfolio value
  const totalPortfolioValue = dashboardData.portfolioItems.reduce(
    (sum, item) => sum + parseFloat(item.totalReturn.replace(/,/g, '')),
    0
  );

  // Generate portfolio allocation data from smart contract holdings using useMemo
  const portfolioAllocation = useMemo(() => {
    if (userHoldings.length === 0) {
      return [];
    }

    const totalValue = userHoldings.reduce((sum, asset) => {
      return sum + (parseFloat(asset.balance) * parseFloat(asset.currentPrice));
    }, 0);

    return userHoldings.map((asset, index) => {
      const assetValue = parseFloat(asset.balance) * parseFloat(asset.currentPrice);
      const percentage = totalValue > 0 ? (assetValue / totalValue) * 100 : 0;

      return {
        name: asset.name,
        percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
        value: assetValue,
        logoColor: asset.assetType === 'STOCK' ? 'bg-blue-500' : 'bg-amber-500',
        colorIndex: index // Add index for color assignment
      };
    }).sort((a, b) => b.value - a.value); // Sort by value descending
  }, [userHoldings]);

  // Color mapping function with more distinct colors
  const colorClasses: Record<string, string> = {
    "bg-amber-500": "#f59e0b",
    "bg-indigo-500": "#4f46e5",
    "bg-purple-500": "#8b5cf6",
    "bg-blue-500": "#3b82f6",
    "bg-pink-500": "#ec4899",
    "bg-red-500": "#ef4444",
    "bg-green-500": "#10b981",
    "bg-emerald-500": "#10b981",
    "bg-cyan-500": "#06b6d4",
    "bg-teal-500": "#14b8a6",
    "bg-lime-500": "#84cc16",
    "bg-orange-500": "#f97316",
    "bg-rose-500": "#f43f5e",
    "bg-violet-500": "#8b5cf6",
    "bg-sky-500": "#0ea5e9",
    "bg-slate-500": "#64748b"
  };

  // Array of distinct colors for portfolio allocation
  const portfolioColors = [
    "#3b82f6", // Blue
    "#f59e0b", // Amber
    "#10b981", // Green
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
    "#f43f5e", // Rose
    "#0ea5e9", // Sky
    "#14b8a6", // Teal
    "#64748b", // Slate
    "#7c3aed", // Violet
    "#059669", // Emerald
    "#dc2626"  // Red-600
  ];

  const getColor = (logoColor: string): string => {
    return colorClasses[logoColor as keyof typeof colorClasses] || "#4f46e5";
  };

  const getPortfolioColor = (index: number): string => {
    return portfolioColors[index % portfolioColors.length];
  };

  // Remove the unused useEffect that was causing errors
  // useEffect(() => {
  //   if (selectedPortfolio && selectedPortfolio.allocation) {
  //     setStocksAllocation(selectedPortfolio.allocation);
  //   }
  // }, [selectedPortfolio]);

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""} bg-gradient-to-br from-dark-bg-primary to-dark-bg-secondary text-dark-text-primary`}>
      {/* Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-8">
        {/* Dashboard Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-text-primary">Financial Dashboard</h1>
        </div>

        {/* My Portfolio from Smart Contract */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-text-primary flex items-center gap-2">
              <LineChart className="h-5 w-5 text-dark-accent-blue" />
              My Portfolio
            </h2>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-700/20 text-green-400 border-transparent">
                {userHoldings.length} Assets
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={assetsLoading}
                className="border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:border-dark-accent-blue"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${assetsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {assetsLoading ? (
            // Shimmering loading for portfolio
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border border-dark-border/50 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 bg-dark-input/50 rounded-full animate-pulse"></div>
                        <div className="w-16 h-4 bg-dark-input/50 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-24 h-4 bg-dark-input/50 rounded animate-pulse"></div>
                        <div className="w-32 h-6 bg-dark-input/50 rounded animate-pulse"></div>
                        <div className="w-20 h-4 bg-dark-input/30 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userHoldings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userHoldings.map((asset) => (
                <Card key={asset.info.address} className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border border-dark-border/50 overflow-hidden hover:border-dark-accent-blue/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${asset.assetType === 'STOCK' ? 'bg-blue-500' : 'bg-amber-500'
                          }`}>
                          {asset.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-dark-text-primary">{asset.name}</div>
                          <div className="text-xs text-dark-text-secondary">{asset.symbol}</div>
                        </div>
                      </div>
                      <Badge className={`${asset.isActive ? 'bg-green-700/20 text-green-400' : 'bg-red-700/20 text-red-400'
                        } border-transparent text-xs`}>
                        {asset.isActive ? 'Live' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-dark-text-secondary">Balance</span>
                        <span className="font-medium text-dark-text-primary">
                          {parseFloat(asset.balance).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-dark-text-secondary">Price</span>
                        <span className="font-medium text-dark-text-primary">
                          ${parseFloat(asset.currentPrice).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-dark-text-secondary">Value</span>
                        <span className="font-semibold text-dark-text-primary">
                          ${(parseFloat(asset.balance) * parseFloat(asset.currentPrice)).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-dark-text-secondary">Type</span>
                        <Badge className={`${asset.assetType === 'STOCK' ? 'bg-blue-700/20 text-blue-400' : 'bg-amber-700/20 text-amber-400'
                          } border-transparent text-xs`}>
                          {asset.assetType}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-dark-border/30">
                      <div className="flex justify-between items-center text-xs text-dark-text-secondary">
                        <span>Last Update</span>
                        <span>{new Date(asset.lastUpdate * 1000).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border border-dark-border/50 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-dark-input/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LineChart className="h-8 w-8 text-dark-text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-dark-text-primary mb-2">No Assets Found</h3>
                <p className="text-dark-text-secondary mb-4">
                  You don't have any tokenized assets in your portfolio yet.
                </p>
                <Button
                  onClick={() => router.push('/trade')}
                  className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90"
                >
                  Start Trading
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Portfolio Summary Cards */}
        {/* {userHoldings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-4 border border-dark-border/50">
              <CardTitle className="text-sm font-medium text-dark-text-secondary mb-2">Total Portfolio Value</CardTitle>
              <div className="text-2xl font-bold text-dark-text-primary">
                {assetsLoading ? (
                  <div className="w-32 h-8 bg-dark-input/50 rounded animate-pulse"></div>
                ) : (
                  `$${assetPortfolioValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                )}
              </div>
              <p className="text-xs text-dark-text-secondary">
                {assetsLoading ? (
                  <div className="w-24 h-3 bg-dark-input/30 rounded animate-pulse"></div>
                ) : (
                  `From ${userHoldings.length} assets`
                )}
              </p>
            </Card>

            <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-4 border border-dark-border/50">
              <CardTitle className="text-sm font-medium text-dark-text-secondary mb-2">Stock Holdings</CardTitle>
              <div className="text-2xl font-bold text-dark-text-primary">
                {assetsLoading ? (
                  <div className="w-8 h-8 bg-dark-input/50 rounded animate-pulse"></div>
                ) : (
                  userHoldings.filter(h => h.assetType === 'STOCK').length
                )}
              </div>
              <p className="text-xs text-dark-text-secondary">Active stock tokens</p>
            </Card>

            <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-4 border border-dark-border/50">
              <CardTitle className="text-sm font-medium text-dark-text-secondary mb-2">Commodity Holdings</CardTitle>
              <div className="text-2xl font-bold text-dark-text-primary">
                {assetsLoading ? (
                  <div className="w-8 h-8 bg-dark-input/50 rounded animate-pulse"></div>
                ) : (
                  userHoldings.filter(h => h.assetType === 'COMMODITY').length
                )}
              </div>
              <p className="text-xs text-dark-text-secondary">Active commodity tokens</p>
            </Card>
          </div>
        )} */}


        {/* Chart and Current Balance Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Chart with TradingView Widget */}
          {/* <Card className="lg:col-span-2 bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-dark-border/50 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 p-2 rounded-md hover:bg-dark-input focus:outline-none">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${selectedPortfolio.logoColor} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                        {selectedPortfolio.name.charAt(0)}
                      </div>
                      <span className="font-medium">{selectedPortfolio.name}</span>
                      <Badge
                        className={`${selectedPortfolio.trend === "up" ? "bg-green-700/20 text-green-400" : "bg-red-700/20 text-red-400"} border-transparent`}
                      >
                        {selectedPortfolio.trend === "up" ? "+" : "-"}{Math.abs(selectedPortfolio.change)}%
                      </Badge>
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4 text-dark-text-secondary" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56 bg-dark-bg-secondary/80 backdrop-blur-lg border-dark-border text-dark-text-primary"
                  >
                    {dashboardData.portfolioItems.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        className={`hover:bg-dark-input ${item.id === selectedPortfolio.id ? 'bg-dark-input/50' : ''
                          }`}
                        onClick={() => handlePortfolioChange(item)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className={`w-6 h-6 rounded-full ${item.logoColor} flex items-center justify-center text-white font-bold text-xs`}>
                            {item.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-dark-text-secondary">${item.price.toLocaleString()}</div>
                          </div>
                          <Badge
                            className={`${item.trend === "up" ? "bg-green-700/20 text-green-400" : "bg-red-700/20 text-red-400"} border-transparent`}
                          >
                            {item.trend === "up" ? "+" : "-"}{Math.abs(item.change)}%
                          </Badge>
                          {item.id === selectedPortfolio.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-dark-accent-blue ml-1"></div>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <div className={`absolute inset-0 bg-dark-bg-secondary z-10 flex items-center justify-center transition-opacity duration-300 ${isChangingPortfolio ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-8 h-8 border-2 border-dark-accent-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
              <TradingViewWidget
                symbol={selectedPortfolio.symbol}
                theme="dark"
                autosize={true}
                height="100%"
              />
            </div>
          </Card> */}
        </div>

        {/* Portfolio Allocation Card */}
        <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-dark-border/50 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full"></div>
          <CardTitle className="text-xl font-medium text-dark-text-primary mb-6 flex items-center gap-2">
            {/* <BarChart3 className="h-5 w-5 text-indigo-500" /> */}
            My Portfolio Allocation
            {userHoldings.length > 0 && (
              <Badge className="bg-indigo-700/20 text-indigo-400 border-transparent text-xs">
                {userHoldings.length} {userHoldings.length === 1 ? 'Asset' : 'Assets'}
              </Badge>
            )}
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Allocation Pie Chart */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center">
              {assetsLoading ? (
                <div className="relative w-48 h-48 mb-4">
                  <div className="w-full h-full bg-dark-input/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-dark-input/30 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ) : userHoldings.length === 0 ? (
                <div className="relative w-48 h-48 mb-4">
                  <div className="w-full h-full bg-dark-input/10 rounded-full border-2 border-dashed border-dark-border/30 flex items-center justify-center">
                    <div className="text-center">
                      {/* <BarChart3 className="h-8 w-8 text-dark-text-secondary mx-auto mb-2" /> */}
                      <div className="text-xs text-dark-text-secondary">No assets</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-48 h-48 mb-4">
                  {/* Simple Pie Chart using CSS */}
                  <div className="relative w-full h-full">
                    <div className="w-full h-full rounded-full bg-dark-input/20 border-2 border-dark-border/30 relative overflow-hidden">
                      {portfolioAllocation.map((item, index) => {
                        const rotation = portfolioAllocation
                          .slice(0, index)
                          .reduce((sum, prevItem) => sum + (prevItem.percentage / 100) * 360, 0);
                        
                        const color = getPortfolioColor(index);
                        
                        return (
                          <div
                            key={index}
                            className="absolute inset-0 origin-center"
                            style={{
                              transform: `rotate(${rotation}deg)`,
                            }}
                          >
                            <div
                              className="absolute inset-0 origin-center"
                              style={{
                                transform: `rotate(${(item.percentage / 100) * 360}deg)`,
                                background: `conic-gradient(from 0deg, ${color} 0deg, ${color} ${(item.percentage / 100) * 360}deg, transparent ${(item.percentage / 100) * 360}deg)`,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Center Info */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-dark-bg-secondary/90 backdrop-blur-sm rounded-full w-20 h-20 flex flex-col items-center justify-center border border-dark-border/30 shadow-lg">
                        <div className="text-xs text-dark-text-secondary">Total</div>
                        <div className="text-sm font-bold text-dark-text-primary">
                          {/* {assetsLoading ? (
                            <div className="w-12 h-3 bg-dark-input/50 rounded animate-pulse"></div>
                          ) : (
                            `$${assetPortfolioValue.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}`
                          )} */}
                        </div>
                        <div className="text-xs text-green-500">
                          {userHoldings.length} {userHoldings.length === 1 ? 'asset' : 'assets'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                {assetsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 mr-2 rounded-sm bg-dark-input/50 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="w-16 h-3 bg-dark-input/50 rounded animate-pulse mb-1"></div>
                        <div className="w-12 h-2 bg-dark-input/30 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : portfolioAllocation.length > 0 ? (
                  portfolioAllocation.map((item, index) => {
                    // Get color using the new portfolio color system
                    const color = getPortfolioColor(index);

                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: color }}></div>
                        <div className="flex-1">
                          <span className="text-xs text-dark-text-primary">{item.name}</span>
                          <span className="text-xs text-dark-text-secondary ml-1">({item.percentage}%)</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center text-xs text-dark-text-secondary py-4">
                    No assets to display
                  </div>
                )}
              </div>
            </div>

            {/* Allocation Table */}
            <div className="lg:w-1/2 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border/50">
                    <th className="text-left py-2 px-3 text-dark-text-secondary font-medium">Asset</th>
                    <th className="text-right py-2 px-3 text-dark-text-secondary font-medium">Percentage</th>
                    <th className="text-right py-2 px-3 text-dark-text-secondary font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {assetsLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index} className="border-b border-dark-border/30 last:border-b-0">
                        <td className="py-2 px-3">
                          <div className="flex items-center">
                            <div className="w-3 h-3 mr-2 rounded-sm bg-dark-input/50 animate-pulse"></div>
                            <div className="w-20 h-4 bg-dark-input/50 rounded animate-pulse"></div>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end">
                            <div className="bg-dark-input h-1.5 w-16 rounded-full overflow-hidden mr-2">
                              <div className="w-8 h-full bg-dark-input/50 rounded-full animate-pulse"></div>
                            </div>
                            <div className="w-12 h-4 bg-dark-input/50 rounded animate-pulse"></div>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="w-16 h-4 bg-dark-input/50 rounded animate-pulse ml-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : portfolioAllocation.length > 0 ? (
                    portfolioAllocation.map((item, index) => {
                      // Get color using the new portfolio color system
                      const color = getPortfolioColor(index);

                      return (
                        <tr key={index} className="border-b border-dark-border/30 last:border-b-0 hover:bg-dark-input/20">
                          <td className="py-2 px-3">
                            <div className="flex items-center">
                              <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: color }}></div>
                              <span className="text-dark-text-primary font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end">
                              <div className="bg-dark-input h-1.5 w-16 rounded-full overflow-hidden mr-2">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: color
                                  }}
                                ></div>
                              </div>
                              <span className="font-medium">{item.percentage}%</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right text-dark-text-primary">${item.value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-dark-text-secondary">
                        No assets to display
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Financial News Section */}
        <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border border-dark-border/50 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full"></div>
          <CardTitle className="text-xl font-medium text-dark-text-primary mb-6 flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-blue-500" />
            Financial News
          </CardTitle>
          <CardContent className="p-0">
            <StockNews 
              symbol="MARKET" 
              companyName="Financial Markets" 
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Find Tokenized Assets */}
        <div className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border border-dark-border/50 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-full"></div>
          <h2 className="text-xl font-bold text-dark-text-primary mb-6 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Find Tokenized Assets
          </h2>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary h-4 w-4" />
                <Input
                  placeholder="Search tokenized assets..."
                  className="bg-dark-input shadow-sm border border-dark-border/50 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-dark-accent-blue text-dark-text-primary placeholder-dark-text-secondary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-dark-bg-secondary shadow-sm border border-dark-border/50 rounded-lg px-4 py-2 flex items-center space-x-2 text-dark-text-primary hover:bg-dark-input"
                >
                  <Filter className="h-4 w-4 text-blue-500" />
                  <span>Type: {filterCountry || 'All'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-dark-bg-secondary/80 backdrop-blur-lg border-dark-border/50 text-dark-text-primary">
                <DropdownMenuItem
                  className="hover:bg-dark-input"
                  onClick={() => setFilterCountry(null)}
                >
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-dark-input"
                  onClick={() => setFilterCountry('STOCK')}
                >
                  Stocks
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-dark-input"
                  onClick={() => setFilterCountry('COMMODITY')}
                >
                  Commodities
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-dark-bg-secondary shadow-sm border border-dark-border/50 rounded-lg px-4 py-2 flex items-center space-x-2 text-dark-text-primary hover:bg-dark-input"
                >
                  <Filter className="h-4 w-4 text-green-500" />
                  <span>Status: {filterSector || 'All'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-dark-bg-secondary/80 backdrop-blur-lg border-dark-border/50 text-dark-text-primary">
                <DropdownMenuItem
                  className="hover:bg-dark-input"
                  onClick={() => setFilterSector(null)}
                >
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-dark-input"
                  onClick={() => setFilterSector('active')}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-dark-input"
                  onClick={() => setFilterSector('inactive')}
                >
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={showRecommendedOnly ? "default" : "outline"}
              className={`${showRecommendedOnly
                ? "bg-dark-accent-blue text-white"
                : "bg-dark-bg-secondary border-dark-border/50 text-dark-text-primary hover:bg-dark-input"
                } shadow-sm rounded-lg px-4 py-2 flex items-center gap-2`}
              onClick={() => setShowRecommendedOnly(!showRecommendedOnly)}
            >
              <span className={`w-3 h-3 rounded-full ${showRecommendedOnly ? "bg-white" : "bg-dark-accent-blue"}`}></span>
              Available
            </Button>
          </div>

          {/* Tokenized Assets Table */}
          <div className="overflow-x-auto rounded-lg border border-dark-border/30">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-bg-secondary/50">
                  <th
                    className="text-left py-3 px-4 cursor-pointer hover:bg-dark-input/30 border-b border-dark-border/30"
                    onClick={() => handleSortChange("name")}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-dark-text-secondary">Asset</span>
                      {sortBy === "name" && (
                        <span className="ml-1 text-dark-accent-blue">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-right py-3 px-4 cursor-pointer hover:bg-dark-input/30 border-b border-dark-border/30"
                    onClick={() => handleSortChange("price")}
                  >
                    <div className="flex items-center justify-end">
                      <span className="font-medium text-dark-text-secondary">Price (USD)</span>
                      {sortBy === "price" && (
                        <span className="ml-1 text-dark-accent-blue">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-right py-3 px-4 cursor-pointer hover:bg-dark-input/30 border-b border-dark-border/30"
                    onClick={() => handleSortChange("change")}
                  >
                    <div className="flex items-center justify-end">
                      <span className="font-medium text-dark-text-secondary">Last Update</span>
                      {sortBy === "change" && (
                        <span className="ml-1 text-dark-accent-blue">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 cursor-pointer hover:bg-dark-input/30 border-b border-dark-border/30"
                    onClick={() => handleSortChange("sector")}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-dark-text-secondary">Status</span>
                      {sortBy === "sector" && (
                        <span className="ml-1 text-dark-accent-blue">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 border-b border-dark-border/30 font-medium text-dark-text-secondary">Action</th>
                </tr>
              </thead>
              <tbody>
                {assetsLoading ? (
                  // Shimmering loading skeleton
                  Array.from({ length: 8 }).map((_, index) => (
                    <tr key={index} className="border-b border-dark-border/20 last:border-b-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-dark-input/50 rounded animate-pulse mr-3"></div>
                          <div className="w-24 h-4 bg-dark-input/50 rounded animate-pulse mr-2"></div>
                          <div className="w-16 h-4 bg-dark-input/30 rounded animate-pulse"></div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="w-20 h-4 bg-dark-input/50 rounded animate-pulse ml-auto"></div>
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="w-32 h-4 bg-dark-input/50 rounded animate-pulse ml-auto"></div>
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="w-24 h-4 bg-dark-input/50 rounded animate-pulse ml-auto"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-16 h-6 bg-dark-input/50 rounded animate-pulse"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-20 h-6 bg-dark-input/50 rounded animate-pulse"></div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="w-16 h-8 bg-dark-input/50 rounded animate-pulse mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  (() => {
                    // Filter and sort asset tokens based on current filters
                    let filteredAssets = assetTokens.filter((asset: AssetTokenData) => {
                      // Apply search filter
                      if (searchTerm && !asset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        !asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return false;
                      }

                      // Apply type filter
                      if (filterCountry && asset.assetType !== filterCountry) {
                        return false;
                      }

                      // Apply status filter
                      if (filterSector === 'active' && !asset.isActive) {
                        return false;
                      }
                      if (filterSector === 'inactive' && asset.isActive) {
                        return false;
                      }

                      // Apply available filter
                      if (showRecommendedOnly && !asset.isActive) {
                        return false;
                      }

                      return true;
                    });

                    // Apply sorting
                    filteredAssets.sort((a: AssetTokenData, b: AssetTokenData) => {
                      let comparison = 0;

                      switch (sortBy) {
                        case "name":
                          comparison = a.name.localeCompare(b.name);
                          break;
                        case "price":
                          comparison = parseFloat(a.currentPrice) - parseFloat(b.currentPrice);
                          break;
                        case "change":
                          comparison = a.lastUpdate - b.lastUpdate;
                          break;
                        case "country":
                          comparison = a.assetType.localeCompare(b.assetType);
                          break;
                        case "sector":
                          comparison = a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1;
                          break;
                      }

                      return sortOrder === "asc" ? comparison : -comparison;
                    });

                    if (filteredAssets.length === 0) {
                      return (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-dark-text-secondary">
                            {assetsLoading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 bg-dark-input/50 rounded animate-pulse"></div>
                                <span>Loading assets...</span>
                              </div>
                            ) : (
                              "No tokenized assets found matching your criteria"
                            )}
                          </td>
                        </tr>
                      );
                    }

                    return filteredAssets.map((asset: AssetTokenData) => {
                      console.log(asset.name, '🔍 Asset Token:', asset.lastUpdate);
                      return (
                        <tr key={asset.info.address} className="border-b border-dark-border/20 last:border-b-0 hover:bg-dark-input/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="font-medium text-dark-text-primary">{asset.name}</div>
                              <div className="text-xs text-dark-text-secondary ml-2">{asset.symbol}</div>
                              {asset.isActive && (
                                <Badge className="ml-2 bg-green-700/20 text-green-400 border-transparent text-xs">
                                  Live
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 font-medium text-dark-text-primary">
                            ${parseFloat(asset.currentPrice).toFixed(2)}
                          </td>
                          <td className="text-right py-3 px-4 text-dark-text-secondary">
                            {new Date(asset.lastUpdate * 1000).toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 text-dark-text-secondary">
                            {parseFloat(asset.totalSupply).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={`${asset.assetType === 'STOCK' ? 'bg-blue-700/20 text-blue-400' : 'bg-amber-700/20 text-amber-400'} border-transparent`}
                            >
                              {asset.assetType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={`${asset.isActive ? 'bg-green-700/20 text-green-400' : 'bg-red-700/20 text-red-400'} border-transparent`}
                            >
                              {asset.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-dark-accent-blue/10 text-dark-accent-blue border-dark-accent-blue/20 hover:bg-dark-accent-blue/20 transition-colors"
                              disabled={!asset.isActive}
                              onClick={() => {
                                // Navigate to trade page with the selected asset
                                router.push(`/trade?asset=${asset.symbol}`);
                              }}
                            >
                              {asset.isActive ? 'Buy' : 'Unavailable'}
                            </Button>
                          </td>
                        </tr>
                      );
                    });
                  })()
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

// Main Dashboard component with authentication protection
export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
