"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/ui/Layout";
import { LoadingState } from "@/components/ui/States/LoadingState";
import { ErrorState } from "@/components/ui/States/ErrorState";
import { EmptyState } from "@/components/ui/States/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { LineChartWidget } from "@/components/partials/Trading/LineChartWidget";
import { TradePanel } from "@/components/partials/Trading/TradePanel";
import { AssetInfo } from "@/components/partials/Trading/AssetInfo";
import { NewsSection } from "@/components/partials/Trading/NewsSection";
import { MarketStats } from "@/components/partials/Trading/MarketStats";
import { PerformanceSummary } from "@/components/partials/Trading/PerformanceSummary";

const mockTradingAssets = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: "$1.906.551.118",
    priceNumber: 1906551118,
    change24h: -0.8,
    change7d: 1.0,
    change1m: -0.41,
    change1y: 110.43,
    marketCap: "$37.964 Trilliun",
    marketCapNumber: 37964000000000,
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    color: "bg-orange-500",
    category: "Cryptocurrency",
    type: "CRYPTO",
    description:
      "Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.",
    volume24h: "$25.123 Trilliun",
    high24h: "$1.950.000.000",
    low24h: "$1.880.000.000",
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: "$123.456.789",
    priceNumber: 123456789,
    change24h: 3.21,
    change7d: -2.45,
    change1m: 12.34,
    change1y: 345.67,
    marketCap: "$14.567 Trilliun",
    marketCapNumber: 14567000000000,
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    color: "bg-blue-600",
    category: "Cryptocurrency",
    type: "CRYPTO",
    description:
      "Ethereum is a decentralized platform that runs smart contracts and enables decentralized applications.",
    volume24h: "$8.945 Trilliun",
    high24h: "$130.000.000",
    low24h: "$120.000.000",
  },
  {
    id: 3,
    name: "Apple Inc.",
    symbol: "tAAPL",
    price: "$3.456.789",
    priceNumber: 3456789,
    change24h: 2.45,
    change7d: -1.23,
    change1m: 15.67,
    change1y: 234.56,
    marketCap: "$52.123 Trilliun",
    marketCapNumber: 52123000000000,
    icon: "https://logo.clearbit.com/apple.com",
    color: "bg-gray-800",
    category: "Technology Stock",
    type: "STOCK",
    description:
      "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
    volume24h: "$1.234 Trilliun",
    high24h: "$3.500.000",
    low24h: "$3.400.000",
    sector: "Technology",
    industry: "Consumer Electronics",
    country: "United States",
    exchange: "NASDAQ",
    website: "https://www.apple.com",
    employees: "164,000",
    founded: "1976",
    ceo: "Tim Cook",
  },
  {
    id: 4,
    name: "Microsoft Corp",
    symbol: "MSFT",
    price: "$6.789.012",
    priceNumber: 6789012,
    change24h: 1.25,
    change7d: 3.45,
    change1m: 8.9,
    change1y: 189.34,
    marketCap: "$45.678 Trilliun",
    marketCapNumber: 45678000000000,
    icon: "https://logo.clearbit.com/microsoft.com",
    color: "bg-blue-600",
    category: "Technology Stock",
    type: "STOCK",
    description:
      "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.",
    volume24h: "$987 Billion",
    high24h: "$7.000.000",
    low24h: "$6.500.000",
    sector: "Technology",
    industry: "Software",
    country: "United States",
    exchange: "NASDAQ",
    website: "https://www.microsoft.com",
    employees: "221,000",
    founded: "1975",
    ceo: "Satya Nadella",
  },
  {
    id: 5,
    name: "Tesla Inc.",
    symbol: "TSLA",
    price: "$4.123.456",
    priceNumber: 4123456,
    change24h: -2.15,
    change7d: 8.76,
    change1m: -5.43,
    change1y: 67.23,
    marketCap: "$23.456 Trilliun",
    marketCapNumber: 23456000000000,
    icon: "https://logo.clearbit.com/tesla.com",
    color: "bg-red-600",
    category: "Automotive Stock",
    type: "STOCK",
    description:
      "Tesla, Inc. is an American electric vehicle and clean energy company based in Austin, Texas.",
    volume24h: "$2.345 Trilliun",
    high24h: "$4.200.000",
    low24h: "$4.000.000",
    sector: "Automotive",
    industry: "Electric Vehicles",
    country: "United States",
    exchange: "NASDAQ",
    website: "https://www.tesla.com",
    employees: "127,855",
    founded: "2003",
    ceo: "Elon Musk",
  },
];

const AssetDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<any>(null);

  useEffect(() => {
    // Simulate API loading
    const loadAsset = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find asset data
        const foundAsset = mockTradingAssets.find(
          (a) =>
            a.symbol.toLowerCase() === symbol?.toLowerCase()
        );

        if (!foundAsset) {
          setError("Asset not found");
        } else {
          setAsset(foundAsset);
        }
      } catch (err) {
        setError("Failed to load asset data");
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      loadAsset();
    }
  }, [symbol]);

  const handleBackClick = () => {
    router.push("/trading");
  };

  const handleRefresh = () => {
    // Reload the page data
    window.location.reload();
  };

  // Loading State
  if (isLoading) {
    return (
      <Layout theme="dark">
        <PageHeader
          title="Asset Details"
          subtitle="Loading asset information..."
          showBackButton
          onBackClick={handleBackClick}
          theme="dark"
        />
        <LoadingState
          message="Loading asset details from blockchain..."
          size="lg"
        />
      </Layout>
    );
  }

  // Error State
  if (error) {
    return (
      <Layout theme="dark">
        <PageHeader
          title="Asset Details"
          subtitle="Error loading asset"
          showBackButton
          onBackClick={handleBackClick}
          theme="dark"
        />
        <ErrorState
          type={error === "Asset not found" ? "404" : "generic"}
          title={
            error === "Asset not found"
              ? "Asset Not Found"
              : "Error Loading Asset"
          }
          message={
            error === "Asset not found"
              ? `The asset "${symbol}" could not be found in our database.`
              : "Failed to load asset information. Please try again."
          }
          actions={[
            {
              label: "Back to Markets",
              onClick: handleBackClick,
              variant: "primary",
              icon: <ArrowLeft className="w-4 h-4" />,
            },
            ...(error !== "Asset not found"
              ? [
                  {
                    label: "Try Again",
                    onClick: handleRefresh,
                    variant: "secondary" as const,
                  },
                ]
              : []),
          ]}
          size="lg"
        />
      </Layout>
    );
  }

  // Empty State (fallback)
  if (!asset) {
    return (
      <Layout theme="dark">
        <PageHeader
          title="Asset Details"
          subtitle="No asset data available"
          showBackButton
          onBackClick={handleBackClick}
          theme="dark"
        />
        <EmptyState
          title="No Asset Data"
          description="Unable to load asset information."
          action={{
            label: "Back to Markets",
            onClick: handleBackClick,
            variant: "primary",
          }}
          size="lg"
        />
      </Layout>
    );
  }

  // Success State - Show Asset Details
  return (
    <Layout theme="dark">
      {/* Page Header */}
      <PageHeader
        title={asset.name}
        subtitle={`${asset.symbol} • ${
          asset.type === "STOCK"
            ? "Stock"
            : asset.type === "CRYPTO"
            ? "Crypto"
            : "Commodity"
        }`}
        showBackButton
        onBackClick={handleBackClick}
        theme="dark"
        breadcrumbs={[
          { label: "Trading", onClick: () => router.push("/trading") },
          { label: asset.name },
        ]}
        stats={[
          {
            label: "Current Price",
            value: asset.price,
          },
          {
            label: "24h Change",
            value: `${asset.change24h > 0 ? "+" : ""}${asset.change24h.toFixed(
              2
            )}%`,
          },
          {
            label: "Market Cap",
            value: asset.marketCap,
          },
        ]}
        actions={[
          {
            label: "Refresh",
            onClick: handleRefresh,
            variant: "ghost",
          },
        ]}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Charts and Info */}
        <div className="lg:col-span-3 space-y-6">
          {/* Line Chart */}
          <LineChartWidget asset={asset} />

          {/* Asset Information */}
          <AssetInfo asset={asset} />

          {/* News Section */}
          <NewsSection asset={asset} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Trade Panel */}
          <TradePanel asset={asset} />

          {/* Market Stats */}
          <MarketStats asset={asset} />

          {/* Performance Summary */}
          <PerformanceSummary asset={asset} />
        </div>
      </div>
    </Layout>
  );
};

export default AssetDetails;
