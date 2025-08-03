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
  const [sortBy, setSortBy] = useState<"name" | "currentPrice" | "marketCap" | "supply" | "type" | "status">("name")
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
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortOrder("asc")
    }
  }

  // Filter and sort assets
  const filteredAndSortedAssets = assetTokens
    ?.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === "all" || asset.assetType === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "currentPrice":
          aValue = parseFloat(a.currentPrice || "0")
          bValue = parseFloat(b.currentPrice || "0")
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

  const formatcurrentPrice = (currentPrice: string) => {
    return parseFloat(currentPrice).toFixed(2)
  }

  const formatMarketCap = (supply: string, currentPrice: string) => {
    const marketCap = parseFloat(supply) * parseFloat(currentPrice)
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`
    return `$${marketCap.toFixed(2)}`
  }

  return (
    // Updated main container with landing page theme - black background with orange accents
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Effects - Similar to landing page with orange accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#F77A0E]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#E6690D]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#FF8C00]/5 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/30 to-black opacity-80"></div>
      </div>
      
      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Trade Markets</h1>
                <p className="text-gray-300">Discover and trade tokenized assets</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                  disabled={assetsLoading}
                  className="border-[#F77A0E]/50 text-[#F77A0E] hover:bg-[#F77A0E]/10 hover:border-[#F77A0E]"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${assetsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Cards - Updated with orange theme */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-900/80 border-[#F77A0E]/20 backdrop-blur-sm hover:border-[#F77A0E]/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Assets</p>
                      <p className="text-2xl font-bold text-white">
                        {assetsLoading ? (
                          <div className="h-8 w-16 bg-gray-800/50 rounded animate-pulse"></div>
                        ) : (
                          assetTokens?.length || 0
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center">
                      <Coins className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-[#F77A0E]/20 backdrop-blur-sm hover:border-[#F77A0E]/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Portfolio Value</p>
                      <p className="text-2xl font-bold text-white">
                        {assetsLoading ? (
                          <div className="h-8 w-20 bg-gray-800/50 rounded animate-pulse"></div>
                        ) : (
                          `$${totalPortfolioValue ? parseFloat(totalPortfolioValue.toString()).toFixed(2) : '0.00'}`
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-[#F77A0E]/20 backdrop-blur-sm hover:border-[#F77A0E]/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Trades</p>
                      <p className="text-2xl font-bold text-white">
                        {transactionsLoading ? (
                          <div className="h-8 w-8 bg-gray-800/50 rounded animate-pulse"></div>
                        ) : (
                          recentTransactions?.length || 0
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-[#F77A0E]/20 backdrop-blur-sm hover:border-[#F77A0E]/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Volume</p>
                      <p className="text-2xl font-bold text-white">$1.2M</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Controls - Updated theme */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-[#F77A0E]/20 text-white placeholder:text-gray-400 focus:border-[#F77A0E]/50"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-40 bg-gray-900/50 border-[#F77A0E]/20 text-white focus:border-[#F77A0E]/50">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-[#F77A0E]/20">
                    <SelectItem value="all" className="text-white hover:bg-[#F77A0E]/10">All Assets</SelectItem>
                    <SelectItem value="stock" className="text-white hover:bg-[#F77A0E]/10">Stocks</SelectItem>
                    <SelectItem value="crypto" className="text-white hover:bg-[#F77A0E]/10">Crypto</SelectItem>
                    <SelectItem value="commodity" className="text-white hover:bg-[#F77A0E]/10">Commodities</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-[#F77A0E]/20 rounded-lg p-1 bg-gray-900/50">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-[#F77A0E] hover:bg-[#E6690D] text-white" : "text-gray-400 hover:text-white hover:bg-[#F77A0E]/10"}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-[#F77A0E] hover:bg-[#E6690D] text-white" : "text-gray-400 hover:text-white hover:bg-[#F77A0E]/10"}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Assets Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assetsLoading ? (
                // Loading skeleton with orange theme
                Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="bg-gray-900/80 border-[#F77A0E]/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-10 w-10 bg-gray-800/50 rounded-lg"></div>
                        <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-800/50 rounded w-1/2"></div>
                        <div className="h-8 bg-[#F77A0E]/20 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredAndSortedAssets?.length === 0 ? (
                <div className="col-span-full">
                  <Card className="bg-gray-900/80 border-[#F77A0E]/20 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="h-12 w-12 text-[#F77A0E] mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No assets found</h3>
                      <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredAndSortedAssets?.map((token) => (
                  <Card 
                    key={token.symbol} 
                    className="group bg-gray-900/80 border-[#F77A0E]/20 backdrop-blur-sm hover:border-[#F77A0E]/50 transition-all duration-300 hover:bg-gray-900 cursor-pointer"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {token.symbol.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white group-hover:text-[#F77A0E] transition-colors">
                              {token.name}
                            </h3>
                            <p className="text-sm text-gray-400">{token.symbol}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs border-[#F77A0E]/30 ${
                            token.isActive 
                              ? 'text-green-400 bg-green-400/10' 
                              : 'text-red-400 bg-red-400/10'
                          }`}
                        >
                          {token.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">currentPrice</span>
                          <span className="text-sm font-medium text-white">
                            ${formatcurrentPrice(token.currentPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Type</span>
                          <Badge variant="secondary" className="text-xs bg-[#F77A0E]/10 text-[#F77A0E] border-[#F77A0E]/20">
                            {token.assetType}
                          </Badge>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-[#F77A0E] to-[#E6690D] hover:from-[#E6690D] hover:to-[#D55C0D] text-white border-none group-hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTokenSelect(token)
                        }}
                      >
                        Trade Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            // List view with updated orange theme
            <div className="bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-xl border border-[#F77A0E]/20 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F77A0E]/5 rounded-bl-full"></div>
              
              {/* Enhanced Table Header */}
              <div className="overflow-x-auto rounded-lg border border-[#F77A0E]/30">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900/50">
                      <th 
                        className="text-left py-3 px-4 cursor-pointer hover:bg-[#F77A0E]/10 border-b border-[#F77A0E]/30 transition-colors"
                        onClick={() => handleSortChange("name")}
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-300">Asset</span>
                          {sortBy === "name" && (
                            <span className="ml-1 text-[#F77A0E]">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-right py-3 px-4 cursor-pointer hover:bg-[#F77A0E]/10 border-b border-[#F77A0E]/30 transition-colors"
                        onClick={() => handleSortChange("currentPrice")}
                      >
                        <div className="flex items-center justify-end">
                          <span className="font-medium text-gray-300">currentPrice (USD)</span>
                          {sortBy === "currentPrice" && (
                            <span className="ml-1 text-[#F77A0E]">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-right py-3 px-4 cursor-pointer hover:bg-[#F77A0E]/10 border-b border-[#F77A0E]/30 transition-colors"
                        onClick={() => handleSortChange("marketCap")}
                      >
                        <div className="flex items-center justify-end">
                          <span className="font-medium text-gray-300">Market Cap</span>
                          {sortBy === "marketCap" && (
                            <span className="ml-1 text-[#F77A0E]">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-300 border-b border-[#F77A0E]/30">Type</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-300 border-b border-[#F77A0E]/30">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-300 border-b border-[#F77A0E]/30">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetsLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-[#F77A0E]/10">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-800/50 rounded-lg animate-pulse"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-800/50 rounded w-24 animate-pulse"></div>
                                <div className="h-3 bg-gray-800/50 rounded w-16 animate-pulse"></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-800/50 rounded w-16 ml-auto animate-pulse"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-800/50 rounded w-20 ml-auto animate-pulse"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-6 bg-gray-800/50 rounded w-16 mx-auto animate-pulse"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-6 bg-gray-800/50 rounded w-16 mx-auto animate-pulse"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-8 bg-gray-800/50 rounded w-20 mx-auto animate-pulse"></div>
                          </td>
                        </tr>
                      ))
                    ) : filteredAndSortedAssets?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <AlertCircle className="h-8 w-8 text-[#F77A0E] mx-auto mb-3" />
                          <p className="text-gray-400">No assets found matching your criteria</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedAssets?.map((token) => (
                        <tr 
                          key={token.symbol} 
                          className="border-b border-[#F77A0E]/10 hover:bg-[#F77A0E]/5 transition-colors cursor-pointer"
                          onClick={() => handleTokenSelect(token)}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {token.symbol.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-white">{token.name}</div>
                                <div className="text-sm text-gray-400">{token.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-medium text-white">
                              ${formatcurrentPrice(token.currentPrice)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge variant="secondary" className="bg-[#F77A0E]/10 text-[#F77A0E] border-[#F77A0E]/20">
                              {token.assetType}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge 
                              variant="outline" 
                              className={`${
                                token.isActive 
                                  ? 'text-green-400 border-green-400/30 bg-green-400/10' 
                                  : 'text-red-400 border-red-400/30 bg-red-400/10'
                              }`}
                            >
                              {token.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Button 
                              size="sm"
                              className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] hover:from-[#E6690D] hover:to-[#D55C0D] text-white border-none"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTokenSelect(token)
                              }}
                            >
                              Trade
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Activity Section - Updated with orange theme */}
          {recentTransactions && recentTransactions.length > 0 && (
            <div className="mt-8">
              <Card className="bg-gray-900/80 border-[#F77A0E]/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Clock className="h-5 w-5 mr-2 text-[#F77A0E]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.slice(0, 5).map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-[#F77A0E]/10 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.type === 1 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {tx.type === 1 ? 'Bought' : 'Sold'}
                            </p>
                            <p className="text-sm text-gray-400">{tx.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${tx.value}</p>
                          <p className={`text-sm ${tx.type === 1 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type === 1 ? '+' : '-'}{tx.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
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