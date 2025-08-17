"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { BarChart3 } from "lucide-react";

interface PriceChartWidgetProps {
  asset: {
    symbol: string;
    type: string;
  };
  className?: string;
}

export const PriceChartWidget: React.FC<PriceChartWidgetProps> = ({
  asset,
  className = "",
}) => {
  const [timeframe, setTimeframe] = useState("1D");
  const [chartReady, setChartReady] = useState(false);

  const timeframes = ["1D", "1W", "1M", "3M", "1Y"];

  // TradingView Widget Effect
  useEffect(() => {
    if (asset && !chartReady) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol:
          asset.type === "CRYPTO"
            ? `BINANCE:${asset.symbol}USDT`
            : `NASDAQ:${asset.symbol.replace("t", "")}`,
        interval:
          timeframe === "1D"
            ? "D"
            : timeframe === "1W"
            ? "W"
            : timeframe === "1M"
            ? "M"
            : "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1a1a1a",
        enable_publishing: false,
        backgroundColor: "rgba(0, 0, 0, 0)",
        gridColor: "rgba(255, 255, 255, 0.06)",
        hide_top_toolbar: false,
        hide_legend: true,
        save_image: false,
        container_id: "tradingview_chart",
        studies: ["Volume@tv-basicstudies"],
        overrides: {
          "paneProperties.background": "rgba(0, 0, 0, 0)",
          "paneProperties.backgroundType": "solid",
          "paneProperties.backgroundGradientStartColor": "rgba(0, 0, 0, 0)",
          "paneProperties.backgroundGradientEndColor": "rgba(0, 0, 0, 0)",
          "mainSeriesProperties.candleStyle.upColor": "#00ff88",
          "mainSeriesProperties.candleStyle.downColor": "#ff4757",
          "mainSeriesProperties.candleStyle.borderUpColor": "#00ff88",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ff4757",
          "mainSeriesProperties.candleStyle.wickUpColor": "#00ff88",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ff4757",
          volumePaneSize: "medium",
        },
      });

      const container = document.getElementById("tradingview_chart");
      if (container) {
        container.innerHTML = "";
        container.appendChild(script);
        setChartReady(true);
      }
    }
  }, [asset, timeframe, chartReady]);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    setChartReady(false); // Trigger chart re-render
  };

  return (
    <GlassCard theme="dark" variant="elevated" className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Price Chart - {asset.symbol}
        </h2>
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                timeframe === tf
                  ? "bg-[#F77A0E] text-white"
                  : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="h-96 rounded-lg border border-white/10 overflow-hidden">
        <div
          id="tradingview_chart"
          className="w-full h-full bg-gray-900/50"
        ></div>
      </div>
    </GlassCard>
  );
};
