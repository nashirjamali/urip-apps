import { useState, useEffect, useCallback } from 'react';

interface UseSmartContractPriceProps {
  contractAddress: string;
  tokenSymbol: string;
  refreshInterval?: number; // in milliseconds
  mockMode?: boolean; // Enable mock mode for development
}

interface PriceData {
  price: string;
  timestamp: number;
  change24h: number;
  volume24h: string;
  isLoading: boolean;
  error: string | null;
}

export const useSmartContractPrice = ({
  contractAddress,
  tokenSymbol,
  refreshInterval = 10000,
  mockMode = true // Default to mock mode for development
}: UseSmartContractPriceProps) => {
  const [priceData, setPriceData] = useState<PriceData>({
    price: '$0',
    timestamp: Date.now(),
    change24h: 0,
    volume24h: '$0',
    isLoading: true,
    error: null
  });

  // Mock price data for different tokens
  const mockPrices = {
    'BTC': { base: 1906551118, currency: 'Rp' },
    'AAPL': { base: 3456789, currency: 'Rp' },
    'MSFT': { base: 6789012, currency: 'Rp' },
    'TSLA': { base: 4123456, currency: 'Rp' },
    'ETH': { base: 85000000, currency: 'Rp' },
    'USDT': { base: 15750, currency: 'Rp' }
  };

  const fetchPrice = useCallback(async () => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }));

      if (mockMode) {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const tokenConfig = mockPrices[tokenSymbol as keyof typeof mockPrices] || 
                           mockPrices['BTC'];
        
        const basePrice = tokenConfig.base;
        const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
        const newPrice = basePrice * (1 + variation);
        
        // Calculate 24h change (simulate realistic market movement)
        const change24h = (Math.random() - 0.5) * 10; // ±5% daily change
        
        // Generate volume
        const volumeBase = basePrice * Math.random() * 1000;
        
        setPriceData({
          price: `${tokenConfig.currency} ${Math.round(newPrice).toLocaleString('id-ID')}`,
          timestamp: Date.now(),
          change24h: parseFloat(change24h.toFixed(2)),
          volume24h: `${tokenConfig.currency} ${Math.round(volumeBase).toLocaleString('id-ID')}`,
          isLoading: false,
          error: null
        });
      } else {
        // Real smart contract implementation
        // This will be enabled when mockMode is false
        
        // Method 1: Using Web3.js (uncomment when ready to use)
        /*
        if (typeof window !== 'undefined' && window.ethereum) {
          const Web3 = require('web3');
          const web3 = new Web3(window.ethereum);
          
          // Your contract ABI
          const contractABI = [
            {
              "inputs": [],
              "name": "getPrice",
              "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
              "stateMutability": "view",
              "type": "function"
            }
          ];
          
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          const rawPrice = await contract.methods.getPrice().call();
          const price = web3.utils.fromWei(rawPrice, 'ether');
          
          setPriceData(prev => ({
            ...prev,
            price: `$${parseFloat(price).toLocaleString('id-ID')}`,
            timestamp: Date.now(),
            isLoading: false
          }));
        }
        */

        // Method 2: Direct RPC call (uncomment when ready to use)
        /*
        const response = await fetch('https://your-rpc-endpoint.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{
              to: contractAddress,
              data: '0x98d5fdca' // getPrice() function selector
            }, 'latest'],
            id: 1
          })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const hexPrice = data.result;
        const priceWei = parseInt(hexPrice, 16);
        const price = priceWei / Math.pow(10, 18); // Adjust decimals
        
        setPriceData(prev => ({
          ...prev,
          price: `$${price.toLocaleString('id-ID')}`,
          timestamp: Date.now(),
          isLoading: false
        }));
        */

        // For now, fall back to mock data
        console.warn('Smart contract integration not yet configured, falling back to mock data');
        
        // Call mock implementation
        const mockImplementation = useSmartContractPrice({
          contractAddress,
          tokenSymbol,
          refreshInterval,
          mockMode: true
        });
        
        return mockImplementation;
      }

    } catch (error) {
      console.error('Error fetching smart contract price:', error);
      setPriceData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch price',
        isLoading: false
      }));
    }
  }, [contractAddress, tokenSymbol, mockMode]);

  useEffect(() => {
    fetchPrice();
    
    const interval = setInterval(fetchPrice, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchPrice, refreshInterval]);

  const refetch = useCallback(() => {
    fetchPrice();
  }, [fetchPrice]);

  return {
    ...priceData,
    refetch,
    isMockMode: mockMode
  };
};
