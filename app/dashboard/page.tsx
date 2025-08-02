"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Bell, Moon, Sun, ChevronDown, Download, Upload, DollarSign, Filter, ChevronLeft, ChevronRight, BarChart3, LineChart, PieChart, TrendingUp, AreaChart, Vote, Briefcase } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

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
  
  // Generate portfolio allocation data
  const generatePortfolioAllocation = () => {
    return dashboardData.portfolioItems.map(item => ({
      name: item.name,
      percentage: item.percentage,
      value: parseFloat(item.totalReturn.replace(/,/g, '')),
      logoColor: item.logoColor
    }));
  };
  
  // Update the stocks allocation section to use portfolio data
  const [portfolioAllocation, setPortfolioAllocation] = useState(generatePortfolioAllocation());
  
  // Color mapping function
  const colorClasses: Record<string, string> = {
    "bg-amber-500": "#f59e0b",
    "bg-indigo-500": "#4f46e5",
    "bg-purple-500": "#8b5cf6",
    "bg-blue-500": "#3b82f6",
    "bg-pink-500": "#ec4899",
    "bg-red-500": "#ef4444",
    "bg-green-500": "#10b981"
  };
  
  const getColor = (logoColor: string): string => {
    return colorClasses[logoColor as keyof typeof colorClasses] || "#4f46e5";
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-dark-text-secondary hover:text-dark-text-primary bg-dark-bg-secondary/50 rounded-full"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90 rounded-lg flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>
        
        {/* Portfolio Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-text-primary flex items-center gap-2">
              <LineChart className="h-5 w-5 text-dark-accent-blue" />
              My Portfolio
            </h2>
            {showNavigation && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:border-dark-accent-blue rounded-full w-8 h-8 p-0"
                  onClick={scrollPrev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:border-dark-accent-blue rounded-full w-8 h-8 p-0"
                  onClick={scrollNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          <div className="relative overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                width: `${totalItems * (100 / itemsPerView)}%`,
                transform: `translateX(0%)`
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {dashboardData.portfolioItems.map((item, index) => (
                <div
                  key={index}
                  className="px-2"
                  style={{ width: `${100 / totalItems}%` }}
                >
                  <Card 
                    className={`bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border ${item.id === selectedPortfolio.id
                      ? 'border-dark-accent-blue ring-1 ring-dark-accent-blue shadow-dark-accent-blue/20' 
                      : 'border-dark-border/50 hover:border-dark-accent-blue/50'
                    } overflow-hidden cursor-pointer transition-all hover:shadow-lg`}
                    onClick={() => {
                      handlePortfolioChange(item);
                    }}
                  >
                    <CardContent className={`p-6 ${item.id === selectedPortfolio.id
                      ? 'bg-dark-bg-secondary/80' 
                      : ''
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 relative flex items-center justify-center rounded-md ${item.logoColor} shadow-sm`}>
                            <Image
                              src={item.logo}
                              alt={item.name}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-semibold text-lg">{item.name}</span>
                        </div>
                        <div className="relative w-24 h-8">
                          {item.trend === "up" ? (
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent rounded-md">
                              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path
                                  d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,8"
                                  stroke="#22c55e"
                                  strokeWidth="2"
                                  fill="none"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent rounded-md">
                              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path
                                  d="M0,8 L10,12 L20,10 L30,15 L40,13 L50,18 L60,16 L70,22 L80,20 L90,25 L100,22"
                                  stroke="#ef4444"
                                  strokeWidth="2"
                                  fill="none"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-dark-text-secondary">Total Share</span>
                          <span className={`flex items-center ${item.trend === "up" ? "text-green-500" : "text-red-500"} font-medium`}>
                            + {item.totalShare} {item.trend === "up" ? "▲" : "▼"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-text-secondary">Total Return</span>
                          <span className="font-semibold">$ {item.totalReturn}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          {showNavigation && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalItems - itemsPerView + 1 }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${scrollPosition === index 
                    ? "bg-dark-accent-blue" 
                    : "bg-dark-text-secondary/30 hover:bg-dark-text-secondary/50"
                  }`}
                  onClick={() => {
                    if (carouselRef.current) {
                      setScrollPosition(index);
                      carouselRef.current.style.transform = `translateX(-${index * cardWidth}%)`;
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Deposit/Withdraw/Cash In Buttons */}
        <div className="flex justify-end space-x-4 mb-8">
          <Button className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90 px-6 py-3 rounded-lg flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Deposit</span>
          </Button>
          <Button className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90 px-6 py-3 rounded-lg flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Withdraw</span>
          </Button>
        </div>

        {/* Chart and Current Balance Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Chart with TradingView Widget */}
          <Card className="lg:col-span-2 bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-dark-border/50 overflow-hidden">
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
          </Card>

          {/* Cards Section */}
          <div className="flex flex-col space-y-6">
            {/* Current Balance Card */}
            <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-dark-border/50 flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-dark-accent-blue/10 rounded-bl-full"></div>
              <CardTitle className="text-sm font-medium text-dark-text-secondary mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-dark-accent-blue" />
                Current Balance
              </CardTitle>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-dark-text-primary">
                  ${dashboardData.currentBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <Badge className="bg-green-700/20 text-green-400 border-transparent text-sm px-3 py-1 rounded-full">
                  {dashboardData.balanceChangePercent}%
                </Badge>
              </div>
              <p className="text-sm text-dark-text-secondary mt-2">vs last 24 hours</p>
            </Card>

            {/* Total PNL Card */}
            <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-dark-border/50 flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full"></div>
              <CardTitle className="text-sm font-medium text-dark-text-secondary mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Total PNL
              </CardTitle>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-dark-text-primary">
                  ${dashboardData.totalPnL.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <Badge 
                  className={`${dashboardData.pnlChangePercent >= 0 ? "bg-green-700/20 text-green-400" : "bg-red-700/20 text-red-400"} border-transparent text-sm px-3 py-1 rounded-full`}
                >
                  {dashboardData.pnlChangePercent >= 0 ? "+" : "-"}{Math.abs(dashboardData.pnlChangePercent)}%
                </Badge>
              </div>
              <p className="text-sm text-dark-text-secondary mt-2">vs last 24 hours</p>
            </Card>
          </div>
        </div>

        {/* Portfolio Allocation Card */}
        <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-dark-border/50 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full"></div>
          <CardTitle className="text-xl font-medium text-dark-text-primary mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-500" />
            My Portfolio Allocation
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Allocation Pie Chart */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4">
                {/* SVG Pie Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <circle cx="50" cy="50" r="42" fill="#1f2937" stroke="#374151" strokeWidth="1" />
                  {(() => {
                    let offset = 0;
                    return portfolioAllocation.map((item, index) => {
                      // Calculate the start and end angles for the pie slice
                      const startAngle = offset;
                      const endAngle = startAngle + (item.percentage / 100) * 360;
                      offset = endAngle;
                      
                      // Calculate the SVG arc path
                      const x1 = 50 + 42 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 = 50 + 42 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 50 + 42 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 = 50 + 42 * Math.sin((endAngle * Math.PI) / 180);
                      
                      // Determine if the arc should be drawn as a large arc
                      const largeArcFlag = item.percentage > 50 ? 1 : 0;
                      
                      // Get color using the helper function
                      const color = getColor(item.logoColor);
                      
                      // Calculate position for percentage label
                      const midAngle = (startAngle + endAngle) / 2;
                      const labelRadius = item.percentage > 5 ? 30 : 0; // Only show label if segment is large enough
                      const labelX = 50 + labelRadius * Math.cos((midAngle * Math.PI) / 180);
                      const labelY = 50 + labelRadius * Math.sin((midAngle * Math.PI) / 180);
                      
                      return (
                        <g key={index} filter="url(#glow)">
                          <path
                            d={`M 50 50 L ${x1} ${y1} A 42 42 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={color}
                            stroke="#1f2937"
                            strokeWidth="0.5"
                          />
                          {item.percentage > 5 && (
                            <text
                              x={labelX}
                              y={labelY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="#ffffff"
                              fontSize="6"
                              fontWeight="bold"
                            >
                              {item.percentage}%
                            </text>
                          )}
                        </g>
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-dark-bg-secondary/70 backdrop-blur-sm rounded-full w-24 h-24 flex flex-col items-center justify-center border border-dark-border/20 shadow-lg">
                    <div className="text-xs text-dark-text-secondary">Total</div>
                    <div className="text-lg font-bold text-dark-text-primary">
                      ${totalPortfolioValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-500 flex items-center">
                      <span className="mr-1">+2.4%</span>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 1L9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                {portfolioAllocation.map((item, index) => {
                  // Get color using the helper function
                  const color = getColor(item.logoColor);
                  
                  return (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: color }}></div>
                      <div className="flex-1">
                        <span className="text-xs text-dark-text-primary">{item.name}</span>
                        <span className="text-xs text-dark-text-secondary ml-1">({item.percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
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
                  {portfolioAllocation.map((item, index) => {
                    // Get color using the helper function
                    const color = getColor(item.logoColor);
                    
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
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Find Assets & Filter */}
        <div className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border border-dark-border/50 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-full"></div>
          <h2 className="text-xl font-bold text-dark-text-primary mb-6 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Find Assets
          </h2>
          
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary h-4 w-4" />
                <Input
                  placeholder="Search assets..."
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
                  <span>Country: {filterCountry || 'All'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-dark-bg-secondary/80 backdrop-blur-lg border-dark-border/50 text-dark-text-primary">
                <DropdownMenuItem 
                  className="hover:bg-dark-input"
                  onClick={() => setFilterCountry(null)}
                >
                  All Countries
                </DropdownMenuItem>
                {countries.map(country => (
                  <DropdownMenuItem 
                    key={country} 
                    className="hover:bg-dark-input"
                    onClick={() => setFilterCountry(country)}
                  >
                    {country}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-dark-bg-secondary shadow-sm border border-dark-border/50 rounded-lg px-4 py-2 flex items-center space-x-2 text-dark-text-primary hover:bg-dark-input"
                >
                  <Filter className="h-4 w-4 text-green-500" />
                  <span>Sector: {filterSector || 'All'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-dark-bg-secondary/80 backdrop-blur-lg border-dark-border/50 text-dark-text-primary">
                <DropdownMenuItem 
                  className="hover:bg-dark-input"
                  onClick={() => setFilterSector(null)}
                >
                  All Sectors
                </DropdownMenuItem>
                {sectors.map(sector => (
                  <DropdownMenuItem 
                    key={sector} 
                    className="hover:bg-dark-input"
                    onClick={() => setFilterSector(sector)}
                  >
                    {sector}
                  </DropdownMenuItem>
                ))}
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
              Recommended
            </Button>
          </div>
          
          {/* Stocks Table */}
          <div className="overflow-x-auto rounded-lg border border-dark-border/30">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-bg-secondary/50">
                  <th 
                    className="text-left py-3 px-4 cursor-pointer hover:bg-dark-input/30 border-b border-dark-border/30"
                    onClick={() => handleSortChange("name")}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-dark-text-secondary">Name</span>
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
                      <span className="font-medium text-dark-text-secondary">Price</span>
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
                      <span className="font-medium text-dark-text-secondary">Change</span>
                      {sortBy === "change" && (
                        <span className="ml-1 text-dark-accent-blue">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 border-b border-dark-border/30 font-medium text-dark-text-secondary">Market Cap</th>
                  <th 
                    className="text-left py-3 px-4 cursor-pointer hover:bg-dark-input/30 border-b border-dark-border/30"
                    onClick={() => handleSortChange("country")}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-dark-text-secondary">Country</span>
                      {sortBy === "country" && (
                        <span className="ml-1 text-dark-accent-blue">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 cursor-pointer hover:bg-dark-input/30 border-b border-dark-border/30"
                    onClick={() => handleSortChange("sector")}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-dark-text-secondary">Sector</span>
                      {sortBy === "sector" && (
                        <span className="ml-1 text-dark-accent-blue">{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 border-b border-dark-border/30 font-medium text-dark-text-secondary">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-dark-text-secondary">
                      No stocks found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map(stock => (
                    <tr key={stock.id} className="border-b border-dark-border/20 last:border-b-0 hover:bg-dark-input/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="font-medium text-dark-text-primary">{stock.name}</div>
                          <div className="text-xs text-dark-text-secondary ml-2">{stock.symbol}</div>
                          {stock.recommended && (
                            <Badge className="ml-2 bg-dark-accent-blue/20 text-dark-accent-blue border-transparent text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium text-dark-text-primary">${stock.price.toFixed(2)}</td>
                      <td className={`text-right py-3 px-4 font-medium ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {stock.change >= 0 ? "+" : ""}{stock.change}%
                      </td>
                      <td className="text-right py-3 px-4 text-dark-text-secondary">{stock.marketCap}</td>
                      <td className="py-3 px-4 text-dark-text-secondary">{stock.country}</td>
                      <td className="py-3 px-4 text-dark-text-secondary">{stock.sector}</td>
                      <td className="text-center py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-dark-accent-blue/10 text-dark-accent-blue border-dark-accent-blue/20 hover:bg-dark-accent-blue/20 transition-colors"
                          onClick={() => {}}
                        >
                          Buy
                        </Button>
                      </td>
                    </tr>
                  ))
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
