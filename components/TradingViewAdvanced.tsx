import React, { useEffect, useRef, memo, useState } from 'react';

interface TradingViewAdvancedProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  autosize?: boolean;
  height?: number | string;
  width?: number | string;
  interval?: string;
}

function TradingViewAdvanced({
  symbol = 'NASDAQ:AAPL',
  theme = 'dark',
  autosize = true,
  height = '100%',
  width = '100%',
  interval = 'D',
}: TradingViewAdvancedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInstanceRef = useRef<any>(null);
  const [containerId] = useState(() => `tradingview_advanced_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Create the script element for TradingView library
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        // Use the standard lightweight widget instead of the advanced chart
        // This doesn't require the UDFCompatibleDatafeed
        try {
          widgetInstanceRef.current = new window.TradingView.widget({
            symbol: symbol,
            interval: interval,
            container_id: containerId,
            width: '100%',
            height: '100%',
            autosize: autosize,
            timezone: "Etc/UTC",
            theme: theme,
            style: "1", // Candlestick chart
            locale: "en",
            toolbar_bg: theme === 'dark' ? "#131722" : "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            save_image: false,
            studies: ["RSI@tv-basicstudies"],
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650",
            hide_side_toolbar: false,
            withdateranges: true,
          });
        } catch (error) {
          console.error('Error initializing TradingView widget:', error);
        }
      }
    };

    // Append the script to the document
    document.head.appendChild(script);

    // Clean up
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (widgetInstanceRef.current) {
        widgetInstanceRef.current = null;
      }
    };
  }, [symbol, theme, autosize, interval, isClient, containerId]);

  if (!isClient) {
    return (
      <div 
        ref={containerRef} 
        id={containerId} 
        style={{ height, width }}
        className="tradingview-widget-container bg-gray-800/50 rounded-lg flex items-center justify-center"
      >
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      id={containerId} 
      style={{ height, width }}
      className="tradingview-widget-container"
    />
  );
}

export default memo(TradingViewAdvanced);

// Add TradingView to the window object type
declare global {
  interface Window {
    TradingView: any;
  }
} 