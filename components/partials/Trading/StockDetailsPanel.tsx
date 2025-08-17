"use client";

import type React from "react";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { PriceChange } from "./PriceChange";
import {
  Building2,
  Activity,
  Globe,
  MapPin,
  Users,
  Calendar,
} from "lucide-react";

interface StockDetailsPanelProps {
  asset: {
    name: string;
    symbol: string;
    price: string;
    change24h: number;
    high24h: string;
    low24h: string;
    marketCap: string;
    sector?: string;
    industry?: string;
    category?: string;
    exchange?: string;
    country?: string;
    employees?: string;
    founded?: string;
    ceo?: string;
    website?: string;
  };
  className?: string;
}

export const StockDetailsPanel: React.FC<StockDetailsPanelProps> = ({
  asset,
  className = "",
}) => {
  return (
    <GlassCard theme="dark" variant="default" className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Stock Details</h3>
        <span className="text-[#F77A0E] text-sm">Company Info</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Current Price</span>
            <span className="text-white font-medium">{asset.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Daily Change</span>
            <PriceChange value={asset.change24h} showIcon={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Day High</span>
            <span className="text-green-400 font-medium">{asset.high24h}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Day Low</span>
            <span className="text-red-400 font-medium">{asset.low24h}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Previous Close</span>
            <span className="text-white font-medium">{asset.low24h}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">52 Week High</span>
            <span className="text-green-400 font-medium">{asset.high24h}</span>
          </div>
        </div>

        {/* Company Profile Section */}
        {asset.sector && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-md font-semibold text-white mb-4 flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Company Profile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Building2 className="w-3 h-3 mr-1" />
                  Company Name
                </span>
                <span className="text-white font-medium">{asset.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  Industry
                </span>
                <span className="text-white font-medium">
                  {asset.industry || asset.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  Exchange
                </span>
                <span className="text-white font-medium">
                  {asset.exchange || "NASDAQ"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Country
                </span>
                <span className="text-white font-medium">
                  {asset.country || "United States"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  Market Cap
                </span>
                <span className="text-white font-medium">
                  {asset.marketCap}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Last Updated
                </span>
                <span className="text-white font-medium">8/2/2025</span>
              </div>
              {asset.ceo && (
                <div className="flex justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    CEO
                  </span>
                  <span className="text-white font-medium">{asset.ceo}</span>
                </div>
              )}
              {asset.employees && (
                <div className="flex justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Employees
                  </span>
                  <span className="text-white font-medium">
                    {asset.employees}
                  </span>
                </div>
              )}
              {asset.founded && (
                <div className="flex justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Founded
                  </span>
                  <span className="text-white font-medium">
                    {asset.founded}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
