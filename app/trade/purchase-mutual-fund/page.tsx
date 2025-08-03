"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowRight, 
  DollarSign, 
  RefreshCw,
  Shield,
  ArrowLeft
} from "lucide-react"
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAccount } from "wagmi"
import { usePurchaseManager } from '@/hooks/usePurchaseManager'
import { useToast } from '@/hooks/use-toast'

// Import dashboard components
import { DashboardLayout } from "@/components/partials/Dashboard/DashboardLayout"
import { ActionButton } from "@/components/partials/Dashboard/ActionButton"
import { GlassCard } from "@/components/partials/Dashboard/GlassCard"

function PurchaseMutualFundPageContent() {
  const router = useRouter()
  const { address } = useAccount()
  const { toast } = useToast()
  
  const [investmentAmount, setInvestmentAmount] = useState<string>('')

  // Purchase manager hook
  const {
    usdtBalance,
    usdtAllowance,
    isTransactionPending,
    isConfirmed,
    transactionHash,
    error,
    hasEnoughBalance,
    hasEnoughAllowance,
    approveUSDT,
    purchaseMutualFund,
    refreshAll,
    handleTransactionComplete
  } = usePurchaseManager()

  const handlePurchase = async () => {
    if (!investmentAmount) return
    
    try {
      // Check if user has enough balance
      if (!hasEnoughBalance(investmentAmount)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough USDT to complete this purchase.",
          variant: "destructive",
        })
        return
      }

      // Check if approval is needed
      if (!hasEnoughAllowance(investmentAmount)) {
        toast({
          title: "Approval Required",
          description: "Please approve USDT spending first.",
          variant: "destructive",
        })
        return
      }

      // Purchase mutual fund
      await purchaseMutualFund(investmentAmount)
      
      toast({
        title: "Purchase Initiated",
        description: "Your mutual fund purchase transaction has been submitted.",
      })
      
    } catch (error) {
      console.error('Purchase failed:', error)
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "An error occurred during purchase.",
        variant: "destructive",
      })
    }
  }

  const handleApprove = async () => {
    if (!investmentAmount) return
    
    try {
      await approveUSDT(investmentAmount)
      toast({
        title: "Approval Submitted",
        description: "USDT approval transaction has been submitted.",
      })
    } catch (error) {
      console.error('Approval failed:', error)
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "An error occurred during approval.",
        variant: "destructive",
      })
    }
  }

  // Handle transaction completion
  useEffect(() => {
    if (isConfirmed && transactionHash) {
      handleTransactionComplete()
      toast({
        title: "Purchase Successful!",
        description: "Your mutual fund purchase has been completed successfully.",
      })
      router.push('/portfolio')
    }
  }, [isConfirmed, transactionHash, handleTransactionComplete, router, toast])



  return (
    <DashboardLayout className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <GlassCard className="p-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                Purchase Mutual Funds
              </h1>
              <p className="text-gray-400">
                Invest in professionally managed diversified portfolios
              </p>
            </GlassCard>
          </div>
          <div className="flex justify-center">
            <ActionButton
              variant="ghost"
              onClick={() => router.push('/trade')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trade
            </ActionButton>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#F77A0E]" />
                Purchase Mutual Fund
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter the amount you want to invest in the mutual fund
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-6">
                {/* USDT Balance */}
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-3">USDT Balance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Available Balance:</span>
                      <span className="text-white">${parseFloat(usdtBalance).toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Approved Amount:</span>
                      <span className="text-white">${parseFloat(usdtAllowance).toFixed(2)} USDT</span>
                    </div>
                  </div>
                </div>

                {/* Investment Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Investment Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70"
                    min="1"
                  />
                  <p className="text-xs text-gray-400">
                    Minimum investment: $1
                  </p>
                  {investmentAmount && parseFloat(investmentAmount) > parseFloat(usdtBalance) && (
                    <p className="text-xs text-red-400">
                      Insufficient USDT balance
                    </p>
                  )}
                </div>

                {/* Purchase Summary */}
                {investmentAmount && parseFloat(investmentAmount) >= 1 && (
                  <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-white font-medium mb-3">Purchase Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Payment Amount:</span>
                        <span className="text-white">${parseFloat(investmentAmount).toFixed(2)} USDT</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fund Type:</span>
                        <span className="text-white">URIP Mutual Fund</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {investmentAmount && parseFloat(investmentAmount) >= 1 && (
                  <div className="space-y-3">
                    {/* Approval Button - Show if approval needed */}
                    {parseFloat(investmentAmount) > parseFloat(usdtAllowance) && (
                      <ActionButton
                        onClick={handleApprove}
                        disabled={isTransactionPending}
                        variant="secondary"
                        className="w-full"
                      >
                        {isTransactionPending ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Approve USDT
                          </>
                        )}
                      </ActionButton>
                    )}

                    {/* Purchase Button */}
                    <ActionButton
                      onClick={handlePurchase}
                      disabled={
                        !investmentAmount || 
                        parseFloat(investmentAmount) < 1 || 
                        parseFloat(investmentAmount) > parseFloat(usdtBalance) ||
                        parseFloat(investmentAmount) > parseFloat(usdtAllowance) ||
                        isTransactionPending
                      }
                      variant="primary"
                      className="w-full"
                    >
                      {isTransactionPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Purchase Mutual Fund
                        </>
                      )}
                    </ActionButton>
                  </div>
                )}
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </main>
    </DashboardLayout>
  )
}

export default function PurchaseMutualFundPage() {
  return (
    <ProtectedRoute>
      <PurchaseMutualFundPageContent />
    </ProtectedRoute>
  )
} 