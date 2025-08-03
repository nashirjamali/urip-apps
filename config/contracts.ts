import { Address } from 'viem';

// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  MockUSDT: "0x787b5e45f1def0a126d2c93d39822e0a24bbc074" as Address,
  URIP: "0x3aa72870440488c55310ebfccdccd751da331da5" as Address,
  PurchaseManager: "0x177d6da3c6e37ff9b9e63fe5305d0b25ea341f98" as Address,
  DAOGovernance: "0x9A89d580000a3eD2271B43518B5dC827A70135Bd" as Address, // Using URIP address for now
  // TreasuryManager: "0x3aa72870440488c55310ebfccdccd751da331da5" as Address, // Using URIP address for now
  Stocks: {
    tMSFT: "0x7a346368cb82bca986e16d91fa1846f3e2f2f081" as Address,
    tAAPL: "0xdf1a0e84ad813a178cdcf6fdfec1876f78bb471d" as Address,
    tGOOG: "0x067556d409d112376a5c68cde223fdae3a4bd62b" as Address,
    tD05: "0x2ba5a6aa9fd6cf52b30ccb2fddefd505b34f0eb9" as Address,
    tBREN: "0x751d67bcbfa63acc27e6a6514fbeb27365d3dd38" as Address,
    tDELTA: "0x616a76c281f2f805499ae46a6c7c3a6a3a62cdc0" as Address,
    tMAYBANK: "0x04d1edf5252c35d3c1f7e6a5f934b6ab12f66220" as Address,
    tXAU: "0xf80567a323c99c99086d0d6884d7b03aff5c8903" as Address,
    tXAG: "0xa2f75a99ea1133f72673ddbbbe01a0080e5c6e52" as Address,
    tBTC: "0x8049cd4055b32e810efad90e998bbe82a58d5ab9" as Address,
  }
} as const;

// MockUSDT ABI (ERC20 + Faucet)
export const MOCK_USDT_ABI = [
  // Standard ERC20 functions
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  // Faucet function
  {
    type: "function",
    name: "faucet",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lastFaucetClaim",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "faucetAmount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "faucetCooldown",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  // Events
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false }
    ],
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false }
    ],
  },
  {
    type: "event",
    name: "FaucetClaim",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ],
  },
] as const;

// URIP Token ABI
export const URIP_TOKEN_ABI = [
  // Standard ERC20 functions
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  // URIP specific functions
  {
    type: "function",
    name: "getCurrentNAV",
    inputs: [],
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint256" }
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFundStats",
    inputs: [],
    outputs: [
      { name: "totalValue", type: "uint256" },
      { name: "nav", type: "uint256" },
      { name: "totalTokens", type: "uint256" },
      { name: "managementFee", type: "uint256" }
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fundInfo",
    inputs: [],
    outputs: [
      { name: "totalAssetValue", type: "uint256" },
      { name: "navPerToken", type: "uint256" },
      { name: "lastNavUpdate", type: "uint256" },
      { name: "managementFee", type: "uint256" },
      { name: "isActive", type: "bool" }
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "assetAllocations",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  // Events
  {
    type: "event",
    name: "NAVUpdated",
    inputs: [
      { name: "oldNAV", type: "uint256", indexed: false },
      { name: "newNAV", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ],
  },
  {
    type: "event",
    name: "FundPurchased",
    inputs: [
      { name: "buyer", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "nav", type: "uint256", indexed: false }
    ],
  },
  {
    type: "event",
    name: "FundRedeemed",
    inputs: [
      { name: "redeemer", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "nav", type: "uint256", indexed: false }
    ],
  },
] as const;

// Asset Token ABI
export const ASSET_TOKEN_ABI = [
  // Standard ERC20 functions
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  // Asset Token specific functions
  {
    type: "function",
    name: "getCurrentPrice",
    inputs: [],
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint256" }
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "assetInfo",
    inputs: [],
    outputs: [
      { name: "symbol", type: "string" },
      { name: "assetType", type: "string" },
      { name: "currentPrice", type: "uint256" },
      { name: "lastUpdate", type: "uint256" },
      { name: "isActive", type: "bool" }
    ],
    stateMutability: "view",
  },
  // Events
  {
    type: "event",
    name: "PriceUpdated",
    inputs: [
      { name: "oldPrice", type: "uint256", indexed: false },
      { name: "newPrice", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ],
  },
  {
    type: "event",
    name: "AssetMinted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "price", type: "uint256", indexed: false }
    ],
  },
  {
    type: "event",
    name: "AssetBurned",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "price", type: "uint256", indexed: false }
    ],
  },
] as const;

// Purchase Manager ABI
export const PURCHASE_MANAGER_ABI = [
  {
    type: "function",
    name: "purchaseAssetToken",
    inputs: [
      { name: "paymentToken", type: "address" },
      { name: "assetToken", type: "address" },
      { name: "paymentAmount", type: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "purchaseMutualFund",
    inputs: [
      { name: "paymentToken", type: "address" },
      { name: "paymentAmount", type: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportedPaymentTokens",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "supportedAssetTokens",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "uripFund",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  // Events
  {
    type: "event",
    name: "AssetTokenPurchased",
    inputs: [
      { name: "buyer", type: "address", indexed: true },
      { name: "assetToken", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "price", type: "uint256", indexed: false }
    ],
  },
  {
    type: "event",
    name: "MutualFundPurchased",
    inputs: [
      { name: "buyer", type: "address", indexed: true },
      { name: "usdAmount", type: "uint256", indexed: false },
      { name: "tokensReceived", type: "uint256", indexed: false }
    ],
  },
] as const;

// DAO Governance ABI
export const DAO_GOVERNANCE_ABI = [
  // Enums
  {
    type: "function",
    name: "ProposalCategory",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ProposalStatus",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  // Core functions
  {
    type: "function",
    name: "createProposal",
    inputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "actionDescriptions", type: "string[]" },
      { name: "targets", type: "address[]" },
      { name: "values", type: "uint256[]" },
      { name: "calldatas", type: "bytes[]" },
      { name: "category", type: "uint8" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "castVote",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "support", type: "uint8" },
      { name: "reason", type: "string" }
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getVotingPower",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProposalState",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasVoted",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "account", type: "address" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVote",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "account", type: "address" }
    ],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "delegate",
    inputs: [{ name: "delegatee", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "proposalCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proposals",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "id", type: "uint256" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "category", type: "uint8" },
      { name: "status", type: "uint8" },
      { name: "proposer", type: "address" },
      { name: "startTime", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "executionTime", type: "uint256" },
      { name: "forVotes", type: "uint256" },
      { name: "againstVotes", type: "uint256" },
      { name: "abstainVotes", type: "uint256" }
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proposalConfigs",
    inputs: [{ name: "", type: "uint8" }],
    outputs: [
      { name: "quorumPercentage", type: "uint256" },
      { name: "approvalThreshold", type: "uint256" },
      { name: "votingPeriod", type: "uint256" },
      { name: "executionDelay", type: "uint256" },
      { name: "proposalThreshold", type: "uint256" }
    ],
    stateMutability: "view",
  },
  // Events
  {
    type: "event",
    name: "ProposalCreated",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true },
      { name: "proposer", type: "address", indexed: true },
      { name: "category", type: "uint8", indexed: false },
      { name: "title", type: "string", indexed: false }
    ],
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true },
      { name: "voter", type: "address", indexed: true },
      { name: "support", type: "uint8", indexed: false },
      { name: "weight", type: "uint256", indexed: false },
      { name: "reason", type: "string", indexed: false }
    ],
  },
  {
    type: "event",
    name: "ProposalExecuted",
    inputs: [
      { name: "proposalId", type: "uint256", indexed: true }
    ],
  },
  {
    type: "event",
    name: "VotingPowerDelegated",
    inputs: [
      { name: "delegator", type: "address", indexed: true },
      { name: "delegatee", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ],
  },
] as const;

// Treasury Manager ABI
export const TREASURY_MANAGER_ABI = [
  {
    type: "function",
    name: "allocateFunds",
    inputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "category", type: "uint8" }
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "spendFunds",
    inputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "category", type: "uint8" },
      { name: "recipient", type: "address" }
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "budgets",
    inputs: [
      { name: "", type: "uint8" },
      { name: "", type: "address" }
    ],
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "spent", type: "uint256" },
      { name: "period", type: "uint256" },
      { name: "lastReset", type: "uint256" },
      { name: "active", type: "bool" }
    ],
    stateMutability: "view",
  },
] as const;

// Asset token metadata
export interface AssetTokenInfo {
  address: Address;
  symbol: string;
  name: string;
  type: 'STOCK' | 'COMMODITY';
  tradingViewSymbol?: string;
}

// Log contract addresses for debugging
console.log('📋 Contract Addresses:', {
  MockUSDT: CONTRACT_ADDRESSES.MockUSDT,
  URIP: CONTRACT_ADDRESSES.URIP,
  Stocks: CONTRACT_ADDRESSES.Stocks
});

export const ASSET_TOKENS: Record<string, AssetTokenInfo> = {
  tMSFT: {
    address: CONTRACT_ADDRESSES.Stocks.tMSFT,
    symbol: 'tMSFT',
    name: 'Tokenized Microsoft',
    type: 'STOCK',
    tradingViewSymbol: 'NASDAQ:MSFT'
  },
  tAAPL: {
    address: CONTRACT_ADDRESSES.Stocks.tAAPL,
    symbol: 'tAAPL',
    name: 'Tokenized Apple',
    type: 'STOCK',
    tradingViewSymbol: 'NASDAQ:AAPL'
  },
  tGOOG: {
    address: CONTRACT_ADDRESSES.Stocks.tGOOG,
    symbol: 'tGOOG',
    name: 'Tokenized Google',
    type: 'STOCK',
    tradingViewSymbol: 'NASDAQ:GOOGL'
  },
  tD05: {
    address: CONTRACT_ADDRESSES.Stocks.tD05,
    symbol: 'tD05',
    name: 'Tokenized DBS Bank',
    type: 'STOCK'
  },
  tBREN: {
    address: CONTRACT_ADDRESSES.Stocks.tBREN,
    symbol: 'tBREN',
    name: 'Tokenized Brent Oil',
    type: 'COMMODITY'
  },
  tDELTA: {
    address: CONTRACT_ADDRESSES.Stocks.tDELTA,
    symbol: 'tDELTA',
    name: 'Tokenized Delta Airlines',
    type: 'STOCK'
  },
  tMAYBANK: {
    address: CONTRACT_ADDRESSES.Stocks.tMAYBANK,
    symbol: 'tMAYBANK',
    name: 'Tokenized Maybank',
    type: 'STOCK'
  },
  tXAU: {
    address: CONTRACT_ADDRESSES.Stocks.tXAU,
    symbol: 'tXAU',
    name: 'Tokenized Gold',
    type: 'COMMODITY'
  },
  tXAG: {
    address: CONTRACT_ADDRESSES.Stocks.tXAG,
    symbol: 'tXAG',
    name: 'Tokenized Silver',
    type: 'COMMODITY'
  },
  tBTC: {
    address: CONTRACT_ADDRESSES.Stocks.tBTC,
    symbol: 'tBTC',
    name: 'Tokenized Bitcoin',
    type: 'COMMODITY',
    tradingViewSymbol: 'BTCUSD'
  }
};

// Log asset tokens configuration
console.log('🎯 Asset Tokens Configuration:', Object.keys(ASSET_TOKENS).map(key => ({
  key,
  ...ASSET_TOKENS[key]
})));