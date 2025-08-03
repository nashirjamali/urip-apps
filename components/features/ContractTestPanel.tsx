"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, TestTube } from 'lucide-react';
import { useURIPContract } from '@/hooks/useURIPContract';
import { useAssetTokens } from '@/hooks/useAssetTokens';
import { usePurchaseManager } from '@/hooks/usePurchaseManager';
import { validateAssetContracts, ContractValidationResult } from '@/utils/contractValidation';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export const ContractTestPanel = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [contractValidation, setContractValidation] = useState<ContractValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const {
    uripBalance,
    currentNAV,
    usdtBalance,
    fundStats,
    canUseFaucet,
    isLoading: uripLoading,
    error: uripError
  } = useURIPContract();

  const {
    assetTokens,
    totalPortfolioValue,
    isLoading: assetsLoading,
    isError: assetsError
  } = useAssetTokens();

  const {
    usdtBalance: pmUsdtBalance,
    isPaymentTokenSupported,
    error: pmError
  } = usePurchaseManager();

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    // Test 1: URIP Contract Connection
    testResults.push({
      name: 'URIP Contract Connection',
      status: uripError ? 'error' : 'success',
      message: uripError ? `Error: ${uripError && typeof uripError === 'object' && 'message' in uripError ? uripError.message : 'Unknown error'}` : `Connected successfully. Balance: ${uripBalance} URIP`
    });

    // Test 8: Contract Validation
    if (contractValidation.length > 0) {
      const deployedCount = contractValidation.filter(c => c.isDeployed).length;
      const failedCount = contractValidation.filter(c => !c.isDeployed).length;
      
      testResults.push({
        name: 'Asset Contract Validation',
        status: deployedCount > 0 ? 'success' : 'error',
        message: `${deployedCount} contracts deployed, ${failedCount} failed`
      });
    }

    // Test 2: NAV Reading
    testResults.push({
      name: 'NAV Data Reading',
      status: currentNAV === '0' ? 'error' : 'success',
      message: currentNAV === '0' ? 'NAV not available' : `Current NAV: $${currentNAV}`
    });

    // Test 3: USDT Balance
    testResults.push({
      name: 'USDT Balance Reading',
      status: usdtBalance === '0' && !canUseFaucet ? 'error' : 'success',
      message: `USDT Balance: $${usdtBalance}${canUseFaucet ? ' (Faucet available)' : ''}`
    });

    // Test 4: Asset Tokens Loading
    testResults.push({
      name: 'Asset Tokens Loading',
      status: assetsError ? 'error' : assetTokens.length > 0 ? 'success' : 'error',
      message: assetsError ? 'Failed to load asset tokens' : `Loaded ${assetTokens.length} asset tokens`
    });

    // Test 5: Fund Statistics
    testResults.push({
      name: 'Fund Statistics',
      status: !fundStats ? 'error' : 'success',
      message: !fundStats ? 'Fund stats not available' : `Fund value: $${(Number(fundStats.totalValue) / 1e6).toFixed(2)}`
    });

    // Test 6: Purchase Manager
    testResults.push({
      name: 'Purchase Manager',
      status: pmError ? 'error' : 'success',
      message: pmError ? `Error: ${pmError.message}` : `Payment token supported: ${isPaymentTokenSupported ? 'Yes' : 'No'}`
    });

    // Test 7: Portfolio Calculation
    testResults.push({
      name: 'Portfolio Value Calculation',
      status: totalPortfolioValue >= 0 ? 'success' : 'error',
      message: `Total portfolio value: $${totalPortfolioValue.toFixed(2)}`
    });

    setTests(testResults);
    setIsRunning(false);
  };

  const validateContracts = async () => {
    setIsValidating(true);
    try {
      const validation = await validateAssetContracts();
      setContractValidation(validation);
      console.log('✅ Contract validation completed:', validation);
    } catch (error) {
      console.error('❌ Contract validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-700/20 text-green-400 border-transparent">Pass</Badge>;
      case 'error':
        return <Badge className="bg-red-700/20 text-red-400 border-transparent">Fail</Badge>;
      default:
        return <Badge className="bg-blue-700/20 text-blue-400 border-transparent">Running</Badge>;
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;

  return (
    <Card className="bg-dark-bg-secondary/80 backdrop-blur-sm shadow-lg rounded-xl border border-dark-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-dark-text-primary flex items-center gap-2">
          <TestTube className="h-5 w-5 text-purple-500" />
          Contract Integration Tests
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Test Summary */}
        {tests.length > 0 && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-dark-input/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-dark-text-primary">{tests.length}</div>
              <div className="text-sm text-dark-text-secondary">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{successCount}</div>
              <div className="text-sm text-dark-text-secondary">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{errorCount}</div>
              <div className="text-sm text-dark-text-secondary">Failed</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={validateContracts}
            disabled={isValidating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {isValidating ? 'Validating...' : 'Validate Contracts'}
          </Button>
          
          <Button
            onClick={runTests}
            disabled={isRunning || uripLoading || assetsLoading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <TestTube className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>

        {/* Test Results */}
        {tests.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-dark-text-primary">Test Results:</h3>
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-input/20 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span className="font-medium text-dark-text-primary">{test.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(test.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Test Details */}
        {tests.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-dark-text-primary">Details:</h3>
            {tests.map((test, index) => (
              <Alert key={index} className={`${test.status === 'error' ? 'border-red-500/50' : 'border-green-500/50'}`}>
                <AlertDescription className="text-sm">
                  <strong>{test.name}:</strong> {test.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Contract Validation Results */}
        {contractValidation.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-dark-text-primary">Contract Validation:</h3>
            <div className="grid grid-cols-2 gap-2">
              {contractValidation.map((contract) => (
                <div key={contract.symbol} className={`p-2 rounded text-xs ${contract.isDeployed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="font-medium">{contract.symbol}</div>
                  <div className="text-xs opacity-75">{contract.address}</div>
                  <div>{contract.isDeployed ? '✅ Deployed' : '❌ Not Deployed'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading States */}
        {(uripLoading || assetsLoading) && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Loading contract data... {uripLoading && 'URIP'} {assetsLoading && 'Assets'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};