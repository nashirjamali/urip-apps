"use client"

import { useState, useEffect } from 'react'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Newspaper, 
  ExternalLink, 
  Clock, 
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
  sentiment?: 'positive' | 'negative' | 'neutral'
  imageUrl?: string
}

interface StockNewsProps {
  symbol: string
  companyName: string
  className?: string
}

export const StockNews = ({ symbol, companyName, className = "" }: StockNewsProps) => {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to get company name for search
  const getSearchTerm = () => {
    // Extract company name from tokenized names
    if (companyName.includes('Tokenized ')) {
      return companyName.replace('Tokenized ', '')
    }
    // For general financial news
    if (symbol === 'MARKET') {
      return 'financial markets stocks economy'
    }
    return companyName
  }

  // Function to fetch news using real API
  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const searchTerm = getSearchTerm()
      
      // Using Alpha Vantage News API (free tier)
      // You can get a free API key from: https://www.alphavantage.co/support/#api-key
      const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || '9acabacbaf494747948900f3553af9e1'
      
      // Use different endpoints based on symbol
      let url: string
      if (symbol === 'MARKET') {
        // For general financial news, use topics instead of tickers
        url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${API_KEY}&limit=10`
      } else {
        // For specific company news
        url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}&limit=10`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data['Error Message']) {
        throw new Error(data['Error Message'])
      }
      
      if (data['Note']) {
        // API limit reached, fallback to alternative
        throw new Error('API limit reached')
      }
      
      const newsData = data.feed || []
      
      if (newsData.length === 0) {
        // Fallback to NewsAPI.org if no results
        const newsApiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY || '9acabacbaf494747948900f3553af9e1'
        const fallbackQuery = symbol === 'MARKET' ? 'financial markets stocks economy' : `${searchTerm} stock`
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(fallbackQuery)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${newsApiKey}`
        
        const newsResponse = await fetch(newsApiUrl)
        const newsData2 = await newsResponse.json()
        
        if (newsData2.status === 'error') {
          throw new Error(newsData2.message || 'Failed to fetch news')
        }
        
        const articles = newsData2.articles || []
        const formattedNews: NewsArticle[] = articles.map((article: any) => ({
          title: article.title,
          description: article.description || article.content || '',
          url: article.url,
          publishedAt: article.publishedAt,
          source: { name: article.source.name },
          sentiment: 'neutral', // NewsAPI doesn't provide sentiment
          imageUrl: article.urlToImage || null
        }))
        
        setNews(formattedNews)
      } else {
        // Use Alpha Vantage data
        const formattedNews: NewsArticle[] = newsData.map((article: any) => ({
          title: article.title,
          description: article.summary,
          url: article.url,
          publishedAt: article.time_published,
          source: { name: article.source },
          sentiment: article.overall_sentiment_label || 'neutral',
          imageUrl: article.banner_image || null
        }))
        
        setNews(formattedNews)
      }
    } catch (err: any) {
      console.error('Error fetching news:', err)
      
      // If API fails, provide helpful error message
      if (err.message.includes('API limit reached')) {
        setError('News API limit reached. Please try again later or add your API key.')
      } else {
        setError('Failed to load news. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [symbol, companyName])

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'negative':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />
      case 'negative':
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const formatTimeAgo = (publishedAt: string) => {
    const now = new Date()
    const published = new Date(publishedAt)
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  return (
    <Card className={`bg-gray-800/50 border-gray-700/50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Latest News</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNews}
            disabled={loading}
            className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700/30 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700/30 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNews}
              className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No news available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.slice(0, 5).map((article, index) => (
              <div
                key={index}
                className="border border-gray-700/50 rounded-lg p-4 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex gap-4">
                  {/* News Image */}
                  {article.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-20 h-16 object-cover rounded-md bg-gray-700/50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* News Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-white line-clamp-2 flex-1 mr-2">
                        {article.title}
                      </h4>
                      <Badge className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                        {getSentimentIcon(article.sentiment)}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{article.source.name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(article.publishedAt)}
                        </span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(article.url, '_blank')}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-1 h-6"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(getSearchTerm())}+stock+news`, '_blank')}
                className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View More News
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 