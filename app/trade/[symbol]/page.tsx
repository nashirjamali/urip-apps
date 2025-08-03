"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  LineChart,
  Coins,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react"
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAccount } from "wagmi"
import { useAssetTokens, AssetTokenData, useAssetToken } from '@/hooks/useAssetTokens'
import { usePurchaseManager } from '@/hooks/usePurchaseManager'
import { parseUnits } from 'viem'
import { StockNews } from '@/components/features/StockNews'
import { StockDetails } from '@/components/features/StockDetails'
import dynamic from 'next/dynamic'

// Import TradingView widget dynamically to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('../../../components/TradingViewWidget'),
  { ssr: false }
)

function TokenDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedToken, setSelectedToken] = useState<AssetTokenData | null>(null)
  const [buyAmount, setBuyAmount] = useState("")
  const [buyQuantity, setBuyQuantity] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  
  // Unwrap params promise
  const { symbol } = use(params)
  
  const { address } = useAccount()

  // Purchase manager hook
  const {
    usdtBalance,
    usdtAllowance,
    hasEnoughBalance,
    hasEnoughAllowance,
    calculateAssetTokens,
    isTransactionPending,
    isConfirmed,
    error: purchaseError,
    approveUSDT,
    purchaseAssetToken,
    refreshAll,
    handleTransactionComplete
  } = usePurchaseManager()

  // Smart contract data
  const {
    assetTokens,
    userHoldings,
    isLoading: assetsLoading,
    refetch
  } = useAssetTokens()

  // Fetch specific token data from smart contract
  const { 
    token: fetchedToken, 
    isLoading: tokenLoading, 
    isError: tokenError, 
    errorMessage: tokenErrorMessage,
    refetch: refetchToken 
  } = useAssetToken(symbol)

  // Update selected token with fresh data from smart contract
  useEffect(() => {
    if (fetchedToken) {
      setSelectedToken(fetchedToken)
    } else if (assetTokens.length > 0) {
      const token = assetTokens.find(t => t.symbol.toLowerCase() === symbol.toLowerCase())
      if (token) {
        setSelectedToken(token)
      }
    }
  }, [fetchedToken, assetTokens, symbol])

  const handleBackToOverview = () => {
    router.push('/trade')
  }

  // Handle buy amount change
  const handleBuyAmountChange = (value: string) => {
    setBuyAmount(value)
    if (selectedToken && value) {
      const quantity = calculateAssetTokens(value, selectedToken.currentPrice)
      setBuyQuantity(quantity)
    } else {
      setBuyQuantity("")
    }
  }

  // Handle buy quantity change
  const handleBuyQuantityChange = (value: string) => {
    setBuyQuantity(value)
    if (selectedToken && value) {
      const amount = (parseFloat(value) * parseFloat(selectedToken.currentPrice)).toFixed(2)
      setBuyAmount(amount)
    } else {
      setBuyAmount("")
    }
  }

  // Handle buy transaction
  const handleBuy = async () => {
    if (!selectedToken || !buyAmount || !address) return
    
    setIsProcessing(true)
    setAlertMessage(null) // Clear any previous alerts
    
    try {
      // Check if we need to approve first
      if (!hasEnoughAllowance(buyAmount)) {
        setAlertMessage({ type: 'success', message: 'Approving USDT allowance...' })
        await approveUSDT(buyAmount)
        setAlertMessage({ type: 'success', message: 'USDT approved! Processing purchase...' })
      }
      
      // Purchase the asset token
      await purchaseAssetToken(selectedToken.info.address, buyAmount)
      
      // Reset form
      setBuyAmount("")
      setBuyQuantity("")
      
    } catch (error: any) {
      console.error('Purchase error:', error)
      setAlertMessage({ 
        type: 'error', 
        message: error.message || 'Failed to purchase tokens. Please try again.' 
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle transaction completion
  useEffect(() => {
    if (isConfirmed) {
      handleTransactionComplete()
      // Refresh asset data
      refetch()
      // Show success message
      setAlertMessage({ 
        type: 'success', 
        message: `Successfully purchased ${buyQuantity} ${selectedToken?.symbol} tokens!` 
      })
    }
  }, [isConfirmed, handleTransactionComplete, refetch, buyQuantity, selectedToken?.symbol])

  // Handle transaction pending state
  useEffect(() => {
    if (isTransactionPending && !alertMessage) {
      setAlertMessage({ 
        type: 'success', 
        message: 'Transaction pending... Please wait for confirmation.' 
      })
    }
  }, [isTransactionPending, alertMessage])

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

  // Function to get TradingView symbol
  const getTradingViewSymbol = () => {
    if (!selectedToken) return 'NASDAQ:AAPL' // Default fallback
    
    // Check if token has TradingView symbol in info
    if (selectedToken.info.tradingViewSymbol) {
      return selectedToken.info.tradingViewSymbol
    }
    
    // Extract symbol and map to TradingView format
    const cleanSymbol = selectedToken.symbol.startsWith('t') 
      ? selectedToken.symbol.substring(1) 
      : selectedToken.symbol
    
    // Map common symbols to their exchange
    const symbolMap: { [key: string]: string } = {
      'MSFT': 'NASDAQ:MSFT',
      'AAPL': 'NASDAQ:AAPL',
      'GOOG': 'NASDAQ:GOOGL',
      'BTC': 'BINANCE:BTCUSD',
      'XAU': 'FOREX:XAUUSD',
      'XAG': 'FOREX:XAGUSD',
      'BREN': 'OANDA:UKOIL',
      'D05': 'SGX:D05',
      'DELTA': 'NYSE:DAL',
      'MAYBANK': 'KLSE:MAYBANK'
    }
    
    return symbolMap[cleanSymbol] || `NASDAQ:${cleanSymbol}`
  }

  // Loading State
  if (tokenLoading || assetsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-xl font-medium text-gray-300 mb-2">Loading Token Data</h2>
              <p className="text-gray-400 text-sm">Fetching latest information from smart contract...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (tokenError || !selectedToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToOverview}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Markets
          </Button>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-red-400 font-medium">Token Not Found</h3>
                <p className="text-red-300 text-sm mt-1">
                  {tokenErrorMessage || `Token with symbol "${symbol}" was not found.`}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetchToken}
                  className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button and Token Info */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToOverview}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Markets
          </Button>
          
          {/* Token Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${
                selectedToken.assetType === 'STOCK' ? 'bg-blue-500' : 
                selectedToken.assetType === 'CRYPTO' ? 'bg-amber-500' : 'bg-green-500'
              } flex items-center justify-center text-white font-bold text-xl`}>
                {selectedToken.symbol.substring(0, 2)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{selectedToken.name}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-gray-400">{selectedToken.symbol}</p>
                  <Badge variant="secondary">{selectedToken.assetType}</Badge>
                  <Badge 
                    className={selectedToken.isActive 
                      ? "bg-green-500/20 text-green-400 border-transparent" 
                      : "bg-red-500/20 text-red-400 border-transparent"
                    }
                  >
                    {selectedToken.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {fetchedToken && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-transparent">
                      Live Data
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                ${formatPrice(selectedToken.currentPrice)}
              </p>
              <p className="text-sm text-gray-400">
                Market Cap: {formatMarketCap(selectedToken.totalSupply, selectedToken.currentPrice)}
              </p>
              {fetchedToken && (
                <p className="text-xs text-blue-400 mt-1">
                  Updated from smart contract
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart and Market Data */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-400" />
                  Price Chart - {getTradingViewSymbol()}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 rounded-lg overflow-hidden">
                  <TradingViewWidget
                    symbol={getTradingViewSymbol()}
                    theme="dark"
                    autosize={true}
                    height="100%"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">Market Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Current Price</p>
                    <p className="text-lg font-bold text-white">
                      ${formatPrice(selectedToken.currentPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Supply</p>
                    <p className="text-lg font-bold text-white">
                      {parseFloat(selectedToken.totalSupply).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Market Cap</p>
                    <p className="text-lg font-bold text-white">
                      {formatMarketCap(selectedToken.totalSupply, selectedToken.currentPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="text-lg font-bold text-white">
                      {new Date(selectedToken.lastUpdate * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stock Details Section */}
            <StockDetails 
              symbol={selectedToken.symbol} 
              companyName={selectedToken.name}
            />
            
            {/* Stock News Section */}
            <StockNews 
              symbol={selectedToken.symbol} 
              companyName={selectedToken.name}
            />
          </div>
          
          {/* Trading Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">Trade {selectedToken.symbol}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
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
                    {/* Alert Messages */}
                    {alertMessage && (
                      <Alert className={`border-2 ${
                        alertMessage.type === 'success' 
                          ? 'border-green-500/20 bg-green-500/10' 
                          : 'border-red-500/20 bg-red-500/10'
                      }`}>
                        <div className="flex items-center gap-2">
                          {alertMessage.type === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                          <AlertDescription className={`${
                            alertMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {alertMessage.message}
                          </AlertDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0"
                          onClick={() => setAlertMessage(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Alert>
                    )}

                    {/* USDT Balance and Allowance Info */}
                    <div className="bg-gray-700/30 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">USDT Balance:</span>
                        <span className="text-white font-medium">${usdtBalance}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Allowance:</span>
                        <span className="text-white font-medium">${usdtAllowance}</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="buy-amount" className="text-gray-400 text-sm">Amount (USDT)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="buy-amount"
                          type="number"
                          placeholder="0.00"
                          value={buyAmount}
                          onChange={(e) => handleBuyAmountChange(e.target.value)}
                          className="pl-10 bg-gray-700/50 border-gray-600 text-white"
                        />
                      </div>
                      {buyAmount && !hasEnoughBalance(buyAmount) && (
                        <p className="text-red-400 text-xs mt-1">Insufficient USDT balance</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="buy-quantity" className="text-gray-400 text-sm">
                        Quantity ({selectedToken.symbol})
                      </Label>
                      <Input
                        id="buy-quantity"
                        type="number"
                        placeholder="0.00"
                        value={buyQuantity}
                        onChange={(e) => handleBuyQuantityChange(e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>


                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleBuy}
                      disabled={!buyAmount || !hasEnoughBalance(buyAmount) || isTransactionPending || isProcessing}
                    >
                      {isTransactionPending || isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowDown className="h-4 w-4 mr-2" />
                          Buy {selectedToken.symbol}
                        </>
                      )}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="sell" className="space-y-4">
                    <div>
                      <Label htmlFor="sell-quantity" className="text-gray-400 text-sm">
                        Quantity ({selectedToken.symbol})
                      </Label>
                      <Input
                        id="sell-quantity"
                        type="number"
                        placeholder="0.00"
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sell-amount" className="text-gray-400 text-sm">Amount (USD)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="sell-amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-10 bg-gray-700/50 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Sell {selectedToken.symbol}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Your Holdings */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const userHolding = userHoldings.find(h => h.info.address === selectedToken.info.address)
                  const userBalance = userHolding ? parseFloat(userHolding.balance) : 0
                  
                  if (userBalance > 0) {
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Balance</span>
                          <span className="text-white font-medium">
                            {userBalance.toFixed(4)} {selectedToken.symbol}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Value</span>
                          <span className="text-white font-medium">
                            ${(userBalance * parseFloat(selectedToken.currentPrice)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Avg. Price</span>
                          <span className="text-white font-medium">
                            ${formatPrice(selectedToken.currentPrice)}
                          </span>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div className="text-center py-4">
                        <Coins className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No holdings yet</p>
                        <p className="text-gray-500 text-xs">Start trading to build your position</p>
                      </div>
                    )
                  }
                })()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TokenDetailPageWrapper({ params }: { params: Promise<{ symbol: string }> }) {
  return (
    <ProtectedRoute>
      <TokenDetailPage params={params} />
    </ProtectedRoute>
  )
} 