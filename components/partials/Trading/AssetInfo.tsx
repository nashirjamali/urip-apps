"use client";

import type React from "react";
import { Activity, Building2, Globe, MapPin, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card/Card";

interface AssetInfoProps {
  asset: {
    name: string;
    description: string;
    type: string;
    sector?: string;
    industry?: string;
    exchange?: string;
    country?: string;
    founded?: string;
    employees?: string;
  };
  className?: string;
}

export const AssetInfo: React.FC<AssetInfoProps> = ({ asset, className }) => {
  return (
    <Card variant="elevated" theme="dark" className={className}>
      <CardHeader>
        <CardTitle size="md" className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          About {asset.name}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-300 mb-6">{asset.description}</p>

        {/* Company Details for Stocks */}
        {asset.type === "STOCK" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {asset.sector && (
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Building2 className="w-3 h-3 mr-1" />
                  Sector
                </span>
                <span className="text-white font-medium">{asset.sector}</span>
              </div>
            )}
            {asset.industry && (
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  Industry
                </span>
                <span className="text-white font-medium">{asset.industry}</span>
              </div>
            )}
            {asset.exchange && (
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  Exchange
                </span>
                <span className="text-white font-medium">{asset.exchange}</span>
              </div>
            )}
            {asset.country && (
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Country
                </span>
                <span className="text-white font-medium">{asset.country}</span>
              </div>
            )}
            {asset.founded && (
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Founded
                </span>
                <span className="text-white font-medium">{asset.founded}</span>
              </div>
            )}
            {asset.employees && (
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Building2 className="w-3 h-3 mr-1" />
                  Employees
                </span>
                <span className="text-white font-medium">
                  {asset.employees}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
