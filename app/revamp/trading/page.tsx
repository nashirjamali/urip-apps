"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PrimaryLayout } from "@/components/revamp/layout/PrimaryLayout";
import { Header } from "@/components/revamp/layout/Header";
import { Footer } from "@/components/revamp/layout/Footer";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { TrendingUp, Search, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";

// Mock trading data dengan berbagai jenis aset
const mockTradingAssets = [
  // Cryptocurrencies
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: "$1.906.551.118",
    priceNumber: 1906551118,
    change24h: -0.80,
    change7d: 1.00,
    change1m: -0.41,
    change1y: 110.43,
    marketCap: "$37.964 Trilliun",
    marketCapNumber: 37964000000000,
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    color: "bg-orange-500",
    category: "Cryptocurrency",
    type: "CRYPTO"
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: "$72.345.660",
    priceNumber: 72345660,
    change24h: -3.81,
    change7d: 10.05,
    change1m: 42.38,
    change1y: 78.79,
    marketCap: "$8.737 Trilliun",
    marketCapNumber: 8737000000000,
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    color: "bg-blue-500",
    category: "Cryptocurrency",
    type: "CRYPTO"
  },
  // Tokenized Stocks
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
    type: "STOCK"
  },
  {
    id: 4,
    name: "Microsoft Corp",
    symbol: "tMSFT",
    price: "$6.789.012",
    priceNumber: 6789012,
    change24h: 1.25,
    change7d: 3.45,
    change1m: 8.90,
    change1y: 189.34,
    marketCap: "$45.678 Trilliun",
    marketCapNumber: 45678000000000,
    icon: "https://logo.clearbit.com/microsoft.com",
    color: "bg-blue-600",
    category: "Technology Stock",
    type: "STOCK"
  },
  {
    id: 5,
    name: "Tesla Inc.",
    symbol: "tTSLA",
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
    type: "STOCK"
  },
  // Commodities
  {
    id: 6,
    name: "Gold",
    symbol: "tXAU",
    price: "$2.567.890",
    priceNumber: 2567890,
    change24h: 0.65,
    change7d: -0.45,
    change1m: 3.21,
    change1y: 12.45,
    marketCap: "$15.789 Trilliun",
    marketCapNumber: 15789000000000,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Gold_nugget_%28placer_gold%29_2_%28151426426%29.jpg/256px-Gold_nugget_%28placer_gold%29_2_%28151426426%29.jpg",
    color: "bg-yellow-500",
    category: "Precious Metal",
    type: "COMMODITY"
  },
  {
    id: 7,
    name: "Silver",
    symbol: "tXAG",
    price: "$456.789",
    priceNumber: 456789,
    change24h: -1.23,
    change7d: 2.34,
    change1m: -0.87,
    change1y: 8.92,
    marketCap: "$3.456 Trilliun",
    marketCapNumber: 3456000000000,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Silver_crystal.jpg/256px-Silver_crystal.jpg",
    color: "bg-gray-400",
    category: "Precious Metal",
    type: "COMMODITY"
  },
  {
    id: 8,
    name: "Brent Oil",
    symbol: "tBREN",
    price: "$1.234.567",
    priceNumber: 1234567,
    change24h: 3.45,
    change7d: -2.10,
    change1m: 12.34,
    change1y: 45.67,
    marketCap: "$8.901 Trilliun",
    marketCapNumber: 8901000000000,
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Crude_oil_burning.jpg/256px-Crude_oil_burning.jpg",
    color: "bg-black",
    category: "Energy",
    type: "COMMODITY"
  },
  // More Crypto
  {
    id: 9,
    name: "Solana",
    symbol: "SOL",
    price: "$2.345.678",
    priceNumber: 2345678,
    change24h: 5.67,
    change7d: -3.21,
    change1m: 18.90,
    change1y: 156.78,
    marketCap: "$12.345 Trilliun",
    marketCapNumber: 12345000000000,
    icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
    color: "bg-purple-600",
    category: "Cryptocurrency",
    type: "CRYPTO"
  },
  {
    id: 10,
    name: "Cardano",
    symbol: "ADA",
    price: "$12.345",
    priceNumber: 12345,
    change24h: -1.56,
    change7d: 3.45,
    change1m: -2.34,
    change1y: 89.12,
    marketCap: "$567 Trilliun",
    marketCapNumber: 567000000000,
    icon: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    color: "bg-blue-400",
    category: "Cryptocurrency",
    type: "CRYPTO"
  }
];

const categories = [
  { name: "Cryptocurrency", icon: "🪙" },
  { name: "Technology Stock", icon: "�" },
  { name: "Automotive Stock", icon: "🚗" },
  { name: "Precious Metal", icon: "🥇" },
  { name: "Energy", icon: "⛽" },
  { name: "Healthcare Stock", icon: "🏥" },
  { name: "Finance Stock", icon: "🏦" }
];

type SortField = 'name' | 'price' | 'change24h' | 'change7d' | 'change1m' | 'change1y' | 'marketCap';
type SortDirection = 'asc' | 'desc';

const PriceChange: React.FC<{ value: number; showIcon?: boolean }> = ({ value, showIcon = true }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <div className={`flex items-center ${
      isNeutral ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600'
    }`}>
      {showIcon && !isNeutral && (
        <span className="mr-1">
          {isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </span>
      )}
      <span className="font-medium">
        {isPositive ? '+' : ''}{value.toFixed(2)}%
      </span>
    </div>
  );
};

const TradingPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Handle asset click - navigate to detail page
  const handleAssetClick = (symbol: string) => {
    // Remove 't' prefix if exists for clean URL
    const cleanSymbol = symbol.startsWith('t') ? symbol.substring(1) : symbol;
    router.push(`/revamp/trading/${cleanSymbol}`);
  };

  // Filter and sort logic
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = mockTradingAssets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        asset =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(asset => asset.category === selectedCategory);
    }

    // Sort assets
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'name':
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'price':
          aValue = a.priceNumber;
          bValue = b.priceNumber;
          break;
        case 'change24h':
          aValue = a.change24h;
          bValue = b.change24h;
          break;
        case 'change7d':
          aValue = a.change7d;
          bValue = b.change7d;
          break;
        case 'change1m':
          aValue = a.change1m;
          bValue = b.change1m;
          break;
        case 'change1y':
          aValue = a.change1y;
          bValue = b.change1y;
          break;
        case 'marketCap':
          aValue = a.marketCapNumber;
          bValue = b.marketCapNumber;
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortField, sortDirection]);

  // Top movers (based on 24h change)
  const topMovers = useMemo(() => {
    return [...mockTradingAssets]
      .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
      .slice(0, 6);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3 h-3 ml-1 text-[#F77A0E]" />
      : <ChevronDown className="w-3 h-3 ml-1 text-[#F77A0E]" />;
  };
  return (
    <PrimaryLayout theme="dark">
      <Header theme="dark" />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Trading Hub - All Assets</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-300">Trade crypto, stocks, commodities, and tokenized assets</p>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets on URIP"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E] w-64 transition-all duration-200 text-white placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Top Movers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            🔥 Top Movers (24 Hours)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topMovers.map((asset) => (
              <div 
                key={asset.id}
                className="cursor-pointer hover:scale-105 transition-all duration-200 group"
                onClick={() => handleAssetClick(asset.symbol)}
              >
                <GlassCard 
                  theme="dark" 
                  variant="default" 
                  className="p-4 text-center group-hover:bg-[#F77A0E]/10 group-hover:border group-hover:border-[#F77A0E]/50 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden bg-white/10 group-hover:bg-[#F77A0E]/20 group-hover:scale-110 transition-all duration-200">
                    <img 
                      src={asset.icon} 
                      alt={asset.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.textContent = asset.symbol.charAt(0);
                        (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                      }}
                    />
                    <span className="hidden text-white font-bold text-sm"></span>
                  </div>
                  <h3 className="font-semibold text-white text-sm group-hover:text-[#F77A0E] transition-colors duration-200">{asset.symbol}</h3>
                  <p className="text-xs text-gray-400 mb-2 group-hover:text-gray-300 transition-colors duration-200">{asset.price.split(' ')[1]}</p>
                  <PriceChange value={asset.change24h} showIcon={false} />
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === "All"
                  ? 'bg-[#F77A0E] text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
              }`}
            >
              <span className="mr-2">🌟</span>
              All Assets
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-[#F77A0E] text-white shadow-lg transform scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20 hover:scale-102'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
          {selectedCategory !== "All" && (
            <div className="mt-2 text-sm text-gray-400">
              Showing {filteredAndSortedAssets.length} assets in "{selectedCategory}" category
            </div>
          )}
        </div>

        {/* Trading Table */}
        {/* <GlassCard theme="dark" variant="default" className="overflow-hidden"> */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      ASSET
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center justify-end">
                      PRICE
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
                    onClick={() => handleSort('change24h')}
                  >
                    <div className="flex items-center justify-end">
                      24H
                      {getSortIcon('change24h')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
                    onClick={() => handleSort('change7d')}
                  >
                    <div className="flex items-center justify-end">
                      7D
                      {getSortIcon('change7d')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
                    onClick={() => handleSort('change1m')}
                  >
                    <div className="flex items-center justify-end">
                      1M
                      {getSortIcon('change1m')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
                    onClick={() => handleSort('change1y')}
                  >
                    <div className="flex items-center justify-end">
                      1Y
                      {getSortIcon('change1y')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
                    onClick={() => handleSort('marketCap')}
                  >
                    <div className="flex items-center justify-end">
                      MARKET CAP
                      {getSortIcon('marketCap')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/10">
                {filteredAndSortedAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                        <p className="text-lg font-medium">No assets found</p>
                        <p className="text-sm">Try changing your search keywords or category filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedAssets.map((asset) => (
                    <tr 
                      key={asset.id} 
                      className="hover:bg-[#F77A0E]/10 hover:border-l-4 hover:border-l-[#F77A0E] transition-all duration-200 cursor-pointer group"
                      onClick={() => handleAssetClick(asset.symbol)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 overflow-hidden bg-white/10 group-hover:bg-[#F77A0E]/20 group-hover:scale-110 transition-all duration-200">
                            <img 
                              src={asset.icon} 
                              alt={asset.name}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling!.textContent = asset.symbol.charAt(0);
                                (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                              }}
                            />
                            <span className="hidden text-white font-bold text-sm"></span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-[#F77A0E] transition-colors duration-200">{asset.name}</div>
                            <div className="text-sm text-gray-400">{asset.symbol} • {asset.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-white group-hover:text-[#F77A0E] transition-colors duration-200">
                        {asset.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <PriceChange value={asset.change24h} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <PriceChange value={asset.change7d} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <PriceChange value={asset.change1m} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <PriceChange value={asset.change1y} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                        {asset.marketCap}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ActionButton 
                          variant="primary" 
                          size="sm" 
                          theme="dark"
                          className="group-hover:bg-[#F77A0E] group-hover:border-[#F77A0E] group-hover:scale-105 transition-all duration-200"
                          onClick={() => {
                            const cleanSymbol = asset.symbol.startsWith('t') ? asset.symbol.substring(1) : asset.symbol;
                            router.push(`/revamp/trading/${cleanSymbol}`);
                          }}
                        >
                          Trade
                        </ActionButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        {/* </GlassCard> */}
      </div>
      
      <Footer theme="dark" />
    </PrimaryLayout>
  );
};

export default TradingPage;
