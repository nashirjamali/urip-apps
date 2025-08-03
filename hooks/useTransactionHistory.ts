import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface AddressInfo {
  hash: string;
  implementation_name?: string;
  name?: string;
  ens_domain_name?: string;
  is_contract: boolean;
  is_verified: boolean;
  metadata?: {
    slug: string;
    name: string;
    tagType: string;
    ordinal: number;
    meta: any;
  };
  private_tags?: Array<{
    address_hash: string;
    display_name: string;
    label: string;
  }>;
  watchlist_names?: Array<{
    display_name: string;
    label: string;
  }>;
  public_tags?: Array<{
    address_hash: string;
    display_name: string;
    label: string;
  }>;
}

export interface TokenInfo {
  circulating_market_cap?: string;
  icon_url?: string;
  name: string;
  decimals: string;
  symbol: string;
  address: string;
  type: string;
  holders?: string;
  exchange_rate?: string;
  total_supply?: string;
}

export interface TokenTransfer {
  block_hash: string;
  from: AddressInfo;
  log_index: number;
  method: string;
  timestamp: string;
  to: AddressInfo;
  token: TokenInfo;
  total: {
    decimals: string;
    value: string;
  };
  transaction_hash: string;
  type: string;
}

export interface Transaction {
  timestamp: string;
  fee: {
    type: string;
    value: string;
  };
  gas_limit: number;
  block_number: number;
  status: string;
  method: string;
  confirmations: number;
  type: number;
  exchange_rate?: string;
  to: AddressInfo;
  transaction_burnt_fee?: string;
  max_fee_per_gas?: string;
  result?: string;
  hash: string;
  gas_price: string;
  priority_fee?: string;
  base_fee_per_gas?: string;
  from: AddressInfo;
  gas_used: string;
  transaction_types: string[];
  created_contract?: AddressInfo;
  position: number;
  nonce: number;
  has_error_in_internal_transactions: boolean;
  actions?: any[];
  decoded_input?: {
    method_call: string;
    method_id: string;
    parameters: any[];
  };
  token_transfers_overflow: boolean;
  raw_input: string;
  value: string;
  max_priority_fee_per_gas?: string;
  revert_reason?: string;
  confirmation_duration?: number[];
  transaction_tag?: string;
  token_transfers?: TokenTransfer[];
}

export interface TransactionHistoryResponse {
  items: Transaction[];
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  } | null;
}

export const useTransactionHistory = (pageSize: number = 20) => {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextPageParams, setNextPageParams] = useState<any>(null);

  const fetchTransactions = async (isLoadMore: boolean = false) => {
    if (!address) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = 'https://sepolia-blockscout.lisk.com/api/v2/addresses';
      const url = `${baseUrl}/${address}/transactions`;
      
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        ...(isLoadMore && nextPageParams && {
          block_number: nextPageParams.block_number.toString(),
          index: nextPageParams.index.toString(),
          items_count: nextPageParams.items_count.toString(),
        }),
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data: TransactionHistoryResponse = await response.json();
      
      if (isLoadMore) {
        setTransactions(prev => [...prev, ...data.items]);
      } else {
        setTransactions(data.items);
      }
      
      setNextPageParams(data.next_page_params);
      setHasMore(!!data.next_page_params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      fetchTransactions(true);
    }
  };

  const refresh = () => {
    setNextPageParams(null);
    setHasMore(true);
    fetchTransactions(false);
  };

  useEffect(() => {
    fetchTransactions(false);
  }, [address]);

  // Helper function to format transaction value
  const formatTransactionValue = (value: string, decimals: number = 18) => {
    const numericValue = parseFloat(value) / Math.pow(10, decimals);
    return numericValue.toFixed(6);
  };

  // Helper function to format gas fee
  const formatGasFee = (gasUsed: string, gasPrice: string) => {
    const gasUsedNum = parseFloat(gasUsed);
    const gasPriceNum = parseFloat(gasPrice);
    const feeInWei = gasUsedNum * gasPriceNum;
    const feeInEth = feeInWei / Math.pow(10, 18);
    return feeInEth.toFixed(6);
  };

  // Helper function to get transaction type
  const getTransactionType = (tx: Transaction, userAddress: string) => {
    if (tx.from.hash.toLowerCase() === userAddress.toLowerCase()) {
      return 'send';
    } else if (tx.to.hash.toLowerCase() === userAddress.toLowerCase()) {
      return 'receive';
    }
    return 'unknown';
  };

  // Helper function to get display name for address
  const getAddressDisplayName = (addressInfo: AddressInfo) => {
    if (addressInfo.ens_domain_name) {
      return addressInfo.ens_domain_name;
    }
    if (addressInfo.name) {
      return addressInfo.name;
    }
    if (addressInfo.public_tags && addressInfo.public_tags.length > 0) {
      return addressInfo.public_tags[0].display_name;
    }
    return `${addressInfo.hash.slice(0, 6)}...${addressInfo.hash.slice(-4)}`;
  };

  // Helper function to get transaction method name
  const getTransactionMethodName = (tx: Transaction) => {
    if (tx.decoded_input?.method_call) {
      const methodCall = tx.decoded_input.method_call;
      const methodName = methodCall.split('(')[0];
      return methodName;
    }
    return tx.method || 'Transfer';
  };

  // Helper function to check if transaction has token transfers
  const hasTokenTransfers = (tx: Transaction) => {
    return tx.token_transfers && tx.token_transfers.length > 0;
  };

  // Helper function to get primary token transfer
  const getPrimaryTokenTransfer = (tx: Transaction) => {
    if (hasTokenTransfers(tx) && tx.token_transfers!.length > 0) {
      return tx.token_transfers![0];
    }
    return null;
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date),
    };
  };

  // Helper function to get relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  return {
    transactions,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    formatTransactionValue,
    formatGasFee,
    getTransactionType,
    formatTimestamp,
    getAddressDisplayName,
    getTransactionMethodName,
    hasTokenTransfers,
    getPrimaryTokenTransfer,
  };
}; 