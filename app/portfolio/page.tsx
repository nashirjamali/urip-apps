"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  AreaChart, 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  Percent, 
  RotateCcw, 
  Clock, 
  Settings,
  Info,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  Check,
  X,
  Bell,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Minus,
  Target,
  Shield,
  Zap,
  Calendar,
  TrendingDown,
  Wallet,
  Coins,
  Activity
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'

// Import custom portfolio chart
import PortfolioChart from '../../components/PortfolioChart'

// Import TradingView widget dynamically to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('../../components/TradingViewWidget'),
  { ssr: false }
)

// Portfolio data
const portfolioData = {
  totalValue: 24580.50,
  totalChange: 12.5,
  totalChangeAmount: 2734.20,
  totalInvested: 21846.30,
  totalProfit: 2734.20,
  profitPercentage: 12.5
}

// Portfolio assets
const portfolioAssets = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-amber-500",
    quantity: 0.45,
    avgPrice: 62000,
    currentPrice: 68000,
    currentValue: 30600,
    change24h: 2.3,
    changeAmount: 690,
    profitLoss: 2700,
    profitLossPercentage: 9.7,
    allocation: 45.2
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-indigo-500",
    quantity: 3.2,
    avgPrice: 3100,
    currentPrice: 3200,
    currentValue: 10240,
    change24h: 1.5,
    changeAmount: 151,
    profitLoss: 320,
    profitLossPercentage: 3.2,
    allocation: 15.1
  },
  {
    id: 3,
    name: "Solana",
    symbol: "SOL",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-purple-500",
    quantity: 25,
    avgPrice: 110,
    currentPrice: 120,
    currentValue: 3000,
    change24h: -0.8,
    changeAmount: -24,
    profitLoss: 250,
    profitLossPercentage: 9.1,
    allocation: 4.4
  },
  {
    id: 4,
    name: "Cardano",
    symbol: "ADA",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-blue-500",
    quantity: 5000,
    avgPrice: 0.42,
    currentPrice: 0.45,
    currentValue: 2250,
    change24h: 3.2,
    changeAmount: 70,
    profitLoss: 150,
    profitLossPercentage: 7.1,
    allocation: 3.3
  },
  {
    id: 5,
    name: "Polkadot",
    symbol: "DOT",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-pink-500",
    quantity: 100,
    avgPrice: 7.2,
    currentPrice: 6.8,
    currentValue: 680,
    change24h: -1.2,
    changeAmount: -8,
    profitLoss: -40,
    profitLossPercentage: -5.6,
    allocation: 1.0
  },
  {
    id: 6,
    name: "Avalanche",
    symbol: "AVAX",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-red-500",
    quantity: 50,
    avgPrice: 34.5,
    currentPrice: 35.2,
    currentValue: 1760,
    change24h: 0.9,
    changeAmount: 16,
    profitLoss: 35,
    profitLossPercentage: 2.0,
    allocation: 2.6
  }
]

// Recent transactions
const recentTransactions = [
  { 
    id: 1, 
    type: "buy", 
    asset: "Bitcoin", 
    symbol: "BTC",
    amount: "0.1", 
    value: "$6,800", 
    price: 68000,
    fee: "$2.50",
    date: "2024-01-15", 
    time: "14:30:25",
    status: "completed",
    txHash: "0x1234567890abcdef1234567890abcdef12345678",
    network: "Bitcoin",
    blockNumber: 12345678
  },
  { 
    id: 2, 
    type: "sell", 
    asset: "Ethereum", 
    symbol: "ETH",
    amount: "0.5", 
    value: "$1,600", 
    price: 3200,
    fee: "$1.20",
    date: "2024-01-14", 
    time: "09:15:42",
    status: "completed",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
    network: "Ethereum",
    blockNumber: 45678901
  },
  { 
    id: 3, 
    type: "buy", 
    asset: "Solana", 
    symbol: "SOL",
    amount: "10", 
    value: "$1,200", 
    price: 120,
    fee: "$0.80",
    date: "2024-01-13", 
    time: "16:45:18",
    status: "completed",
    txHash: "0x567890abcdef1234567890abcdef1234567890ab",
    network: "Solana",
    blockNumber: 78901234
  },
  { 
    id: 4, 
    type: "buy", 
    asset: "Cardano", 
    symbol: "ADA",
    amount: "1000", 
    value: "$450", 
    price: 0.45,
    fee: "$0.50",
    date: "2024-01-12", 
    time: "11:22:33",
    status: "completed",
    txHash: "0x890abcdef1234567890abcdef1234567890abcdef",
    network: "Cardano",
    blockNumber: 23456789
  },
  { 
    id: 5, 
    type: "sell", 
    asset: "Bitcoin", 
    symbol: "BTC",
    amount: "0.05", 
    value: "$3,400", 
    price: 68000,
    fee: "$1.25",
    date: "2024-01-11", 
    time: "13:55:07",
    status: "completed",
    txHash: "0xdef1234567890abcdef1234567890abcdef12345",
    network: "Bitcoin",
    blockNumber: 34567890
  },
  { 
    id: 6, 
    type: "buy", 
    asset: "Polkadot", 
    symbol: "DOT",
    amount: "50", 
    value: "$340", 
    price: 6.8,
    fee: "$0.75",
    date: "2024-01-10", 
    time: "08:30:15",
    status: "pending",
    txHash: "0xef1234567890abcdef1234567890abcdef123456",
    network: "Polkadot",
    blockNumber: 56789012
  }
]

// Performance data for charts
const performanceData = [
  { date: "2024-01-01", value: 20000 },
  { date: "2024-01-02", value: 20500 },
  { date: "2024-01-03", value: 19800 },
  { date: "2024-01-04", value: 21000 },
  { date: "2024-01-05", value: 21500 },
  { date: "2024-01-06", value: 22000 },
  { date: "2024-01-07", value: 21800 },
  { date: "2024-01-08", value: 22500 },
  { date: "2024-01-09", value: 23000 },
  { date: "2024-01-10", value: 23500 },
  { date: "2024-01-11", value: 23200 },
  { date: "2024-01-12", value: 23800 },
  { date: "2024-01-13", value: 24000 },
  { date: "2024-01-14", value: 24200 },
  { date: "2024-01-15", value: 24580 }
]

export default function PortfolioPage() {
  const [isDark, setIsDark] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")
  const [selectedAsset, setSelectedAsset] = useState(portfolioAssets[0])
  const [showAddAssetModal, setShowAddAssetModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [sortBy, setSortBy] = useState("value")
  const [searchTerm, setSearchTerm] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  // Sort assets
  const sortedAssets = [...portfolioAssets].sort((a, b) => {
    switch (sortBy) {
      case "value":
        return b.currentValue - a.currentValue
      case "change":
        return b.change24h - a.change24h
      case "profit":
        return b.profitLoss - a.profitLoss
      case "allocation":
        return b.allocation - a.allocation
      default:
        return 0
    }
  })

  // Filter assets by search term
  const filteredAssets = sortedAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg-primary to-dark-bg-secondary text-dark-text-primary">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-dark-text-secondary">Loading portfolio...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""} bg-gradient-to-br from-dark-bg-primary to-dark-bg-secondary text-dark-text-primary`}>
      {/* Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio</h1>
            <p className="text-gray-400 text-sm mt-1">Track your investments and performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Portfolio Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(portfolioData.totalValue)}</p>
                  <div className={`flex items-center text-sm ${portfolioData.totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolioData.totalChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {formatPercentage(portfolioData.totalChange)} ({formatCurrency(portfolioData.totalChangeAmount)})
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Invested</p>
                  <p className="text-2xl font-bold">{formatCurrency(portfolioData.totalInvested)}</p>
                  <p className="text-sm text-gray-400">Initial capital</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Profit/Loss</p>
                  <p className={`text-2xl font-bold ${portfolioData.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(portfolioData.totalProfit)}
                  </p>
                  <p className={`text-sm ${portfolioData.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(portfolioData.profitPercentage)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Assets</p>
                  <p className="text-2xl font-bold">{portfolioAssets.length}</p>
                  <p className="text-sm text-gray-400">Different cryptocurrencies</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Assets
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Portfolio Chart */}
              <div className="lg:col-span-2">
                <PortfolioChart 
                  data={performanceData}
                  height={300}
                />
              </div>

              {/* Asset Allocation */}
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {portfolioAssets.slice(0, 5).map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${asset.logoColor}`}></div>
                          <span className="text-sm">{asset.symbol}</span>
                        </div>
                        <span className="text-sm font-medium">{asset.allocation.toFixed(1)}%</span>
                      </div>
                    ))}
                    {portfolioAssets.length > 5 && (
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="text-sm">Others</span>
                        <span className="text-sm">
                          {(100 - portfolioAssets.slice(0, 5).reduce((sum, asset) => sum + asset.allocation, 0)).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {portfolioAssets
                    .sort((a, b) => b.profitLossPercentage - a.profitLossPercentage)
                    .slice(0, 3)
                    .map((asset, index) => (
                      <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${asset.logoColor} flex items-center justify-center text-white font-bold text-sm`}>
                            {asset.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-gray-400">{asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${asset.profitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatPercentage(asset.profitLossPercentage)}
                          </div>
                          <div className="text-sm text-gray-400">{formatCurrency(asset.profitLoss)}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700/50 border-gray-700/50"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">By Value</SelectItem>
                      <SelectItem value="change">By 24h Change</SelectItem>
                      <SelectItem value="profit">By Profit/Loss</SelectItem>
                      <SelectItem value="allocation">By Allocation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Assets Table */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-800/50 border-gray-700/50">
                      <TableHead className="text-gray-400">Asset</TableHead>
                      <TableHead className="text-gray-400">Quantity</TableHead>
                      <TableHead className="text-gray-400">Avg Price</TableHead>
                      <TableHead className="text-gray-400">Current Price</TableHead>
                      <TableHead className="text-gray-400">Current Value</TableHead>
                      <TableHead className="text-gray-400">24h Change</TableHead>
                      <TableHead className="text-gray-400">P&L</TableHead>
                      <TableHead className="text-gray-400">Allocation</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id} className="hover:bg-gray-800/50 border-gray-700/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${asset.logoColor} flex items-center justify-center text-white font-bold text-sm`}>
                              {asset.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{asset.name}</div>
                              <div className="text-sm text-gray-400">{asset.symbol}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{asset.quantity}</div>
                            <div className="text-sm text-gray-400">{asset.symbol}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(asset.avgPrice)}</TableCell>
                        <TableCell>{formatCurrency(asset.currentPrice)}</TableCell>
                        <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                        <TableCell>
                          <div className={`flex items-center ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {asset.change24h >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {Math.abs(asset.change24h).toFixed(2)}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className={`font-medium ${asset.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(asset.profitLoss)}
                            </div>
                            <div className={`text-sm ${asset.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatPercentage(asset.profitLossPercentage)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${asset.logoColor}`}
                                style={{ width: `${asset.allocation}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{asset.allocation.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-900/95 border-gray-700">
                              <DropdownMenuItem className="hover:bg-gray-800">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-800">
                                <Plus className="h-4 w-4 mr-2" />
                                Buy More
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-gray-800">
                                <Minus className="h-4 w-4 mr-2" />
                                Sell
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <PortfolioChart 
                data={performanceData}
                height={300}
              />

              {/* Performance Metrics */}
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Total Return</div>
                      <div className="text-xl font-bold text-green-400">{formatPercentage(portfolioData.profitPercentage)}</div>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Sharpe Ratio</div>
                      <div className="text-xl font-bold">1.85</div>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Max Drawdown</div>
                      <div className="text-xl font-bold text-red-400">-8.2%</div>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Volatility</div>
                      <div className="text-xl font-bold">12.4%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-gray-400 hover:text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-400 hover:text-white">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-800/50 border-gray-700/50">
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Asset</TableHead>
                      <TableHead className="text-gray-400">Amount</TableHead>
                      <TableHead className="text-gray-400">Price</TableHead>
                      <TableHead className="text-gray-400">Value</TableHead>
                      <TableHead className="text-gray-400">Fee</TableHead>
                      <TableHead className="text-gray-400">Date & Time</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow 
                        key={transaction.id} 
                        className="hover:bg-gray-800/50 border-gray-700/50 cursor-pointer"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowTransactionModal(true);
                        }}
                      >
                        <TableCell>
                          <Badge 
                            className={transaction.type === "buy" 
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-transparent" 
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-transparent"
                            }
                          >
                            {transaction.type === "buy" ? "Buy" : "Sell"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xs`}>
                              {transaction.asset.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{transaction.asset}</div>
                              <div className="text-xs text-gray-400">{transaction.symbol}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.amount} {transaction.symbol}</div>
                          </div>
                        </TableCell>
                        <TableCell>${transaction.price.toLocaleString()}</TableCell>
                        <TableCell>{transaction.value}</TableCell>
                        <TableCell className="text-gray-400">{transaction.fee}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{transaction.date}</div>
                            <div className="text-xs text-gray-400">{transaction.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {transaction.status === "completed" ? (
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-400 mr-1" />
                              <span>Completed</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-amber-400 mr-1" />
                              <span>Pending</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransaction(transaction);
                              setShowTransactionModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transaction Detail Modal */}
        {showTransactionModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Transaction Details</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowTransactionModal(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transaction Header */}
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-lg`}>
                      {selectedTransaction.asset.charAt(0)}
                    </div>
                    <div>
                      <div className="text-lg font-medium">{selectedTransaction.asset}</div>
                      <div className="text-sm text-gray-400">{selectedTransaction.symbol}</div>
                    </div>
                  </div>
                  <Badge 
                    className={selectedTransaction.type === "buy" 
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-transparent text-lg px-4 py-2" 
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-transparent text-lg px-4 py-2"
                    }
                  >
                    {selectedTransaction.type === "buy" ? "Buy" : "Sell"}
                  </Badge>
                </div>

                {/* Transaction Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Amount</div>
                      <div className="text-lg font-medium">{selectedTransaction.amount} {selectedTransaction.symbol}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Price per {selectedTransaction.symbol}</div>
                      <div className="text-lg font-medium">${selectedTransaction.price.toLocaleString()}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Total Value</div>
                      <div className="text-lg font-medium">{selectedTransaction.value}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Transaction Fee</div>
                      <div className="text-lg font-medium">{selectedTransaction.fee}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Date</div>
                      <div className="text-lg font-medium">{selectedTransaction.date}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Time</div>
                      <div className="text-lg font-medium">{selectedTransaction.time}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Status</div>
                      <div className="flex items-center">
                        {selectedTransaction.status === "completed" ? (
                          <>
                            <Check className="h-4 w-4 text-green-400 mr-2" />
                            <span className="text-green-400 font-medium">Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-amber-400 mr-2" />
                            <span className="text-amber-400 font-medium">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Network</div>
                      <div className="text-lg font-medium">{selectedTransaction.network}</div>
                    </div>
                  </div>
                </div>

                {/* Blockchain Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Blockchain Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Transaction Hash</div>
                      <div className="text-sm font-mono text-gray-300 break-all">
                        {selectedTransaction.txHash}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-400">Block Number</div>
                      <div className="text-lg font-medium">{selectedTransaction.blockNumber.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Copy transaction hash to clipboard
                      navigator.clipboard.writeText(selectedTransaction.txHash);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Copy Hash
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Open in blockchain explorer
                      window.open(`https://blockchain.info/tx/${selectedTransaction.txHash}`, '_blank');
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setShowTransactionModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
} 