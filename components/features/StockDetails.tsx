"use client"

import { useState, useEffect } from 'react'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  RefreshCw,
  AlertCircle,
  Clock,
  Users,
  Activity
} from 'lucide-react'

interface StockQuote {
  c: number // Current price
  d: number // Change
  dp: number // Percent change
  h: number // High price of the day
  l: number // Low price of the day
  o: number // Open price of the day
  pc: number // Previous close price
}

interface CompanyProfile {
  country: string
  currency: string
  exchange: string
  ipo: string
  marketCapitalization: number
  name: string
  phone: string
  shareOutstanding: number
  ticker: string
  weburl: string
  logo: string
  finnhubIndustry: string
}

interface StockDetailsProps {
  symbol: string
  companyName: string
  className?: string
}

export const StockDetails = ({ symbol, companyName, className = "" }: StockDetailsProps) => {
  const [quote, setQuote] = useState<StockQuote | null>(null)
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to get clean symbol for API calls
  const getCleanSymbol = () => {
    // Remove 't' prefix from tokenized symbols
    if (symbol.startsWith('t')) {
      return symbol.substring(1)
    }
    return symbol
  }

  // Function to fetch stock data from Finnhub
  const fetchStockData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const cleanSymbol = getCleanSymbol()
      const API_KEY = 'd27gfe9r01qloarivvi0d27gfe9r01qloarivvig'
      
      // Fetch quote data
      const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${cleanSymbol}&token=${API_KEY}`
      const quoteResponse = await fetch(quoteUrl)
      const quoteData = await quoteResponse.json()
      
      // Fetch company profile
      const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${cleanSymbol}&token=${API_KEY}`
      const profileResponse = await fetch(profileUrl)
      const profileData = await profileResponse.json()
      
      if (quoteData.error) {
        throw new Error(quoteData.error)
      }
      
      if (profileData.error) {
        throw new Error(profileData.error)
      }
      
      setQuote(quoteData)
      setProfile(profileData)
      
    } catch (err: any) {
      console.error('Error fetching stock data:', err)
      setError('Failed to load stock details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()
  }, [symbol])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toLocaleString()
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  return (
    <Card className={`bg-gray-800/50 border-gray-700/50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Stock Details</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStockData}
            disabled={loading}
            className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700/50 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700/30 rounded w-3/4 mb-4"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-700/30 rounded w-20 mb-1"></div>
                  <div className="h-6 bg-gray-700/50 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStockData}
              className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </div>
        ) : quote ? (
          <div className="space-y-6">
            {/* Current Price and Change */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">Current Price</h4>
                <Badge className={`${getChangeColor(quote.d)} border-transparent`}>
                  {getChangeIcon(quote.d)}
                  {quote.dp > 0 ? '+' : ''}{quote.dp.toFixed(2)}%
                </Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatCurrency(quote.c)}
              </div>
              <div className={`text-sm ${getChangeColor(quote.d)}`}>
                {quote.d > 0 ? '+' : ''}{formatCurrency(quote.d)} ({quote.dp > 0 ? '+' : ''}{quote.dp.toFixed(2)}%)
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-400">Day High</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {formatCurrency(quote.h)}
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-400">Day Low</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {formatCurrency(quote.l)}
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Open</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {formatCurrency(quote.o)}
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Previous Close</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  {formatCurrency(quote.pc)}
                </div>
              </div>
            </div>

            {/* Company Profile */}
            {profile && (
              <div className="border-t border-gray-700/50 pt-4">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Company Profile
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Company Name</p>
                    <p className="text-white font-medium">{profile.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Industry</p>
                    <p className="text-white font-medium">{profile.finnhubIndustry}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Exchange</p>
                    <p className="text-white font-medium">{profile.exchange}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <p className="text-white font-medium">{profile.country}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Market Cap</p>
                    <p className="text-white font-medium">{formatNumber(profile.marketCapitalization)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Shares Outstanding</p>
                    <p className="text-white font-medium">{formatNumber(profile.shareOutstanding)}</p>
                  </div>
                  
                  {profile.weburl && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-400">Website</p>
                      <a 
                        href={profile.weburl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {profile.weburl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No stock data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 