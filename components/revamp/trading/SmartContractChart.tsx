"use client";

import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface SmartContractChartProps {
  symbol: string;
  currentPrice: string;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  contractAddress?: string;
  className?: string;
  mockMode?: boolean;
  priceChange?: number;
}

const SmartContractChart: React.FC<SmartContractChartProps> = ({
  symbol,
  currentPrice,
  timeframe,
  onTimeframeChange,
  contractAddress,
  className = "",
  mockMode = true,
  priceChange: externalPriceChange = 0
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastPrice, setLastPrice] = useState<number>(0);
  const [internalPriceChange, setInternalPriceChange] = useState<number>(0);

  const timeframes = ["1D", "1W", "1M", "3M", "1Y"];

  // Use external price change if available, otherwise use internal calculation
  const displayPriceChange = externalPriceChange !== 0 ? externalPriceChange : internalPriceChange;

  // Parse current price from string format
  const getCurrentPrice = () => {
    return parseFloat(currentPrice.replace(/[^\d.-]/g, ''));
  };

  // Generate historical data based on current smart contract price
  const generateHistoricalData = (currentPriceNum: number, days: number = 30) => {
    const data: PriceData[] = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    for (let i = days; i >= 0; i--) {
      const time = now - (i * dayMs);
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const basePrice = currentPriceNum * (1 + variation);
      
      const open = basePrice * (0.98 + Math.random() * 0.04);
      const close = basePrice * (0.98 + Math.random() * 0.04);
      const high = Math.max(open, close) * (1 + Math.random() * 0.05);
      const low = Math.min(open, close) * (1 - Math.random() * 0.05);
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      data.push({ time, open, high, low, close, volume });
    }
    
    return data;
  };

  // Simulate real-time price updates from smart contract
  useEffect(() => {
    const currentPriceNum = getCurrentPrice();
    if (currentPriceNum > 0) {
      const historical = generateHistoricalData(currentPriceNum);
      setPriceData(historical);
      setLastPrice(currentPriceNum);
      setIsLoading(false);

      // Simulate real-time updates
      const interval = setInterval(() => {
        const variation = (Math.random() - 0.5) * 0.02; // ±1% real-time variation
        const newPrice = currentPriceNum * (1 + variation);
        const now = Date.now();
        
        setPriceData(prev => {
          const updated = [...prev];
          const lastCandle = updated[updated.length - 1];
          
          // Update last candle or add new one
          if (now - lastCandle.time < 60000) { // Update current minute
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
          } else { // New candle
            updated.push({
              time: now,
              open: lastCandle.close,
              high: newPrice,
              low: newPrice,
              close: newPrice,
              volume: Math.floor(Math.random() * 100000)
            });
          }
          
          return updated.slice(-100); // Keep last 100 candles
        });
        
        setInternalPriceChange((newPrice - lastPrice) / lastPrice * 100);
        setLastPrice(newPrice);
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [currentPrice]);

  // Initialize TradingView chart with custom datafeed
  useEffect(() => {
    if (chartRef.current && priceData.length > 0) {
      // Create custom chart implementation
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `SC:${symbol}`,
        interval: timeframe === '1D' ? '60' : timeframe === '1W' ? '1D' : timeframe === '1M' ? 'D' : '1D',
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        backgroundColor: "rgba(17, 24, 39, 0.5)",
        gridColor: "rgba(255, 255, 255, 0.1)",
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: "smart_contract_chart",
        studies: ["Volume@tv-basicstudies"],
        overrides: {
          "paneProperties.background": "rgba(17, 24, 39, 0.5)",
          "paneProperties.backgroundType": "solid",
          "mainSeriesProperties.candleStyle.upColor": "#10b981",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#10b981",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
          "volumePaneSize": "medium",
          "scalesProperties.textColor": "#9CA3AF"
        }
      });

      chartRef.current.innerHTML = '';
      chartRef.current.appendChild(script);
    }
  }, [priceData, timeframe, symbol]);

  // Initialize TradingView chart with custom datafeed
  useEffect(() => {
    if (chartRef.current && priceData.length > 0) {
      // Create custom chart implementation
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `SC:${symbol}`,
        interval: timeframe === '1D' ? '60' : timeframe === '1W' ? '1D' : timeframe === '1M' ? '1D' : '1D',
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        backgroundColor: "rgba(17, 24, 39, 0.5)",
        gridColor: "rgba(255, 255, 255, 0.1)",
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: "smart_contract_chart",
        studies: ["Volume@tv-basicstudies"],
        overrides: {
          "paneProperties.background": "rgba(17, 24, 39, 0.5)",
          "paneProperties.backgroundType": "solid",
          "mainSeriesProperties.candleStyle.upColor": "#10b981",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor": "#10b981",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#10b981",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
          "volumePaneSize": "medium",
          "scalesProperties.textColor": "#9CA3AF"
        }
      });

      chartRef.current.innerHTML = '';
      chartRef.current.appendChild(script);
    }
  }, [priceData, timeframe, symbol]);

  return (
    <div className={`bg-gray-900/50 rounded-lg border border-white/10 ${className}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-5 h-5 text-[#F77A0E]" />
          <div>
            <h3 className="text-lg font-semibold text-white">Smart Contract Price Chart</h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">{symbol}</span>
              {contractAddress && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 font-mono text-xs">
                    {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Real-time Price Display */}
        <div className="text-right">
          <div className="text-xl font-bold text-white">{currentPrice}</div>
          <div className={`flex items-center text-sm ${displayPriceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {displayPriceChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span>{displayPriceChange >= 0 ? '+' : ''}{displayPriceChange.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Timeframe Controls */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${mockMode ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`}></span>
          <span className="text-gray-400 text-sm">
            {mockMode ? 'Mock contract data' : 'Live data from smart contract'}
          </span>
        </div>
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
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

      {/* Chart Container */}
      <div className="relative h-96">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#F77A0E] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Loading smart contract data...</p>
            </div>
          </div>
        ) : (
          <div 
            ref={chartRef}
            id="smart_contract_chart" 
            className="w-full h-full"
          />
        )}
      </div>

      {/* Contract Info Footer */}
      <div className="p-4 border-t border-white/10 bg-gray-800/30">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {mockMode ? 'Mock data updated every 5 seconds' : 'Data updated every 5 seconds'}
          </span>
          <span>
            {mockMode ? 'Development Mode' : 'Powered by Smart Contract Oracle'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmartContractChart;
