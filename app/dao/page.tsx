"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Check,
  X,
  Clock,
  Users,
  TrendingUp,
  Award,
  Star,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Vote,
  BarChart3,
  Calendar,
  UserCheck,
  Shield,
  Target,
  Zap,
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Wallet,
  Home,
  TrendingDown,
  PieChart,
  AreaChart,
  LineChart,
  RefreshCw,
  ChevronDown,
  Activity
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

// Fund Manager Data
const fundManagers = [
  {
    id: 1,
    name: "Quantum Capital",
    ens: "quantum.eth",
    avatar: "/placeholder-user.jpg",
    description: "Leading algorithmic trading firm with 8+ years experience in crypto markets. Specializes in high-frequency trading and arbitrage strategies.",
    performance: {
      totalReturn: 156.7,
      sharpeRatio: 2.8,
      maxDrawdown: -12.3,
      winRate: 78.5,
      totalTrades: 1247,
      avgTradeSize: 25000
    },
    strategies: ["Arbitrage", "Momentum", "Mean Reversion"],
    riskLevel: "Medium",
    minInvestment: 10000,
    maxInvestment: 1000000,
    feeStructure: {
      management: 1.5,
      performance: 20
    },
    trackRecord: "5 years",
    teamSize: 12,
    compliance: "SEC Registered",
    socialProof: {
      followers: 15420,
      reviews: 4.8,
      totalInvestors: 847
    },
    assetAllocation: [
      { symbol: "XAU", name: "Gold", percentage: 20 },
      { symbol: "SPY", name: "S&P 500", percentage: 30 },
      { symbol: "BBRI", name: "Bank BRI", percentage: 25 },
      { symbol: "BTC", name: "Bitcoin", percentage: 15 },
      { symbol: "ETH", name: "Ethereum", percentage: 10 }
    ]
  },
  {
    id: 2,
    name: "Alpha Strategies",
    ens: "alpha.eth",
    avatar: "/placeholder-user.jpg",
    description: "Institutional-grade crypto fund focusing on systematic trading strategies. Proven track record in bear and bull markets.",
    performance: {
      totalReturn: 203.4,
      sharpeRatio: 3.2,
      maxDrawdown: -8.7,
      winRate: 82.1,
      totalTrades: 2156,
      avgTradeSize: 45000
    },
    strategies: ["Systematic", "Trend Following", "Volatility"],
    riskLevel: "High",
    minInvestment: 25000,
    maxInvestment: 5000000,
    feeStructure: {
      management: 2.0,
      performance: 25
    },
    trackRecord: "7 years",
    teamSize: 18,
    compliance: "SEC Registered",
    socialProof: {
      followers: 23450,
      reviews: 4.9,
      totalInvestors: 1234
    },
    assetAllocation: [
      { symbol: "TSLA", name: "Tesla", percentage: 35 },
      { symbol: "NVDA", name: "NVIDIA", percentage: 25 },
      { symbol: "BTC", name: "Bitcoin", percentage: 20 },
      { symbol: "QQQ", name: "NASDAQ", percentage: 15 },
      { symbol: "MSFT", name: "Microsoft", percentage: 5 }
    ]
  },
  {
    id: 3,
    name: "Crypto Dynamics",
    ens: "cryptodynamics.eth",
    avatar: "/placeholder-user.jpg",
    description: "AI-powered trading algorithms with machine learning optimization. Focuses on market microstructure and liquidity analysis.",
    performance: {
      totalReturn: 89.3,
      sharpeRatio: 2.1,
      maxDrawdown: -15.8,
      winRate: 71.2,
      totalTrades: 892,
      avgTradeSize: 18000
    },
    strategies: ["AI/ML", "Liquidity", "Market Making"],
    riskLevel: "Low",
    minInvestment: 5000,
    maxInvestment: 500000,
    feeStructure: {
      management: 1.0,
      performance: 15
    },
    trackRecord: "3 years",
    teamSize: 8,
    compliance: "Pending",
    socialProof: {
      followers: 8760,
      reviews: 4.6,
      totalInvestors: 456
    },
    assetAllocation: [
      { symbol: "USDC", name: "USD Coin", percentage: 40 },
      { symbol: "ETH", name: "Ethereum", percentage: 25 },
      { symbol: "AAPL", name: "Apple", percentage: 20 },
      { symbol: "GOOGL", name: "Google", percentage: 10 },
      { symbol: "BTC", name: "Bitcoin", percentage: 5 }
    ]
  },
  {
    id: 4,
    name: "Blockchain Ventures",
    ens: "blockchainventures.eth",
    avatar: "/placeholder-user.jpg",
    description: "DeFi-native fund manager with deep expertise in yield farming, liquidity provision, and cross-chain arbitrage.",
    performance: {
      totalReturn: 312.8,
      sharpeRatio: 1.9,
      maxDrawdown: -22.4,
      winRate: 65.8,
      totalTrades: 3456,
      avgTradeSize: 12000
    },
    strategies: ["DeFi", "Yield Farming", "Cross-chain"],
    riskLevel: "High",
    minInvestment: 15000,
    maxInvestment: 2000000,
    feeStructure: {
      management: 1.8,
      performance: 22
    },
    trackRecord: "4 years",
    teamSize: 15,
    compliance: "SEC Registered",
    socialProof: {
      followers: 18920,
      reviews: 4.7,
      totalInvestors: 678
    },
    assetAllocation: [
      { symbol: "UNI", name: "Uniswap", percentage: 30 },
      { symbol: "AAVE", name: "Aave", percentage: 25 },
      { symbol: "COMP", name: "Compound", percentage: 20 },
      { symbol: "SUSHI", name: "SushiSwap", percentage: 15 },
      { symbol: "CRV", name: "Curve", percentage: 10 }
    ]
  }
]

// Voting Data
const votingData = {
  proposal: {
    id: "DAO-2024-001",
    title: "Auto Trading Fund Manager Selection",
    description: "Select the preferred fund manager for our automated trading system. This vote will determine which professional trading team will manage our community's pooled funds for the next 12 months.",
    creator: "dao.eth",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    quorum: 1000, // Minimum votes required
    totalSupply: 10000, // Total DAO tokens
    currentVotes: 3247,
    requiredQuorum: 50 // 50% of total supply
  },
  votes: [
    { voter: "0x1234...5678", vote: "Quantum Capital", power: 150, percentage: 1.5 },
    { voter: "alice.eth", vote: "Alpha Strategies", power: 200, percentage: 2.0 },
    { voter: "bob.eth", vote: "Crypto Dynamics", power: 75, percentage: 0.75 },
    { voter: "0xabcd...efgh", vote: "Blockchain Ventures", power: 300, percentage: 3.0 },
    { voter: "crypto.eth", vote: "Quantum Capital", power: 125, percentage: 1.25 },
    { voter: "0x9876...5432", vote: "Alpha Strategies", power: 180, percentage: 1.8 },
    { voter: "investor.eth", vote: "Quantum Capital", power: 220, percentage: 2.2 },
    { voter: "0xdef0...1234", vote: "Crypto Dynamics", power: 90, percentage: 0.9 },
    { voter: "trader.eth", vote: "Blockchain Ventures", power: 160, percentage: 1.6 },
    { voter: "0x5678...9abc", vote: "Alpha Strategies", power: 140, percentage: 1.4 }
  ]
}

// Calculate vote totals
const voteTotals = fundManagers.map(manager => {
  const votes = votingData.votes.filter(v => v.vote === manager.name);
  const totalPower = votes.reduce((sum, v) => sum + v.power, 0);
  const percentage = (totalPower / votingData.proposal.totalSupply) * 100;
  return {
    manager: manager.name,
    votes: votes.length,
    power: totalPower,
    percentage: percentage
  };
});

function DAOPageContent() {
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [userVotingPower, setUserVotingPower] = useState(100);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const { address } = useAccount();
  const router = useRouter();
  // Calculate time remaining
  useEffect(() => {
    const endDate = new Date(votingData.proposal.endDate).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = () => {
    if (selectedManager) {
      // Here you would typically submit the vote to the blockchain
      console.log(`Voting for ${selectedManager} with ${userVotingPower} power`);
      alert(`Vote submitted for ${selectedManager}!`);
    }
  };

  const totalVotes = voteTotals.reduce((sum, v) => sum + v.power, 0);
  const quorumPercentage = (totalVotes / votingData.proposal.totalSupply) * 100;
  const hasQuorum = quorumPercentage >= votingData.proposal.requiredQuorum;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg-primary to-dark-bg-secondary text-dark-text-primary">
      {/* Navigation */}
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Proposal Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-400/50 px-3 py-1">
                  {votingData.proposal.status}
                </Badge>
                <span className="text-sm text-gray-300">#{votingData.proposal.id}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-300">by {votingData.proposal.creator}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">{votingData.proposal.title}</h1>
              <p className="text-gray-200 text-lg leading-relaxed">{votingData.proposal.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-dark-accent-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-dark-accent-blue" />
                  </div>
                  <div className="text-2xl font-bold text-dark-text-primary mb-1">{quorumPercentage.toFixed(1)}%</div>
                  <div className="text-sm text-dark-text-secondary font-medium">Quorum Progress</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-dark-accent-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-dark-accent-blue" />
                  </div>
                  <div className="text-2xl font-bold text-dark-text-primary mb-1">{votingData.votes.length}</div>
                  <div className="text-sm text-dark-text-secondary font-medium">Total Voters</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-dark-accent-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-dark-accent-blue" />
                  </div>
                  <div className="text-2xl font-bold text-dark-text-primary mb-1">{fundManagers.length}</div>
                  <div className="text-sm text-dark-text-secondary font-medium">Candidates</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-dark-accent-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-dark-accent-blue" />
                  </div>
                  <div className="text-2xl font-bold text-dark-text-primary mb-1">{timeRemaining.days}d</div>
                  <div className="text-sm text-dark-text-secondary font-medium">Time Left</div>
                </CardContent>
              </Card>
            </div>

            {/* Current Vote Results */}
            <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-xl overflow-hidden mb-8">
              <CardHeader className="bg-dark-bg-secondary/50 border-b border-dark-border pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3 text-dark-text-primary">
                  <div className="w-8 h-8 bg-dark-accent-blue/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-dark-accent-blue" />
                  </div>
                  Current Votes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {voteTotals.map((vote, index) => (
                    <div key={index} className="group hover:bg-gray-700/50 p-4 rounded-lg transition-all duration-300 border border-gray-700/50">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${index === 0 ? "bg-emerald-400" :
                              index === 1 ? "bg-blue-400" :
                                index === 2 ? "bg-purple-400" :
                                  "bg-amber-400"
                            }`}></div>
                          <span className="font-semibold text-white text-lg">{vote.manager}</span>
                          {index === 0 && (
                            <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400 text-xs px-2 py-1">
                              Leading
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">{vote.percentage.toFixed(1)}%</div>
                          <div className="text-sm text-gray-200">{vote.votes} voters</div>
                        </div>
                      </div>
                      <Progress value={vote.percentage} className="h-3 bg-gray-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fund Manager Candidates */}
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-white">Fund Manager Candidates</h2>
                <p className="text-gray-300">
                  Choose from our carefully vetted professional fund managers to lead our automated trading strategies
                </p>
              </div>

              <div className="space-y-6">
                {fundManagers.map((manager, index) => {
                  const voteData = voteTotals.find(v => v.manager === manager.name);
                  const votePercentage = voteData ? voteData.percentage : 0;
                  const isLeading = index === 0;

                  return (
                    <Card
                      key={manager.id}
                      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl ${selectedManager === manager.name
                          ? 'ring-2 ring-blue-400 bg-blue-500/20 shadow-xl border-blue-400'
                          : 'bg-gray-800 border border-gray-600 hover:bg-gray-750 hover:border-gray-500'
                        }`}
                      onClick={() => setSelectedManager(manager.name)}
                    >
                      <CardContent className="p-6">
                        {/* Manager Header */}
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border-4 border-gray-600 shadow-lg group-hover:border-blue-500 transition-colors duration-300">
                              <AvatarImage src={manager.avatar} />
                              <AvatarFallback className="text-xl bg-gray-700 font-bold text-white">{manager.name.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{manager.name}</h3>
                                {isLeading && (
                                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/50">
                                    <Award className="h-3 w-3 mr-1" />
                                    Leading
                                  </Badge>
                                )}
                                <Badge className={`${manager.riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' :
                                    manager.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' :
                                      'bg-rose-500/20 text-rose-300 border-rose-400/50'
                                  }`}>
                                  {manager.riskLevel} Risk
                                </Badge>
                                <Badge variant="outline" className="border-gray-500 text-gray-300">
                                  {manager.compliance}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1 text-amber-400">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="font-medium">{manager.socialProof.reviews}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-300">{manager.socialProof.totalInvestors} investors</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-300">{manager.trackRecord} experience</span>
                              </div>

                              <p className="text-gray-200 leading-relaxed text-sm">{manager.description}</p>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            {selectedManager === manager.name && (
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                          <div className="text-center p-3 bg-emerald-500/15 rounded-lg border border-emerald-500/30">
                            <div className="text-lg font-bold text-emerald-300 mb-1">
                              +{manager.performance.totalReturn}%
                            </div>
                            <div className="text-xs text-gray-300">Total Return</div>
                          </div>
                          <div className="text-center p-3 bg-blue-500/15 rounded-lg border border-blue-500/30">
                            <div className="text-lg font-bold text-blue-300 mb-1">
                              {manager.performance.sharpeRatio}
                            </div>
                            <div className="text-xs text-gray-300">Sharpe Ratio</div>
                          </div>
                          <div className="text-center p-3 bg-rose-500/15 rounded-lg border border-rose-500/30">
                            <div className="text-lg font-bold text-rose-300 mb-1">
                              {manager.performance.maxDrawdown}%
                            </div>
                            <div className="text-xs text-gray-300">Max Drawdown</div>
                          </div>
                          <div className="text-center p-3 bg-purple-500/15 rounded-lg border border-purple-500/30">
                            <div className="text-lg font-bold text-purple-300 mb-1">
                              {manager.performance.winRate}%
                            </div>
                            <div className="text-xs text-gray-300">Win Rate</div>
                          </div>
                        </div>

                        {/* Asset Allocation */}
                        <div className="mb-4 p-4 bg-gray-700/40 rounded-lg border border-gray-600/50">
                          <div className="flex items-center gap-2 mb-3">
                            <PieChart className="h-4 w-4 text-amber-400" />
                            <h4 className="text-sm font-semibold text-white">Asset Allocation</h4>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                            {manager.assetAllocation.map((asset, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-blue-500" :
                                    idx === 1 ? "bg-emerald-500" :
                                      idx === 2 ? "bg-purple-500" :
                                        idx === 3 ? "bg-amber-500" :
                                          "bg-rose-500"
                                  }`}></div>
                                <span className="text-white font-medium">{asset.symbol}</span>
                                <span className="text-gray-300">{asset.percentage}%</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-gray-600/30 rounded-md p-1 overflow-hidden">
                            <div className="flex h-2 rounded-sm overflow-hidden">
                              {manager.assetAllocation.map((asset, idx) => (
                                <div
                                  key={idx}
                                  className={`${idx === 0 ? "bg-blue-500" :
                                      idx === 1 ? "bg-emerald-500" :
                                        idx === 2 ? "bg-purple-500" :
                                          idx === 3 ? "bg-amber-500" :
                                            "bg-rose-500"
                                    }`}
                                  style={{ width: `${asset.percentage}%` }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Strategies and Fee */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 p-3 bg-gray-700/30 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {manager.strategies.slice(0, 3).map((strategy, idx) => (
                              <Badge key={idx} variant="outline" className="bg-gray-700/50 border-gray-500 text-gray-200 text-xs">
                                <Zap className="h-3 w-3 mr-1 text-amber-400" />
                                {strategy}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-gray-300">
                            Management: {manager.feeStructure.management}% • Performance: {manager.feeStructure.performance}%
                          </div>
                        </div>

                        {/* Vote Progress */}
                        <div className="bg-gray-700/40 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-white">Current Votes</span>
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-400">{votePercentage.toFixed(1)}%</div>
                              <div className="text-xs text-gray-300">{voteData?.votes || 0} voters</div>
                            </div>
                          </div>
                          <Progress value={votePercentage} className="h-2 bg-gray-600" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Recent Voting Activity */}
            <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-xl overflow-hidden">
              <CardHeader className="bg-dark-bg-secondary/50 border-b border-dark-border">
                <CardTitle className="text-xl font-bold flex items-center gap-3 text-dark-text-primary">
                  <div className="w-8 h-8 bg-dark-accent-blue/20 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 text-dark-accent-blue" />
                  </div>
                  Recent Votes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {votingData.votes.slice(0, 8).map((vote, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {vote.voter.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{vote.voter}</div>
                          <div className="text-sm text-gray-200">Voted for <span className="text-blue-200 font-medium">{vote.vote}</span></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-200">{vote.power}</div>
                        <div className="text-xs text-gray-200">voting power</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Voting Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Cast Your Vote */}
              <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-dark-text-primary">Cast Your Vote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedManager ? (
                    <div className="p-4 bg-blue-500/25 border-2 border-blue-400 rounded-lg">
                      <div className="text-center">
                        <CheckCircle className="h-8 w-8 text-blue-200 mx-auto mb-2" />
                        <div className="font-bold mb-1 text-white">Selected:</div>
                        <div className="text-blue-200 font-medium text-lg">{selectedManager}</div>
                        <p className="text-sm text-gray-200 mt-2">
                          Voting with <span className="font-bold text-blue-200">{userVotingPower}</span> power
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-700 border-2 border-gray-600 rounded-lg text-center">
                      <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <div className="font-bold mb-1 text-white">No Selection</div>
                      <p className="text-sm text-gray-200">Select a candidate below</p>
                    </div>
                  )}

                  <Button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50 font-medium"
                    disabled={!selectedManager}
                    onClick={handleVote}
                  >
                    <Vote className="h-4 w-4 mr-2" />
                    {selectedManager ? `Vote for ${selectedManager}` : 'Select a Candidate'}
                  </Button>
                </CardContent>
              </Card>

              {/* Voting Deadline */}
              <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-dark-text-secondary mb-2">Voting ends in</div>
                  <div className="text-2xl font-bold text-dark-text-primary mb-1">
                    {timeRemaining.days}d {timeRemaining.hours}h
                  </div>
                  <div className="text-sm text-dark-text-secondary">
                    {timeRemaining.minutes}m {timeRemaining.seconds}s
                  </div>
                </CardContent>
              </Card>

              {/* Voting Requirements */}
              <Card className="bg-dark-bg-secondary/80 backdrop-blur-lg border border-dark-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-dark-text-primary">Voting Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-200">Quorum</span>
                    <span className="font-bold text-blue-200">{votingData.proposal.requiredQuorum}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-200">Current Progress</span>
                    <span className="font-bold text-white">{quorumPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={quorumPercentage} className="h-3 bg-gray-600" />
                  <div className="text-center">
                    <Badge className={hasQuorum ? "bg-emerald-500/30 text-emerald-200 border-emerald-400" : "bg-amber-500/30 text-amber-200 border-amber-400"}>
                      {hasQuorum ? "✓ Quorum Reached" : "Pending Quorum"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Main DAO page component with authentication protection
export default function DAOPage() {
  return (
    <ProtectedRoute>
      <DAOPageContent />
    </ProtectedRoute>
  );
} 