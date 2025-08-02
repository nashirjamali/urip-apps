import type React from "react";
import Aurora from "@/components/ui/Aurora/Aurora";
import { Badge } from "@/components/ui/badge";
import BlurText from "@/components/ui/BlurText/BlurText";
import { Button } from "@/components/ui/button";
import CountUp from "@/components/ui/CountUp/CountUp";
import { Marquee } from "@/components/magicui/marquee";
import { TrendingUp, Shield, Zap } from "lucide-react";
import { ShinyButton } from "@/components/ui/ShinyButton/ShinyButton";

interface Token {
  name: string;
  symbol: string;
  address: string;
  logo: string;
  sector: string;
}

const supportedTokens: Token[] = [
  {
    name: "Microsoft Corp.",
    symbol: "tMSFT",
    address: "0x7a346368cb82bca986e16d91fa1846f3e2f2f081",
    logo: "https://logo.clearbit.com/microsoft.com",
    sector: "Technology",
  },
  {
    name: "Apple Inc.",
    symbol: "tAAPL",
    address: "0xdf1a0e84ad813a178cdcf6fdfec1876f78bb471d",
    logo: "https://logo.clearbit.com/apple.com",
    sector: "Technology",
  },
  {
    name: "Alphabet Inc.",
    symbol: "tGOOG",
    address: "0x067556d409d112376a5c68cde223fdae3a4bd62b",
    logo: "https://logo.clearbit.com/google.com",
    sector: "Technology",
  },
  {
    name: "DBS Group Holdings Ltd",
    symbol: "tD05",
    address: "0x2ba5a6aa9fd6cf52b30ccb2fddefd505b34f0eb9",
    logo: "https://companieslogo.com/img/orig/D05.SI-edfcd000.png?t=1720244491",
    sector: "Financial Services",
  },
  {
    name: "Barito Renewables Energy",
    symbol: "tBREN",
    address: "0x751d67bcbfa63acc27e6a6514fbeb27365d3dd38",
    logo: "https://www.barito-pacific.com/fe/assets/icons/favicon_barito1.png",
    sector: "Energy",
  },
  {
    name: "Delta Electronics Thailand PCL",
    symbol: "tDELTA",
    address: "0x616a76c281f2f805499ae46a6c7c3a6a3a62cdc0",
    logo: "https://www.deltathailand.com/imgadmins/news/news_cover/DELTA_news_photo2019-02-27_15-17-12.jpg",
    sector: "Electronics",
  },
  {
    name: "Maybank",
    symbol: "tMAYBANK",
    address: "0x04d1edf5252c35d3c1f7e6a5f934b6ab12f66220",
    logo: "https://w7.pngwing.com/pngs/280/197/png-transparent-maybank-finance-money-permodalan-nasional-berhad-interior-design-logo-saving-food-text.png",
    sector: "Banking",
  },
  {
    name: "Gold",
    symbol: "tXAU",
    address: "0xf80567a323c99c99086d0d6884d7b03aff5c8903",
    logo: "https://cdn-icons-png.flaticon.com/512/2583/2583963.png",
    sector: "Precious Metals",
  },
  {
    name: "Silver",
    symbol: "tXAG",
    address: "0xa2f75a99ea1133f72673ddbbbe01a0080e5c6e52",
    logo: "https://cdn-icons-png.flaticon.com/512/2583/2583967.png",
    sector: "Precious Metals",
  },
  {
    name: "Bitcoin",
    symbol: "tBTC",
    address: "0x8049cd4055b32e810efad90e998bbe82a58d5ab9",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968260.png",
    sector: "Cryptocurrency",
  },
];

const TokenCard = ({ token }: { token: Token }) => (
  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[220px] border border-white/20 hover:bg-white/20 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
      <img
        src={token.logo || "/placeholder.svg"}
        alt={token.name}
        className="w-8 h-8 object-contain"
      />
    </div>
    <div className="flex flex-col">
      <span className="text-white font-semibold text-sm">{token.symbol}</span>
      <span className="text-white/70 text-xs">{token.sector}</span>
      <span className="text-white/50 text-xs font-mono">
        {token.address.slice(0, 6)}...{token.address.slice(-4)}
      </span>
    </div>
  </div>
);

const EnhancedSpotlightCard = ({
  children,
  icon: Icon,
  className = "",
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  className?: string;
}) => (
  <div
    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#F77A0E]/20 ${className}`}
  >
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#F77A0E]/10 via-transparent to-[#FF94B4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Spotlight effect */}
    <div className="absolute -inset-px bg-gradient-to-r from-[#F77A0E] via-[#FF94B4] to-[#FF3232] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    <div className="absolute inset-0 bg-black rounded-2xl" />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center space-y-4">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F77A0E] to-[#FF94B4] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
      {children}
    </div>

    {/* Floating particles effect */}
    <div className="absolute top-4 right-4 w-2 h-2 bg-[#F77A0E] rounded-full opacity-60 group-hover:animate-pulse" />
    <div
      className="absolute bottom-6 left-6 w-1 h-1 bg-[#FF94B4] rounded-full opacity-40 group-hover:animate-pulse"
      style={{ animationDelay: "0.5s" }}
    />
  </div>
);

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute w-screen h-screen">
        <Aurora colorStops={["#F77A0E", "#FF94B4", "#FF3232"]} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 pt-28">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              <Badge className="bg-white/10 text-white border border-white/20 px-6 py-2 backdrop-blur-sm">
                Leading DeFi Platform for Traditional Assets
              </Badge>
              <div className="space-y-8">
                <BlurText
                  text="Democratizing Global Investment with Blockchain"
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white"
                />
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl leading-relaxed">
                  URIP bridges traditional finance and DeFi, providing easy,
                  transparent, and cost-effective global investment access to
                  everyone.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <ShinyButton className="bg-white">
                  <p className="text-black">Start Investing</p>
                </ShinyButton>
                <ShinyButton className="bg-black">
                  <p className="text-white">Learn More</p>
                </ShinyButton>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Tokens Marquee Section */}
        <section className="w-full py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Live Tokenized Assets
              </h3>
              <p className="text-white/70">
                Trade real-world assets on the blockchain with full transparency
              </p>
            </div>

            {/* Marquee Container */}
            <div className="relative">
              {/* First Row - Left to Right */}
              <Marquee className="[--duration:40s] py-4" pauseOnHover>
                {supportedTokens.slice(0, 5).map((token, index) => (
                  <TokenCard key={`row1-${index}`} token={token} />
                ))}
              </Marquee>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-8">
              <p className="text-white/60 text-sm">
                All tokens are backed 1:1 by real assets held in secure custody
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <EnhancedSpotlightCard icon={TrendingUp}>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#F77A0E] to-[#FF94B4] bg-clip-text text-transparent">
                  $<CountUp from={0} to={100} />
                  M+
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  Target Total Value Locked
                </div>
              </EnhancedSpotlightCard>

              <EnhancedSpotlightCard icon={Shield}>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#F77A0E] to-[#FF94B4] bg-clip-text text-transparent">
                  <CountUp from={0} to={10} />
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  Supported Traditional Assets
                </div>
              </EnhancedSpotlightCard>

              <EnhancedSpotlightCard icon={Zap}>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#F77A0E] to-[#FF94B4] bg-clip-text text-transparent">
                  <CountUp from={0} to={100} />
                  K+
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  Target Active Users
                </div>
              </EnhancedSpotlightCard>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
