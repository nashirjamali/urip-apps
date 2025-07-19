import React, { useEffect, useRef, memo, useState } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  autosize?: boolean;
  height?: number | string;
  width?: number | string;
  interval?: string;
}

function TradingViewWidget({
  symbol = 'NASDAQ:AAPL',
  theme = 'dark',
  autosize = true,
  height = '100%',
  width = '100%',
  interval = 'D',
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInstanceRef = useRef<any>(null);
  const [containerId] = useState(() => `tradingview_widget_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create and destroy widget on mount/unmount
  useEffect(() => {
    if (!isClient) return;

    // Load TradingView script if it's not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Function to initialize the widget
    const initWidget = () => {
      if (!containerRef.current) return;
      
      // Clean up any previous instance
      if (widgetInstanceRef.current) {
        try {
          widgetInstanceRef.current = null;
        } catch (e) {
          console.error("Error cleaning up widget:", e);
        }
      }

      // Create new widget instance
      try {
        widgetInstanceRef.current = new window.TradingView.widget({
          autosize,
          symbol,
          interval,
          timezone: 'Etc/UTC',
          theme,
          style: '1',
          locale: 'en',
          toolbar_bg: theme === 'dark' ? "#131722" : "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
          hide_side_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: ["RSI@tv-basicstudies"],
          show_popup_button: true,
          withdateranges: true,
        });
      } catch (e) {
        console.error("Error initializing TradingView widget:", e);
      }
    };

    // Initialize widget when TradingView is loaded
    if (window.TradingView) {
      initWidget();
    } else {
      // Wait for script to load
      const checkTradingViewLoaded = setInterval(() => {
        if (window.TradingView) {
          clearInterval(checkTradingViewLoaded);
          initWidget();
        }
      }, 100);
      
      // Clear interval on cleanup
      return () => clearInterval(checkTradingViewLoaded);
    }

    // Cleanup function
    return () => {
      if (widgetInstanceRef.current) {
        try {
          widgetInstanceRef.current = null;
        } catch (e) {
          console.error("Error cleaning up widget:", e);
        }
      }
    };
  }, [symbol, interval, theme, autosize, isClient, containerId]); // Re-create widget when these props change

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

export default memo(TradingViewWidget);

// Add TradingView to the window object type
declare global {
  interface Window {
    TradingView: any;
  }
} 