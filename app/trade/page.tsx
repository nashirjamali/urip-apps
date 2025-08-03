"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  TrendingUp, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Eye,
  BarChart3,
  LineChart,
  Coins,
  RefreshCw,
  Info,
  AlertCircle,
  Clock
} from "lucide-react"
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAccount } from "wagmi"
import { useAssetTokens, AssetTokenData } from '@/hooks/useAssetTokens'
import { useTransactionHistory } from '@/hooks/useTransactionHistory'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

function TradePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "stock" | "crypto" | "commodity">("all")
  const [sortBy, setSortBy] = useState<"name" | "price" | "marketCap" | "supply" | "type" | "status">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  
  const { address } = useAccount()

  // Smart contract data
  const {
    assetTokens,
    totalPortfolioValue,
    userHoldings,
    isLoading: assetsLoading,
    refetch
  } = useAssetTokens()

  // Transaction history for recent activity
  const {
    transactions: recentTransactions,
    isLoading: transactionsLoading,
    refresh: refreshTransactions
  } = useTransactionHistory(5)

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

  // Filter and sort tokens
  const filteredTokens = assetTokens
    .filter(token => {
      const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Debug: Log the asset type to see what we're getting
      console.log(`Token ${token.symbol}: assetType = "${token.assetType}", info.type = "${token.info.type}", filterType = "${filterType}"`)
      
      // Fix the filter logic to handle case sensitivity properly
      let matchesFilter = true
      if (filterType !== "all") {
        // Try to get asset type from contract first, fallback to token info
        const contractAssetType = token.assetType?.toLowerCase() || ""
        const infoAssetType = token.info.type?.toLowerCase() || ""
        const filterValue = filterType.toLowerCase()
        
        // More robust matching - handle different possible values
        let tokenType = contractAssetType || infoAssetType
        
        if (filterValue === "stock") {
          matchesFilter = tokenType === "stock" || tokenType === "stocks"
        } else if (filterValue === "commodity") {
          matchesFilter = tokenType === "commodity" || tokenType === "commodities"
        } else {
          matchesFilter = tokenType === filterValue
        }
        
        console.log(`Filtering ${token.symbol}: contractType="${contractAssetType}", infoType="${infoAssetType}", filter="${filterValue}" = ${matchesFilter}`)
      }
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "price":
          aValue = parseFloat(a.currentPrice)
          bValue = parseFloat(b.currentPrice)
          break
        case "marketCap":
          aValue = parseFloat(a.totalSupply) * parseFloat(a.currentPrice)
          bValue = parseFloat(b.totalSupply) * parseFloat(b.currentPrice)
          break
        case "supply":
          aValue = parseFloat(a.totalSupply)
          bValue = parseFloat(b.totalSupply)
          break
        case "type":
          aValue = a.assetType
          bValue = b.assetType
          break
        case "status":
          aValue = a.isActive ? 1 : 0
          bValue = b.isActive ? 1 : 0
          break
        default:
          aValue = a.name
          bValue = b.name
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })



  const handleTokenSelect = (token: AssetTokenData) => {
    // Navigate to the token detail page
    router.push(`/trade/${token.symbol}`)
  }

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(2)
  }

  const formatMarketCap = (supply: string, price: string) => {
    const marketCap = parseFloat(supply) * parseFloat(price)
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`
    return `$${marketCap.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Trade Markets</h1>
                <p className="text-gray-400">Discover and trade tokenized assets</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                  disabled={assetsLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${assetsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Assets</p>
                      <p className="text-2xl font-bold text-white">
                        {assetsLoading ? "..." : assetTokens.length}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <Coins className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Portfolio Value</p>
                      <p className="text-2xl font-bold text-white">
                        {assetsLoading ? "..." : `$${totalPortfolioValue.toFixed(2)}`}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Holdings</p>
                      <p className="text-2xl font-bold text-white">
                        {assetsLoading ? "..." : userHoldings.filter(h => parseFloat(h.balance) > 0).length}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Recent Activity</p>
                      <p className="text-2xl font-bold text-white">
                        {transactionsLoading ? "..." : recentTransactions.length}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tokens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
                  />
                </div>
                
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="stock">Stocks</SelectItem>
                    <SelectItem value="commodity">Commodities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tokenized Assets List with Slider */}
          {assetsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="bg-gray-800/30 border-gray-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-600/50 animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-600/50 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-600/50 rounded animate-pulse"></div>
                      <div className="w-20 h-3 bg-gray-600/30 rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Coins className="h-5 w-5 text-blue-400" />
                Tokenized Assets
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs font-medium px-2 py-1">
                  {filteredTokens.length} {filteredTokens.length === 1 ? 'Asset' : 'Assets'}
                </Badge>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredTokens.map((token) => {
                  const userHolding = userHoldings.find(h => h.info.address === token.info.address)
                  const userBalance = userHolding ? parseFloat(userHolding.balance) : 0
                  const marketCap = parseFloat(token.totalSupply) * parseFloat(token.currentPrice)
                  
                  return (
                    <Card 
                      key={token.info.address}
                      className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
                      onClick={() => handleTokenSelect(token)}
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full"></div>
                      
                      {/* Status indicator */}
                      <div className={`absolute top-3 left-3 w-2 h-2 rounded-full ${token.isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                      
                      <CardContent className="p-6 relative z-10">
                        {/* Header with logo and type */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`relative w-12 h-12 rounded-xl ${
                              token.assetType === 'STOCK' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 
                              token.assetType === 'CRYPTO' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 
                              'bg-gradient-to-br from-green-500 to-emerald-600'
                            } flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                              {token.symbol.substring(0, 2)}
                              <div className="absolute inset-0 rounded-xl bg-white/10"></div>
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                                {token.name}
                              </h3>
                              <p className="text-sm text-gray-400">{token.symbol}</p>
                            </div>
                          </div>
                          <Badge 
                            className={`${
                              token.assetType === 'STOCK' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              token.assetType === 'CRYPTO' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              'bg-green-500/20 text-green-400 border-green-500/30'
                            } border text-xs font-medium`}
                          >
                            {token.assetType}
                          </Badge>
                        </div>
                        
                        {/* Price and market cap */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Current Price</span>
                            <span className="text-xl font-bold text-white">
                              ${formatPrice(token.currentPrice)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Market Cap</span>
                            <span className="text-sm font-medium text-gray-300">
                              {marketCap >= 1e9 ? `$${(marketCap / 1e9).toFixed(2)}B` :
                               marketCap >= 1e6 ? `$${(marketCap / 1e6).toFixed(2)}M` :
                               marketCap >= 1e3 ? `$${(marketCap / 1e3).toFixed(2)}K` :
                               `$${marketCap.toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                        
                        {/* User holdings */}
                        {userBalance > 0 && (
                          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-400 font-medium">Your Holdings</span>
                              <span className="text-sm text-green-400 font-bold">
                                {userBalance.toFixed(2)} {token.symbol}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Value: ${(userBalance * parseFloat(token.currentPrice)).toFixed(2)}
                            </div>
                          </div>
                        )}
                        
                        {/* Supply and status */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Supply:</span>
                            <span className="text-gray-300 font-medium">
                              {parseFloat(token.totalSupply).toLocaleString()}
                            </span>
                          </div>
                          <Badge 
                            className={`${
                              token.isActive 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            } border text-xs`}
                          >
                            {token.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        
                        {/* Action button */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTokenSelect(token);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Trade
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              
              {filteredTokens.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No tokens found</h3>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-xl border border-gray-700/50 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-full"></div>
              
                             {/* Enhanced Table Header */}
               <div className="overflow-x-auto rounded-lg border border-gray-700/30">
                 <table className="w-full">
                   <thead>
                     <tr className="bg-gray-800/50">
                       <th 
                         className="text-left py-3 px-4 cursor-pointer hover:bg-gray-700/30 border-b border-gray-700/30"
                         onClick={() => handleSortChange("name")}
                       >
                         <div className="flex items-center">
                           <span className="font-medium text-gray-400">Asset</span>
                           {sortBy === "name" && (
                             <span className="ml-1 text-blue-400">{sortOrder === "asc" ? "↑" : "↓"}</span>
                           )}
                         </div>
                       </th>
                       <th 
                         className="text-right py-3 px-4 cursor-pointer hover:bg-gray-700/30 border-b border-gray-700/30"
                         onClick={() => handleSortChange("price")}
                       >
                         <div className="flex items-center justify-end">
                           <span className="font-medium text-gray-400">Price (USD)</span>
                           {sortBy === "price" && (
                             <span className="ml-1 text-blue-400">{sortOrder === "asc" ? "↑" : "↓"}</span>
                           )}
                         </div>
                       </th>
                       <th 
                         className="text-right py-3 px-4 cursor-pointer hover:bg-gray-700/30 border-b border-gray-700/30"
                         onClick={() => handleSortChange("marketCap")}
                       >
                         <div className="flex items-center justify-end">
                           <span className="font-medium text-gray-400">Market Cap</span>
                           {sortBy === "marketCap" && (
                             <span className="ml-1 text-blue-400">{sortOrder === "asc" ? "↑" : "↓"}</span>
                           )}
                         </div>
                       </th>
                       <th 
                         className="text-right py-3 px-4 cursor-pointer hover:bg-gray-700/30 border-b border-gray-700/30"
                         onClick={() => handleSortChange("supply")}
                       >
                         <div className="flex items-center justify-end">
                           <span className="font-medium text-gray-400">Total Supply</span>
                           {sortBy === "supply" && (
                             <span className="ml-1 text-blue-400">{sortOrder === "asc" ? "↑" : "↓"}</span>
                           )}
                         </div>
                       </th>
                       <th 
                         className="text-left py-3 px-4 cursor-pointer hover:bg-gray-700/30 border-b border-gray-700/30"
                         onClick={() => handleSortChange("type")}
                       >
                         <div className="flex items-center">
                           <span className="font-medium text-gray-400">Type</span>
                           {sortBy === "type" && (
                             <span className="ml-1 text-blue-400">{sortOrder === "asc" ? "↑" : "↓"}</span>
                           )}
                         </div>
                       </th>
                       <th 
                         className="text-left py-3 px-4 cursor-pointer hover:bg-gray-700/30 border-b border-gray-700/30"
                         onClick={() => handleSortChange("status")}
                       >
                         <div className="flex items-center">
                           <span className="font-medium text-gray-400">Status</span>
                           {sortBy === "status" && (
                             <span className="ml-1 text-blue-400">{sortOrder === "asc" ? "↑" : "↓"}</span>
                           )}
                         </div>
                       </th>
                       <th className="text-center py-3 px-4 border-b border-gray-700/30 font-medium text-gray-400">Your Holdings</th>
                       <th className="text-center py-3 px-4 border-b border-gray-700/30 font-medium text-gray-400">Action</th>
                     </tr>
                   </thead>
                  <tbody>
                    {filteredTokens.map((token) => {
                      const userHolding = userHoldings.find(h => h.info.address === token.info.address)
                      const userBalance = userHolding ? parseFloat(userHolding.balance) : 0
                      
                      return (
                        <tr 
                          key={token.info.address}
                          className="border-b border-gray-700/20 last:border-b-0 hover:bg-gray-700/20 transition-colors cursor-pointer"
                          onClick={() => handleTokenSelect(token)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="font-medium text-white">{token.name}</div>
                              <div className="text-xs text-gray-400 ml-2">{token.symbol}</div>
                              {token.isActive && (
                                <Badge className="ml-2 bg-green-500/20 text-green-400 border-transparent text-xs">
                                  Live
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 font-medium text-white">
                            ${formatPrice(token.currentPrice)}
                          </td>
                          <td className="text-right py-3 px-4 text-gray-400">
                            {formatMarketCap(token.totalSupply, token.currentPrice)}
                          </td>
                          <td className="text-right py-3 px-4 text-gray-400">
                            {parseFloat(token.totalSupply).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={`${token.assetType === 'STOCK' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'} border-transparent`}
                            >
                              {token.assetType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={`${token.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-transparent`}
                            >
                              {token.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            {userBalance > 0 ? (
                              <div>
                                <div className="text-sm text-green-400 font-medium">
                                  {userBalance.toFixed(2)} {token.symbol}
                                </div>
                                <div className="text-xs text-gray-400">
                                  ${(userBalance * parseFloat(token.currentPrice)).toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">No holdings</span>
                            )}
                          </td>
                          <td className="text-center py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                              disabled={!token.isActive}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTokenSelect(token);
                              }}
                            >
                              {token.isActive ? 'Trade' : 'Unavailable'}
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}


        </div>
      </div>
    )

}

export default function TradePage() {
  return (
    <ProtectedRoute>
      <TradePageContent />
    </ProtectedRoute>
  )
} 