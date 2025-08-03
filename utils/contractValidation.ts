import { readContract } from '@wagmi/core';
import { config } from '@/config/xellarConfig';
import { ASSET_TOKENS, ASSET_TOKEN_ABI } from '@/config/contracts';

export interface ContractError {
  type: 'NETWORK' | 'CONTRACT' | 'METHOD' | 'VALIDATION' | 'RPC' | 'UNKNOWN';
  message: string;
  details?: string;
  suggestions?: string[];
  address?: string;
  symbol?: string;
}

export interface ContractValidation {
  isDeployed: boolean;
  hasCode: boolean;
  error?: string;
  address: string;
  symbol: string;
}

export interface SystemValidation {
  network: {
    name: string;
    chainId: number;
    isConnected: boolean;
  };
  assetTokens: ContractValidation[];
  summary: {
    totalContracts: number;
    deployedContracts: number;
    isSystemHealthy: boolean;
  };
}

// Retry mechanism for contract calls
export const retryContractCall = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
};

// Parse contract errors into structured format
export const parseContractError = (error: any): ContractError => {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('chain')) {
    return {
      type: 'NETWORK',
      message: 'Network connection error',
      details: errorMessage,
      suggestions: [
        'Check your internet connection',
        'Verify you are connected to the correct network',
        'Try switching networks in your wallet'
      ]
    };
  }
  
  // Contract not deployed
  if (errorMessage.includes('contract') && errorMessage.includes('deployed')) {
    return {
      type: 'CONTRACT',
      message: 'Contract not deployed',
      details: errorMessage,
      suggestions: [
        'Verify the contract address is correct',
        'Check if contracts are deployed on this network',
        'Ensure you are on the correct network'
      ]
    };
  }
  
  // Method not found
  if (errorMessage.includes('method') || errorMessage.includes('function')) {
    return {
      type: 'METHOD',
      message: 'Contract method not found',
      details: errorMessage,
      suggestions: [
        'Check if the ABI is correct',
        'Verify the contract has the required methods',
        'Update the contract ABI if needed'
      ]
    };
  }
  
  // RPC errors
  if (errorMessage.includes('rpc') || errorMessage.includes('provider')) {
    return {
      type: 'RPC',
      message: 'RPC connection error',
      details: errorMessage,
      suggestions: [
        'Check your RPC endpoint',
        'Try using a different RPC provider',
        'Verify network connectivity'
      ]
    };
  }
  
  // Unknown error
  return {
    type: 'UNKNOWN',
    message: 'Unknown contract error',
    details: errorMessage,
    suggestions: [
      'Check the browser console for more details',
      'Try refreshing the page',
      'Contact support if the issue persists'
    ]
  };
};

// Validate if a contract is deployed (simplified version)
export const validateContract = async (address: string, symbol: string): Promise<ContractValidation> => {
  try {
    console.log(`🔍 Validating ${symbol} at ${address}...`);
    
    // Try to read a basic method to verify the contract works
    try {
      await readContract(config as any, {
        address: address as any,
        abi: ASSET_TOKEN_ABI,
        functionName: 'name',
      });
      
      return {
        isDeployed: true,
        hasCode: true,
        address,
        symbol
      };
    } catch (methodError) {
      return {
        isDeployed: false,
        hasCode: false,
        error: `Contract validation failed: ${methodError}`,
        address,
        symbol
      };
    }
  } catch (error) {
    return {
      isDeployed: false,
      hasCode: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      address,
      symbol
    };
  }
};

// Validate all system contracts (simplified version)
export const validateAllSystemContracts = async (): Promise<SystemValidation> => {
  try {
    console.log('🔍 Validating system contracts...');
    
    // Simplified network validation
    const networkValidation = {
      name: 'Sepolia', // Default to Sepolia since that's what's configured
      chainId: 11155111,
      isConnected: true
    };
    
    // Validate all asset token contracts
    const assetTokenValidations: ContractValidation[] = [];
    
    for (const [symbol, tokenInfo] of Object.entries(ASSET_TOKENS)) {
      console.log(`🔍 Validating ${symbol} at ${tokenInfo.address}...`);
      const validation = await validateContract(tokenInfo.address, symbol);
      assetTokenValidations.push(validation);
      
      // Small delay to avoid overwhelming the RPC
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Calculate summary
    const totalContracts = assetTokenValidations.length;
    const deployedContracts = assetTokenValidations.filter(v => v.isDeployed).length;
    const isSystemHealthy = deployedContracts > 0;
    
    const summary = {
      totalContracts,
      deployedContracts,
      isSystemHealthy
    };
    
    console.log('📊 System validation summary:', summary);
    console.log('✅ Deployed contracts:', assetTokenValidations.filter(v => v.isDeployed).map(v => v.symbol));
    console.log('❌ Failed contracts:', assetTokenValidations.filter(v => !v.isDeployed).map(v => v.symbol));
    
    return {
      network: networkValidation,
      assetTokens: assetTokenValidations,
      summary
    };
  } catch (error) {
    console.error('❌ System validation failed:', error);
    throw error;
  }
};

// Get network information (simplified version)
export const getNetworkInfo = () => {
  return {
    name: 'Sepolia',
    chainId: 11155111,
    isConnected: true
  };
}; 