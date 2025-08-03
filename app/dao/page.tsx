"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Vote,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  UserCheck,
  Settings,
  RefreshCw,
  Zap,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  BarChart3,
  DollarSign
} from "lucide-react"
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAccount } from "wagmi"
import { useDAOGovernance, ProposalCategory, ProposalStatus, VoteType } from '@/hooks/useDAOGovernance'
import { formatUnits } from 'viem'

// Import dashboard components
import { DashboardLayout } from "@/components/partials/Dashboard/DashboardLayout";
import { ActionButton } from "@/components/partials/Dashboard/ActionButton";
import { GlassCard } from "@/components/partials/Dashboard/GlassCard";

export default function DAOPage() {
  return (
    <ProtectedRoute>
      <DAOContent />
    </ProtectedRoute>
  )
}

function DAOContent() {
  const { address } = useAccount()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null)
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const {
    proposals,
    proposalCount,
    votingPower,
    loading,
    isWritePending,
    isConfirming,
    isConfirmed,
    error,
    writeError,
    receiptError,
    castVote,
    hasVoted,
    getVote,
    getProposalState,
    getProposalConfig,
    loadProposals,
    getCategoryName,
    getStatusName,
    getVoteTypeName,
    ProposalCategory,
    ProposalStatus,
    VoteType,
  } = useDAOGovernance()

  // Vote form
  const [voteForm, setVoteForm] = useState({
    support: VoteType.FOR,
    reason: ""
  })

  // Individual vote forms for each proposal
  const [proposalVotes, setProposalVotes] = useState<{
    [proposalId: number]: { support: VoteType; reason: string }
  }>({})

  // User's voting history
  const [userVotes, setUserVotes] = useState<{
    [proposalId: number]: { support: VoteType; reason: string; timestamp: number }
  }>({})

  // Handle voting
  const handleVote = async (proposalId: number) => {
    const voteData = proposalVotes[proposalId]
    if (!voteData || !voteData.reason.trim()) {
      setAlertMessage({ type: 'error', message: 'Please provide a reason for your vote' })
      return
    }

    setAlertMessage(null)
    try {
      await castVote(proposalId, voteData.support, voteData.reason)
      setAlertMessage({ type: 'success', message: `Vote cast successfully for proposal #${proposalId}!` })

      // Clear the vote form for this proposal
      setProposalVotes(prev => {
        const updated = { ...prev }
        delete updated[proposalId]
        return updated
      })

      // Add to user's voting history
      setUserVotes(prev => ({
        ...prev,
        [proposalId]: {
          support: voteData.support,
          reason: voteData.reason,
          timestamp: Date.now()
        }
      }))
    } catch (error: any) {
      setAlertMessage({ type: 'error', message: error.message || 'Failed to cast vote' })
    }
  }

  // Update vote form for a specific proposal
  const updateProposalVote = (proposalId: number, field: 'support' | 'reason', value: VoteType | string) => {
    setProposalVotes(prev => ({
      ...prev,
      [proposalId]: {
        ...prev[proposalId],
        [field]: value
      }
    }))
  }

  // Quick vote function
  const handleQuickVote = async (proposalId: number, support: VoteType, reason: string) => {
    setAlertMessage(null)
    try {
      await castVote(proposalId, support, reason)
      setAlertMessage({
        type: 'success',
        message: `Quick vote cast successfully for proposal #${proposalId}!`
      })

      // Add to user's voting history
      setUserVotes(prev => ({
        ...prev,
        [proposalId]: {
          support,
          reason,
          timestamp: Date.now()
        }
      }))
    } catch (error: any) {
      setAlertMessage({ type: 'error', message: error.message || 'Failed to cast quick vote' })
    }
  }

  // Handle transaction completion
  useEffect(() => {
    if (isConfirmed) {
      loadProposals()
    }
  }, [isConfirmed, loadProposals])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case ProposalStatus.ACTIVE:
        return "bg-blue-500/20 text-blue-400 border-blue-500/20"
      case ProposalStatus.SUCCEEDED:
        return "bg-green-500/20 text-green-400 border-green-500/20"
      case ProposalStatus.DEFEATED:
        return "bg-red-500/20 text-red-400 border-red-500/20"
      case ProposalStatus.EXECUTED:
        return "bg-purple-500/20 text-purple-400 border-purple-500/20"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/20"
    }
  }

  const getCategoryColor = (category: number) => {
    switch (category) {
      case ProposalCategory.FUND_MANAGEMENT:
        return "bg-green-500/20 text-green-400 border-green-500/20"
      case ProposalCategory.PROTOCOL_GOVERNANCE:
        return "bg-blue-500/20 text-blue-400 border-blue-500/20"
      case ProposalCategory.TREASURY_MANAGEMENT:
        return "bg-purple-500/20 text-purple-400 border-purple-500/20"
      case ProposalCategory.EMERGENCY_ACTION:
        return "bg-red-500/20 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/20"
    }
  }

  return (
    <DashboardLayout className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              DAO Governance
            </h1>
            <p className="text-gray-400">
              Decentralized governance for the URIP protocol
            </p>
          </div>

          <div className="flex gap-3">
            <ActionButton
              variant="ghost"
              onClick={() => loadProposals()}
              disabled={loading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </ActionButton>

            <ActionButton className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] hover:from-[#E6690D] hover:to-[#D55C0D] border-[#F77A0E]/20">
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </ActionButton>
          </div>
        </div>

        {/* Alert Messages */}
        {alertMessage && (
          <Alert className={`border-2 ${alertMessage.type === 'success'
              ? 'border-green-500/20 bg-green-500/10'
              : 'border-red-500/20 bg-red-500/10'
            }`}>
            <div className="flex items-center gap-2">
              {alertMessage.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <AlertDescription className={`${alertMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                {alertMessage.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Transaction Status */}
        {(isWritePending || isConfirming) && (
          <Alert className="border-2 border-blue-500/20 bg-blue-500/10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <AlertDescription className="text-blue-400">
                {isWritePending ? 'Processing transaction...' : 'Confirming transaction...'}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Quick Actions */}
        <GlassCard className="p-6">
          <CardHeader className="px-0 pb-4">
            <CardTitle className="text-xl font-semibold text-white">
              Quick Actions
            </CardTitle>
          </CardHeader>

          <CardContent className="px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "View Proposals",
                  description: "Browse and vote on governance proposals",
                  icon: FileText,
                  color: "from-[#F77A0E] to-[#E6690D]",
                  onClick: () => setActiveTab("proposals"),
                },
                {
                  title: "Your Voting Power",
                  description: `${votingPower} URIP tokens available`,
                  icon: Vote,
                  color: "from-green-500 to-green-600",
                  onClick: () => {},
                },
                {
                  title: "Active Proposals",
                  description: `${proposals.filter(p => p.status === ProposalStatus.ACTIVE).length} currently open`,
                  icon: Clock,
                  color: "from-blue-500 to-blue-600",
                  onClick: () => setActiveTab("proposals"),
                },
                {
                  title: "Total Proposals",
                  description: `${proposalCount} proposals created`,
                  icon: BarChart3,
                  color: "from-purple-500 to-purple-600",
                  onClick: () => {},
                },
              ].map((action, index) => {
                const Icon = action.icon;

                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="group relative p-4 rounded-lg bg-gradient-to-br from-gray-800/70 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:from-gray-700/80 hover:to-gray-800/70 hover:border-[#F77A0E]/30 transition-all duration-200 hover:scale-[1.02] text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#F77A0E] transition-colors" />
                    </div>

                    <h3 className="font-medium text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {action.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </GlassCard>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#F77A0E] data-[state=active]:text-white">
              <Vote className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-[#F77A0E] data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Proposals
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Voting Power */}
              <GlassCard className="p-6">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Vote className="h-5 w-5 text-[#F77A0E]" />
                    Your Voting Power
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="text-3xl font-bold text-white mb-2">
                    {votingPower} URIP
                  </div>
                  <p className="text-gray-400 text-sm">
                    Total voting power including delegations
                  </p>
                </CardContent>
              </GlassCard>

              {/* Total Proposals */}
              <GlassCard className="p-6">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#F77A0E]" />
                    Total Proposals
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="text-3xl font-bold text-white mb-2">
                    {proposalCount}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Proposals created to date
                  </p>
                </CardContent>
              </GlassCard>

              {/* Active Proposals */}
              <GlassCard className="p-6">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#F77A0E]" />
                    Active Proposals
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="text-3xl font-bold text-white mb-2">
                    {proposals.filter(p => p.status === ProposalStatus.ACTIVE).length}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Currently open for voting
                  </p>
                </CardContent>
              </GlassCard>
            </div>

            {/* Recent Proposals */}
            <GlassCard className="p-6">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#F77A0E]" />
                  Recent Proposals
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[#F77A0E] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : proposals.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No proposals found</p>
                ) : (
                  <div className="space-y-4">
                    {proposals.slice(0, 5).map((proposal) => (
                      <div key={proposal.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{proposal.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getCategoryColor(proposal.category)}>
                              {getCategoryName(proposal.category)}
                            </Badge>
                            <Badge className={getStatusColor(proposal.status)}>
                              {getStatusName(proposal.status)}
                            </Badge>
                          </div>
                        </div>
                        <ActionButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedProposal(proposal.id)
                            setActiveTab("proposals")
                          }}
                        >
                          View Details
                        </ActionButton>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </GlassCard>
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Proposals</h2>
              <ActionButton
                variant="ghost"
                onClick={() => loadProposals()}
                disabled={loading}
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </ActionButton>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#F77A0E] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : proposals.length === 0 ? (
              <GlassCard className="p-6">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No Proposals</h3>
                  <p className="text-gray-400 mb-4">Be the first to create a proposal!</p>
                  <ActionButton>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Proposal
                  </ActionButton>
                </CardContent>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <GlassCard key={proposal.id} className="p-6">
                    <CardContent className="px-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-white text-lg font-medium mb-2">
                            #{proposal.id} - {proposal.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {proposal.description}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getCategoryColor(proposal.category)}>
                              {getCategoryName(proposal.category)}
                            </Badge>
                            <Badge className={getStatusColor(proposal.status)}>
                              {getStatusName(proposal.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">
                            <p>Proposed by: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</p>
                            <p>Start: {formatTime(proposal.startTime)}</p>
                            <p>End: {formatTime(proposal.endTime)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Vote Results */}
                      <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="text-green-400 font-medium">
                              {formatUnits(proposal.forVotes, 18)}
                            </div>
                            <div className="text-sm text-gray-400">For</div>
                          </div>
                          <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                            <div className="text-red-400 font-medium">
                              {formatUnits(proposal.againstVotes, 18)}
                            </div>
                            <div className="text-sm text-gray-400">Against</div>
                          </div>
                          <div className="text-center p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                            <div className="text-gray-400 font-medium">
                              {formatUnits(proposal.abstainVotes, 18)}
                            </div>
                            <div className="text-sm text-gray-400">Abstain</div>
                          </div>
                        </div>

                        {/* Vote Statistics */}
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Total Votes:</span>
                              <span className="text-white font-medium ml-2">
                                {formatUnits(proposal.forVotes + proposal.againstVotes + proposal.abstainVotes, 18)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Participation:</span>
                              <span className="text-blue-400 font-medium ml-2">
                                {proposalCount > 0 ?
                                  `${((Number(proposal.forVotes + proposal.againstVotes + proposal.abstainVotes) / Number(proposalCount)) * 100).toFixed(1)}%`
                                  : '0%'
                                }
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">For %:</span>
                              <span className="text-green-400 font-medium ml-2">
                                {proposal.forVotes + proposal.againstVotes + proposal.abstainVotes > BigInt(0) ?
                                  `${((Number(proposal.forVotes) / Number(proposal.forVotes + proposal.againstVotes + proposal.abstainVotes)) * 100).toFixed(1)}%`
                                  : '0%'
                                }
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Against %:</span>
                              <span className="text-red-400 font-medium ml-2">
                                {proposal.forVotes + proposal.againstVotes + proposal.abstainVotes > BigInt(0) ?
                                  `${((Number(proposal.againstVotes) / Number(proposal.forVotes + proposal.againstVotes + proposal.abstainVotes)) * 100).toFixed(1)}%`
                                  : '0%'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Vote Action UI */}
                      {proposal.status === ProposalStatus.ACTIVE && (
                        <div className="border-t border-gray-700/50 pt-6">
                          <div className="space-y-6">
                            {/* Vote Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-[#F77A0E]/20 rounded-full flex items-center justify-center">
                                <Vote className="h-4 w-4 text-[#F77A0E]" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">Cast Your Vote</h4>
                                <p className="text-gray-400 text-sm">Your vote will be recorded on-chain</p>
                              </div>
                            </div>

                            {/* Quick Vote Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${proposalVotes[proposal.id]?.support === VoteType.FOR
                                    ? 'border-green-500 bg-green-500/10'
                                    : 'border-gray-600 bg-gray-700/30 hover:border-green-500/50'
                                  }`}
                                onClick={() => updateProposalVote(proposal.id, 'support', VoteType.FOR)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${proposalVotes[proposal.id]?.support === VoteType.FOR
                                      ? 'bg-green-500'
                                      : 'bg-gray-600'
                                    }`}>
                                    <ThumbsUp className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="text-white font-medium">Vote For</h5>
                                    <p className="text-gray-400 text-sm">Support this proposal</p>
                                  </div>
                                </div>
                                {proposalVotes[proposal.id]?.support === VoteType.FOR && (
                                  <div className="absolute top-2 right-2">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                  </div>
                                )}
                              </div>

                              <div
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${proposalVotes[proposal.id]?.support === VoteType.AGAINST
                                    ? 'border-red-500 bg-red-500/10'
                                    : 'border-gray-600 bg-gray-700/30 hover:border-red-500/50'
                                  }`}
                                onClick={() => updateProposalVote(proposal.id, 'support', VoteType.AGAINST)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${proposalVotes[proposal.id]?.support === VoteType.AGAINST
                                      ? 'bg-red-500'
                                      : 'bg-gray-600'
                                    }`}>
                                    <ThumbsDown className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="text-white font-medium">Vote Against</h5>
                                    <p className="text-gray-400 text-sm">Oppose this proposal</p>
                                  </div>
                                </div>
                                {proposalVotes[proposal.id]?.support === VoteType.AGAINST && (
                                  <div className="absolute top-2 right-2">
                                    <CheckCircle className="h-5 w-5 text-red-400" />
                                  </div>
                                )}
                              </div>

                              <div
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${proposalVotes[proposal.id]?.support === VoteType.ABSTAIN
                                    ? 'border-gray-500 bg-gray-500/10'
                                    : 'border-gray-600 bg-gray-700/30 hover:border-gray-500/50'
                                  }`}
                                onClick={() => updateProposalVote(proposal.id, 'support', VoteType.ABSTAIN)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${proposalVotes[proposal.id]?.support === VoteType.ABSTAIN
                                      ? 'bg-gray-500'
                                      : 'bg-gray-600'
                                    }`}>
                                    <HelpCircle className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="text-white font-medium">Abstain</h5>
                                    <p className="text-gray-400 text-sm">Neutral position</p>
                                  </div>
                                </div>
                                {proposalVotes[proposal.id]?.support === VoteType.ABSTAIN && (
                                  <div className="absolute top-2 right-2">
                                    <CheckCircle className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Vote Reason Input */}
                            <div className="space-y-3">
                              <Label className="text-gray-300 font-medium">Vote Reason (Optional)</Label>
                              <Textarea
                                placeholder="Explain your reasoning for this vote... (optional)"
                                value={proposalVotes[proposal.id]?.reason || ""}
                                onChange={(e) => updateProposalVote(proposal.id, 'reason', e.target.value)}
                                className="min-h-[80px] resize-none bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70"
                                rows={3}
                              />
                            </div>

                            {/* Voting Power & Action */}
                            <div className="bg-gradient-to-r from-[#F77A0E]/10 to-[#E6690D]/10 border border-[#F77A0E]/20 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-[#F77A0E]/20 rounded-full flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-[#F77A0E]" />
                                  </div>
                                  <div>
                                    <h5 className="text-white font-medium">Your Voting Power</h5>
                                    <p className="text-gray-400 text-sm">Based on your URIP tokens</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-white">{votingPower}</div>
                                  <div className="text-sm text-[#F77A0E]">URIP Tokens</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <ActionButton
                                  onClick={() => handleVote(proposal.id)}
                                  disabled={isWritePending || !proposalVotes[proposal.id]?.support}
                                  className="flex-1"
                                  size="lg"
                                >
                                  {isWritePending ? (
                                    <>
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                      Processing Vote...
                                    </>
                                  ) : (
                                    <>
                                      <Vote className="h-5 w-5 mr-2" />
                                      Cast Vote
                                    </>
                                  )}
                                </ActionButton>

                                <ActionButton
                                  variant="secondary"
                                  onClick={() => handleQuickVote(proposal.id, VoteType.FOR, "I support this proposal")}
                                  disabled={isWritePending}
                                  className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Quick For
                                </ActionButton>

                                <ActionButton
                                  variant="secondary"
                                  onClick={() => handleQuickVote(proposal.id, VoteType.AGAINST, "I oppose this proposal")}
                                  disabled={isWritePending}
                                  className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  Quick Against
                                </ActionButton>
                              </div>
                            </div>

                            {/* User's Previous Vote */}
                            {userVotes[proposal.id] && (
                              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                  </div>
                                  <div>
                                    <h5 className="text-white font-medium">Your Previous Vote</h5>
                                    <p className="text-gray-400 text-sm">You have already voted on this proposal</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <Badge className={
                                      userVotes[proposal.id].support === VoteType.FOR
                                        ? "bg-green-500/20 text-green-400 border-green-500/20"
                                        : userVotes[proposal.id].support === VoteType.AGAINST
                                          ? "bg-red-500/20 text-red-400 border-red-500/20"
                                          : "bg-gray-500/20 text-gray-400 border-gray-500/20"
                                    }>
                                      {getVoteTypeName(userVotes[proposal.id].support)}
                                    </Badge>
                                    <span className="text-sm text-gray-400">
                                      {new Date(userVotes[proposal.id].timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  {userVotes[proposal.id].reason && (
                                    <div className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">
                                      <span className="text-gray-400 font-medium">Reason: </span>
                                      {userVotes[proposal.id].reason}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </GlassCard>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Call-to-Action */}
        <GlassCard className="p-8 text-center" gradient>
          <CardContent className="px-0">
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Participate in Governance?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join the DAO community and help shape the future of the URIP protocol through decentralized governance and voting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ActionButton
                size="lg"
                className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] hover:from-[#E6690D] hover:to-[#D55C0D]"
              >
                <Vote className="h-5 w-5 mr-2" />
                Start Voting
              </ActionButton>

              <ActionButton variant="secondary" size="lg">
                <FileText className="h-5 w-5 mr-2" />
                Create Proposal
              </ActionButton>
            </div>
          </CardContent>
        </GlassCard>
      </main>
    </DashboardLayout>
  )
} 