"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioDataPoint {
  date: string;
  value: number;
  change?: number;
}

interface PortfolioChartProps {
  data: PortfolioDataPoint[];
  height?: number;
  className?: string;
}

function PortfolioChart({ data, height = 300, className = "" }: PortfolioChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [isPositive, setIsPositive] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<PortfolioDataPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Filter data based on timeframe
  const getFilteredData = useCallback(() => {
    if (!data.length) return data;
    
    const now = new Date();
    const filteredData: PortfolioDataPoint[] = [];
    
    switch (timeframe) {
      case '1W':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData.push(...data.filter(point => new Date(point.date) >= oneWeekAgo));
        break;
      case '1M':
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData.push(...data.filter(point => new Date(point.date) >= oneMonthAgo));
        break;
      case '3M':
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filteredData.push(...data.filter(point => new Date(point.date) >= threeMonthsAgo));
        break;
      case '1Y':
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredData.push(...data.filter(point => new Date(point.date) >= oneYearAgo));
        break;
      case 'ALL':
      default:
        filteredData.push(...data);
        break;
    }
    
    return filteredData.length > 0 ? filteredData : data;
  }, [data, timeframe]);

  const filteredData = getFilteredData();

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMousePosition({ x, y });

    // Find the closest data point
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = height - padding * 2;

    if (filteredData.length > 1) {
      const pointIndex = Math.round(((x - padding) / chartWidth) * (filteredData.length - 1));
      const clampedIndex = Math.max(0, Math.min(filteredData.length - 1, pointIndex));
      
      if (clampedIndex >= 0 && clampedIndex < filteredData.length) {
        setHoveredPoint(filteredData[clampedIndex]);
      } else {
        setHoveredPoint(null);
      }
    }
  }, [filteredData, height]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || filteredData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find min and max values
    const values = filteredData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    // Calculate if overall trend is positive
    const firstValue = filteredData[0]?.value || 0;
    const lastValue = filteredData[filteredData.length - 1]?.value || 0;
    setIsPositive(lastValue >= firstValue);

    // Draw grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = padding + (chartWidth / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Draw line chart
    if (filteredData.length > 1) {
      ctx.strokeStyle = isPositive ? '#10B981' : '#EF4444';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      filteredData.forEach((point, index) => {
        const x = padding + (chartWidth / (filteredData.length - 1)) * index;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw area under the line
      ctx.fillStyle = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      ctx.beginPath();
      ctx.moveTo(padding, padding + chartHeight);
      
      filteredData.forEach((point, index) => {
        const x = padding + (chartWidth / (filteredData.length - 1)) * index;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        ctx.lineTo(x, y);
      });
      
      ctx.lineTo(padding + chartWidth, padding + chartHeight);
      ctx.closePath();
      ctx.fill();

      // Draw data points
      ctx.fillStyle = isPositive ? '#10B981' : '#EF4444';
      filteredData.forEach((point, index) => {
        const x = padding + (chartWidth / (filteredData.length - 1)) * index;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        // Highlight hovered point
        if (hoveredPoint && hoveredPoint.date === point.date) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = isPositive ? '#10B981' : '#EF4444';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // Draw hover tooltip
      if (hoveredPoint) {
        const pointIndex = filteredData.findIndex(p => p.date === hoveredPoint.date);
        if (pointIndex !== -1) {
          const x = padding + (chartWidth / (filteredData.length - 1)) * pointIndex;
          const y = padding + chartHeight - ((hoveredPoint.value - minValue) / valueRange) * chartHeight;

          // Draw tooltip background
          const tooltipText = `$${hoveredPoint.value.toLocaleString()}`;
          const tooltipDate = new Date(hoveredPoint.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          });
          
          ctx.font = '12px Inter, sans-serif';
          const textMetrics = ctx.measureText(tooltipText);
          const dateMetrics = ctx.measureText(tooltipDate);
          const tooltipWidth = Math.max(textMetrics.width, dateMetrics.width) + 20;
          const tooltipHeight = 60;
          const tooltipX = Math.min(x + 10, rect.width - tooltipWidth - 10);
          const tooltipY = Math.max(y - tooltipHeight - 10, 10);

          // Tooltip background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

          // Tooltip border
          ctx.strokeStyle = isPositive ? '#10B981' : '#EF4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

          // Tooltip text
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.fillText(tooltipText, tooltipX + tooltipWidth / 2, tooltipY + 20);
          ctx.fillText(tooltipDate, tooltipX + tooltipWidth / 2, tooltipY + 40);

          // Draw connecting line
          ctx.strokeStyle = isPositive ? '#10B981' : '#EF4444';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(tooltipX + tooltipWidth / 2, tooltipY + tooltipHeight);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Draw labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';

    // Y-axis labels
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i;
      const value = maxValue - (valueRange / gridLines) * i;
      ctx.fillText(`$${(value / 1000).toFixed(0)}K`, padding - 10, y + 4);
    }

    // X-axis labels (dates)
    ctx.textAlign = 'center';
    const labelInterval = Math.max(1, Math.floor(filteredData.length / 5));
    for (let i = 0; i < filteredData.length; i += labelInterval) {
      const x = padding + (chartWidth / (filteredData.length - 1)) * i;
      const date = new Date(filteredData[i].date);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.fillText(label, x, height - 10);
    }

  }, [filteredData, height, timeframe, hoveredPoint]);

  // Calculate performance metrics based on filtered data
  const firstValue = filteredData[0]?.value || 0;
  const lastValue = filteredData[filteredData.length - 1]?.value || 0;
  const totalChange = lastValue - firstValue;
  const totalChangePercent = firstValue > 0 ? (totalChange / firstValue) * 100 : 0;

  return (
    <Card className={`bg-gray-800/50 border-gray-700/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Portfolio Performance</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Change</div>
              <div className={`flex items-center text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
              </div>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1W">1W</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
                <SelectItem value="3M">3M</SelectItem>
                <SelectItem value="1Y">1Y</SelectItem>
                <SelectItem value="ALL">ALL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full cursor-pointer"
            style={{ height: `${height}px` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          {filteredData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PortfolioChart; 