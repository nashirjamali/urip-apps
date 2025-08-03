"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, DollarSign, TrendingUp, Clock, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { useURIPContract } from '@/hooks/useURIPContract';
import { usePurchaseManager } from '@/hooks/usePurchaseManager';
import { formatUnits } from 'viem';

interface URIPFundProps {
  className?: string;
}

export const URIPFund = ({ className }: URIPFundProps) => {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionStep, setTransactionStep] = useState<'input' | 'approve' | 'purchase' | 'success'>('input');

  const {
    uripBalance,
    currentNAV,
    navTimestamp,
    fundStats,
    fundInfo,
    usdtBalance,
    canUseFaucet,
    nextFaucetTime,
    faucetAmount,
    isLoading,
    isTransactionPending,
    error,
    isConfirmed,
    transactionHash,
    hasEnoughAllowance,
    hasEnoughBalance,
    claimFaucet,
    approveUSDT,
    refreshAll,
    handleTransactionComplete,
  } = useURIPContract();

  const {
    purchaseMutualFund,
    calculateURIPTokens,
    isTransactionPending: isPurchasePending,
    isConfirmed: isPurchaseConfirmed,
    error: purchaseError,
  } = usePurchaseManager();

  // Format values for display
  const formatValue = (value: bigint | undefined, decimals: number = 18): string => {
    if (!value) return '0';
    return parseFloat(formatUnits(value, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatNAV = (nav: string): string => {
    return parseFloat(nav).toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const handleFaucetClaim = async () => {
    try {
      await claimFaucet();
    } catch (error) {
      console.error('Faucet claim failed:', error);
    }
  };

  const handlePurchase = async () => {
    if (!purchaseAmount) return;

    try {
      setTransactionStep('approve');
      
      // Check if we need to approve first
      if (!hasEnoughAllowance(purchaseAmount)) {
        await approveUSDT(purchaseAmount);
        // Wait for approval to complete
        return;
      }

      setTransactionStep('purchase');
      await purchaseMutualFund(purchaseAmount);
    } catch (error) {
      console.error('Purchase failed:', error);
      setTransactionStep('input');
    }
  };

  // Handle transaction completion
  if (isConfirmed || isPurchaseConfirmed) {
    if (transactionStep !== 'success') {
      setTransactionStep('success');
      handleTransactionComplete();
      setTimeout(() => {
        setIsDialogOpen(false);
        setTransactionStep('input');
        setPurchaseAmount('');
        refreshAll();
      }, 3000);
    }
  }

  const estimatedTokens = calculateURIPTokens(purchaseAmount, currentNAV);
  const canPurchase = purchaseAmount && hasEnoughBalance(purchaseAmount) && parseFloat(purchaseAmount) > 0;

  if (isLoading) {
    return (
      <Card className={`bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-dark-border/50 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-dark-accent-blue" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border border-dark-border/50 relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full"></div>
      
      <CardHeader>
        <CardTitle className="text-xl font-medium text-dark-text-primary flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          URIP Mutual Fund
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Fund Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-dark-text-secondary">Current NAV</p>
            <p className="text-2xl font-bold text-dark-text-primary">
              ${formatNAV(currentNAV)}
            </p>
            <p className="text-xs text-dark-text-secondary">
              <Clock className="h-3 w-3 inline mr-1" />
              Updated: {formatTimestamp(navTimestamp)}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-dark-text-secondary">Your Holdings</p>
            <p className="text-2xl font-bold text-dark-text-primary">
              {parseFloat(uripBalance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })} URIP
            </p>
            <p className="text-xs text-green-400">
              ≈ ${(parseFloat(uripBalance) * parseFloat(currentNAV)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Fund Statistics */}
        {fundStats && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border/30">
            <div>
              <p className="text-sm text-dark-text-secondary">Total Fund Value</p>
              <p className="text-lg font-semibold text-dark-text-primary">
                ${formatValue(fundStats.totalValue, 6)}
              </p>
            </div>
            <div>
              <p className="text-sm text-dark-text-secondary">Total Tokens</p>
              <p className="text-lg font-semibold text-dark-text-primary">
                {formatValue(fundStats.totalTokens, 18)}
              </p>
            </div>
          </div>
        )}

        {/* USDT Balance & Faucet */}
        <div className="space-y-3 pt-4 border-t border-dark-border/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary">USDT Balance</p>
              <p className="text-lg font-semibold text-dark-text-primary">
                ${parseFloat(usdtBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            
            {canUseFaucet ? (
              <Button
                onClick={handleFaucetClaim}
                disabled={isTransactionPending}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                {isTransactionPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-1" />
                    Claim ${faucetAmount}
                  </>
                )}
              </Button>
            ) : (
              <div className="text-right">
                <p className="text-xs text-dark-text-secondary">Next claim:</p>
                <p className="text-xs text-orange-400">
                  {nextFaucetTime?.toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Purchase Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-dark-accent-blue hover:bg-dark-accent-blue/90 text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Purchase URIP Tokens
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-dark-bg-secondary border-dark-border text-dark-text-primary">
            <DialogHeader>
              <DialogTitle>Purchase URIP Mutual Fund</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {transactionStep === 'input' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount (USDT)</label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      className="bg-dark-input border-dark-border text-dark-text-primary"
                    />
                    <div className="flex justify-between text-xs text-dark-text-secondary">
                      <span>Available: ${usdtBalance} USDT</span>
                      <span>NAV: ${formatNAV(currentNAV)}</span>
                    </div>
                  </div>

                  {purchaseAmount && (
                    <div className="bg-dark-input/50 p-3 rounded-lg">
                      <p className="text-sm text-dark-text-secondary">You will receive approximately:</p>
                      <p className="text-lg font-semibold text-dark-text-primary">
                        {estimatedTokens} URIP tokens
                      </p>
                    </div>
                  )}

                  {!hasEnoughBalance(purchaseAmount) && purchaseAmount && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Insufficient USDT balance. You need ${purchaseAmount} but only have ${usdtBalance}.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handlePurchase}
                    disabled={!canPurchase || isTransactionPending || isPurchasePending}
                    className="w-full bg-dark-accent-blue hover:bg-dark-accent-blue/90"
                  >
                    {isTransactionPending || isPurchasePending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Purchase URIP Tokens
                  </Button>
                </>
              )}

              {transactionStep === 'approve' && (
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-dark-accent-blue" />
                  <p>Approving USDT spending...</p>
                  <p className="text-sm text-dark-text-secondary">
                    Please confirm the approval transaction in your wallet.
                  </p>
                </div>
              )}

              {transactionStep === 'purchase' && (
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-dark-accent-blue" />
                  <p>Processing purchase...</p>
                  <p className="text-sm text-dark-text-secondary">
                    Please confirm the purchase transaction in your wallet.
                  </p>
                </div>
              )}

              {transactionStep === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
                  <p className="text-green-500 font-semibold">Purchase Successful!</p>
                  <p className="text-sm text-dark-text-secondary">
                    You have successfully purchased {estimatedTokens} URIP tokens.
                  </p>
                  {transactionHash && (
                    <p className="text-xs text-dark-text-secondary break-all">
                      Transaction: {transactionHash}
                    </p>
                  )}
                </div>
              )}

              {(error || purchaseError) && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(error && typeof error === 'object' && 'message' in error ? error.message : '') || 
                     (purchaseError && typeof purchaseError === 'object' && 'message' in purchaseError ? purchaseError.message : '') || 
                     'Transaction failed'}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Fund Status */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-border/30">
          <Badge 
            className={`${fundInfo?.isActive ? 'bg-green-700/20 text-green-400' : 'bg-red-700/20 text-red-400'} border-transparent`}
          >
            {fundInfo?.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <p className="text-xs text-dark-text-secondary">
            Management Fee: {fundInfo ? (Number(fundInfo.managementFee) / 100).toFixed(2) : '0'}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};