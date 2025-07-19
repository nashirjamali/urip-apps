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
  Bell
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'

// Import TradingView widget dynamically to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('../../components/TradingViewWidget'),
  { ssr: false }
)

// Add global styles for TradingView
const tradingViewStyles = `
  .tradingview-widget-container {
    height: 100%;
    width: 100%;
  }
  .tradingview-widget-container iframe {
    height: 100% !important;
    width: 100% !important;
  }
`;

// Placeholder data
const assets = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTCUSD",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-amber-500",
    price: 68000,
    change: 2.3,
    volume: "4.2B",
    marketCap: "1.32T"
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETHUSD",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-indigo-500",
    price: 3200,
    change: 1.5,
    volume: "1.8B",
    marketCap: "385B"
  },
  {
    id: 3,
    name: "Solana",
    symbol: "SOLUSD",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-purple-500",
    price: 120,
    change: -0.8,
    volume: "890M",
    marketCap: "52B"
  },
  {
    id: 4,
    name: "Cardano",
    symbol: "ADAUSD",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-blue-500",
    price: 0.45,
    change: 3.2,
    volume: "320M",
    marketCap: "15B"
  },
  {
    id: 5,
    name: "Polkadot",
    symbol: "DOTUSD",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-pink-500",
    price: 6.8,
    change: -1.2,
    volume: "210M",
    marketCap: "8.5B"
  },
  {
    id: 6,
    name: "Avalanche",
    symbol: "AVAXUSD",
    logo: "/placeholder-logo.svg",
    logoColor: "bg-red-500",
    price: 35.2,
    change: 0.9,
    volume: "380M",
    marketCap: "12.8B"
  }
]

// Manager allocation presets
const managerPresets = [
  { name: "Conservative", allocation: [40, 25, 15, 10, 5, 5] },
  { name: "Balanced", allocation: [30, 30, 20, 10, 5, 5] },
  { name: "Aggressive", allocation: [20, 20, 30, 15, 10, 5] },
  { name: "High Risk", allocation: [10, 15, 35, 20, 15, 5] },
  { name: "Custom", allocation: [0, 0, 0, 0, 0, 0] }
]

// Recent trades data
const recentTrades = [
  { id: 1, asset: "Bitcoin", type: "buy", amount: "0.05 BTC", value: "$3,400", status: "completed", time: "2 hours ago" },
  { id: 2, asset: "Ethereum", type: "sell", amount: "1.2 ETH", value: "$3,840", status: "completed", time: "5 hours ago" },
  { id: 3, asset: "Solana", type: "buy", amount: "10 SOL", value: "$1,200", status: "pending", time: "10 min ago" },
  { id: 4, asset: "Bitcoin", type: "buy", amount: "0.02 BTC", value: "$1,360", status: "completed", time: "1 day ago" }
]

export default function TradePage() {
  const [isDark, setIsDark] = useState(true)
  const [selectedAsset, setSelectedAsset] = useState(assets[0])
  const [tradeAmount, setTradeAmount] = useState("1000")
  const [tradeType, setTradeType] = useState("buy")
  const [tradingMode, setTradingMode] = useState("manual") // "manual" or "auto"
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(managerPresets[0])
  const [customAllocation, setCustomAllocation] = useState(managerPresets[0].allocation)
  const [isChangingAsset, setIsChangingAsset] = useState(false)
  const [orderType, setOrderType] = useState("market") // "market" or "limit"
  const [limitPrice, setLimitPrice] = useState("")
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [activeTab, setActiveTab] = useState("chart") // "chart", "orderbook", "trades"
  const [leverage, setLeverage] = useState(1)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false)
  const [priceAlerts, setPriceAlerts] = useState<{id: number, asset: string, price: number, direction: 'above' | 'below', active: boolean}[]>([
    { id: 1, asset: "Bitcoin", price: 70000, direction: 'above', active: true },
    { id: 2, asset: "Ethereum", price: 3000, direction: 'below', active: true }
  ])

  // Handle asset change
  const handleAssetChange = (asset: any) => {
    setIsChangingAsset(true)
    setSelectedAsset(asset)
    setTimeout(() => {
      setIsChangingAsset(false)
    }, 1000)
  }

  // Handle preset change
  const handlePresetChange = (presetName: string) => {
    const preset = managerPresets.find(p => p.name === presetName) || managerPresets[0]
    setSelectedPreset(preset)
    setCustomAllocation([...preset.allocation])
  }

  // Handle allocation slider change
  const handleAllocationChange = (index: number, value: number[]) => {
    const newAllocation = [...customAllocation]
    newAllocation[index] = value[0]
    
    // Ensure total allocation is 100%
    const total = newAllocation.reduce((sum, val) => sum + val, 0)
    if (total > 100) {
      const excess = total - 100
      const otherIndices = Array.from({length: newAllocation.length}, (_, i) => i).filter(i => i !== index)
      
      // Distribute excess proportionally among other allocations
      if (otherIndices.length > 0) {
        const otherTotal = otherIndices.reduce((sum, i) => sum + newAllocation[i], 0)
        if (otherTotal > 0) {
          otherIndices.forEach(i => {
            const proportion = newAllocation[i] / otherTotal
            newAllocation[i] = Math.max(0, newAllocation[i] - excess * proportion)
          })
        }
      }
    }
    
    setCustomAllocation(newAllocation.map(val => Math.round(val)))
    setSelectedPreset(managerPresets[4]) // Set to Custom preset
  }

  // Toggle trading mode
  const handleTradingModeChange = (mode: string) => {
    setTradingMode(mode)
    if (mode === "auto") {
      setAutoTradeEnabled(true)
    } else {
      setAutoTradeEnabled(false)
    }
  }

  // Handle order submission
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowOrderConfirmation(true)
    // In a real app, you would submit the order to your backend here
    // and handle the response accordingly
  }

  // Handle order confirmation
  const handleOrderConfirm = () => {
    // In a real app, you would submit the order to your backend here
    setShowOrderConfirmation(false)
    // Show success message or redirect
  }

  // Add price alert
  const handleAddPriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const price = parseFloat(formData.get('alertPrice') as string);
    const direction = formData.get('alertDirection') as 'above' | 'below';
    
    if (price && !isNaN(price)) {
      setPriceAlerts(prev => [
        ...prev,
        {
          id: Date.now(),
          asset: selectedAsset.name,
          price,
          direction,
          active: true
        }
      ]);
      setShowPriceAlertModal(false);
    }
  }

  // Remove price alert
  const handleRemovePriceAlert = (id: number) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== id));
  }

  // Toggle price alert
  const handleTogglePriceAlert = (id: number) => {
    setPriceAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  }

  // Calculate estimated value
  const calculateEstimatedValue = () => {
    if (tradeType === "buy") {
      return (parseFloat(tradeAmount) / selectedAsset.price).toFixed(8)
    } else {
      return (parseFloat(tradeAmount) * selectedAsset.price).toFixed(2)
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""} bg-gradient-to-br from-dark-bg-primary to-dark-bg-secondary text-dark-text-primary`}>
      {/* TradingView Styles */}
      <style jsx global>{tradingViewStyles}</style>
      
      {/* Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Trade</h1>
            <p className="text-gray-400 text-sm mt-1">Buy, sell, or auto-trade digital assets</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-transparent">
              <Clock className="h-3 w-3 mr-1" /> 24h Volume: $8.2B
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-transparent">
              <TrendingUp className="h-3 w-3 mr-1" /> Market: Bullish
            </Badge>
          </div>
        </div>

        {/* Trading Mode Selection */}
        <div className="mb-6">
          <Tabs defaultValue="manual" className="w-full" onValueChange={handleTradingModeChange}>
            <TabsList className="h-auto items-center justify-center text-muted-foreground grid w-full grid-cols-2 mb-4 max-w-md mx-auto bg-gray-800/50 p-1 rounded-lg" style={{height: '100%'}}>
              <TabsTrigger value="manual" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">
                <div className="flex items-center gap-2 py-1">
                  <ArrowRight className="h-4 w-4" />
                  <div>
                    <div className="font-medium text-sm">Manual Trading</div>
                    <div className="text-xs opacity-80">Buy & Sell directly</div>
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="auto" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">
                <div className="flex items-center gap-2 py-1">
                  <RotateCcw className="h-4 w-4" />
                  <div>
                    <div className="font-medium text-sm">Auto Trading</div>
                    <div className="text-xs opacity-80">Managed allocation</div>
                  </div>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Market Overview - Quick stats */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {assets.slice(0, 4).map(asset => (
              <Card 
                key={asset.id} 
                className={`bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 cursor-pointer transition-all duration-200 ${selectedAsset.id === asset.id ? 'ring-1 ring-blue-500/50' : ''}`}
                onClick={() => handleAssetChange(asset)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${asset.logoColor} flex items-center justify-center text-white font-bold text-sm`}>
                      {asset.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-200">{asset.name}</div>
                      <div className="text-xs text-gray-400">{asset.symbol.replace("USD", "")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">${asset.price.toLocaleString()}</div>
                    <div className={`text-xs ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center justify-end`}>
                      {asset.change >= 0 ? (
                        <>
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                          {asset.change}%
                        </>
                      ) : (
                        <>
                          <ArrowDown className="h-3 w-3 mr-0.5" />
                          {Math.abs(asset.change)}%
                        </>
                      )}
                      {priceAlerts.some(alert => alert.asset === asset.name && alert.active) && (
                        <Bell className="h-3 w-3 ml-1 text-blue-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Section */}
          <Card className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700/50 focus:outline-none">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${selectedAsset.logoColor} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                        {selectedAsset.name.charAt(0)}
                      </div>
                      <span className="font-medium">{selectedAsset.name}</span>
                      <Badge 
                        className={`${selectedAsset.change >= 0 ? "bg-green-700/20 text-green-400" : "bg-red-700/20 text-red-400"} border-transparent`}
                      >
                        {selectedAsset.change >= 0 ? "+" : ""}{selectedAsset.change}%
                      </Badge>
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56 bg-gray-900/95 backdrop-blur-lg border-gray-700 text-gray-200"
                  >
                    {assets.map((asset) => (
                      <DropdownMenuItem 
                        key={asset.id}
                        className={`hover:bg-gray-800 ${asset.id === selectedAsset.id ? 'bg-gray-800/70' : ''}`}
                        onClick={() => handleAssetChange(asset)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className={`w-6 h-6 rounded-full ${asset.logoColor} flex items-center justify-center text-white font-bold text-xs`}>
                            {asset.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-gray-400">${asset.price.toLocaleString()}</div>
                          </div>
                          <Badge 
                            className={`${asset.change >= 0 ? "bg-green-700/20 text-green-400" : "bg-red-700/20 text-red-400"} border-transparent`}
                          >
                            {asset.change >= 0 ? "+" : ""}{Math.abs(asset.change)}%
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Chart Controls */}
              <div className="flex items-center gap-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="bg-gray-700/30 p-1 h-8">
                    <TabsTrigger value="chart" className="text-xs h-6 px-3">Chart</TabsTrigger>
                    <TabsTrigger value="orderbook" className="text-xs h-6 px-3">Orderbook</TabsTrigger>
                    <TabsTrigger value="trades" className="text-xs h-6 px-3">Trades</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chart Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            </div>
              </div>
            
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <div className={`absolute inset-0 bg-gray-900 z-10 flex items-center justify-center transition-opacity duration-300 ${isChangingAsset ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="chart" className="h-full m-0">
              <TradingViewWidget 
                symbol={selectedAsset.symbol}
                theme="dark"
                autosize={true}
                height="100%"
              />
                </TabsContent>
                
                <TabsContent value="orderbook" className="h-full m-0 p-4">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {/* Buy Orders */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-400">Buy Orders</h3>
                      <div className="space-y-1">
                        {Array.from({length: 10}).map((_, i) => {
                          const price = selectedAsset.price * (1 - (i * 0.001));
                          const amount = (Math.random() * 2 + 0.1).toFixed(4);
                          return (
                            <div key={`buy-${i}`} className="flex justify-between text-xs">
                              <span className="text-green-400">${price.toFixed(2)}</span>
                              <span className="text-gray-300">{amount} {selectedAsset.symbol.replace("USD", "")}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Sell Orders */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-400">Sell Orders</h3>
                      <div className="space-y-1">
                        {Array.from({length: 10}).map((_, i) => {
                          const price = selectedAsset.price * (1 + (i * 0.001));
                          const amount = (Math.random() * 2 + 0.1).toFixed(4);
                          return (
                            <div key={`sell-${i}`} className="flex justify-between text-xs">
                              <span className="text-red-400">${price.toFixed(2)}</span>
                              <span className="text-gray-300">{amount} {selectedAsset.symbol.replace("USD", "")}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="trades" className="h-full m-0 p-4 overflow-y-auto">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Trades</h3>
                  <div className="space-y-1">
                    {Array.from({length: 20}).map((_, i) => {
                      const isBuy = Math.random() > 0.5;
                      const price = selectedAsset.price * (1 + (Math.random() * 0.01 - 0.005));
                      const amount = (Math.random() * 2 + 0.1).toFixed(4);
                      const time = `${Math.floor(Math.random() * 60)}s ago`;
                      return (
                        <div key={`trade-${i}`} className="flex justify-between text-xs">
                          <span className={isBuy ? "text-green-400" : "text-red-400"}>${price.toFixed(2)}</span>
                          <span className="text-gray-300">{amount}</span>
                          <span className="text-gray-500">{time}</span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Asset Info */}
            <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-700/50">
              <div>
                <div className="text-xs text-gray-400">Price</div>
                <div className="font-medium">${selectedAsset.price.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">24h Change</div>
                <div className={`font-medium ${selectedAsset.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {selectedAsset.change >= 0 ? "+" : ""}{selectedAsset.change}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">24h Volume</div>
                <div className="font-medium">{selectedAsset.volume}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Market Cap</div>
                <div className="font-medium">{selectedAsset.marketCap}</div>
              </div>
            </div>
            
            {/* Price Alert Button */}
            <div className="px-4 pb-4">
              <Button 
                variant="outline" 
                className="w-full border-dashed border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 group"
                onClick={() => setShowPriceAlertModal(true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:animate-pulse">
                    <Bell className="h-3 w-3 text-blue-400" />
                  </div>
                  <span>Set Price Alert</span>
                </div>
              </Button>
            </div>
          </Card>

          {/* Trading Options */}
          <Card style={{height: '100%'}} className="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-xl border border-gray-700/50 overflow-hidden">
            <CardHeader className="border-b border-gray-700/50 p-4">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                {tradingMode === "manual" ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-blue-400" />
                    </div>
                    Manual Trading
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <RotateCcw className="h-5 w-5 text-purple-400" />
                    </div>
                    Auto Trading
                  </>
                )}
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                {tradingMode === "manual" 
                  ? "Execute trades with precision and control" 
                  : "Let algorithms optimize your portfolio"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {tradingMode === "manual" ? (
                <form onSubmit={handleOrderSubmit}>
                <Tabs defaultValue="buy" className="w-full" onValueChange={(value) => setTradeType(value)}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Sell
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="buy" className="space-y-4">
                    <div className="space-y-4">
                        {/* Order Type */}
                        <div className="flex items-center justify-between">
                          <Label htmlFor="order-type" className="text-gray-400 text-sm">Order Type</Label>
                          <div className="flex items-center space-x-2">
                            <Button 
                              type="button"
                              variant={orderType === "market" ? "secondary" : "outline"} 
                              size="sm"
                              onClick={() => setOrderType("market")}
                              className="h-8 text-xs"
                            >
                              Market
                            </Button>
                            <Button 
                              type="button"
                              variant={orderType === "limit" ? "secondary" : "outline"} 
                              size="sm"
                              onClick={() => setOrderType("limit")}
                              className="h-8 text-xs"
                            >
                              Limit
                            </Button>
                          </div>
                        </div>
                        
                        {/* Amount */}
                      <div>
                          <Label htmlFor="amount" className="text-gray-400 text-sm flex items-center gap-1">
                            Amount (USD)
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Enter the amount in USD you want to spend</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="amount"
                            type="text"
                            value={tradeAmount}
                            onChange={(e) => setTradeAmount(e.target.value)}
                              className="bg-gray-700/50 shadow-sm border border-gray-700/50 rounded-lg pl-10 py-2 focus-visible:ring-1 focus-visible:ring-blue-500 text-white placeholder-gray-400"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                              <button 
                                type="button" 
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-1.5 py-0.5 rounded text-gray-300"
                                onClick={() => setTradeAmount("100")}
                              >
                                $100
                              </button>
                              <button 
                                type="button" 
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-1.5 py-0.5 rounded text-gray-300"
                                onClick={() => setTradeAmount("1000")}
                              >
                                $1K
                              </button>
                            </div>
                        </div>
                      </div>
                      
                        {/* Limit Price (conditional) */}
                        {orderType === "limit" && (
                      <div>
                            <Label htmlFor="limit-price" className="text-gray-400 text-sm">Limit Price</Label>
                            <div className="relative mt-1">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="limit-price"
                                type="text"
                                value={limitPrice || selectedAsset.price}
                                onChange={(e) => setLimitPrice(e.target.value)}
                                className="bg-gray-700/50 shadow-sm border border-gray-700/50 rounded-lg pl-10 py-2 focus-visible:ring-1 focus-visible:ring-blue-500 text-white placeholder-gray-400"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* You will receive */}
                        <div>
                          <Label htmlFor="receive" className="text-gray-400 text-sm">You will receive</Label>
                        <div className="relative mt-1">
                          <Input
                            id="receive"
                            type="text"
                              value={calculateEstimatedValue()}
                            disabled
                              readOnly
                              className="bg-gray-700/50 shadow-sm border border-gray-700/50 rounded-lg pr-16 py-2 text-white"
                          />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {selectedAsset.symbol.replace("USD", "")}
                          </div>
                        </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Estimated value based on current price
                          </div>
                      </div>
                      
                        {/* Advanced Options Toggle */}
                        <div>
                          <button 
                            type="button"
                            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                            className="flex items-center text-sm text-gray-400 hover:text-white"
                          >
                            <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                            Advanced Options
                          </button>
                          
                          {showAdvancedOptions && (
                            <div className="mt-3 space-y-3 pt-3 border-t border-gray-700/50">
                              {/* Leverage */}
                              <div>
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="leverage" className="text-gray-400 text-sm">Leverage</Label>
                                  <span className="text-sm font-medium">{leverage}x</span>
                                </div>
                                <Slider
                                  id="leverage"
                                  min={1}
                                  max={10}
                                  step={1}
                                  value={[leverage]}
                                  onValueChange={(value) => setLeverage(value[0])}
                                  className="mt-2"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>1x</span>
                                  <span>5x</span>
                                  <span>10x</span>
                                </div>
                              </div>
                              
                              {/* Stop Loss */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Switch id="stop-loss" />
                                  <Label htmlFor="stop-loss" className="text-gray-400 text-sm">Set Stop Loss</Label>
                                </div>
                                <Input 
                                  type="text" 
                                  placeholder="Price" 
                                  className="w-24 h-7 text-xs bg-gray-700/50 border-gray-700/50"
                                />
                              </div>
                              
                              {/* Take Profit */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Switch id="take-profit" />
                                  <Label htmlFor="take-profit" className="text-gray-400 text-sm">Set Take Profit</Label>
                                </div>
                                <Input 
                                  type="text" 
                                  placeholder="Price" 
                                  className="w-24 h-7 text-xs bg-gray-700/50 border-gray-700/50"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-12 mt-2 group">
                          <ArrowDown className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                        Buy {selectedAsset.name}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sell" className="space-y-4">
                    <div className="space-y-4">
                        {/* Order Type */}
                        <div className="flex items-center justify-between">
                          <Label htmlFor="order-type" className="text-gray-400 text-sm">Order Type</Label>
                          <div className="flex items-center space-x-2">
                            <Button 
                              type="button"
                              variant={orderType === "market" ? "secondary" : "outline"} 
                              size="sm"
                              onClick={() => setOrderType("market")}
                              className="h-8 text-xs"
                            >
                              Market
                            </Button>
                            <Button 
                              type="button"
                              variant={orderType === "limit" ? "secondary" : "outline"} 
                              size="sm"
                              onClick={() => setOrderType("limit")}
                              className="h-8 text-xs"
                            >
                              Limit
                            </Button>
                          </div>
                        </div>
                        
                        {/* Amount */}
                      <div>
                          <Label htmlFor="sell-amount" className="text-gray-400 text-sm flex items-center gap-1">
                            Amount ({selectedAsset.symbol.replace("USD", "")})
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Enter the amount of {selectedAsset.symbol.replace("USD", "")} you want to sell</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                        <div className="relative mt-1">
                          <Input
                            id="sell-amount"
                            type="text"
                              defaultValue="0.5"
                              className="bg-gray-700/50 shadow-sm border border-gray-700/50 rounded-lg pr-16 py-2 focus-visible:ring-1 focus-visible:ring-blue-500 text-white placeholder-gray-400"
                          />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {selectedAsset.symbol.replace("USD", "")}
                          </div>
                        </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Available: 2.5 {selectedAsset.symbol.replace("USD", "")}</span>
                            <button className="text-blue-400 hover:text-blue-300">Max</button>
                          </div>
                      </div>
                      
                        {/* Limit Price (conditional) */}
                        {orderType === "limit" && (
                      <div>
                            <Label htmlFor="limit-price" className="text-gray-400 text-sm">Limit Price</Label>
                        <div className="relative mt-1">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="limit-price"
                                type="text"
                                value={limitPrice || selectedAsset.price}
                                onChange={(e) => setLimitPrice(e.target.value)}
                                className="bg-gray-700/50 shadow-sm border border-gray-700/50 rounded-lg pl-10 py-2 focus-visible:ring-1 focus-visible:ring-blue-500 text-white placeholder-gray-400"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* You will receive */}
                        <div>
                          <Label htmlFor="receive-usd" className="text-gray-400 text-sm">You will receive</Label>
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="receive-usd"
                            type="text"
                              value={formatCurrency(0.5 * selectedAsset.price)}
                            disabled
                              readOnly
                              className="bg-gray-700/50 shadow-sm border border-gray-700/50 rounded-lg pl-10 py-2 text-white"
                          />
                        </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Estimated value based on current price
                          </div>
                      </div>
                      
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white h-12 mt-2 group">
                          <ArrowUp className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                        Sell {selectedAsset.name}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="manager" className="text-gray-400 text-sm flex items-center gap-1">
                      Allocation Strategy
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Choose a preset strategy or customize your own</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select 
                      onValueChange={handlePresetChange} 
                      defaultValue={selectedPreset.name}
                    >
                      <SelectTrigger className="bg-gray-700/50 border-gray-700/50 mt-1">
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-gray-700 text-gray-200">
                        {managerPresets.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name} className="focus:bg-gray-800">
                            <div className="flex items-center gap-2">
                              {preset.name === "Conservative" && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                              {preset.name === "Balanced" && <div className="w-2 h-2 rounded-full bg-green-400" />}
                              {preset.name === "Aggressive" && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                              {preset.name === "High Risk" && <div className="w-2 h-2 rounded-full bg-red-400" />}
                              {preset.name === "Custom" && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                            {preset.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      <div 
                        className={`text-center p-2 rounded cursor-pointer text-xs ${selectedPreset.name === "Conservative" ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-gray-700/30 hover:bg-gray-700/50'}`}
                        onClick={() => handlePresetChange("Conservative")}
                      >
                        Conservative
                      </div>
                      <div 
                        className={`text-center p-2 rounded cursor-pointer text-xs ${selectedPreset.name === "Balanced" ? 'bg-green-500/20 border border-green-500/40' : 'bg-gray-700/30 hover:bg-gray-700/50'}`}
                        onClick={() => handlePresetChange("Balanced")}
                      >
                        Balanced
                      </div>
                      <div 
                        className={`text-center p-2 rounded cursor-pointer text-xs ${selectedPreset.name === "Aggressive" ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-gray-700/30 hover:bg-gray-700/50'}`}
                        onClick={() => handlePresetChange("Aggressive")}
                      >
                        Aggressive
                      </div>
                      <div 
                        className={`text-center p-2 rounded cursor-pointer text-xs ${selectedPreset.name === "High Risk" ? 'bg-red-500/20 border border-red-500/40' : 'bg-gray-700/30 hover:bg-gray-700/50'}`}
                        onClick={() => handlePresetChange("High Risk")}
                      >
                        High Risk
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Asset Allocation</h3>
                      <span className="text-xs text-gray-400">Total: 100%</span>
                    </div>
                    
                    {assets.map((asset, index) => (
                      <div key={asset.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${asset.logoColor}`}></div>
                            <span className="text-sm">{asset.name}</span>
                          </div>
                          <span className="text-sm font-medium">{customAllocation[index]}%</span>
                        </div>
                        <div className="relative">
                        <Slider
                          value={[customAllocation[index]]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleAllocationChange(index, value)}
                          className="py-1"
                        />
                          <div 
                            className={`absolute top-1/2 left-0 h-2 -translate-y-1/2 rounded-l ${asset.logoColor}`} 
                            style={{ width: `${customAllocation[index]}%`, opacity: 0.3 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 bg-gray-700/30 p-2 rounded-md">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Rebalance frequency</span>
                    </div>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="w-32 h-7 text-xs bg-transparent border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 bg-gray-700/30 p-2 rounded-md">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Initial investment</span>
                    </div>
                    <Input 
                      type="text" 
                      defaultValue="5,000" 
                      className="w-32 h-7 text-xs bg-transparent border-0 text-right" 
                    />
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 group">
                    <RotateCcw className="h-4 w-4 mr-2 group-hover:animate-spin" />
                    Start Auto Trading
                  </Button>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
                    <p className="text-gray-300">
                      <strong>Auto Trading</strong> allows fund managers to automatically allocate your assets based on market conditions and your selected risk profile.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders */}
        <Card className="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-xl border border-gray-700/50 mb-8">
          <CardHeader className="border-b border-gray-700/50 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-800/50 border-gray-700/50">
                  <TableHead className="text-gray-400">Asset</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Value</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrades.map((trade) => (
                  <TableRow key={trade.id} className="hover:bg-gray-800/50 border-gray-700/50">
                    <TableCell className="font-medium">{trade.asset}</TableCell>
                    <TableCell>
                      <Badge 
                        className={trade.type === "buy" 
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-transparent" 
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-transparent"
                        }
                      >
                        {trade.type === "buy" ? "Buy" : "Sell"}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.amount}</TableCell>
                    <TableCell>{trade.value}</TableCell>
                    <TableCell>
                      {trade.status === "completed" ? (
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
                    <TableCell className="text-gray-400">{trade.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Confirmation Dialog */}
        {showOrderConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Confirm {tradeType === "buy" ? "Purchase" : "Sale"}</CardTitle>
                <CardDescription>
                  Please review your order details before confirming
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                  <span className="text-gray-400">Asset</span>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full ${selectedAsset.logoColor} mr-2 flex items-center justify-center text-white font-bold text-xs`}>
                      {selectedAsset.name.charAt(0)}
                    </div>
                    <span className="font-medium">{selectedAsset.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                  <span className="text-gray-400">Type</span>
                  <span className={tradeType === "buy" ? "text-green-400" : "text-red-400"}>
                    {tradeType === "buy" ? "Buy" : "Sell"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                  <span className="text-gray-400">Price</span>
                  <span>${selectedAsset.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                  <span className="text-gray-400">Amount</span>
                  <span>{tradeType === "buy" ? `$${tradeAmount}` : `0.5 ${selectedAsset.symbol.replace("USD", "")}`}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                  <span className="text-gray-400">Total</span>
                  <span className="font-medium">
                    {tradeType === "buy" 
                      ? `${calculateEstimatedValue()} ${selectedAsset.symbol.replace("USD", "")}` 
                      : formatCurrency(0.5 * selectedAsset.price)}
                  </span>
                </div>
                {orderType === "limit" && (
                  <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Limit Price</span>
                    <span>${limitPrice || selectedAsset.price}</span>
                  </div>
                )}
                {leverage > 1 && (
                  <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                    <span className="text-gray-400">Leverage</span>
                    <span>{leverage}x</span>
                  </div>
                )}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-200">
                  <div className="flex">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p>Trading cryptocurrencies involves risk. Only trade with funds you can afford to lose.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowOrderConfirmation(false)}>
                  Cancel
                </Button>
                <Button className={`flex-1 ${tradeType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`} onClick={handleOrderConfirm}>
                  Confirm {tradeType === "buy" ? "Purchase" : "Sale"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Price Alert Modal */}
        {showPriceAlertModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-400" />
                  Price Alerts
                </CardTitle>
                <CardDescription>
                  Get notified when prices reach your target
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Current Alerts */}
                {priceAlerts.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-300">Your Alerts</h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {priceAlerts.map(alert => (
                        <div 
                          key={alert.id} 
                          className={`flex items-center justify-between p-2 rounded-md ${
                            alert.active ? 'bg-gray-700/50' : 'bg-gray-700/20 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={alert.active}
                              onCheckedChange={() => handleTogglePriceAlert(alert.id)}
                            />
                            <div>
                              <div className="text-sm font-medium">{alert.asset}</div>
                              <div className="text-xs text-gray-400">
                                {alert.direction === 'above' ? 'Above' : 'Below'} ${alert.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-gray-400 hover:text-red-400"
                            onClick={() => handleRemovePriceAlert(alert.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Alert Form */}
                <form id="alertForm" onSubmit={handleAddPriceAlert} className="space-y-4 pt-4 border-t border-gray-700/50">
                  <h3 className="text-sm font-medium text-gray-300">Create New Alert</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="asset" className="text-gray-400 text-sm">Asset</Label>
                    <div className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-md">
                      <div className={`w-6 h-6 rounded-full ${selectedAsset.logoColor} flex items-center justify-center text-white font-bold text-xs`}>
                        {selectedAsset.name.charAt(0)}
                      </div>
                      <span className="text-sm">{selectedAsset.name}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="alertPrice" className="text-gray-400 text-sm">Price</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="alertPrice"
                          name="alertPrice"
                          type="text"
                          defaultValue={selectedAsset.price.toString()}
                          className="bg-gray-700/50 shadow-sm border border-gray-700/50 rounded-lg pl-10 py-2 focus-visible:ring-1 focus-visible:ring-blue-500 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="alertDirection" className="text-gray-400 text-sm">Direction</Label>
                      <Select name="alertDirection" defaultValue="above">
                        <SelectTrigger className="bg-gray-700/50 border-gray-700/50 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-gray-700 text-gray-200">
                          <SelectItem value="above" className="focus:bg-gray-800">
                            <div className="flex items-center gap-2">
                              <ArrowUp className="h-3 w-3 text-green-400" />
                              Above
                            </div>
                          </SelectItem>
                          <SelectItem value="below" className="focus:bg-gray-800">
                            <div className="flex items-center gap-2">
                              <ArrowDown className="h-3 w-3 text-red-400" />
                              Below
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-200">
                    <div className="flex">
                      <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p>You'll receive a notification when the price reaches your target.</p>
          </div>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPriceAlertModal(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  form="alertForm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700" 
                  onClick={handleAddPriceAlert}
                >
                  Create Alert
                </Button>
              </CardFooter>
        </Card>
          </div>
        )}
      </main>
    </div>
  )
} 