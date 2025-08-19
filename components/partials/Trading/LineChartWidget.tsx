"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";

interface LineChartWidgetProps {
  asset: {
    symbol: string;
    type: string;
  };
  className?: string;
}

export const LineChartWidget: React.FC<LineChartWidgetProps> = ({
  asset,
  className,
}) => {
  const [timeframe, setTimeframe] = useState("1D");
  const [chartReady, setChartReady] = useState(false);

  const timeframes = ["1D", "1W", "1M", "3M", "1Y"];

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
        style: "2", // Line chart style instead of candlestick
        locale: "en",
        toolbar_bg: "#1a1a1a",
        enable_publishing: false,
        backgroundColor: "rgba(0, 0, 0, 0)",
        gridColor: "rgba(255, 255, 255, 0.06)",
        hide_top_toolbar: false,
        hide_legend: true,
        save_image: false,
        container_id: "revamp_tradingview_chart",
        studies: ["Volume@tv-basicstudies"],
        overrides: {
          "paneProperties.background": "rgba(0, 0, 0, 0)",
          "paneProperties.backgroundType": "solid",
          "mainSeriesProperties.lineStyle.color": "#00ff88",
          "mainSeriesProperties.lineStyle.linewidth": 2,
          "mainSeriesProperties.areaStyle.color1": "rgba(0, 255, 136, 0.1)",
          "mainSeriesProperties.areaStyle.color2": "rgba(0, 255, 136, 0.02)",
          volumePaneSize: "medium",
        },
      });

      const container = document.getElementById("revamp_tradingview_chart");
      if (container) {
        container.innerHTML = "";
        container.appendChild(script);
        setChartReady(true);
      }
    }
  }, [asset, timeframe, chartReady]);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    setChartReady(false);
  };

  return (
    <Card variant="elevated" theme="dark" className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle size="md" className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Price Chart - {asset.symbol}
          </CardTitle>
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
      </CardHeader>

      <CardContent>
        <div className="h-96 rounded-lg border border-white/10 overflow-hidden">
          <div
            id="revamp_tradingview_chart"
            className="w-full h-full bg-gray-900/50"
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};
