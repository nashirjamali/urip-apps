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
  HelpCircle
} from "lucide-react"
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAccount } from "wagmi"
import { useDAOGovernance, ProposalCategory, ProposalStatus, VoteType } from '@/hooks/useDAOGovernance'
import { formatUnits } from 'viem'

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
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null)
  const [delegateAddress, setDelegateAddress] = useState("")
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
    createProposal,
    castVote,
    delegate,
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

  // Proposal creation form
  const [proposalForm, setProposalForm] = useState({
    title: "",
    description: "",
    category: ProposalCategory.FUND_MANAGEMENT,
    actionDescriptions: [""],
    targets: [""],
    values: [BigInt(0)],
    calldatas: [""]
  })

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

  // Handle proposal creation
  const handleCreateProposal = async () => {
    if (!proposalForm.title || !proposalForm.description) {
      setAlertMessage({ type: 'error', message: 'Please fill in all required fields' })
      return
    }

    setAlertMessage(null)
    try {
      await createProposal(
        proposalForm.title,
        proposalForm.description,
        proposalForm.actionDescriptions,
        proposalForm.targets,
        proposalForm.values,
        proposalForm.calldatas,
        proposalForm.category
      )
      setAlertMessage({ type: 'success', message: 'Proposal created successfully!' })
      setShowCreateProposal(false)
      setProposalForm({
        title: "",
        description: "",
        category: ProposalCategory.FUND_MANAGEMENT,
        actionDescriptions: [""],
        targets: [""],
        values: [BigInt(0)],
        calldatas: [""]
      })
    } catch (error: any) {
      setAlertMessage({ type: 'error', message: error.message || 'Failed to create proposal' })
    }
  }

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

  // Handle delegation
  const handleDelegate = async () => {
    if (!delegateAddress) {
      setAlertMessage({ type: 'error', message: 'Please enter a delegate address' })
      return
    }

    setAlertMessage(null)
    try {
      await delegate(delegateAddress)
      setAlertMessage({ type: 'success', message: 'Voting power delegated successfully!' })
      setDelegateAddress("")
    } catch (error: any) {
      setAlertMessage({ type: 'error', message: error.message || 'Failed to delegate voting power' })
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
            <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DAO Governance</h1>
          <p className="text-gray-400">Decentralized governance for the URIP protocol</p>
              </div>

        {/* Alert Messages */}
        {alertMessage && (
          <Alert className={`border-2 mb-6 ${
            alertMessage.type === 'success' 
              ? 'border-green-500/20 bg-green-500/10' 
              : 'border-red-500/20 bg-red-500/10'
          }`}>
            <div className="flex items-center gap-2">
              {alertMessage.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <AlertDescription className={`${
                alertMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {alertMessage.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Transaction Status */}
        {(isWritePending || isConfirming) && (
          <Alert className="border-2 border-blue-500/20 bg-blue-500/10 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <AlertDescription className="text-blue-400">
                {isWritePending ? 'Processing transaction...' : 'Confirming transaction...'}
              </AlertDescription>
                  </div>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Vote className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="delegate" className="data-[state=active]:bg-blue-600">
              <UserCheck className="h-4 w-4 mr-2" />
              Delegate
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Voting Power */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Your Voting Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {votingPower} URIP
                  </div>
                  <p className="text-gray-400 text-sm">
                    Total voting power including delegations
                  </p>
                </CardContent>
              </Card>

              {/* Total Proposals */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Total Proposals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {proposalCount}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Proposals created to date
                  </p>
                </CardContent>
              </Card>

              {/* Active Proposals */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Active Proposals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {proposals.filter(p => p.status === ProposalStatus.ACTIVE).length}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Currently open for voting
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Proposals */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : proposals.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No proposals found</p>
                ) : (
                <div className="space-y-4">
                    {proposals.slice(0, 5).map((proposal) => (
                      <div key={proposal.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProposal(proposal.id)
                            setActiveTab("proposals")
                          }}
                        >
                          View Details
                        </Button>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Proposals</h2>
              <Button
                variant="outline"
                onClick={() => loadProposals()}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : proposals.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No Proposals</h3>
                  <p className="text-gray-400 mb-4">Be the first to create a proposal!</p>
                  <Button onClick={() => setActiveTab("create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Proposal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <Card key={proposal.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-6">
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
                          <div className="text-center p-3 bg-green-500/10 rounded-lg">
                            <div className="text-green-400 font-medium">
                              {formatUnits(proposal.forVotes, 18)}
                            </div>
                            <div className="text-sm text-gray-400">For</div>
                          </div>
                          <div className="text-center p-3 bg-red-500/10 rounded-lg">
                            <div className="text-red-400 font-medium">
                              {formatUnits(proposal.againstVotes, 18)}
                            </div>
                            <div className="text-sm text-gray-400">Against</div>
                          </div>
                          <div className="text-center p-3 bg-gray-500/10 rounded-lg">
                            <div className="text-gray-400 font-medium">
                              {formatUnits(proposal.abstainVotes, 18)}
                            </div>
                            <div className="text-sm text-gray-400">Abstain</div>
                          </div>
                        </div>

                        {/* Vote Statistics */}
                        <div className="bg-gray-700/30 rounded-lg p-3">
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
                        <div className="border-t border-gray-700 pt-6">
                          <div className="space-y-6">
                            {/* Vote Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <Vote className="h-4 w-4 text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">Cast Your Vote</h4>
                                <p className="text-gray-400 text-sm">Your vote will be recorded on-chain</p>
                              </div>
                            </div>

                            {/* Quick Vote Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div 
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                                  proposalVotes[proposal.id]?.support === VoteType.FOR
                                    ? 'border-green-500 bg-green-500/10'
                                    : 'border-gray-600 bg-gray-700/30 hover:border-green-500/50'
                                }`}
                                onClick={() => updateProposalVote(proposal.id, 'support', VoteType.FOR)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    proposalVotes[proposal.id]?.support === VoteType.FOR
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
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                                  proposalVotes[proposal.id]?.support === VoteType.AGAINST
                                    ? 'border-red-500 bg-red-500/10'
                                    : 'border-gray-600 bg-gray-700/30 hover:border-red-500/50'
                                }`}
                                onClick={() => updateProposalVote(proposal.id, 'support', VoteType.AGAINST)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    proposalVotes[proposal.id]?.support === VoteType.AGAINST
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
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                                  proposalVotes[proposal.id]?.support === VoteType.ABSTAIN
                                    ? 'border-gray-500 bg-gray-500/10'
                                    : 'border-gray-600 bg-gray-700/30 hover:border-gray-500/50'
                                }`}
                                onClick={() => updateProposalVote(proposal.id, 'support', VoteType.ABSTAIN)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    proposalVotes[proposal.id]?.support === VoteType.ABSTAIN
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
                                className="min-h-[80px] resize-none"
                                rows={3}
                              />
                            </div>

                            {/* Voting Power & Action */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-blue-400" />
                                  </div>
                                  <div>
                                    <h5 className="text-white font-medium">Your Voting Power</h5>
                                    <p className="text-gray-400 text-sm">Based on your URIP tokens</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-white">{votingPower}</div>
                                  <div className="text-sm text-blue-400">URIP Tokens</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Button
                                  onClick={() => handleVote(proposal.id)}
                                  disabled={isWritePending || !proposalVotes[proposal.id]?.support}
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
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
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  onClick={() => handleQuickVote(proposal.id, VoteType.FOR, "I support this proposal")}
                                  disabled={isWritePending}
                                  className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Quick For
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  onClick={() => handleQuickVote(proposal.id, VoteType.AGAINST, "I oppose this proposal")}
                                  disabled={isWritePending}
                                  className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  Quick Against
                                </Button>
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
                    </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Delegate Tab */}
          <TabsContent value="delegate" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Delegate Voting Power
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                        <div>
                  <Label htmlFor="delegate-address" className="text-gray-400">
                    Delegate Address
                  </Label>
                  <Input
                    id="delegate-address"
                    placeholder="0x..."
                    value={delegateAddress}
                    onChange={(e) => setDelegateAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleDelegate}
                  disabled={!delegateAddress || isWritePending}
                  className="w-full"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Delegate Voting Power
                </Button>
                <p className="text-sm text-gray-400">
                  Delegating your voting power allows another address to vote on your behalf.
                  You can change or remove your delegation at any time.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Proposal Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Proposal
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="proposal-title" className="text-gray-400">
                    Title *
                  </Label>
                  <Input
                    id="proposal-title"
                    placeholder="Proposal title..."
                    value={proposalForm.title}
                    onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                    className="mt-1"
                  />
                      </div>

                <div>
                  <Label htmlFor="proposal-description" className="text-gray-400">
                    Description *
                  </Label>
                  <Textarea
                    id="proposal-description"
                    placeholder="Detailed description of the proposal..."
                    value={proposalForm.description}
                    onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                    className="mt-1"
                    rows={4}
                  />
                    </div>

                <div>
                  <Label htmlFor="proposal-category" className="text-gray-400">
                    Category
                  </Label>
                  <Select
                    value={proposalForm.category.toString()}
                    onValueChange={(value) => setProposalForm({ ...proposalForm, category: Number(value) as ProposalCategory })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProposalCategory.FUND_MANAGEMENT.toString()}>
                        Fund Management
                      </SelectItem>
                      <SelectItem value={ProposalCategory.PROTOCOL_GOVERNANCE.toString()}>
                        Protocol Governance
                      </SelectItem>
                      <SelectItem value={ProposalCategory.TREASURY_MANAGEMENT.toString()}>
                        Treasury Management
                      </SelectItem>
                      <SelectItem value={ProposalCategory.EMERGENCY_ACTION.toString()}>
                        Emergency Action
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCreateProposal}
                  disabled={!proposalForm.title || !proposalForm.description || isWritePending}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Proposal
                  </Button>

                <p className="text-sm text-gray-400">
                  Creating a proposal requires sufficient voting power. The minimum threshold varies by category.
                </p>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
        </div>
    </div>
  )
} 