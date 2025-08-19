"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { PrimaryLayout } from "@/components/revamp/layout/PrimaryLayout";
import { Header } from "@/components/revamp/layout/Header";
import { Footer } from "@/components/revamp/layout/Footer";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";
import { Vote, Users, Clock, CheckCircle, XCircle, BarChart3, Filter, Info } from "lucide-react";

// Mock DAO data berdasarkan screenshot
const mockDAOs = [
  {
    id: "1",
    title: "Fund Manager Selection Q3 2025",
    endTime: "2025-08-30 23:59:59",
    percentageAgree: 67,
    percentageAgainst: 33,
    countParticipation: 1247,
    status: "Active",
    description: "Vote for the next fund manager to handle our Q3 portfolio allocation strategy.",
    assetAllocation: [
      { name: "Apple Inc.", symbol: "tAAPL", percentage: 35, icon: "🍎", detail: "Technology sector leader" },
      { name: "Microsoft Corp", symbol: "tMSFT", percentage: 30, icon: "🏢", detail: "Cloud computing giant" },
      { name: "Gold", symbol: "tXAU", percentage: 20, icon: "🥇", detail: "Safe haven asset" },
      { name: "Bitcoin", symbol: "tBTC", percentage: 15, icon: "₿", detail: "Digital gold" }
    ],
    voters: [
      { address: "0x1234...5678", reason: "Strong tech allocation", vote: "Agree" },
      { address: "0x9abc...def0", reason: "Too risky for current market", vote: "Against" },
      { address: "0x5555...9999", reason: "Balanced approach", vote: "Agree" }
    ]
  },
  {
    id: "2",
    title: "ESG Investment Strategy",
    endTime: "2025-08-25 18:00:00",
    percentageAgree: 78,
    percentageAgainst: 22,
    countParticipation: 892,
    status: "Active",
    description: "Proposal to integrate ESG criteria into our investment selection process.",
    assetAllocation: [
      { name: "Tesla Inc.", symbol: "tTSLA", percentage: 40, icon: "🚗", detail: "Clean energy leader" },
      { name: "Solar Energy", symbol: "tSOLAR", percentage: 25, icon: "☀️", detail: "Renewable energy" },
      { name: "Clean Water", symbol: "tH2O", percentage: 20, icon: "💧", detail: "Water sustainability" },
      { name: "Green Bonds", symbol: "tGREEN", percentage: 15, icon: "🌱", detail: "Environmental bonds" }
    ],
    voters: [
      { address: "0xabc1...2345", reason: "Future-focused strategy", vote: "Agree" },
      { address: "0xdef6...7890", reason: "Need more diversification", vote: "Against" }
    ]
  },
  {
    id: "3",
    title: "Q2 2025 Portfolio Rebalancing",
    endTime: "2025-07-15 23:59:59",
    percentageAgree: 85,
    percentageAgainst: 15,
    countParticipation: 2156,
    status: "Executed",
    description: "Successfully executed proposal to rebalance portfolio allocation for Q2 2025.",
    assetAllocation: [
      { name: "Nvidia Corp", symbol: "tNVDA", percentage: 40, icon: "🔥", detail: "AI technology leader" },
      { name: "Amazon", symbol: "tAMZN", percentage: 25, icon: "📦", detail: "E-commerce giant" },
      { name: "Ethereum", symbol: "tETH", percentage: 20, icon: "⧫", detail: "Smart contract platform" },
      { name: "S&P 500 ETF", symbol: "tSPY", percentage: 15, icon: "📈", detail: "Market index" }
    ],
    voters: [
      { address: "0x7777...8888", reason: "AI sector growth potential", vote: "Agree" },
      { address: "0x2222...3333", reason: "Great diversification", vote: "Agree" },
      { address: "0x4444...5555", reason: "Too concentrated in tech", vote: "Against" }
    ]
  },
  {
    id: "4",
    title: "DeFi Integration Proposal",
    endTime: "2025-06-01 23:59:59",
    percentageAgree: 45,
    percentageAgainst: 55,
    countParticipation: 1834,
    status: "Executed",
    description: "Proposal to integrate DeFi protocols was rejected by community vote.",
    assetAllocation: [
      { name: "Uniswap", symbol: "tUNI", percentage: 30, icon: "🦄", detail: "DEX protocol" },
      { name: "Aave", symbol: "tAAVE", percentage: 25, icon: "👻", detail: "Lending protocol" },
      { name: "Compound", symbol: "tCOMP", percentage: 25, icon: "🏛️", detail: "Lending platform" },
      { name: "Chainlink", symbol: "tLINK", percentage: 20, icon: "🔗", detail: "Oracle network" }
    ],
    voters: [
      { address: "0x9999...aaaa", reason: "Too risky for current market", vote: "Against" },
      { address: "0xbbbb...cccc", reason: "DeFi has good potential", vote: "Agree" },
      { address: "0xdddd...eeee", reason: "Smart contracts are unproven", vote: "Against" }
    ]
  }
];

const GovernancePage: React.FC = () => {
  const [selectedDAO, setSelectedDAO] = useState<string>("1");
  const [userVotes, setUserVotes] = useState<{[key: string]: 'agree' | 'against' | null}>({});
  const [voteComment, setVoteComment] = useState<string>("");
  const [showVoteModal, setShowVoteModal] = useState<{show: boolean, type: 'agree' | 'against' | null}>({show: false, type: null});
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Executed">("All");

  // Filter DAOs based on status
  const filteredDAOs = useMemo(() => {
    if (statusFilter === "All") {
      return mockDAOs;
    }
    return mockDAOs.filter(dao => dao.status === statusFilter);
  }, [statusFilter]);

  const handleVoteClick = (vote: 'agree' | 'against') => {
    setShowVoteModal({show: true, type: vote});
  };

  const handleSubmitVote = () => {
    if (showVoteModal.type && voteComment.trim()) {
      setUserVotes(prev => ({ ...prev, [selectedDAO]: showVoteModal.type! }));
      alert(`Voted ${showVoteModal.type} for proposal ${selectedDAO} with comment: "${voteComment}"`);
      setVoteComment("");
      setShowVoteModal({show: false, type: null});
    } else if (!voteComment.trim()) {
      alert("Please provide a reason for your vote");
    }
  };

  const handleCancelVote = () => {
    setShowVoteModal({show: false, type: null});
    setVoteComment("");
  };

  const selectedDAOData = mockDAOs.find(dao => dao.id === selectedDAO) || mockDAOs[0];
  return (
    <AuthWrapper requireAuth={true}>
      <PrimaryLayout theme="dark">
        <Header theme="dark" />
        
        <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Governance</h1>
          <p className="text-gray-300">Participate in DAO decision making and fund management</p>
          
          {/* Status Explanation */}
          <GlassCard theme="dark" variant="default" className="p-4 mt-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-[#F77A0E] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-2">Status Explanation</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><span className="text-green-400 font-medium">Active:</span> Proposal is currently open for voting. Community members can cast their votes.</p>
                  <p><span className="text-blue-400 font-medium">Executed:</span> Proposal voting period has ended. The result has been implemented or rejected based on majority vote.</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DAO List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Proposals</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "All" | "Active" | "Executed")}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50"
                >
                  <option value="All" className="bg-gray-800 text-white">All Status</option>
                  <option value="Active" className="bg-gray-800 text-white">Active</option>
                  <option value="Executed" className="bg-gray-800 text-white">Executed</option>
                </select>
              </div>
            </div>
            
            {filteredDAOs.length === 0 ? (
              <GlassCard theme="dark" variant="default" className="p-6 text-center">
                <p className="text-gray-400">No proposals found for "{statusFilter}" status</p>
              </GlassCard>
            ) : (
            
            <div className="space-y-4">
              {filteredDAOs.map((dao) => (
                <div 
                  key={dao.id}
                  onClick={() => setSelectedDAO(dao.id)}
                  className="cursor-pointer"
                >
                  <GlassCard 
                    theme="dark" 
                    variant="bordered" 
                    className={`p-4 transition-all duration-200 ${
                      selectedDAO === dao.id 
                        ? 'border-[#F77A0E] bg-[#F77A0E]/10 scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    <div className="mb-3">
                      <h3 className="font-semibold text-white text-sm mb-1">{dao.title}</h3>
                      <div className="flex items-center text-xs text-gray-400 mb-2">
                        <Clock className="w-3 h-3 mr-1" />
                        Ends: {dao.endTime}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Agree: {dao.percentageAgree}%</span>
                        <span className="text-gray-300">Against: {dao.percentageAgainst}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" 
                          style={{ width: `${dao.percentageAgree}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-gray-400">
                        <Users className="w-3 h-3 mr-1" />
                        {dao.countParticipation} votes
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        dao.status === 'Active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {dao.status}
                      </span>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
            )}
          </div>          {/* Detailed DAO View */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-white">Proposal Details</h2>
            
            <GlassCard theme="dark" variant="elevated" className="p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{selectedDAOData.title}</h3>
                    <p className="text-gray-300 mb-4">{selectedDAOData.description}</p>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedDAOData.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {selectedDAOData.status}
                    </span>
                    {selectedDAOData.status === 'Executed' && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedDAOData.percentageAgree > 50
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {selectedDAOData.percentageAgree > 50 ? 'APPROVED' : 'REJECTED'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{selectedDAOData.percentageAgree}%</p>
                    <p className="text-sm text-gray-400">Agree</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{selectedDAOData.percentageAgainst}%</p>
                    <p className="text-sm text-gray-400">Against</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#F77A0E]">{selectedDAOData.countParticipation}</p>
                    <p className="text-sm text-gray-400">Participants</p>
                  </div>
                  <div className="text-center">
                    {selectedDAOData.status === 'Active' ? (
                      <>
                        <p className="text-2xl font-bold text-white">7d</p>
                        <p className="text-sm text-gray-400">Time Left</p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-blue-400">Final</p>
                        <p className="text-sm text-gray-400">Completed</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#F77A0E]" />
                  Proposed Asset Allocation
                </h4>
                <div className="space-y-3">
                  {selectedDAOData.assetAllocation.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{asset.icon}</span>
                        <div>
                          <p className="font-medium text-white">{asset.name}</p>
                          <p className="text-sm text-gray-400">{asset.symbol} • {asset.detail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#F77A0E]">{asset.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedDAOData.status === 'Active' ? (
                <div className="grid grid-cols-2 gap-4">
                  <ActionButton 
                    variant="secondary" 
                    size="md" 
                    theme="dark"
                    onClick={() => handleVoteClick('against')}
                    className={userVotes[selectedDAO] === 'against' ? 'bg-red-500/20 border-red-500' : ''}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Vote Against
                  </ActionButton>
                  <ActionButton 
                    variant="primary" 
                    size="md" 
                    theme="dark"
                    onClick={() => handleVoteClick('agree')}
                    className={userVotes[selectedDAO] === 'agree' ? 'bg-green-500/20 border-green-500' : ''}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Vote Agree
                  </ActionButton>
                </div>
              ) : (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-blue-400">Proposal Executed</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    This proposal has been finalized. 
                    {selectedDAOData.percentageAgree > 50 
                      ? ' The proposal was APPROVED and implemented.' 
                      : ' The proposal was REJECTED by community vote.'}
                  </p>
                </div>
              )}
            </GlassCard>
            
            {/* Recent Voters / Final Results */}
            <GlassCard theme="dark" variant="default" className="p-6">
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <Vote className="w-5 h-5 mr-2 text-[#F77A0E]" />
                {selectedDAOData.status === 'Active' ? 'Recent Voters' : 'Final Voting Results'}
              </h4>
              
              {selectedDAOData.status === 'Executed' && (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-400">Final Outcome:</span>
                    <span className={`font-bold ${
                      selectedDAOData.percentageAgree > 50 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedDAOData.percentageAgree > 50 ? 'APPROVED' : 'REJECTED'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Final vote: {selectedDAOData.percentageAgree}% Agree, {selectedDAOData.percentageAgainst}% Against
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {selectedDAOData.voters.map((voter, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-white text-sm">{voter.address}</p>
                      <p className="text-xs text-gray-400">{voter.reason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      voter.vote === 'Agree' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {voter.vote}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      {/* Vote Modal */}
      {showVoteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <GlassCard theme="dark" variant="default" className="p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Vote {showVoteModal.type === 'agree' ? 'Agree' : 'Against'}
            </h3>
            <p className="text-gray-300 mb-4">
              Please provide a reason for your vote. This will be publicly visible to other participants.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Comment/Reason
              </label>
              <textarea
                value={voteComment}
                onChange={(e) => setVoteComment(e.target.value)}
                placeholder="Explain why you are voting this way..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F77A0E]/50 focus:border-[#F77A0E] resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-400">{voteComment.length}/500</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <ActionButton 
                variant="secondary" 
                size="md" 
                theme="dark"
                onClick={handleCancelVote}
                className="flex-1"
              >
                Cancel
              </ActionButton>
              <ActionButton 
                variant="primary" 
                size="md" 
                theme="dark"
                onClick={handleSubmitVote}
                className={`flex-1 ${
                  showVoteModal.type === 'agree' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {showVoteModal.type === 'agree' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Agree
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Submit Against
                  </>
                )}
              </ActionButton>
            </div>
          </GlassCard>
        </div>
      )}
      
      <Footer theme="dark" />
    </PrimaryLayout>
    </AuthWrapper>
  );
};

export default GovernancePage;
