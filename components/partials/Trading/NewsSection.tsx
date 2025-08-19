"use client";

import type React from "react";
import { Newspaper } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card/Card";
import { StockNews } from "@/components/features/StockNews";

interface NewsSectionProps {
  asset: {
    symbol: string;
    name: string;
  };
  className?: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  asset,
  className,
}) => {
  return (
    <Card variant="elevated" theme="dark" className={className}>
      <CardHeader>
        <CardTitle size="md" className="flex items-center">
          <Newspaper className="w-5 h-5 mr-2" />
          Latest News
        </CardTitle>
      </CardHeader>

      <CardContent>
        <StockNews
          symbol={asset.symbol}
          companyName={asset.name}
          className="bg-transparent border-0 p-0"
        />
      </CardContent>
    </Card>
  );
};
